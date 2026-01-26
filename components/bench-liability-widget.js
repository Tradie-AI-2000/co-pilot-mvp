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
                    <AlertOctagon size={20} />
                    <h3>Bench Risk</h3>
                </div>
                <span className="count-badge">{benchCandidates.length} Workers</span>
            </div>

            <div className="card-body">
                <div className="metric">
                    <span className="currency">$</span>
                    <span className="value">{totalWeeklyLiability.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <span className="period">/ wk</span>
                </div>
                <p className="subtext">
                    Current liability for unassigned talent.
                </p>
            </div>

            <div className="card-footer">
                <button className="action-btn" onClick={onViewBench}>
                    <Users size={14} /> View Bench List
                </button>
            </div>

            <style jsx>{`
                .liability-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    border-left: 4px solid;
                    height: 100%;
                }

                .liability-card.critical {
                    border-left-color: #ef4444;
                    background: linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(15, 23, 42, 0.6));
                }

                .liability-card.safe {
                    border-left-color: #10b981;
                    background: rgba(15, 23, 42, 0.6);
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
                    color: ${isCritical ? '#ef4444' : '#10b981'};
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

                .metric {
                    display: flex;
                    align-items: baseline;
                    color: var(--text-main);
                }

                .currency {
                    font-size: 1.2rem;
                    font-weight: 500;
                    margin-right: 2px;
                    color: var(--text-muted);
                }

                .value {
                    font-size: 2rem;
                    font-weight: 800;
                    line-height: 1;
                }

                .period {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-left: 4px;
                }

                .subtext {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin: 0.5rem 0 0 0;
                }

                .card-footer {
                    margin-top: auto;
                }

                .action-btn {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
            `}</style>
        </div>
    );
}
