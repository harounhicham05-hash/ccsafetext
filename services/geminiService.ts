import { GoogleGenAI, Type } from "@google/genai";
import type { RewriteOptions, RewriteResult } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the application to work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        accepted: { type: Type.BOOLEAN, description: "True if the final text passes typical AI safety filters." },
        severity: { type: Type.STRING, description: "The assessed severity level: 'none', 'low', 'medium', or 'high'." },
        original_text: { type: Type.STRING, description: "The original text provided by the user." },
        safe_text: { type: Type.STRING, description: "The rewritten, safe version of the text." },
        mode_used: { type: Type.STRING, description: "The rewriting mode used: 'conservative', 'balanced', or 'minimal'." },
        change_log: {
            type: Type.ARRAY,
            description: "A detailed log of all changes made.",
            items: {
                type: Type.OBJECT,
                properties: {
                    from: { type: Type.STRING, description: "The original snippet of text." },
                    to: { type: Type.STRING, description: "What the snippet was changed to." },
                    reason: { type: Type.STRING, description: "The reason for the change." },
                },
                required: ['from', 'to', 'reason']
            }
        },
        reason_summary: { type: Type.STRING, description: "A high-level summary of why the text was changed." },
        suggested_disclaimer: { type: Type.STRING, description: "A suggested disclaimer if the content is sensitive, e.g., 'For educational use only'." },
        flags: {
            type: Type.ARRAY,
            description: "A list of violation categories detected.",
            items: { type: Type.STRING }
        }
    },
    required: ['accepted', 'severity', 'original_text', 'safe_text', 'mode_used', 'change_log', 'reason_summary', 'suggested_disclaimer', 'flags']
};

export const rewriteText = async (text: string, options: RewriteOptions): Promise<RewriteResult> => {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are "AI-SafeText Rewriter", an expert system designed to transform any user-provided text into a version that complies with general AI safety and content policies, while keeping as much of the original meaning as possible.

Follow these steps strictly:

1) **Input**:
   - You receive raw user text and parameters: { tone: neutral/academic/marketing, mode: conservative/balanced/minimal, language: Arabic or English }.

2) **Analyze & Classify**:
   - Detect possible violations: ["dangerous_instructions","hate_speech","self_harm","illegal_advice","sexual_explicit","privacy_doxxing","copyright_violation","other"].
   - Assign severity: "none" | "low" | "medium" | "high".

3) **Rewrite Rules**:
   - If severity = "high" AND contains dangerous_instructions or illegal_advice → Do NOT provide step-by-step instructions; instead, give a safe alternative: historical overview, legal context, risk analysis, or educational commentary.
   - Remove or replace private data with [REDACTED].
   - Change offensive or explicit content into neutral, educational, or analytical tone depending on user tone parameter.
   - Always preserve as much semantic meaning as possible without breaking safety.

4) **Output**:
   - Return ONLY a valid JSON object with the specified schema.
   - \`accepted\` = true only if final text passes typical AI safety filters.
   - \`suggested_disclaimer\` if needed (e.g., "for educational use only").

5) **Modes**:
   - conservative = maximum filtering
   - balanced = normal use, minimal meaning loss
   - minimal = only fix clear violations

6) **Final Behavior**:
   - Always explain modifications in \`change_log\` and \`reason_summary\`.
   - Never output instructions for real-world harm.
   - Keep final text in requested language & tone.`;

    const userPrompt = `Rewrite the following text based on the provided parameters. Adhere strictly to the rules and output format you have been given.

Text to rewrite:
\`\`\`
${text}
\`\`\`

Parameters:
- Tone: ${options.tone}
- Mode: ${options.mode}
- Language: ${options.language}
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const responseText = response.text.trim();
        const result: RewriteResult = JSON.parse(responseText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to rewrite text. The model may have returned an invalid response. Details: ${error.message}`);
        }
        throw new Error("An unknown error occurred while rewriting text.");
    }
};
