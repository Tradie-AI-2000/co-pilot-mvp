"use client";

import { useMemo } from 'react';
import { DollarSign, User, Users, Target, Briefcase, TrendingUp } from 'lucide-react';
import { useData } from "../context/data-context.js";

export default function CommissionDashboard() {
    const { candidates, clients, projects } = useData();
    const currentUser = "Joe Ward"; // In a real app, get this from auth context

    // --- Configuration ---
    const BURDEN_MULTIPLIER = 1.30; // 30% overhead as per prompt
    const WORK_WEEK_HOURS = 40;

    // Splits Configuration
    const SPLITS = useMemo(() => ({
        recruiter: 0.20,
        candidateManager: 0.30,
        clientOwner: 0.20,
        accountManager: 0.30
    }), []);

    // --- Logic: Calculate Attributed Margin ---
    const commissionData = useMemo(() => {
        // FIXED: Include all "on_job" candidates (using correct DB enum value)
        const activePlacements = candidates.filter(c => c.status === "on_job");

        const myBreakdown = {
            recruiter: 0,
            candidateManager: 0,
            clientOwner: 0,
            accountManager: 0
        };

        const placementsWithSplits = activePlacements.map(candidate => {
            // IMPROVED: Try to find project by ID first, then by name
            const project = projects.find(p =>
                p.id === candidate.projectId ||
                p.name === candidate.currentProject
            );

            // IMPROVED: Try multiple ways to find the client
            const client = clients.find(c =>
                c.id === project?.client ||
                c.name === project?.client ||
                c.name === candidate.currentEmployer ||
                (project?.assignedCompanyIds && project.assignedCompanyIds.includes(c.id))
            );

            // Calculate Margin
            const charge = candidate.chargeRate || 0;
            const pay = candidate.payRate || 0;
            const margin = charge - (pay * BURDEN_MULTIPLIER);
            const weeklyMargin = margin * (candidate.guaranteedHours || WORK_WEEK_HOURS);

            if (weeklyMargin <= 0) return null;

            // Roles
            const roles = {
                recruiter: candidate.recruiter,
                candidateManager: candidate.candidateManager || candidate.recruiter,
                clientOwner: client?.clientOwner,
                accountManager: client?.accountManager || client?.clientOwner
            };

            // Calculate My Attribution
            let myCut = 0;
            if (roles.recruiter === currentUser) {
                const amount = weeklyMargin * SPLITS.recruiter;
                myCut += amount;
                myBreakdown.recruiter += amount;
            }
            if (roles.candidateManager === currentUser) {
                const amount = weeklyMargin * SPLITS.candidateManager;
                myCut += amount;
                myBreakdown.candidateManager += amount;
            }
            if (roles.clientOwner === currentUser) {
                const amount = weeklyMargin * SPLITS.clientOwner;
                myCut += amount;
                myBreakdown.clientOwner += amount;
            }
            if (roles.accountManager === currentUser) {
                const amount = weeklyMargin * SPLITS.accountManager;
                myCut += amount;
                myBreakdown.accountManager += amount;
            }

            return {
                candidate: `${candidate.firstName} ${candidate.lastName}`,
                client: client?.name || project?.name || "Unknown",
                weeklyMargin,
                myCut,
                roles
            };
        }).filter(Boolean);

        const totalWeeklyGM = placementsWithSplits.reduce((sum, p) => sum + p.weeklyMargin, 0);
        const myWeeklyAttribution = placementsWithSplits.reduce((sum, p) => sum + p.myCut, 0);

        return { totalWeeklyGM, myWeeklyAttribution, myBreakdown, placementsWithSplits };
    }, [candidates, clients, projects, currentUser, SPLITS]);

    const categories = [
        { id: 'recruiter', name: 'Recruitment (20%)', value: commissionData.myBreakdown.recruiter, color: '#3b82f6' },
        { id: 'candidateManager', name: 'Cand. Mgmt (30%)', value: commissionData.myBreakdown.candidateManager, color: '#8b5cf6' },
        { id: 'clientOwner', name: 'Client Own. (20%)', value: commissionData.myBreakdown.clientOwner, color: '#10b981' },
        { id: 'accountManager', name: 'Acc. Mgmt (30%)', value: commissionData.myBreakdown.accountManager, color: '#f59e0b' },
    ];

    return (
        <div className="panel commission-panel">
            <div className="panel-header">
                <h3 className="text-white flex items-center gap-2">
                    <Target size={18} className="text-sky-400" /> My Performance Desk
                </h3>
                <span className="user-badge">{currentUser}</span>
            </div>

            <div className="top-stats">
                <div className="stat-card total">
                    <div className="label">Total Desk Margin</div>
                    <div className="value text-slate-200">
                        ${Math.round(commissionData.totalWeeklyGM).toLocaleString()}
                        <span className="unit">/wk</span>
                    </div>
                </div>
                <div className="stat-card personal">
                    <div className="label">My Attributed GM</div>
                    <div className="value text-sky-400">
                        ${Math.round(commissionData.myWeeklyAttribution).toLocaleString()}
                        <span className="unit">/wk</span>
                    </div>
                    <div className="subtext">
                        {Math.round((commissionData.myWeeklyAttribution / (commissionData.totalWeeklyGM || 1)) * 100)}% of Total
                    </div>
                </div>
            </div>

            <div className="viz-section">
                <div className="breakdown-list">
                    {categories.map(cat => {
                        const pct = commissionData.myWeeklyAttribution > 0
                            ? (cat.value / commissionData.myWeeklyAttribution) * 100
                            : 0;

                        return (
                            <div key={cat.id} className="cat-row">
                                <div className="cat-info">
                                    <span className="cat-name">{cat.name}</span>
                                    <span className="cat-val">${Math.round(cat.value)}</span>
                                </div>
                                <div className="cat-bar-track">
                                    <div
                                        className="cat-bar-fill"
                                        style={{ width: `${pct}%`, background: cat.color }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="table-container">
                <h4>Active Splits Breakdown</h4>
                <div className="table-scroll">
                    <table className="splits-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Client</th>
                                <th>Margin</th>
                                <th>My Cut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissionData.placementsWithSplits.map((p, idx) => (
                                <tr key={idx}>
                                    <td>{p.candidate}</td>
                                    <td>{p.client}</td>
                                    <td className="text-slate-400">${Math.round(p.weeklyMargin)}</td>
                                    <td className="text-sky-400 font-bold">${Math.round(p.myCut)}</td>
                                </tr>
                            ))}
                            {commissionData.placementsWithSplits.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted italic p-4">
                                        No active placements with margin found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .commission-panel {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 100%;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .panel-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .user-badge {
                    background: rgba(56, 189, 248, 0.1);
                    color: #38bdf8;
                    font-size: 0.75rem;
                    padding: 4px 10px;
                    border-radius: 99px;
                    font-weight: 600;
                    border: 1px solid rgba(56, 189, 248, 0.2);
                }

                .top-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .stat-card.personal {
                    background: linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(15, 23, 42, 0) 100%);
                    border-color: rgba(56, 189, 248, 0.2);
                }

                .stat-card .label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.25rem;
                }

                .stat-card .value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    line-height: 1;
                }

                .stat-card .unit {
                    font-size: 0.8rem;
                    font-weight: 500;
                    opacity: 0.6;
                    margin-left: 2px;
                }

                .stat-card .subtext {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    margin-top: 0.25rem;
                }

                .viz-section {
                    background: rgba(0,0,0,0.2);
                    padding: 1.25rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }

                .breakdown-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .cat-row {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .cat-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .cat-name {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .cat-val {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: white;
                }

                .cat-bar-track {
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .cat-bar-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .table-container h4 {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin: 0 0 0.75rem 0;
                    font-weight: 700;
                }

                .table-scroll {
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                }

                .splits-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.75rem;
                }

                .splits-table th {
                    text-align: left;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-muted);
                    font-weight: 700;
                    position: sticky;
                    top: 0;
                }

                .splits-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid var(--border);
                    color: white;
                }

                .splits-table tr:last-child td {
                    border-bottom: none;
                }
            `}</style>
        </div>
    );
}
