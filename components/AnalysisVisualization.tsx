import React from 'react';
import type { Severity } from '../types';

interface AnalysisVisualizationProps {
    severity: Severity;
    flags: string[];
}

const getSeverityDetails = (severity: Severity) => {
    switch (severity) {
        case 'none':
            return { angle: -67.5, color: 'text-cyan-400', label: 'None' };
        case 'low':
            return { angle: -22.5, color: 'text-sky-500', label: 'Low' };
        case 'medium':
            return { angle: 22.5, color: 'text-indigo-500', label: 'Medium' };
        case 'high':
            return { angle: 67.5, color: 'text-fuchsia-500', label: 'High' };
        default:
            return { angle: -67.5, color: 'text-slate-400', label: 'Unknown' };
    }
};

export const AnalysisVisualization: React.FC<AnalysisVisualizationProps> = ({ severity, flags }) => {
    const { angle, color, label } = getSeverityDetails(severity);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col items-center text-white">
            <div className="relative w-64 h-32">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Gauge Background Arcs */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#475569" strokeWidth="12" />
                    
                    {/* Gauge Color Arcs */}
                    <path d="M 20 100 A 80 80 0 0 1 50.7 35.1" fill="none" stroke="#22d3ee" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 50.7 35.1 A 80 80 0 0 1 100 20" fill="none" stroke="#0ea5e9" strokeWidth="12" />
                    <path d="M 100 20 A 80 80 0 0 1 149.3 35.1" fill="none" stroke="#6366f1" strokeWidth="12" />
                    <path d="M 149.3 35.1 A 80 80 0 0 1 180 100" fill="none" stroke="#d946ef" strokeWidth="12" strokeLinecap="round"/>

                    {/* Needle */}
                    <g transform={`rotate(${angle} 100 100)`} style={{ transition: 'transform 0.7s ease-in-out' }}>
                        <path d="M 100 100 L 100 30" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="6" fill="#f1f5f9" />
                    </g>

                     {/* Labels */}
                    <text x="15" y="80" className="text-xs font-medium fill-slate-400">None</text>
                    <text x="50" y="30" className="text-xs font-medium fill-slate-400">Low</text>
                    <text x="125" y="30" className="text-xs font-medium fill-slate-400">Medium</text>
                    <text x="158" y="80" className="text-xs font-medium fill-slate-400" textAnchor="end">High</text>
                </svg>
                 <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-center`}>
                    <div className={`text-xl font-bold ${color}`}>{label}</div>
                    <div className="text-xs text-slate-400">Severity</div>
                </div>
            </div>
            
            {flags.length > 0 && (
                <div className="w-full mt-4 pt-4 border-t border-slate-700">
                    <h4 className="text-sm font-semibold text-center mb-2 text-slate-300">Detected Flags</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                        {flags.map((flag, i) => (
                             <span key={i} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                {flag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
