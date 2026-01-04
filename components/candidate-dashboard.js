"use client";

import { Users, AlertCircle, Clock, Briefcase, TrendingUp } from "lucide-react";

export default function CandidateDashboard({ candidates = [], onStatusClick }) {
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
            <div
                className="metric-card red-alert cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => onStatusClick && onStatusClick('Available')}
            >
                <div className="metric-icon"><AlertCircle size={24} /></div>
                <div className="metric-content">
                    <span className="metric-label">On The Bench</span>
                    <span className="metric-value">{availableCandidates}</span>
                    <span className="metric-sub">Immediate Availability</span>
                </div>
            </div>

            <div
                className="metric-card orange-alert cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => onStatusClick && onStatusClick('Finishing Soon')}
            >
                <div className="metric-icon"><Clock size={24} /></div>
                <div className="metric-content">
                    <span className="metric-label">Finishing Soon</span>
                    <span className="metric-value">{finishingSoon}</span>
                    <span className="metric-sub">Next 14 Days</span>
                </div>
            </div>

            <div
                className="metric-card blue-info cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => onStatusClick && onStatusClick('Total Pool')}
            >
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
                    grid-template-columns: repeat(4, 1fr) 1.5fr;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .metric-card {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1.25rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .metric-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .metric-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                }

                .metric-card.red-alert::before { background: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
                .metric-card.red-alert .metric-icon { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
                
                .metric-card.orange-alert::before { background: #f97316; box-shadow: 0 0 15px rgba(249, 115, 22, 0.5); }
                .metric-card.orange-alert .metric-icon { color: #f97316; background: rgba(249, 115, 22, 0.1); }

                .metric-card.blue-info::before { background: var(--secondary); box-shadow: 0 0 15px rgba(0, 242, 255, 0.5); }
                .metric-card.blue-info .metric-icon { color: var(--secondary); background: rgba(0, 242, 255, 0.1); }

                .metric-card.green-success::before { background: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
                .metric-card.green-success .metric-icon { color: #10b981; background: rgba(16, 185, 129, 0.1); }

                .metric-icon {
                    padding: 0.85rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .metric-content {
                    display: flex;
                    flex-direction: column;
                }

                .metric-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .metric-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    line-height: 1.1;
                    margin: 0.4rem 0;
                    letter-spacing: -0.02em;
                }

                .metric-sub {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* Role Chart */
                .role-chart-card {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .role-chart-card h3 {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .chart-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    justify-content: center;
                    flex: 1;
                }

                .chart-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.85rem;
                }

                .role-label {
                    width: 110px;
                    color: var(--text-main);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: right;
                    font-weight: 500;
                }

                .bar-track {
                    flex: 1;
                    height: 8px;
                    background: rgba(15, 23, 42, 0.8);
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--secondary) 0%, #3b82f6 100%);
                    border-radius: 4px;
                    box-shadow: 0 0 10px rgba(0, 242, 255, 0.2);
                }

                .role-count {
                    width: 24px;
                    color: var(--secondary);
                    font-weight: 700;
                    text-align: right;
                }
            `}</style>
        </div>
    );
}
