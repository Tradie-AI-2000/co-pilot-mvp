"use client";

import { Briefcase, Calendar, ChevronRight } from "lucide-react";

export default function ClientDemandWidget({ projects = [], onOpenProject }) {

    // --- 1. ROBUST HELPERS (Keep these!) ---
    const parseDate = (d) => {
        if (!d) return null;
        const dateObj = new Date(d);
        return isNaN(dateObj.getTime()) ? null : dateObj;
    };

    const getStartDate = (p) => {
        const pStart = parseDate(p.startDate);
        if (pStart) return pStart;

        const possibleDates = [];

        // Check demands
        if (Array.isArray(p.clientDemands)) {
            p.clientDemands.forEach(d => {
                const dDate = parseDate(d.startDate);
                if (dDate) possibleDates.push(dDate);
            });
        }

        // Check phases
        if (p.phaseSettings) {
            Object.values(p.phaseSettings).forEach(s => {
                if (!s.skipped) {
                    const sDate = parseDate(s.startDate);
                    if (sDate) possibleDates.push(sDate);
                }
            });
        }

        if (possibleDates.length > 0) return new Date(Math.min(...possibleDates));
        return new Date(8640000000000000); // Far future for sorting
    };

    const getDemandCount = (p) => {
        let count = 0;
        if (Array.isArray(p.clientDemands)) {
            count += p.clientDemands.reduce((acc, d) => acc + (Number(d.quantity) || 1), 0);
        }
        return count;
    };

    // --- 2. PRODUCTION FILTER ---
    const demandList = projects
        .filter(p => {
            // Case-Insensitive Status Check
            if (!p.status) return false;
            const s = p.status.toLowerCase();
            return s !== 'completed' && s !== 'archived'; // Show everything except dead projects
        })
        .filter(p => getDemandCount(p) > 0) // Only show projects with demand
        .sort((a, b) => getStartDate(a) - getStartDate(b))
        .slice(0, 10);

    return (
        <div className="client-demand-widget h-full flex flex-col">
            <div className="widget-header flex justify-between items-center mb-3">
                <h3 className="uppercase text-xs font-bold text-slate-500 tracking-wider">Upcoming Starts</h3>
                <span className="text-[10px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700">
                    {demandList.length} Active
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {demandList.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 text-sm italic">
                        No active demands found.
                    </div>
                ) : (
                    demandList.map(project => (
                        <div
                            key={project.id}
                            className="project-item group"
                            onClick={() => onOpenProject(project)}
                        >
                            <div className="flex items-center gap-3">
                                {/* Dynamic Status Color */}
                                <div className={`status-dot ${project.status?.toLowerCase() || 'neutral'}`}></div>

                                <div className="flex-1 min-w-0">
                                    <div className="project-name truncate">{project.name}</div>
                                    <div className="client-name truncate">{project.client || project.assetOwner || "Direct Client"}</div>
                                </div>
                            </div>

                            <div className="meta-info text-right">
                                <div className="role-badge">
                                    {getDemandCount(project)} Roles
                                </div>
                                <div className="start-date">
                                    <Calendar size={10} className="inline mr-1" />
                                    {(() => {
                                        const d = getStartDate(project);
                                        return d.getFullYear() > 3000 ? 'TBD' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                    })()}
                                </div>
                            </div>

                            <div className="hover-arrow">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .project-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 0.75rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }

                .project-item:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateX(2px);
                }

                .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #64748b; }
                .status-dot.active { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
                .status-dot.planning { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
                .status-dot.construction { background: #3b82f6; box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); }

                .project-name { font-weight: 600; font-size: 0.9rem; color: #e2e8f0; }
                .client-name { font-size: 0.75rem; color: #64748b; }

                .role-badge {
                    font-size: 0.7rem; font-weight: 700; background: rgba(15, 23, 42, 0.5); 
                    padding: 2px 6px; border-radius: 4px; color: var(--secondary); display: inline-block; margin-bottom: 2px;
                }
                .start-date { font-size: 0.7rem; color: #94a3b8; }

                .hover-arrow {
                    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                    opacity: 0; transition: opacity 0.2s; color: white;
                }
                
                .project-item:hover .meta-info { opacity: 0; } 
                .project-item:hover .hover-arrow { opacity: 1; }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            `}</style>
        </div>
    );
}