"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Smile, Frown, Meh, Briefcase, Calendar, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useData } from '../context/data-context.js';

export default function WeeklyCheckinWidget() {
    const { placements, candidates, projects, logCheckin } = useData();

    // State to track which card is open
    const [expandedPlacementId, setExpandedPlacementId] = useState(null);

    // State to hold the form data for the CURRENTLY expanded card
    const [checkinForm, setCheckinForm] = useState({
        candidateMood: 'neutral',
        clientMood: 'neutral',
        notes: ''
    });

    const activePlacements = placements.filter(p => p.status === 'Deployed');

    const handleExpand = (placementId) => {
        if (expandedPlacementId === placementId) {
            setExpandedPlacementId(null); // Close if already open
        } else {
            setExpandedPlacementId(placementId);
            // Reset form to defaults when opening a new card
            setCheckinForm({ candidateMood: 'neutral', clientMood: 'neutral', notes: '' });
        }
    };

    const handleSubmit = (placementId) => {
        logCheckin(placementId, {
            candidateMood: checkinForm.candidateMood,
            clientMood: checkinForm.clientMood,
            notes: checkinForm.notes
        });
        setExpandedPlacementId(null); // Collapse after success
    };

    if (activePlacements.length === 0) {
        return (
            <div className="checkin-widget empty-state">
                <Briefcase size={24} className="text-muted" />
                <p>No active placements.</p>
                <span className="subtext">Deploy candidates to track check-ins.</span>
                <style jsx>{`
                    .checkin-widget {
                        height: 100%;
                        background: rgba(15, 23, 42, 0.3);
                        border: 1px solid var(--border);
                        border-radius: var(--radius-lg);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: var(--text-muted);
                        gap: 0.5rem;
                        padding: 2rem;
                    }
                    .subtext { font-size: 0.8rem; opacity: 0.7; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="checkin-widget">
            <div className="widget-header">
                <div className="header-title">
                    <Calendar size={18} className="text-secondary" />
                    <h3>Weekly Check-ins</h3>
                </div>
                <span className="badge-count">{activePlacements.length} Active</span>
            </div>

            <div className="checkin-list">
                {activePlacements.map(placement => {
                    const candidate = candidates.find(c => c.id === placement.candidateId);
                    const project = projects.find(p => p.id === placement.projectId);

                    if (!candidate || !project) return null;

                    const lastCheckin = placement.weeklyCheckins?.[placement.weeklyCheckins.length - 1];
                    // If no checkin ever, treat as overdue
                    const lastDate = lastCheckin ? new Date(lastCheckin.checkinDate) : new Date(0);
                    const daysSinceLastCheckin = Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysSinceLastCheckin > 7;
                    const isExpanded = expandedPlacementId === placement.id;

                    return (
                        <div
                            key={placement.id}
                            className={`placement-card ${isExpanded ? 'expanded' : ''} ${isOverdue ? 'overdue-border' : ''}`}
                        >
                            {/* Summary Row (Click to Expand) */}
                            <div className="card-summary" onClick={() => handleExpand(placement.id)}>
                                <div className="info-col">
                                    <h4 className="candidate-name">{candidate.firstName} {candidate.lastName}</h4>
                                    <div className="project-detail">
                                        <Briefcase size={12} />
                                        <span>{project.name}</span>
                                    </div>
                                </div>

                                <div className="status-col">
                                    {isOverdue && !isExpanded && (
                                        <span className="overdue-badge">Overdue ({daysSinceLastCheckin}d)</span>
                                    )}
                                    {!isOverdue && !isExpanded && lastCheckin && (
                                        <span className="ok-badge"><CheckCircle size={12} /> Done</span>
                                    )}
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>

                            {/* Expanded Form Area */}
                            {isExpanded && (
                                <div className="card-details">
                                    <div className="mood-grid">
                                        {/* Candidate Mood Section */}
                                        <div className="mood-section">
                                            <span className="mood-label">Candidate Mood</span>
                                            <div className="mood-buttons">
                                                <button
                                                    className={`mood-btn up ${checkinForm.candidateMood === 'up' ? 'active' : ''}`}
                                                    onClick={() => setCheckinForm(prev => ({ ...prev, candidateMood: 'up' }))}
                                                >
                                                    <ThumbsUp size={16} />
                                                </button>
                                                <button
                                                    className={`mood-btn neutral ${checkinForm.candidateMood === 'neutral' ? 'active' : ''}`}
                                                    onClick={() => setCheckinForm(prev => ({ ...prev, candidateMood: 'neutral' }))}
                                                >
                                                    <Meh size={16} />
                                                </button>
                                                <button
                                                    className={`mood-btn down ${checkinForm.candidateMood === 'down' ? 'active' : ''}`}
                                                    onClick={() => setCheckinForm(prev => ({ ...prev, candidateMood: 'down' }))}
                                                >
                                                    <Frown size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Client Mood Section */}
                                        <div className="mood-section">
                                            <span className="mood-label">Client Feedback</span>
                                            <div className="mood-buttons">
                                                <button
                                                    className={`mood-btn up ${checkinForm.clientMood === 'up' ? 'active' : ''}`}
                                                    onClick={() => setCheckinForm(prev => ({ ...prev, clientMood: 'up' }))}
                                                >
                                                    <ThumbsUp size={16} />
                                                </button>
                                                <button
                                                    className={`mood-btn neutral ${checkinForm.clientMood === 'neutral' ? 'active' : ''}`}
                                                    onClick={() => setCheckinForm(prev => ({ ...prev, clientMood: 'neutral' }))}
                                                >
                                                    <Meh size={16} />
                                                </button>
                                                <button
                                                    className={`mood-btn down ${checkinForm.clientMood === 'down' ? 'active' : ''}`}
                                                    onClick={() => setCheckinForm(prev => ({ ...prev, clientMood: 'down' }))}
                                                >
                                                    <Frown size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Any issues? (e.g. Needs new boots, site access issues...)"
                                        value={checkinForm.notes}
                                        onChange={(e) => setCheckinForm(prev => ({ ...prev, notes: e.target.value }))}
                                        rows="2"
                                        className="notes-input"
                                    ></textarea>

                                    <button onClick={() => handleSubmit(placement.id)} className="save-btn">
                                        Log Check-in
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .checkin-widget {
                    background: rgba(15, 23, 42, 0.3);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                }

                .widget-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(30, 41, 59, 0.4);
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .widget-header h3 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: white;
                    margin: 0;
                    text-transform: uppercase;
                }

                .badge-count {
                    font-size: 0.7rem;
                    background: rgba(255,255,255,0.1);
                    padding: 2px 8px;
                    border-radius: 12px;
                    color: var(--text-muted);
                }

                .checkin-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .checkin-list::-webkit-scrollbar { width: 4px; }
                .checkin-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

                /* CARD STYLES */
                .placement-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid transparent;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    transition: all 0.2s ease;
                }

                .placement-card:hover {
                    background: rgba(255,255,255,0.06);
                }

                .placement-card.expanded {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(255,255,255,0.1);
                }

                .placement-card.overdue-border {
                    border-left: 3px solid #f43f5e; /* Red indicator for overdue */
                }

                /* SUMMARY ROW */
                .card-summary {
                    padding: 0.75rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }

                .info-col {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .candidate-name {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-main);
                    margin: 0;
                }

                .project-detail {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .status-col {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                }

                .overdue-badge {
                    color: #f43f5e;
                    background: rgba(244, 63, 94, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 0.7rem;
                }

                .ok-badge {
                    color: #10b981;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                /* EXPANDED DETAILS */
                .card-details {
                    padding: 0 0.75rem 0.75rem 0.75rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    animation: slideDown 0.2s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .mood-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin: 0.75rem 0;
                }

                .mood-label {
                    display: block;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }

                .mood-buttons {
                    display: flex;
                    background: rgba(0,0,0,0.2);
                    border-radius: 6px;
                    padding: 2px;
                }

                .mood-btn {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    padding: 4px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .mood-btn:hover { background: rgba(255,255,255,0.1); }

                /* Active States */
                .mood-btn.up.active { background: #10b981; color: white; }
                .mood-btn.neutral.active { background: #f59e0b; color: white; }
                .mood-btn.down.active { background: #ef4444; color: white; }

                .notes-input {
                    width: 100%;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    padding: 0.5rem;
                    color: var(--text-main);
                    font-size: 0.85rem;
                    resize: none;
                    margin-bottom: 0.75rem;
                }
                
                .notes-input:focus {
                    outline: none;
                    border-color: var(--secondary);
                }

                .save-btn {
                    width: 100%;
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 0.5rem;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                }

                .save-btn:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}