"use client";

import { X, Send, Phone, AlertTriangle, Briefcase, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ActionDrawer({ isOpen, nudge, onClose }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !nudge) return null;

    // --- DEBUGGING: CHECK EVERY POSSIBLE NAME ---
    // The database uses snake_case, the app uses camelCase.
    // We try to grab the payload from anywhere it might be hiding.
    const rawPayload = nudge.actionPayload || nudge.action_payload || nudge.payload || {};

    // Check if communication exists
    const comms = rawPayload.communication || rawPayload.Communication;

    const handlePrimaryAction = () => {
        if (comms && comms.method === 'sms') {
            const body = encodeURIComponent(comms.template);
            const phone = comms.recipient || "";
            window.location.href = `sms:${phone}?&body=${body}`;
        } else {
            console.log("Generic action triggered");
        }
    };

    const handleCopy = () => {
        if (comms?.template) {
            navigator.clipboard.writeText(comms.template);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Helper: Icon Selection
    const renderIcon = () => {
        if (nudge.type === 'PRE_EMPTIVE_STRIKE') return <Briefcase className="text-purple-400" size={24} />;
        if (nudge.type === 'CHURN_INTERCEPTOR' || nudge.priority === 'CRITICAL') return <AlertTriangle className="text-rose-400" size={24} />;
        if (nudge.type === 'TASK') return <MessageCircle className="text-blue-400" size={24} />;
        return <AlertTriangle className="text-amber-400" size={24} />;
    };

    const theme = (nudge.type === 'TASK') ? 'blue' :
        (nudge.type === 'PRE_EMPTIVE_STRIKE') ? 'purple' :
            (nudge.priority === 'CRITICAL') ? 'rose' : 'amber';

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

            <div className="fixed inset-y-0 right-0 w-[450px] bg-[#0f172a] border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-900/50">
                    <div className="flex gap-4">
                        <div className="mt-1 p-2 bg-slate-800 rounded-lg border border-slate-700">
                            {renderIcon()}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight pr-4">{nudge.title}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider bg-slate-800 text-slate-400 border-slate-700">
                                    {nudge.type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Situation */}
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Situation</h3>
                        <p className="text-slate-200 text-sm leading-relaxed">{nudge.description}</p>
                    </div>

                    {/* DRAFT MESSAGE PREVIEW */}
                    {comms ? (
                        <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                    <MessageCircle size={12} className="inline mr-1" /> Draft Message
                                </h3>
                                <button onClick={handleCopy} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-700/50">
                                <p className="text-slate-300 text-sm font-mono whitespace-pre-wrap">"{comms.template}"</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20 text-amber-500 text-sm">
                            ⚠️ No Communication Template Found
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-700 bg-slate-900/80 backdrop-blur space-y-3">
                    {comms ? (
                        <button onClick={handlePrimaryAction} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                            <MessageCircle size={18} /> Send SMS Now
                        </button>
                    ) : (
                        <button className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                            <Phone size={18} /> Call Client Now (Default)
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}