"use client";

import { Building, Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export default function ClientCard({ client, onClick, variant = "default" }) {
    const isCompact = variant === "compact";

    // Determine status style
    let statusClass = "status-default";
    let statusLabel = client.status || "Unknown";

    if (client.status === "Key Account" || client.status === "Active") {
        statusClass = "status-active"; // Green
    } else if (client.status === "At Risk" || client.status === "Inactive" || client.status === "Dormant") {
        statusClass = "status-inactive"; // Amber/Grey
    } else if (client.status === "Never Used" || client.status === "New Lead") {
        statusClass = "status-never"; // Blue Dashed
    }

    const tierLabels = {
        '1': 'T1',
        '2': 'T2',
        '3': 'T3'
    };

    return (
        <div className={`client-card glass-panel ${statusClass} ${isCompact ? 'compact' : ''}`} onClick={onClick}>
            {/* Left Status Bar handled by CSS border */}
            
            <div className="card-content">
                <div className="header-top">
                    <h3 className="client-name truncate" title={client.name}>{client.name}</h3>
                    {client.tier && (
                        <span className={`tier-badge tier-${client.tier}`}>
                            {tierLabels[client.tier] || client.tier}
                        </span>
                    )}
                </div>
                
                <div className="sub-header">
                    <span className="location text-xs text-slate-400">{client.region || "National"}</span>
                    {!isCompact && <span className="industry text-xs text-slate-500">• {client.industry}</span>}
                </div>

                {!isCompact && (
                    <div className="metrics-grid">
                        <div className="metric">
                            <span className="label">Active Jobs</span>
                            <span className="value">{client.activeJobs}</span>
                        </div>
                        <div className="metric">
                            <span className="label">Pipeline</span>
                            <span className="value">{client.pipelineStage}</span>
                        </div>
                        <div className="metric">
                            <span className="label">Last Contact</span>
                            <span className="value text-xs">{client.lastContact}</span>
                        </div>
                    </div>
                )}

                {isCompact && (
                     <div className="compact-metrics flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                             <Building size={12} />
                             <span>{client.activeJobs} Jobs</span>
                        </div>
                        {client.keyContacts?.[0] && (
                            <div className="flex items-center gap-1 text-xs text-slate-400" title={`Contact: ${client.keyContacts[0].name}`}>
                                <Users size={12} />
                                <span className="truncate max-w-[80px]">{client.keyContacts[0].name.split(' ')[0]}</span>
                            </div>
                        )}
                     </div>
                )}

                {!isCompact && client.actionAlerts?.length > 0 && (
                    <div className="alert-banner">
                        <AlertTriangle size={14} />
                        <span>{client.actionAlerts[0].message}</span>
                    </div>
                )}
            </div>

            <style jsx>{`
                .client-card {
                    display: flex;
                    flex-direction: column;
                    padding: 1rem; /* Reduced padding */
                    cursor: pointer;
                    transition: all 0.2s;
                    border-left: 4px solid var(--border);
                    position: relative;
                    overflow: hidden;
                    background: rgba(30, 41, 59, 0.4); /* Glass base */
                }

                .client-card.compact {
                    padding: 0.75rem;
                }

                .client-card:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.05);
                }

                /* Status Borders */
                .client-card.status-active { border-left-color: #10b981; box-shadow: -4px 0 15px -8px rgba(16, 185, 129, 0.4); }
                .client-card.status-inactive { border-left-color: #f59e0b; }
                .client-card.status-never { border-left-color: #3b82f6; border-left-style: dashed; }

                .card-content {
                    width: 100%;
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.1rem;
                }

                .client-name {
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-main);
                    max-width: 80%;
                }
                .compact .client-name {
                    font-size: 0.9rem;
                }

                .sub-header {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .tier-badge {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    padding: 0.1rem 0.3rem;
                    border-radius: 4px;
                    font-weight: 700;
                }

                .tier-badge.tier-1 { background: rgba(251, 191, 36, 0.1); color: var(--tier-1-gold); border: 1px solid rgba(251, 191, 36, 0.2); }
                .tier-badge.tier-2 { background: rgba(148, 163, 184, 0.1); color: var(--tier-2-silver); border: 1px solid rgba(148, 163, 184, 0.2); }
                .tier-badge.tier-3 { background: rgba(202, 138, 4, 0.1); color: var(--tier-3-bronze); border: 1px solid rgba(202, 138, 4, 0.2); }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .metric {
                    display: flex;
                    flex-direction: column;
                }

                .metric .label {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .metric .value {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--text-main);
                }

                .alert-banner {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem;
                    background: rgba(245, 158, 11, 0.1);
                    color: #fbbf24;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
}
