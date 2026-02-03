"use client";

import { AlertOctagon, DollarSign, Users } from "lucide-react";

export default function BenchLiabilityWidget({ candidates, liability, onViewBench }) {
    // 1. Filter for 'Bench' candidates (Available)
    const benchCandidates = candidates.filter(c => c.status === "available");

    const totalWeeklyLiability = liability ?? benchCandidates.reduce((acc, c) => {
        const payRate = c.payRate || 30;
        const hours = c.guaranteedHours || 0;
        return acc + (payRate * 1.20 * hours);
    }, 0);

    const isCritical = totalWeeklyLiability > 0;

    return (
        <div className={`liability-card ${isCritical ? 'critical' : 'safe'}`}>
            <div className="card-header">
                <div className="title-row">
                    <AlertOctagon size={24} className={isCritical ? "text-red-500" : "text-emerald-500"} />
                    <h3>Bench Risk</h3>
                </div>
            </div>

            <div className="card-body">
                <div className="main-metric">
                    <div className="metric-row">
                        <span className="currency">$</span>
                        <span className="value">{totalWeeklyLiability.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        <span className="period">/ wk</span>
                    </div>
                    <p className="subtext">Liability Cost</p>
                </div>

                <div className="worker-stat">
                    <Users size={48} className="worker-icon" />
                    <div className="stat-content">
                        <span className="stat-value">{benchCandidates.length}</span>
                        <span className="stat-label">On Bench</span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <button className="action-btn" onClick={onViewBench}>
                    View Details
                </button>
            </div>

            <style jsx>{`
                .liability-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                }

                .liability-card.critical {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                h3 {
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: white;
                }

                .card-body {
                    display: flex;
                    justify-content: space-between;
                    align-items: center; 
                    flex: 1;
                }

                .main-metric {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .metric-row {
                    display: flex;
                    align-items: baseline;
                    gap: 0.25rem;
                }

                .currency {
                    font-size: 1.5rem;
                    font-weight: 500;
                    color: var(--text-muted);
                }

                .value {
                    font-size: 3rem;
                    font-weight: 800;
                    line-height: 1;
                    color: white;
                }

                .period {
                    font-size: 1rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                
                .subtext {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #ef4444;
                    font-weight: 700;
                    margin-top: 0.5rem;
                }

                .worker-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    position: relative;
                }

                .worker-icon {
                    color: rgba(255, 255, 255, 0.05);
                    position: absolute;
                    top: -20px;
                    right: 0;
                    transform: scale(1.5);
                    pointer-events: none;
                }

                .stat-content {
                    text-align: right;
                    z-index: 1;
                }

                .stat-value {
                    display: block;
                    font-size: 3.5rem;
                    line-height: 0.9;
                    font-weight: 900;
                    color: #ef4444; 
                    text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
                }

                .stat-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .action-btn {
                    width: 100%;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    padding: 0.75rem;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .action-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: rgba(239, 68, 68, 0.5);
                    color: white;
                }
            `}</style>
        </div>
    );
}
