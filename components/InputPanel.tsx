import React, { useState } from 'react';
import type { RewriteOptions, Tone, Mode, Language } from '../types';

interface InputPanelProps {
    onRewrite: (text: string, options: RewriteOptions) => void;
    isLoading: boolean;
}

const OptionSelector = <T,>({ label, value, onChange, options }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { value: string, label: string }[] }) => (
    <div>
        <label htmlFor={label} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select
            id={label}
            value={value}
            onChange={onChange}
            className="w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

export const InputPanel: React.FC<InputPanelProps> = ({ onRewrite, isLoading }) => {
    const [text, setText] = useState<string>('');
    const [tone, setTone] = useState<Tone>('neutral');
    const [mode, setMode] = useState<Mode>('balanced');
    const [language, setLanguage] = useState<Language>('English');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRewrite(text, { tone, mode, language });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Your Text</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to analyze and rewrite..."
                    className="w-full flex-grow p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-base resize-none min-h-[250px] md:min-h-[300px]"
                    disabled={isLoading}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                    <OptionSelector 
                        label="Tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as Tone)}
                        options={[
                            { value: 'neutral', label: 'Neutral' },
                            { value: 'academic', label: 'Academic' },
                            { value: 'marketing', label: 'Marketing' },
                        ]}
                    />
                    <OptionSelector
                        label="Mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as Mode)}
                        options={[
                            { value: 'conservative', label: 'Conservative' },
                            { value: 'balanced', label: 'Balanced' },
                            { value: 'minimal', label: 'Minimal' },
                        ]}
                    />
                    <OptionSelector
                        label="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        options={[
                            { value: 'English', label: 'English' },
                            { value: 'Arabic', label: 'Arabic' },
                        ]}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !text}
                    className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        'Rewrite Text'
                    )}
                </button>
            </form>
        </div>
    );
};
