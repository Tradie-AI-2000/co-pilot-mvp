"use client";

import { useState } from "react";
import { X, User, Zap, Calendar, DollarSign, Search } from "lucide-react";

export default function DealFlowModal({ isOpen, onClose, candidates, initialTab = 'floats' }) {
    const [activeTab, setActiveTab] = useState(initialTab); // 'floats' or 'placements'

    if (!isOpen) return null;

    // Filter Logic
    const floats = candidates.filter(c => c.status === "Floated" || c.status === "Interviewing");
    const placements = candidates.filter(c => c.status === "On Job");

    const currentList = activeTab === 'floats' ? floats : placements;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Deal Flow Detail</h2>
                        <div className="flex bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('floats')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'floats' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Floated ({floats.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('placements')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'placements' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Placed ({placements.length})
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Sub-Header / Filters (Visual Only for now) */}
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/20 flex gap-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search names, roles..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-slate-600 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 text-xs font-medium text-slate-500 items-center">
                        <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Last 7 Days</span>
                        <span className="px-2 py-1 hover:bg-slate-800 rounded cursor-pointer transition-colors">Month to Date</span>
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {currentList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <Zap size={48} className="mb-4 opacity-20" />
                            <p>No {activeTab} found in this period.</p>
                        </div>
                    ) : (
                        currentList.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${activeTab === 'floats' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {c.firstName?.[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white flex items-center gap-2">
                                            {c.firstName} {c.lastName}
                                            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                                                {c.role || "General Labour"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Zap size={10} /> {c.skills?.[0] || 'Reliable'}</span>
                                            {c.location && <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-600"></span> {c.location}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-bold text-white mb-1">
                                        {activeTab === 'floats' ? 'Sent to Client' : `$${c.chargeRate || 45}/hr`}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {activeTab === 'floats' ? '2 days ago' : 'Effective Immediately'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Metrics */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/80 rounded-b-2xl flex justify-between text-xs text-slate-400 font-mono uppercase tracking-wider">
                    <span>Total {activeTab === 'floats' ? 'Floated' : 'Placed'}: {currentList.length}</span>
                    <span>Efficiency: {activeTab === 'floats' ? 'HIGH' : 'OPTIMAL'}</span>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}</style>
        </div>
    );
}
