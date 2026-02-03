"use client";

import { X, User, Briefcase, Calendar, DollarSign, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useData } from "../../context/data-context.js";

export default function ActivePlacementsModal({ onClose }) {
    const { placements, candidates, projects } = useData();

    // Filter candidates who are explicitly "on_job"
    // This ensures alignment with the Dashboard counter and catches manual edits
    const onJobCandidates = candidates.filter(c => c.status === 'on_job');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Briefcase className="text-secondary" /> Active Placements
                        </h2>
                        <p className="text-sm text-muted mt-1">
                            {onJobCandidates.length} candidates currently deployed on site.
                        </p>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="placements-list">
                    {onJobCandidates.map(candidate => {
                        // Try to find the linked placement for extra metadata (like start date)
                        const placement = placements.find(p => p.candidateId === candidate.id && p.status === 'active');

                        // Resolve Project Name
                        let projectName = candidate.currentEmployer || "Unknown Project";
                        if (candidate.projectId) {
                            const proj = projects.find(p => p.id === candidate.projectId);
                            if (proj) projectName = proj.name;
                        } else if (placement && placement.projectId) {
                            const proj = projects.find(p => p.id === placement.projectId);
                            if (proj) projectName = proj.name;
                        }

                        // Calculate margin
                        const margin = candidate.chargeRate && candidate.payRate
                            ? ((candidate.chargeRate - candidate.payRate) / candidate.chargeRate * 100).toFixed(1)
                            : "0.0";

                        // Determine Start Date
                        const startDate = candidate.startDate
                            ? new Date(candidate.startDate).toLocaleDateString()
                            : placement?.floatedDate
                                ? new Date(placement.floatedDate).toLocaleDateString()
                                : "N/A";

                        return (
                            <div key={candidate.id} className="placement-card">
                                <div className="card-left">
                                    <div className="avatar">
                                        {candidate.firstName[0]}{candidate.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className="candidate-name">{candidate.firstName} {candidate.lastName}</h3>
                                        <div className="project-info">
                                            <Briefcase size={12} />
                                            <span>{projectName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-center">
                                    <div className="stat-group">
                                        <span className="label">Start Date</span>
                                        <span className="value flex items-center gap-1">
                                            <Calendar size={12} />
                                            {startDate}
                                        </span>
                                    </div>
                                    <div className="stat-group">
                                        <span className="label">Financials</span>
                                        <span className="value flex items-center gap-1 text-emerald-400">
                                            <DollarSign size={12} />
                                            {margin}% Margin
                                        </span>
                                    </div>
                                </div>

                                <div className="card-right">
                                    <span className="status-badge">
                                        <div className="dot"></div> On Job
                                    </span>
                                    <button className="action-btn">Manage</button>
                                </div>
                            </div>
                        );
                    })}

                    {onJobCandidates.length === 0 && (
                        <div className="empty-state">
                            <Briefcase size={48} className="text-slate-700 mb-4" />
                            <p className="text-slate-500">No active placements found.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1100;
                }

                .modal-content {
                    background: #0f172a;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    width: 800px;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: #1e293b;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .close-btn:hover { color: white; }

                .placements-list {
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .placement-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }

                .placement-card:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateY(-1px);
                }

                .card-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 2;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }

                .candidate-name {
                    font-weight: 600;
                    color: white;
                    font-size: 0.95rem;
                }

                .project-info {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .card-center {
                    flex: 2;
                    display: flex;
                    gap: 2rem;
                }

                .stat-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .stat-group .label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .stat-group .value {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: white;
                }

                .card-right {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.5rem;
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #34d399;
                    padding: 0.25rem 0.5rem;
                    border-radius: 99px;
                    font-weight: 600;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #34d399;
                    box-shadow: 0 0 6px #34d399;
                }

                .action-btn {
                    background: none;
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    border-color: var(--secondary);
                    color: var(--secondary);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                }
            `}</style>
        </div>
    );
}
