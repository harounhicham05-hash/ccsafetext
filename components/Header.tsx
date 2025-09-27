import React from 'react';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
                <ShieldIcon />
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">AI-SafeText Rewriter</h1>
                    <p className="text-sm text-slate-500">Transform text to comply with AI safety policies.</p>
                </div>
            </div>
        </header>
    );
};
