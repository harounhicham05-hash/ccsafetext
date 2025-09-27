import React, { useState, useEffect } from 'react';
import type { RewriteResult, Severity } from '../types';
import { AnalysisVisualization } from './AnalysisVisualization';

const ClipboardIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const getSeverityStyles = (severity: Severity): string => {
    switch (severity) {
        case 'none':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'low':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'medium':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'high':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-slate-100 text-slate-800 border-slate-200';
    }
};

const Tag: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${className}`}>
        {children}
    </span>
);

const OutputContent: React.FC<{ output: RewriteResult }> = ({ output }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(output.safe_text);
        setIsCopied(true);
    };

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    return (
        <div className="space-y-6 animate-fade-in">
             <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Visualization</h3>
                <AnalysisVisualization severity={output.severity} flags={output.flags} />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">Safe Text</h3>
                    <button onClick={handleCopy} className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 font-medium transition disabled:text-slate-400">
                        {isCopied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardIcon className="h-5 w-5"/>}
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="bg-slate-100 p-4 rounded-md border border-slate-200 text-slate-700 whitespace-pre-wrap font-serif text-base">
                    {output.safe_text}
                </div>
            </div>

            {output.suggested_disclaimer && (
                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                    <strong>Disclaimer:</strong> {output.suggested_disclaimer}
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Summary</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Tag className={getSeverityStyles(output.severity)}>Severity: {output.severity}</Tag>
                        <Tag className={`border ${output.accepted ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                            {output.accepted ? 'Accepted' : 'Rejected'}
                        </Tag>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">{output.reason_summary}</p>
                    </div>
                </div>
            </div>

            {output.change_log.length > 0 && (
                 <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Change Log</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {output.change_log.map((change, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
                                <p className="text-slate-500 mb-1"><strong className="text-red-600">From:</strong> {change.from}</p>

                                <p className="text-slate-700 mb-2"><strong className="text-green-600">To:</strong> {change.to}</p>
                                <p className="text-xs text-slate-500 italic"><strong>Reason:</strong> {change.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


interface OutputPanelProps {
    output: RewriteResult | null;
    isLoading: boolean;
    error: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output, isLoading, error }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                     <svg className="animate-spin h-8 w-8 text-sky-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-medium">Generating safe text...</p>
                    <p className="text-sm">This may take a moment.</p>
                </div>
            )}
            {error && (
                <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-md border border-red-200">
                    <h3 className="font-bold mb-2">An Error Occurred</h3>
                    <p className="text-center text-sm">{error}</p>
                </div>
            )}
            {!isLoading && !error && !output && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="font-semibold text-lg">Results will appear here</h3>
                    <p className="max-w-xs">Enter text on the left and click "Rewrite Text" to see the analysis and the safe version of your content.</p>
                </div>
            )}
            {output && <OutputContent output={output} />}
        </div>
    );
};