"use client";

import { Calendar, AlertCircle, Clock, CheckCircle } from "lucide-react";

export default function RedeploymentRadar({ candidates }) {
    // 1. Filter for 'On Job' candidates finishing within 28 days
    const today = new Date();
    const fourWeeksOut = new Date(today);
    fourWeeksOut.setDate(today.getDate() + 28);

    const upcomingFinishes = candidates.filter(c => {
        if (c.status !== "On Job" || !c.finishDate) return false;
        const finish = new Date(c.finishDate);
        return finish >= today && finish <= fourWeeksOut;
    }).sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate));

    // Group by Urgency
    const buckets = {
        critical: [], // 0-7 days
        urgent: [],   // 8-14 days
        upcoming: []  // 15-28 days
    };

    upcomingFinishes.forEach(c => {
        const finish = new Date(c.finishDate);
        const diffTime = Math.abs(finish - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        c.daysLeft = diffDays;

        if (diffDays <= 7) buckets.critical.push(c);
        else if (diffDays <= 14) buckets.urgent.push(c);
        else buckets.upcoming.push(c);
    });

    return (
        <div className="radar-card">
            <div className="card-header">
                <div className="title-row">
                    <Clock size={20} className="text-secondary" />
                    <h3>Redeployment Radar (4 Weeks)</h3>
                </div>
                <span className="count-badge">{upcomingFinishes.length} Finishing Soon</span>
            </div>

            <div className="radar-lanes">
                {/* Critical Lane */}
                <div className="lane critical">
                    <div className="lane-header">
                        <AlertCircle size={14} />
                        <span>Critical (0-7 Days)</span>
                    </div>
                    <div className="lane-content">
                        {buckets.critical.length === 0 ? (
                            <div className="empty-lane">No critical expiries</div>
                        ) : (
                            buckets.critical.map(c => (
                                <div key={c.id} className="candidate-pill critical">
                                    <div className="pill-name">{c.firstName} {c.lastName}</div>
                                    <div className="pill-meta">{c.role} • {c.daysLeft} days</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Urgent Lane */}
                <div className="lane urgent">
                    <div className="lane-header">
                        <Clock size={14} />
                        <span>Urgent (8-14 Days)</span>
                    </div>
                    <div className="lane-content">
                        {buckets.urgent.length === 0 ? (
                            <div className="empty-lane">No urgent expiries</div>
                        ) : (
                            buckets.urgent.map(c => (
                                <div key={c.id} className="candidate-pill urgent">
                                    <div className="pill-name">{c.firstName} {c.lastName}</div>
                                    <div className="pill-meta">{c.role} • {c.daysLeft} days</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Lane */}
                <div className="lane upcoming">
                    <div className="lane-header">
                        <CheckCircle size={14} />
                        <span>Upcoming (15-28 Days)</span>
                    </div>
                    <div className="lane-content">
                        {buckets.upcoming.length === 0 ? (
                            <div className="empty-lane">No upcoming expiries</div>
                        ) : (
                            buckets.upcoming.map(c => (
                                <div key={c.id} className="candidate-pill upcoming">
                                    <div className="pill-name">{c.firstName} {c.lastName}</div>
                                    <div className="pill-meta">{c.role} • {c.finishDate}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .radar-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    height: 100%;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-main);
                }

                h3 {
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .count-badge {
                    background: rgba(255,255,255,0.1);
                    padding: 0.2rem 0.6rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .radar-lanes {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    flex: 1;
                }

                .lane {
                    background: rgba(0,0,0,0.2);
                    border-radius: var(--radius-sm);
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .lane-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--border);
                }

                .lane.critical .lane-header { color: #ef4444; }
                .lane.urgent .lane-header { color: #f59e0b; }
                .lane.upcoming .lane-header { color: #3b82f6; }

                .lane-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    overflow-y: auto;
                    max-height: 200px;
                }

                .empty-lane {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-style: italic;
                    text-align: center;
                    margin-top: 1rem;
                }

                .candidate-pill {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    padding: 0.5rem;
                    border-left-width: 3px;
                    cursor: pointer;
                    transition: transform 0.1s;
                }

                .candidate-pill:hover {
                    transform: translateX(2px);
                    background: rgba(255,255,255,0.05);
                }

                .candidate-pill.critical { border-left-color: #ef4444; }
                .candidate-pill.urgent { border-left-color: #f59e0b; }
                .candidate-pill.upcoming { border-left-color: #3b82f6; }

                .pill-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .pill-meta {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    margin-top: 0.1rem;
                }
            `}</style>
        </div>
    );
}
