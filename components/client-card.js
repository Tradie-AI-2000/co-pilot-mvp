"use client";

import { Building, Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export default function ClientCard({ client, onClick }) {
    const tierColors = {
        '1': 'var(--tier-1-gold)',
        '2': 'var(--tier-2-silver)',
        '3': 'var(--tier-3-bronze)'
    };

    const tierLabels = {
        '1': 'Tier 1: General',
        '2': 'Tier 2: Package Holder',
        '3': 'Tier 3: Specialist'
    };

    const borderColor = tierColors[client.tier] || 'var(--border)';

    return (
        <div className="client-card glass-panel" onClick={onClick}>
            <div className="card-header">
                <div className="header-top">
                    <h3 className="client-name">{client.name}</h3>
                    <span className={`tier-badge tier-${client.tier}`}>
                        {tierLabels[client.tier] || 'Standard'}
                    </span>
                </div>
                <div className="industry">{client.industry}</div>
            </div>

            <div className="card-body">
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

                {client.actionAlerts?.length > 0 && (
                    <div className="alert-banner">
                        <AlertTriangle size={14} />
                        <span>{client.actionAlerts[0].message}</span>
                    </div>
                )}
            </div>

            <div className="card-footer">
                <div className="status-indicator">
                    <div className={`status-dot ${client.status === 'Key Account' ? 'green' : client.status === 'At Risk' ? 'red' : 'amber'}`}></div>
                    <span>{client.status}</span>
                </div>
                {client.projectIds?.length > 0 && (
                    <div className="project-count">
                        <Building size={14} /> {client.projectIds.length} Linked Projects
                    </div>
                )}
            </div>

            <style jsx>{`
                .client-card {
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-left: 4px solid ${borderColor};
                    position: relative;
                    overflow: hidden;
                }

                .client-card:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.03);
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.25rem;
                }

                .client-name {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--text-main);
                }

                .industry {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .tier-badge {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .tier-badge.tier-1 { background: rgba(251, 191, 36, 0.1); color: var(--tier-1-gold); border: 1px solid rgba(251, 191, 36, 0.2); }
                .tier-badge.tier-2 { background: rgba(148, 163, 184, 0.1); color: var(--tier-2-silver); border: 1px solid rgba(148, 163, 184, 0.2); }
                .tier-badge.tier-3 { background: rgba(202, 138, 4, 0.1); color: var(--tier-3-bronze); border: 1px solid rgba(202, 138, 4, 0.2); }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .metric {
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                }

                .metric .label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .metric .value {
                    font-weight: 600;
                    color: var(--text-main);
                }

                .alert-banner {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    background: rgba(245, 158, 11, 0.1);
                    color: #fbbf24;
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .card-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .status-dot.green { background: #10b981; }
                .status-dot.red { background: #ef4444; }
                .status-dot.amber { background: #f59e0b; }

                .project-count {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                }
            `}</style>
        </div>
    );
}
