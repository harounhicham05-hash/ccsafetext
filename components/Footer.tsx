import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-8">
            <div className="container mx-auto px-4 md:px-6 py-4 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} AI-SafeText Rewriter. For demonstration purposes only.</p>
            </div>
        </footer>
    );
};
