"use client";

import { X, MapPin, ArrowRight, Briefcase } from "lucide-react";
import { format } from "date-fns";

export default function MatchListModal({ isOpen, matchData, onClose, onFloat }) {
    // If not open or no data, don't render anything
    if (!isOpen || !matchData) return null;

    const { candidates, project, client, role, startsIn } = matchData;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Main Card */}
            <div className="bg-[#0f172a] w-full max-w-4xl max-h-[90vh] rounded-xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="bg-cyan-500 text-slate-900 text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                {matchData.count}x {role}
                            </span>
                            <span className="text-slate-400 text-sm">needed for</span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-1">{project}</h2>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                            <span className="flex items-center gap-1.5"><Briefcase size={14} /> {client}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="text-emerald-400">Starts in {startsIn} Days</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-900/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 shrink-0">
                    <div className="col-span-4">Candidate</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                {/* List Body */}
                <div className="overflow-y-auto p-2 custom-scrollbar flex-1">
                    {candidates.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 italic">No candidates available.</div>
                    ) : (
                        candidates.map(candidate => {
                            // Determine status badge color
                            const isFinishing = candidate.finishDate;
                            const statusColor = isFinishing ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
                            const statusLabel = isFinishing ? "FINISHING" : "AVAILABLE";

                            // Format date safely
                            let dateLabel = "Now";
                            if (isFinishing) {
                                try {
                                    dateLabel = format(new Date(candidate.finishDate), 'd MMM');
                                } catch (e) { dateLabel = "Soon"; }
                            }

                            return (
                                <div key={candidate.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-800 mb-1 group">

                                    {/* Candidate Name/Role */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
                                            {candidate.firstName ? candidate.firstName.charAt(0) : '?'}{candidate.lastName ? candidate.lastName.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                {candidate.firstName} {candidate.lastName}
                                            </div>
                                            <div className="text-xs text-slate-500">{candidate.role}</div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="col-span-3">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${statusColor}`}>
                                                {statusLabel}
                                            </span>
                                            <span className="text-xs text-slate-500 pl-1">{dateLabel}</span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="col-span-3 flex items-center gap-2 text-sm text-slate-400">
                                        <MapPin size={14} />
                                        <span>{candidate.suburb || "Local"}</span>
                                    </div>

                                    {/* Action Button - TRIGGERS PARENT ONLY */}
                                    <div className="col-span-2 text-right">
                                        <button
                                            onClick={() => onFloat({ candidate })}
                                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-black px-4 py-2 rounded shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 ml-auto"
                                        >
                                            FLOAT <ArrowRight size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}