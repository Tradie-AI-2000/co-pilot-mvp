"use client";

import { useState } from "react";
import { X, User, Building2, MapPin, Calendar, ArrowRight, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useData } from "../../context/data-context.js";

export default function PlacementTicketModal({ placement, onClose }) {
    const { candidates, projects, placements, updatePlacementStatus } = useData();
    const [note, setNote] = useState("");

    // Find the latest version of this placement from the context
    // This ensures that when we update the status, the modal re-renders with the new status
    const livePlacement = placements.find(p => p.id === placement?.id) || placement;

    if (!livePlacement) return null;

    const candidate = candidates.find(c => c.id === livePlacement.candidateId);
    const project = projects.find(p => p.id === livePlacement.projectId);

    if (!candidate || !project) return null;

    const stages = ["Floated", "Interview", "Offer", "Deployed"];
    const currentStageIndex = stages.indexOf(livePlacement.status);

    const handleStageUpdate = (newStatus) => {
        updatePlacementStatus(livePlacement.id, newStatus);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-left">
                        <div className="status-badge">{livePlacement.status}</div>
                        <h2 className="title">Deal Ticket #{livePlacement.id.slice(-4)}</h2>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <div className="deal-grid">
                    {/* Candidate Side */}
                    <div className="entity-card candidate">
                        <div className="card-label">CANDIDATE</div>
                        <div className="entity-info">
                            <div className="avatar">{candidate.firstName[0]}{candidate.lastName[0]}</div>
                            <div>
                                <div className="name">{candidate.firstName} {candidate.lastName}</div>
                                <div className="role">{candidate.role}</div>
                            </div>
                        </div>
                        <div className="rate-box">
                            <span className="label">Pay Rate</span>
                            <span className="value">${candidate.payRate}</span>
                        </div>
                    </div>

                    <div className="connector">
                        <ArrowRight size={24} className="text-muted" />
                    </div>

                    {/* Project Side */}
                    <div className="entity-card project">
                        <div className="card-label">PROJECT</div>
                        <div className="entity-info">
                            <div className="icon"><Building2 size={20} /></div>
                            <div>
                                <div className="name">{project.name}</div>
                                <div className="role">{project.location}</div>
                            </div>
                        </div>
                        <div className="rate-box">
                            <span className="label">Charge Rate</span>
                            <span className="value">${candidate.chargeRate || (candidate.payRate * 1.5).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Pipeline Tracker */}
                <div className="pipeline-tracker">
                    {stages.map((stage, idx) => (
                        <div key={stage} className={`stage-step ${idx <= currentStageIndex ? 'active' : ''}`}>
                            <div className="step-circle">{idx + 1}</div>
                            <div className="step-label">{stage}</div>
                            {idx < stages.length - 1 && <div className="step-line"></div>}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="action-panel">
                    <h3 className="section-title">Move Deal Forward</h3>
                    <div className="button-group">
                        {livePlacement.status === 'Floated' && (
                            <button className="action-btn primary" onClick={() => handleStageUpdate('Interview')}>
                                <Calendar size={16} /> Log Interview
                            </button>
                        )}
                        {livePlacement.status === 'Interview' && (
                            <button className="action-btn primary" onClick={() => handleStageUpdate('Offer')}>
                                <CheckCircle size={16} /> Make Offer
                            </button>
                        )}
                        {livePlacement.status === 'Offer' && (
                            <button className="action-btn success" onClick={() => handleStageUpdate('Deployed')}>
                                <CheckCircle size={16} /> Deploy Candidate
                            </button>
                        )}
                        <button className="action-btn danger">
                            <XCircle size={16} /> Deal Failed
                        </button>
                    </div>
                </div>

                {/* Quick Notes */}
                <div className="notes-section">
                    <h3 className="section-title">Latest Updates</h3>
                    <div className="input-row">
                        <input 
                            placeholder="Add a note (e.g., 'Client loved the CV')..." 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <button className="send-btn"><MessageSquare size={16} /></button>
                    </div>
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
                    width: 600px;
                    padding: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .status-badge {
                    display: inline-block;
                    background: var(--secondary);
                    color: #0f172a;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }

                .title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .close-btn:hover { color: white; }

                /* Deal Grid */
                .deal-grid {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .connector {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .entity-card {
                    flex: 1;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                }

                .card-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                    letter-spacing: 0.05em;
                }

                .entity-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .avatar, .icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: white;
                }

                .name { font-weight: 600; color: white; font-size: 0.95rem; }
                .role { font-size: 0.8rem; color: var(--text-muted); }

                .rate-box {
                    background: rgba(0,0,0,0.2);
                    padding: 0.5rem;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .rate-box .label { font-size: 0.75rem; color: var(--text-muted); }
                .rate-box .value { font-weight: 700; color: var(--secondary); }

                /* Pipeline Tracker */
                .pipeline-tracker {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    padding: 0 1rem;
                }

                .stage-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    flex: 1;
                }

                .step-circle {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    z-index: 2;
                    border: 2px solid #0f172a;
                }

                .step-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .step-line {
                    position: absolute;
                    top: 12px;
                    left: 50%;
                    width: 100%;
                    height: 2px;
                    background: rgba(255,255,255,0.1);
                    z-index: 1;
                }

                .stage-step.active .step-circle {
                    background: var(--secondary);
                    color: #0f172a;
                }

                .stage-step.active .step-label {
                    color: white;
                }

                .stage-step.active .step-line {
                    background: var(--secondary);
                }

                /* Actions */
                .action-panel {
                    margin-bottom: 2rem;
                }

                .section-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                }

                .button-group {
                    display: flex;
                    gap: 1rem;
                }

                .action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }

                .action-btn.primary { background: var(--secondary); color: #0f172a; }
                .action-btn.success { background: #10b981; color: white; }
                .action-btn.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
                .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }

                /* Notes */
                .input-row {
                    display: flex;
                    gap: 0.5rem;
                }

                .input-row input {
                    flex: 1;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--border);
                    padding: 0.75rem;
                    border-radius: 6px;
                    color: white;
                }

                .send-btn {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid var(--border);
                    color: white;
                    width: 46px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .send-btn:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}
