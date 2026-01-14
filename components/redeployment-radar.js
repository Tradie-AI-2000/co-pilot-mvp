"use client";

import { useMemo } from 'react';
import { Clock, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function RedeploymentRadar({ candidates }) {
    // Logic: Bucket candidates by finish date
    const buckets = useMemo(() => {
        const today = new Date();
        const data = {
            critical: [], // 0-14 Days
            upcoming: [], // 15-28 Days
            horizon: []   // 29-60 Days
        };

        candidates.forEach(c => {
            if (c.status !== 'On Job' || !c.finishDate) return;

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
        <div className="radar-widget glass-panel">
            {/* 1. FIXED HEADER */}
            <div className="widget-header">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-secondary" />
                    <h3 className="font-bold text-secondary uppercase tracking-wider text-xs">
                        Redeployment Radar (4 Weeks)
                    </h3>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                    {buckets.critical.length + buckets.upcoming.length} Active Risks
                </div>
            </div>

            {/* 2. SCROLLABLE GRID BODY */}
            <div className="radar-grid">

                {/* Column 1: Critical (0-14 Days) */}
                <div className="radar-col critical-zone">
                    <div className="col-header text-rose-400">
                        <AlertTriangle size={12} /> Critical (0-14d)
                    </div>
                    <div className="col-list">
                        {buckets.critical.map(c => (
                            <CandidateCard key={c.id} c={c} color="rose" />
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
                            <CandidateCard key={c.id} c={c} color="amber" />
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
                            <CandidateCard key={c.id} c={c} color="emerald" />
                        ))}
                        {buckets.horizon.length === 0 && <EmptyState />}
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Component Container */
                .radar-widget {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden; /* Contains the scroll areas */
                    background: rgba(15, 23, 42, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                }

                /* Fixed Header */
                .widget-header {
                    flex-shrink: 0; /* Prevents shrinking */
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(15, 23, 42, 0.6);
                }

                /* Grid Layout */
                .radar-grid {
                    flex: 1; /* Fills remaining height */
                    min-height: 0; /* Critical for nested flex scrolling */
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1px; /* Divider look */
                    background: rgba(255,255,255,0.05); /* Grid line color */
                }

                /* Columns */
                .radar-col {
                    background: rgba(15, 23, 42, 0.3);
                    display: flex;
                    flex-direction: column;
                    min-height: 0; /* Enables scrolling inside */
                }

                /* Fixed Column Headers */
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

                /* Scrollable List Area */
                .col-list {
                    flex: 1;
                    overflow-y: auto; /* Individual Scroll! */
                    padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                /* Custom Scrollbar */
                .col-list::-webkit-scrollbar {
                    width: 4px;
                }
                .col-list::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}

// Sub-component for individual items
function CandidateCard({ c, color }) {
    const colors = {
        rose: "bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40 text-rose-100",
        amber: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-100",
        emerald: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100"
    };

    return (
        <div className={`p-2 rounded border ${colors[color]} transition-colors cursor-pointer group`}>
            <div className="flex justify-between items-start">
                <span className="font-bold text-xs truncate">{c.firstName} {c.lastName}</span>
                <span className="text-[9px] font-mono opacity-60">{c.daysLeft}d</span>
            </div>
            <div className="text-[10px] opacity-60 mt-1 truncate">
                {c.role}
            </div>
            <div className="text-[9px] opacity-40 truncate">
                @ {c.currentEmployer || 'Unknown Site'}
            </div>
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