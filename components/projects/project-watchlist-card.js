"use client";

import { ArrowRight, Mail, Calendar, Sparkles } from "lucide-react";

export default function ProjectWatchlistCard({ project }) {
    const { name, stage, progress, threshold, action, nextStep, date } = project;

    const phases = ["Foundations", "Structure", "Finishes"];
    const currentPhaseIndex = phases.indexOf(stage);
    const isTransitioning = progress >= 80;

    const getSegmentState = (index) => {
        if (index < currentPhaseIndex) return "completed";
        if (index === currentPhaseIndex) return "active";
        return "future";
    };

    return (
        <div className="watchlist-card">
            <div className="header">
                <div>
                    <h4 className="project-name">{name}</h4>
                    <div className="meta">
                        <span className="stage">{stage} Phase</span>
                        <span className="date"><Calendar size={12} /> {date}</span>
                    </div>
                </div>
                {isTransitioning && (
                    <div className="transition-badge">
                        <Sparkles size={12} /> Transition Imminent
                    </div>
                )}
            </div>

            <div className="phase-map">
                {phases.map((phase, index) => {
                    const state = getSegmentState(index);
                    const isNext = index === currentPhaseIndex + 1;
                    const showGlow = isTransitioning && isNext;

                    // Calculate fill width for this segment
                    let fillWidth = "0%";
                    if (state === "completed") fillWidth = "100%";
                    else if (state === "active") fillWidth = `${progress}%`;

                    return (
                        <div key={phase} className={`phase-segment ${phase.toLowerCase()} ${state} ${showGlow ? 'predictive-glow' : ''}`}>
                            <div className="segment-label">{phase}</div>
                            <div className="segment-track">
                                <div className="segment-fill" style={{ width: fillWidth }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="next-step">
                <ArrowRight size={12} /> Next Action: {action}
            </div>

            <style jsx>{`
                .watchlist-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    transition: all 0.2s;
                }

                .watchlist-card:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: var(--border-hover);
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .project-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .meta {
                    display: flex;
                    gap: 0.75rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .meta .date {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .transition-badge {
                    background: rgba(168, 85, 247, 0.2);
                    color: #d8b4fe;
                    font-size: 0.65rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    border: 1px solid rgba(168, 85, 247, 0.4);
                    animation: pulse 2s infinite;
                }

                .phase-map {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .phase-segment {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    opacity: 0.4; /* Default ghosted state */
                    transition: all 0.3s;
                }

                .phase-segment.active {
                    opacity: 1;
                }
                
                .phase-segment.completed {
                    opacity: 0.8;
                }

                .phase-segment.predictive-glow {
                    opacity: 1;
                    animation: glow-purple 2s infinite;
                }

                .segment-label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    font-weight: 600;
                    color: var(--text-muted);
                }
                
                .active .segment-label {
                    color: white;
                }

                .segment-track {
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                    position: relative;
                }

                .segment-fill {
                    height: 100%;
                    transition: width 1s ease-out;
                }

                /* Phase Colors */
                .foundations .segment-fill { background: #94a3b8; } /* Slate */
                .structure .segment-fill { background: #38bdf8; } /* Stellar Blue */
                .finishes .segment-fill { background: #f59e0b; } /* Gold */

                /* Active Pulse */
                .active .segment-fill {
                    box-shadow: 0 0 10px currentColor;
                }

                .next-step {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                @keyframes pulse {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }

                @keyframes glow-purple {
                    0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
                    50% { box-shadow: 0 0 15px 2px rgba(168, 85, 247, 0.4); border-color: #a855f7; }
                    100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
                }
            `}</style>
        </div>
    );
}
