"use client";

import { useState } from "react";
import { CheckSquare, Square, Car, Wrench, Shield, AlertCircle, Clock, Zap, UserCheck, Phone, Mail } from "lucide-react";
import { useData } from "../../context/data-context.js";

export default function BenchRoster({ candidates, onGenerateHotList }) {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === candidates.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(candidates.map(c => c.id));
        }
    };

    const handleAction = () => {
        const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id));
        onGenerateHotList(selectedCandidates);
    };

    // Helper to calculate "Days on Bench"
    // Mock logic: If no finish date, assume they've been waiting since dateCreated or just randomize for demo
    const getDaysOnBench = (c) => {
        if (c.finishDate) {
            const finish = new Date(c.finishDate);
            const today = new Date();
            const diff = Math.ceil((today - finish) / (1000 * 60 * 60 * 24));
            return diff > 0 ? diff : 0; // 0 if finishing in future
        }
        return Math.floor(Math.random() * 10) + 1; // Demo data
    };

    return (
        <div className="bench-roster">
            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bulk-actions">
                    <div className="selected-count">
                        {selectedIds.length} Selected
                    </div>
                    <div className="action-buttons">
                        <button className="bulk-btn primary" onClick={handleAction}>
                            <Zap size={16} /> Generate Hot List
                        </button>
                        <button className="bulk-btn secondary">
                            <Phone size={16} /> Check Availability
                        </button>
                    </div>
                </div>
            )}

            <div className="roster-table">
                <div className="table-header">
                    <div className="th check-col" onClick={toggleSelectAll}>
                        {selectedIds.length === candidates.length && candidates.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                    <div className="th name-col">Candidate</div>
                    <div className="th role-col">Role & Skills</div>
                    <div className="th bench-col">Days on Bench</div>
                    <div className="th cost-col">Liability</div>
                    <div className="th status-col">Status</div>
                </div>

                <div className="table-body">
                    {candidates.map(candidate => {
                        const days = getDaysOnBench(candidate);
                        const liability = candidate.guaranteedHours ? (candidate.payRate * 1.2 * candidate.guaranteedHours) : 0;
                        const isSelected = selectedIds.includes(candidate.id);

                        return (
                            <div 
                                key={candidate.id} 
                                className={`table-row ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleSelect(candidate.id)}
                            >
                                <div className="td check-col">
                                    {isSelected ? <CheckSquare size={18} className="text-secondary" /> : <Square size={18} className="text-slate-600" />}
                                </div>
                                <div className="td name-col">
                                    <div className="avatar">{candidate.firstName[0]}{candidate.lastName[0]}</div>
                                    <div>
                                        <div className="font-bold text-white">{candidate.firstName} {candidate.lastName}</div>
                                        <div className="text-xs text-muted">{candidate.suburb}</div>
                                    </div>
                                </div>
                                <div className="td role-col">
                                    <div className="role-text">{candidate.role}</div>
                                    <div className="tags">
                                        <span className="tag" title="Has Vehicle"><Car size={12} /></span>
                                        <span className="tag" title="Has Tools"><Wrench size={12} /></span>
                                        <span className="tag" title="Site Safe"><Shield size={12} /></span>
                                    </div>
                                </div>
                                <div className="td bench-col">
                                    <div className={`days-badge ${days > 7 ? 'red' : days > 3 ? 'orange' : 'green'}`}>
                                        <Clock size={12} /> {days} Days
                                    </div>
                                </div>
                                <div className="td cost-col">
                                    {liability > 0 ? (
                                        <span className="text-rose-400 font-mono">-${Math.round(liability)}/wk</span>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </div>
                                <div className="td status-col">
                                    <span className="status-pill">Available</span>
                                </div>
                            </div>
                        );
                    })}
                    {candidates.length === 0 && (
                        <div className="empty-state">No candidates matching this filter.</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .bench-roster {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Bulk Actions */
                .bulk-actions {
                    background: var(--secondary);
                    color: #0f172a;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-md);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 20px rgba(0, 242, 255, 0.2);
                }

                .selected-count {
                    font-weight: 800;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .action-buttons {
                    display: flex;
                    gap: 0.75rem;
                }

                .bulk-btn {
                    border: none;
                    border-radius: 6px;
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .bulk-btn.primary {
                    background: #0f172a;
                    color: var(--secondary);
                }
                .bulk-btn.primary:hover {
                    background: #1e293b;
                }

                .bulk-btn.secondary {
                    background: rgba(15, 23, 42, 0.1);
                    color: #0f172a;
                    border: 1px solid rgba(15, 23, 42, 0.2);
                }
                .bulk-btn.secondary:hover {
                    background: rgba(15, 23, 42, 0.2);
                }

                /* Table */
                .roster-table {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                }

                .table-header {
                    display: grid;
                    grid-template-columns: 50px 2fr 2fr 1fr 1fr 1fr;
                    padding: 1rem;
                    background: rgba(15, 23, 42, 0.6);
                    border-bottom: 1px solid var(--border);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    letter-spacing: 0.05em;
                }

                .table-row {
                    display: grid;
                    grid-template-columns: 50px 2fr 2fr 1fr 1fr 1fr;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.1s;
                }

                .table-row:last-child { border-bottom: none; }

                .table-row:hover {
                    background: rgba(255,255,255,0.03);
                }

                .table-row.selected {
                    background: rgba(0, 242, 255, 0.05);
                    border-bottom-color: rgba(0, 242, 255, 0.1);
                }

                .td {
                    display: flex;
                    align-items: center;
                }

                .check-col { justify-content: center; color: var(--text-muted); cursor: pointer; }

                .name-col { gap: 1rem; }
                .avatar {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 700;
                }

                .role-col {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .role-text { font-size: 0.9rem; color: white; }
                .tags { display: flex; gap: 0.25rem; }
                .tag {
                    background: rgba(255,255,255,0.1);
                    padding: 2px 4px;
                    border-radius: 4px;
                    color: var(--text-muted);
                }

                .days-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .days-badge.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .days-badge.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
                .days-badge.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                .status-pill {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    font-weight: 700;
                    color: #34d399;
                    background: rgba(16, 185, 129, 0.1);
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .empty-state {
                    padding: 3rem;
                    text-align: center;
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
