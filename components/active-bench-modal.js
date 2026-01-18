"use client";

import { X, User, Phone, Mail, MapPin, Calendar, Clock } from "lucide-react";

export default function ActiveBenchModal({ candidates, onClose, onViewCandidate }) {
    if (!candidates) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onClose} />
            <div className="fixed inset-x-4 top-10 bottom-4 md:inset-x-20 md:top-20 md:bottom-10 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[70] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Active Bench</h2>
                        <p className="text-slate-400">Available workers requiring placement to mitigate guaranteed hours risk.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-lg flex items-start gap-4 hover:border-secondary/50 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-secondary font-bold text-xl">
                                    {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-secondary transition-colors text-lg">
                                                {candidate.firstName} {candidate.lastName}
                                            </h3>
                                            <p className="text-slate-400 text-sm">{candidate.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-emerald-400 font-mono font-bold">${candidate.chargeRate || '65'}/hr</div>
                                            <div className="text-[10px] uppercase text-slate-500 font-bold">Charge Rate</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <MapPin size={14} className="text-slate-500" />
                                            {candidate.suburb || 'Auckland'}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Clock size={14} className="text-slate-500" />
                                            {candidate.guaranteedHours || 30} hrs/wk
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium text-sm transition-colors flex items-center justify-center gap-2">
                                            <Phone size={14} /> Call
                                        </button>
                                        <button
                                            className="flex-1 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded font-medium text-sm transition-colors"
                                            onClick={() => onViewCandidate && onViewCandidate(candidate)}
                                        >
                                            Float
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
