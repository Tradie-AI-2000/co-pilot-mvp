"use client";

import { Calendar, AlertCircle, Users } from "lucide-react";

export default function ProjectTimeline({ project }) {
    if (!project) return (
        <div className="empty-state">
            <p>Select a project to view timeline details</p>
        </div>
    );

    return (
        <div className="timeline-container">
            <div className="timeline-header">
                <h2>{project.name} - Timeline & Signals</h2>
                <div className="dates">
                    <Calendar size={16} />
                    <span>{project.startDate} — {project.completionDate}</span>
                </div>
            </div>

            <div className="phases-wrapper">
                {(project.phases || []).map((phase, index) => (
                    <div key={index} className={`phase-item ${phase.status.toLowerCase().replace(' ', '-')}`}>
                        <div className="phase-marker">
                            <div className="dot"></div>
                            <div className="line"></div>
                        </div>
                        <div className="phase-content">
                            <div className="phase-info">
                                <h4>{phase.name}</h4>
                                <span className="phase-dates">{phase.start} - {phase.end}</span>
                            </div>
                            <div className="phase-status">
                                <span className="status-label">{phase.status}</span>
                                {phase.progress && (
                                    <div className="progress-bar">
                                        <div className="fill" style={{ width: `${phase.progress}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="info-grid">
                <div className="info-column">
                    <h3>Project Team</h3>
                    <div className="team-list">
                        <div className="team-item main">
                            <span className="role">Main Contractor</span>
                            <span className="name">{project.client}</span>
                        </div>
                        {project.subContractors && project.subContractors.map((sub, index) => (
                            <div key={index} className="team-item">
                                <span className="role">{sub.trade}</span>
                                <span className="name">{sub.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-column">
                    <h3>Virtual PM Alerts</h3>
                    <div className="alerts-list">
                        {project.contactTriggers && project.contactTriggers.length > 0 ? (
                            project.contactTriggers.map((trigger) => (
                                <div key={trigger.id} className={`alert-card ${trigger.urgency.toLowerCase()}`}>
                                    <div className="alert-header">
                                        <AlertCircle size={14} />
                                        <span className="alert-date">{trigger.date}</span>
                                    </div>
                                    <p className="alert-message">{trigger.message}</p>
                                    <div className="alert-contact">
                                        <span>Contact: </span>
                                        <strong>{trigger.contact}</strong>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-alerts">No pending alerts</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="signals-section">
                <h3>Hiring Signals</h3>
                <div className="signals-grid">
                    {(project.hiringSignals || []).map((signal, index) => (
                        <div key={index} className={`signal-card ${signal.urgency.toLowerCase()}`}>
                            <div className="signal-header">
                                <span className="role">{signal.role}</span>
                                <span className="urgency-badge">{signal.date}</span>
                            </div>

                            <div className="signal-content">
                                <div className="detail-row">
                                    <div className="detail">
                                        <Users size={14} />
                                        <span>{signal.count} positions</span>
                                    </div>
                                    <div className="detail">
                                        <span className="value-tag">{signal.value || 'N/A'}</span>
                                    </div>
                                </div>

                                {signal.bidders && (
                                    <div className="bidders-section">
                                        <span className="label">Bidders:</span>
                                        <p className="bidders-list">{signal.bidders}</p>
                                    </div>
                                )}
                            </div>

                            <div className="signal-footer">
                                <div className="signal-phase">Phase: {signal.phase}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .timeline-container {
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    padding: 1.5rem;
                    height: 100%;
                    overflow-y: auto;
                }

                .empty-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--text-muted);
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }

                .timeline-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .timeline-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .dates {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .phases-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    margin-bottom: 2rem;
                }

                .phase-item {
                    display: flex;
                    gap: 1rem;
                    position: relative;
                    padding-bottom: 2rem;
                }

                .phase-item:last-child {
                    padding-bottom: 0;
                }

                .phase-marker {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 20px;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--border);
                    border: 2px solid var(--surface);
                    z-index: 2;
                }

                .line {
                    width: 2px;
                    flex: 1;
                    background: var(--border);
                    margin-top: -2px;
                    margin-bottom: -2px;
                }

                .phase-item:last-child .line {
                    display: none;
                }

                .phase-item.completed .dot { background: #10b981; }
                .phase-item.completed .line { background: #10b981; }
                
                .phase-item.in-progress .dot { background: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); }
                
                .phase-content {
                    flex: 1;
                    background: var(--background);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .phase-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }

                .phase-info h4 {
                    font-weight: 600;
                    color: var(--text-main);
                }

                .phase-dates {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .status-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .progress-bar {
                    height: 4px;
                    background: var(--border);
                    border-radius: 2px;
                    margin-top: 0.5rem;
                    overflow: hidden;
                }

                .fill {
                    height: 100%;
                    background: #3b82f6;
                    border-radius: 2px;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                }

                .info-column h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin-bottom: 1rem;
                }

                .team-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .team-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem;
                    background: var(--background);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    font-size: 0.9rem;
                }

                .team-item.main {
                    border-color: var(--primary);
                    background: rgba(59, 130, 246, 0.05);
                }

                .team-item .role { color: var(--text-muted); }
                .team-item .name { font-weight: 500; color: var(--text-main); }

                .alerts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .alert-card {
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: var(--background);
                    border-left-width: 4px;
                }

                .alert-card.high, .alert-card.critical { border-left-color: #ef4444; }
                .alert-card.medium { border-left-color: #f59e0b; }

                .alert-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .alert-message {
                    font-size: 0.9rem;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                }

                .alert-contact {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .alert-contact strong { color: var(--text-main); margin-left: 0.25rem; }

                .empty-alerts {
                    padding: 1rem;
                    text-align: center;
                    color: var(--text-muted);
                    font-style: italic;
                    background: var(--background);
                    border-radius: var(--radius-sm);
                }

                .signals-section h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin-bottom: 1rem;
                }

                .signals-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .signal-card {
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: var(--background);
                }

                .signal-card.high, .signal-card.critical {
                    border-left: 4px solid #ef4444;
                }

                .signal-card.medium {
                    border-left: 4px solid #f59e0b;
                }

                .signal-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                }

                .role {
                    font-weight: 600;
                    color: var(--text-main);
                }

                .urgency-badge {
                    font-size: 0.7rem;
                    padding: 0.125rem 0.5rem;
                    border-radius: 999px;
                    background: var(--surface);
                    color: var(--text-muted);
                    border: 1px solid var(--border);
                }

                .signal-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .detail {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.85rem;
                    color: var(--text-main);
                    font-weight: 500;
                }
                
                .value-tag {
                    font-size: 0.75rem;
                    background: rgba(34, 197, 94, 0.1); /* Green tint */
                    color: #22c55e;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }

                .bidders-section {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.5rem;
                    border-radius: 4px;
                    border: 1px solid var(--border);
                }

                .bidders-section .label {
                    display: block;
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 0.2rem;
                }

                .bidders-list {
                    font-size: 0.8rem;
                    color: var(--text-main);
                    margin: 0;
                    line-height: 1.3;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .signal-footer {
                    padding-top: 0.5rem;
                    border-top: 1px solid var(--border);
                }

                .signal-phase {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
