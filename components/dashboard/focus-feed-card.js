"use client";

import { ArrowRight, Coffee, AlertTriangle, Zap, Sparkles, CheckCircle, ShieldAlert, HeartCrack, MessageCircle, Phone } from "lucide-react";

export default function FocusFeedCard({ type, title, subtitle, meta, payload, onAction }) {
    let signalColor = "var(--signal-predict)";
    let Icon = Zap;
    let signalClass = "predict";

    // Style Mapping
    if (type === "CHURN_INTERCEPTOR" || type === "risk") {
        signalColor = "var(--signal-risk)";
        Icon = AlertTriangle;
        signalClass = "risk";
    } else if (type === "PRE_EMPTIVE_STRIKE" || type === "lead") {
        signalColor = "var(--signal-predict)";
        Icon = Coffee;
        signalClass = "predict";
    } else if (type === "TASK" || type === "urgent") {
        signalColor = "#0ea5e9"; // Sky blue
        Icon = CheckCircle;
        signalClass = "task";
    } else if (type === "COMPLIANCE") {
        signalColor = "#f43f5e"; // Rose
        Icon = ShieldAlert;
        signalClass = "compliance";
    }

    // --- SMART ACTION LOGIC ---
    // Check if we have a communication template in the payload
    const comms = payload?.communication;

    const handleQuickAction = (e) => {
        e.stopPropagation(); // Don't trigger the card click

        if (comms && comms.method === 'sms') {
            // 1. Construct SMS Link (works on Mobile & Mac)
            const body = encodeURIComponent(comms.template);
            const phone = comms.recipient || "";
            window.location.href = `sms:${phone}?&body=${body}`;
        } else {
            // Default action
            if (onAction) onAction();
        }
    };

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

                    {/* Render Action Button if Template Exists */}
                    {comms ? (
                        <button
                            onClick={handleQuickAction}
                            className="mt-2 text-xs flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-slate-200 font-medium"
                        >
                            <MessageCircle size={12} className="text-green-400" />
                            {comms.method === 'sms' ? 'Send SMS' : 'Contact'}
                        </button>
                    ) : (
                        meta && <p className="meta">{meta}</p>
                    )}
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
                    border-left: 4px solid var(--signal-predict);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.2s ease;
                    min-width: 300px;
                    flex-shrink: 0;
                }

                .focus-card.risk { border-left-color: var(--signal-risk); }
                .focus-card.predict { border-left-color: var(--signal-predict); }
                .focus-card.task { border-left-color: #0ea5e9; }
                .focus-card.compliance { border-left-color: #f43f5e; }

                .focus-card:hover {
                    transform: translateY(-2px);
                    background: rgba(30, 41, 59, 0.9);
                }

                .card-glow {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    opacity: 0.05; pointer-events: none; z-index: 0;
                }

                .card-content {
                    position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 1rem;
                }

                .icon-box {
                    width: 40px; height: 40px; border-radius: 50%; border: 1px solid;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.2); flex-shrink: 0;
                }

                .info { flex: 1; }

                .title { font-weight: 600; color: var(--text-main); font-size: 0.95rem; margin-bottom: 0.1rem; }
                .subtitle { color: var(--text-muted); font-size: 0.8rem; line-height: 1.4; }
                .meta { color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem; font-style: italic; }

                .action-icon {
                    color: var(--text-muted); opacity: 0.5; transition: 0.2s; margin-top: 10px;
                }
                .focus-card:hover .action-icon { opacity: 1; transform: translateX(2px); color: var(--text-main); }
            `}</style>
        </div>
    );
}