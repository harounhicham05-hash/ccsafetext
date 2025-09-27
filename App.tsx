import React, { useState, useCallback } from 'react';
import { rewriteText } from './services/geminiService';
import type { RewriteResult, RewriteOptions } from './types';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [output, setOutput] = useState<RewriteResult | null>(null);

    const handleRewrite = useCallback(async (text: string, options: RewriteOptions) => {
        if (!text.trim()) {
            setError("Please enter some text to rewrite.");
            setOutput(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutput(null);
        try {
            const result = await rewriteText(text, options);
            setOutput(result);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <InputPanel onRewrite={handleRewrite} isLoading={isLoading} />
                    <OutputPanel output={output} isLoading={isLoading} error={error} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
