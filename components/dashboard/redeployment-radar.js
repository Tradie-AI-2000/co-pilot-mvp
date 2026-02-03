"use client";

import { useMemo, useState } from 'react';
import { Clock, AlertTriangle, Calendar, CheckCircle, Maximize2, X } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function RedeploymentRadar({ candidates, onViewCandidate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Logic: Bucket candidates by finish date
    const buckets = useMemo(() => {
        const today = new Date();
        const data = {
            critical: [], // 0-14 Days
            upcoming: [], // 15-28 Days
            horizon: []   // 29-60 Days
        };

        candidates.forEach(c => {
            if (c.status?.toLowerCase() !== 'on_job' || !c.finishDate) return;

            // Handle date parsing safely
            const finish = new Date(c.finishDate);
            const diff = differenceInDays(finish, today);

            const item = { ...c, daysLeft: diff };

            if (diff >= 0 && diff <= 14) data.critical.push(item);
            else if (diff > 14 && diff <= 28) data.upcoming.push(item);
            else if (diff > 28 && diff <= 60) data.horizon.push(item);
        });

        // Sort by urgency
        data.critical.sort((a, b) => a.daysLeft - b.daysLeft);
        data.upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
        data.horizon.sort((a, b) => a.daysLeft - b.daysLeft);

        return data;
    }, [candidates]);

    return (
        <>
            <div className="radar-widget glass-panel">
                {/* 1. FIXED HEADER */}
                <div className="widget-header">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-secondary" />
                        <h3 className="font-bold text-secondary uppercase tracking-wider text-xs">
                            Redeployment Radar (4 Weeks)
                        </h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-[10px] text-slate-400 font-mono">
                            {buckets.critical.length + buckets.upcoming.length} Active Risks
                        </div>
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="hover:text-white text-slate-400 transition-colors p-1"
                        >
                            <Maximize2 size={12} />
                        </button>
                    </div>
                </div>

                {/* 2. SCROLLABLE GRID BODY (DEFAULT VIEW) */}
                <div className="radar-grid">
                    {/* Column 1: Critical (0-14 Days) */}
                    <div className="radar-col critical-zone">
                        <div className="col-header text-rose-400">
                            <AlertTriangle size={12} /> Critical (0-14d)
                        </div>
                        <div className="col-list">
                            {buckets.critical.map(c => (
                                <CandidateCard key={c.id} c={c} color="rose" onClick={() => onViewCandidate && onViewCandidate(c)} />
                            ))}
                            {buckets.critical.length === 0 && <EmptyState />}
                        </div>
                    </div>

                    {/* Column 2: Upcoming (15-28 Days) */}
                    <div className="radar-col warning-zone">
                        <div className="col-header text-amber-400">
                            <Calendar size={12} /> Upcoming (15-28d)
                        </div>
                        <div className="col-list">
                            {buckets.upcoming.map(c => (
                                <CandidateCard key={c.id} c={c} color="amber" onClick={() => onViewCandidate && onViewCandidate(c)} />
                            ))}
                            {buckets.upcoming.length === 0 && <EmptyState />}
                        </div>
                    </div>

                    {/* Column 3: Horizon (29+ Days) */}
                    <div className="radar-col safe-zone">
                        <div className="col-header text-emerald-400">
                            <CheckCircle size={12} /> Horizon (29d+)
                        </div>
                        <div className="col-list">
                            {buckets.horizon.map(c => (
                                <CandidateCard key={c.id} c={c} color="emerald" onClick={() => onViewCandidate && onViewCandidate(c)} />
                            ))}
                            {buckets.horizon.length === 0 && <EmptyState />}
                        </div>
                    </div>
                </div>
            </div>

            {/* EXPANDED MODAL OVERLAY */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-8">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl h-[80vh] rounded-xl flex flex-col shadow-2xl relative overflow-hidden">

                        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Clock className="text-secondary" /> Redeployment Radar
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Detailed view of all upcoming contract finishes.</p>
                            </div>
                            <button onClick={() => setIsExpanded(false)} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* REUSED GRID STRUCTURE FOR MODAL */}
                        <div className="flex-1 overflow-hidden p-6 bg-slate-900 flex flex-col">
                            <div className="radar-grid expanded">
                                {/* Column 1 */}
                                <div className="radar-col critical-zone">
                                    <div className="col-header text-rose-400 text-lg p-4">
                                        <AlertTriangle size={20} /> Critical (0-14d)
                                    </div>
                                    <div className="col-list p-4 gap-3">
                                        {buckets.critical.map(c => (
                                            <CandidateCard key={c.id} c={c} color="rose" onClick={() => onViewCandidate && onViewCandidate(c)} expanded={true} />
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="radar-col warning-zone">
                                    <div className="col-header text-amber-400 text-lg p-4">
                                        <Calendar size={20} /> Upcoming (15-28d)
                                    </div>
                                    <div className="col-list p-4 gap-3">
                                        {buckets.upcoming.map(c => (
                                            <CandidateCard key={c.id} c={c} color="amber" onClick={() => onViewCandidate && onViewCandidate(c)} expanded={true} />
                                        ))}
                                    </div>
                                </div>

                                {/* Column 3 */}
                                <div className="radar-col safe-zone">
                                    <div className="col-header text-emerald-400 text-lg p-4">
                                        <CheckCircle size={20} /> Horizon (29d+)
                                    </div>
                                    <div className="col-list p-4 gap-3">
                                        {buckets.horizon.map(c => (
                                            <CandidateCard key={c.id} c={c} color="emerald" onClick={() => onViewCandidate && onViewCandidate(c)} expanded={true} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Component Container */
                .radar-widget {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                    background: rgba(15, 23, 42, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                }

                .widget-header {
                    flex-shrink: 0;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(15, 23, 42, 0.6);
                }

                .radar-grid {
                    flex: 1;
                    min-height: 0;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1px;
                    background: rgba(255,255,255,0.05);
                }

                .radar-grid.expanded {
                    gap: 1.5rem;
                    background: transparent;
                }
                .radar-grid.expanded .radar-col {
                    border-radius: 8px;
                    border: 1px solid var(--border);
                }

                .radar-col {
                    background: rgba(15, 23, 42, 0.3);
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                }

                .col-header {
                    flex-shrink: 0;
                    padding: 0.5rem;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .col-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .col-list::-webkit-scrollbar {
                    width: 4px;
                }
                .col-list::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
            `}</style>
        </>
    );
}

// Sub-component for individual items
function CandidateCard({ c, color, onClick, expanded }) {
    const colors = {
        rose: "bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40 text-rose-100",
        amber: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-100",
        emerald: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100"
    };

    return (
        <div
            onClick={onClick}
            className={`rounded border ${colors[color]} transition-colors cursor-pointer group hover:bg-white/5 ${expanded ? 'p-4' : 'p-2'}`}
        >
            <div className="flex justify-between items-start">
                <span className={`font-bold truncate ${expanded ? 'text-sm' : 'text-xs'}`}>{c.firstName} {c.lastName}</span>
                <span className={`${expanded ? 'text-xs' : 'text-[9px]'} font-mono opacity-60`}>{c.daysLeft}d</span>
            </div>
            <div className={`opacity-60 mt-1 truncate ${expanded ? 'text-xs' : 'text-[10px]'}`}>
                {c.role}
            </div>
            <div className={`opacity-40 truncate ${expanded ? 'text-xs' : 'text-[9px]'}`}>
                @ {c.currentEmployer || 'Unknown Site'}
            </div>
            {expanded && (
                <div className="text-xs mt-2 pt-2 border-t border-white/10 opacity-75">
                    Finish: {c.finishDate}
                </div>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-full flex items-center justify-center text-[10px] text-slate-600 italic">
            -
        </div>
    );
}