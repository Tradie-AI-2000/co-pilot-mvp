"use client";

import { Send, CheckCircle } from "lucide-react";

export default function DealFlowSummary({ floats = [], placements = [], onOpenDetail }) {

    // Calculate simple stats
    const floatCount = floats.length;
    const placementCount = placements.length;

    return (
        <div className="deal-flow-summary flex flex-col gap-3">
            <div
                className="df-card float-card group"
                onClick={() => onOpenDetail('floats')}
            >
                <div className="icon-box">
                    <Send size={18} className="text-indigo-400" />
                </div>
                <div className="content">
                    <div className="label">Active Floats</div>
                    <div className="metric">{floatCount}</div>
                    <div className="subtext">Awaiting Response</div>
                </div>
                <div className="action-hint">View Details &rarr;</div>
            </div>

            <div
                className="df-card placed-card group"
                onClick={() => onOpenDetail('placements')}
            >
                <div className="icon-box">
                    <CheckCircle size={18} className="text-emerald-400" />
                </div>
                <div className="content">
                    <div className="label">Live Placements</div>
                    <div className="metric">{placementCount}</div>
                    <div className="subtext">Currently On Site</div>
                </div>
                <div className="action-hint">View Details &rarr;</div>
            </div>

            <style jsx>{`
                .deal-flow-summary {
                    /* gap handled by flex container */
                }

                .df-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08); /* slightly stronger border */
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.2s ease-out;
                }

                .df-card:hover {
                    transform: translateY(-2px);
                    background: rgba(30, 41, 59, 0.7);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .df-card.float-card:hover { box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.2); }
                .df-card.placed-card:hover { box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.2); }

                .icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(15, 23, 42, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                
                .float-card .icon-box { color: #818cf8; }
                .placed-card .icon-box { color: #34d399; }

                .content { flex: 1; }
                
                .label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    color: #94a3b8;
                    margin-bottom: 0.1rem;
                }

                .metric {
                    font-size: 1.5rem;
                    font-weight: 800;
                    line-height: 1.2;
                    color: white;
                }

                .subtext {
                    font-size: 0.7rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .action-hint {
                    position: absolute;
                    bottom: 0.75rem;
                    right: 1.25rem;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: white;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .df-card:hover .action-hint {
                    opacity: 1;
                    transform: translateX(0);
                    color: var(--secondary);
                }
            `}</style>
        </div>
    );
}
