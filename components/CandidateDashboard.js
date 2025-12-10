"use client";

import { Users, AlertCircle, Clock, Briefcase, TrendingUp } from "lucide-react";

export default function CandidateDashboard({ candidates = [] }) {
    // 1. Calculate Metrics
    const totalCandidates = candidates.length;
    const availableCandidates = candidates.filter(c => c.status === "Available").length;

    // Logic for "Finishing Soon" (Orange Alert) - within 14 days
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    const finishingSoon = candidates.filter(c => {
        if (!c.finishDate || c.status === "Available") return false;
        const finishDate = new Date(c.finishDate);
        return finishDate >= today && finishDate <= twoWeeksFromNow;
    }).length;

    const utilizationRate = totalCandidates > 0
        ? Math.round(((totalCandidates - availableCandidates) / totalCandidates) * 100)
        : 0;

    // 2. Role Breakdown
    const roleCounts = candidates.reduce((acc, curr) => {
        const role = curr.role || "Other";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {});

    // Sort roles by count descending
    const sortedRoles = Object.entries(roleCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5 roles

    const maxRoleCount = Math.max(...Object.values(roleCounts), 1);

    return (
        <div className="dashboard-grid">
            {/* Metric Cards */}
            <div className="metric-card red-alert">
                <div className="metric-icon"><AlertCircle size={24} /></div>
                <div className="metric-content">
                    <span className="metric-label">On The Bench</span>
                    <span className="metric-value">{availableCandidates}</span>
                    <span className="metric-sub">Immediate Availability</span>
                </div>
            </div>

            <div className="metric-card orange-alert">
                <div className="metric-icon"><Clock size={24} /></div>
                <div className="metric-content">
                    <span className="metric-label">Finishing Soon</span>
                    <span className="metric-value">{finishingSoon}</span>
                    <span className="metric-sub">Next 14 Days</span>
                </div>
            </div>

            <div className="metric-card blue-info">
                <div className="metric-icon"><Briefcase size={24} /></div>
                <div className="metric-content">
                    <span className="metric-label">Total Pool</span>
                    <span className="metric-value">{totalCandidates}</span>
                    <span className="metric-sub">Active Candidates</span>
                </div>
            </div>

            <div className="metric-card green-success">
                <div className="metric-icon"><TrendingUp size={24} /></div>
                <div className="metric-content">
                    <span className="metric-label">Utilization</span>
                    <span className="metric-value">{utilizationRate}%</span>
                    <span className="metric-sub">Revenue Generating</span>
                </div>
            </div>

            {/* Role Breakdown Chart */}
            <div className="role-chart-card">
                <h3>Top Roles</h3>
                <div className="chart-container">
                    {sortedRoles.map(([role, count]) => (
                        <div key={role} className="chart-row">
                            <span className="role-label">{role}</span>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${(count / maxRoleCount) * 100}%` }}
                                ></div>
                            </div>
                            <span className="role-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr) 1.5fr; /* 4 metrics + 1 chart */
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .metric-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.25rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    position: relative;
                    overflow: hidden;
                }

                .metric-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                }

                .metric-card.red-alert::before { background: #ef4444; }
                .metric-card.red-alert .metric-icon { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
                
                .metric-card.orange-alert::before { background: #f97316; }
                .metric-card.orange-alert .metric-icon { color: #f97316; background: rgba(249, 115, 22, 0.1); }

                .metric-card.blue-info::before { background: #3b82f6; }
                .metric-card.blue-info .metric-icon { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }

                .metric-card.green-success::before { background: #10b981; }
                .metric-card.green-success .metric-icon { color: #10b981; background: rgba(16, 185, 129, 0.1); }

                .metric-icon {
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .metric-content {
                    display: flex;
                    flex-direction: column;
                }

                .metric-label {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .metric-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1.2;
                    margin: 0.25rem 0;
                }

                .metric-sub {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    opacity: 0.8;
                }

                /* Role Chart */
                .role-chart-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .role-chart-card h3 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .chart-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    justify-content: center;
                    flex: 1;
                }

                .chart-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.85rem;
                }

                .role-label {
                    width: 100px;
                    color: var(--text-main);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: right;
                }

                .bar-track {
                    flex: 1;
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .bar-fill {
                    height: 100%;
                    background: var(--secondary);
                    border-radius: 3px;
                }

                .role-count {
                    width: 20px;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-align: right;
                }
            `}</style>
        </div>
    );
}
