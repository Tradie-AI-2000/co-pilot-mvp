"use client";

import { Briefcase, Calendar, ChevronRight } from "lucide-react";

export default function ClientDemandWidget({ projects = [], onOpenProject }) {
    // Filter for Active or Planning projects
    const demandList = projects
        .filter(p => p.status === 'Active' || p.status === 'Planning')
        .sort((a, b) => new Date(a.startDate || Date.now()) - new Date(b.startDate || Date.now()))
        .slice(0, 5); // Limit to top 5

    return (
        <div className="client-demand-widget h-full flex flex-col">
            <div className="widget-header">
                <h3 className="uppercase text-xs font-bold text-slate-500 tracking-wider">Upcoming Starts</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {demandList.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 text-sm italic">
                        No upcoming project demand found.
                    </div>
                ) : (
                    demandList.map(project => (
                        <div
                            key={project.id}
                            className="project-item group"
                            onClick={() => onOpenProject(project)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`status-dot ${project.status.toLowerCase()}`}></div>
                                <div className="flex-1 min-w-0">
                                    <div className="project-name truncate">{project.name}</div>
                                    <div className="client-name truncate">{project.client || "Direct Client"}</div>
                                </div>
                            </div>

                            <div className="meta-info text-right">
                                <div className="role-badge">
                                    {project.roles ? `${project.roles.length} Roles` : 'Needs Review'}
                                </div>
                                <div className="start-date">
                                    <Calendar size={10} className="inline mr-1" />
                                    {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
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
                .client-demand-widget {
                    /* fits parent */
                }
                .widget-header { margin-bottom: 0.75rem; }

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

                .status-dot { width: 8px; height: 8px; border-radius: 50%; }
                .status-dot.active { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
                .status-dot.planning { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }

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
                .project-item:hover .hover-arrow { opacity: 1; }
                .project-item:hover .meta-info { opacity: 0; } /* Hide meta to show arrow cleanly or keep both? hiding for clean look */
                .project-item:hover .meta-info { opacity: 1; padding-right: 15px; } /* Actually let's just shift layout if we can, or just keep it simple */
                
                /* Override hover behavior */
                .project-item:hover .meta-info { opacity: 0; } 
                .project-item:hover .hover-arrow { opacity: 1; }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            `}</style>
        </div>
    );
}
