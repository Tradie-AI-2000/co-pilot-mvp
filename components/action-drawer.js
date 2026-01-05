"use client";

import { X, Send, Phone, AlertTriangle, Briefcase, ExternalLink } from "lucide-react";

export default function ActionDrawer({ isOpen, nudge, onClose }) {
    if (!isOpen || !nudge) return null;

    // Helper to determine icon based on type
    const renderIcon = () => {
        if (nudge.type === 'signal') return <Briefcase className="text-purple-400" size={24} />;
        if (nudge.type === 'risk') return <AlertTriangle className="text-orange-400" size={24} />;
        return <AlertTriangle className="text-blue-400" size={24} />;
    };

    return (
        <>
            {/* Backdrop (Darken the background) */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* The Drawer Panel */}
            <div className="fixed inset-y-0 right-0 w-[450px] bg-[#0f172a] border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-900/50">
                    <div className="flex gap-3">
                        <div className="mt-1">{renderIcon()}</div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {nudge.title}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {nudge.type === 'signal' ? 'Buying Signal' : 'Risk Alert'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Section 1: The Situation */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Situation
                        </h3>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            {nudge.subtitle || nudge.description}
                        </p>
                    </div>

                    {/* Section 2: Intelligence Data */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Intelligence
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-500 text-sm">Project / Entity</span>
                                <span className="text-slate-300 text-sm font-medium text-right">
                                    {nudge.meta || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-500 text-sm">Urgency Score</span>
                                <span className={`text-sm font-bold ${
                                    nudge.urgency === 'Critical' ? 'text-rose-400' : 'text-amber-400'
                                }`}>
                                    {nudge.urgency || "Normal"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-500 text-sm">Source</span>
                                <span className="text-slate-300 text-sm">BCI Central API</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Actions */}
                <div className="p-6 border-t border-slate-700 bg-slate-900/50 space-y-3">
                    {nudge.type === 'signal' ? (
                        <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20">
                            <Send size={18} /> Generate Spec Pitch
                        </button>
                    ) : (
                        <button className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20">
                            <Phone size={18} /> Call Client Now
                        </button>
                    )}
                    
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-all"
                    >
                        Dismiss / Snooze
                    </button>
                </div>
            </div>
        </>
    );
}