"use client";

import { ArrowRight, Coffee, AlertTriangle, Zap, Sparkles } from "lucide-react";

export default function FocusFeedCard({ type, title, subtitle, meta, onAction }) {
    let signalColor = "var(--signal-predict)";
    let Icon = Zap;
    let signalClass = "predict";

    if (type === "risk") {
        signalColor = "var(--signal-risk)";
        Icon = AlertTriangle;
        signalClass = "risk";
    } else if (type === "urgent") {
        signalColor = "var(--signal-urgent)";
        Icon = Zap; // Or another icon for urgent
        signalClass = "urgent";
    } else if (type === "lead") {
        signalColor = "var(--signal-predict)";
        Icon = Coffee; // Placeholder for Relationship DNA context
        signalClass = "predict";
    } else if (type === "transition") {
        signalColor = "#a855f7";
        Icon = Sparkles;
        signalClass = "transition";
    }

    return (
        <div className={`focus-card ${signalClass}`} onClick={onAction}>
            <div className="card-glow" style={{ background: signalColor }}></div>
            <div className="card-content">
                <div className="icon-box" style={{ color: signalColor, borderColor: signalColor }}>
                    <Icon size={20} />
                </div>
                <div className="info">
                    <h4 className="title">{title}</h4>
                    <p className="subtitle">{subtitle}</p>
                    {meta && <p className="meta">{meta}</p>}
                </div>
                <div className="action-icon">
                    <ArrowRight size={18} />
                </div>
            </div>

            <style jsx>{`
                .focus-card {
                    position: relative;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-left: 4px solid var(--signal-predict); /* Default */
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.2s ease;
                    min-width: 300px;
                    flex-shrink: 0;
                }

                .focus-card.risk { border-left-color: var(--signal-risk); }
                .focus-card.urgent { border-left-color: var(--signal-urgent); }
                .focus-card.predict { border-left-color: var(--signal-predict); }
                .focus-card.transition { border-left-color: #a855f7; }

                .focus-card:hover {
                    transform: translateY(-2px);
                    background: rgba(30, 41, 59, 0.9);
                }

                .card-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.05;
                    pointer-events: none;
                    z-index: 0;
                }

                .card-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .icon-box {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.2);
                }

                .info {
                    flex: 1;
                }

                .title {
                    font-weight: 600;
                    color: var(--text-main);
                    font-size: 0.95rem;
                    margin-bottom: 0.1rem;
                }

                .subtitle {
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .meta {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                    font-style: italic;
                }

                .action-icon {
                    color: var(--text-muted);
                    opacity: 0.5;
                    transition: 0.2s;
                }

                .focus-card:hover .action-icon {
                    opacity: 1;
                    transform: translateX(2px);
                    color: var(--text-main);
                }
            `}</style>
        </div>
    );
}
