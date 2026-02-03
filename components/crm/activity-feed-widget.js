"use client";

import React from 'react';
import { useData } from '../../context/data-context.js';
import { Zap, MapPin, Users, Phone, ChevronRight, AlertCircle } from "lucide-react";

export default function ActivityFeedWidget() {
    const { moneyMoves, setSelectedProject, projects } = useData();

    const getIcon = (type, urgency) => {
        if (urgency === 'Critical') return <AlertCircle size={14} className="text-red-500" />;
        if (urgency === 'High') return <Users size={14} className="text-purple-400" />;
        switch (type) {
            case 'signal': return <Users size={14} className="text-amber-400" />;
            case 'trigger': return <Zap size={14} className="text-secondary" />;
            default: return <MapPin size={14} className="text-slate-400" />;
        }
    };

    const handleJumpToSite = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            // In a real app, we might also trigger a map pan here via a global ref or another context
        }
    };

    return (
        <div className="activity-feed">
            <div className="flex justify-between items-center mb-4">
                <h3 className="widget-title">Money Moves</h3>
                <div className="live-indicator">
                    <div className="dot"></div>
                    LIVE
                </div>
            </div>

            <div className="feed-list">
                {moneyMoves.length > 0 ? (
                    moneyMoves.map(move => (
                        <div key={move.id} className={`feed-item ${move.urgency === 'Critical' ? 'critical' : ''} ${move.urgency === 'High' ? 'high' : ''}`}>
                            <div className="icon-box">
                                {getIcon(move.type, move.urgency)}
                            </div>
                            <div className="content">
                                <div className="action">
                                    <span className="project-name">{move.projectName}</span>
                                    <span className="move-title"> • {move.title}</span>
                                </div>
                                <div className="desc">{move.description}</div>
                                <div className="footer">
                                    <div className="footer-left">
                                        <div className="time">{move.date}</div>
                                        {move.revenueAtRisk > 0 && (
                                            <div className="revenue-badge" title="Revenue at Risk for this gap">
                                                ${move.revenueAtRisk.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                    <button className="jump-btn" onClick={() => handleJumpToSite(move.projectId)}>
                                        Jump to Site <ChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-feed">
                        <Zap size={24} className="text-slate-700 mb-2" />
                        <p className="text-xs text-slate-500">No active Money Moves detected.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .activity-feed {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    height: 100%;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .widget-title {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .live-indicator {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 8px;
                  font-weight: 900;
                  color: var(--secondary);
                  background: rgba(16, 185, 129, 0.1);
                  padding: 2px 6px;
                  border-radius: 4px;
                }

                .dot {
                  width: 4px;
                  height: 4px;
                  background: var(--secondary);
                  border-radius: 50%;
                  animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                  0% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.4; transform: scale(1.5); }
                  100% { opacity: 1; transform: scale(1); }
                }

                .feed-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .feed-item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    transition: all 0.2s;
                }

                .feed-item:hover {
                  background: rgba(255, 255, 255, 0.05);
                  border-color: var(--secondary);
                }

                .critical {
                  border-color: rgba(239, 68, 68, 0.3);
                  background: rgba(239, 68, 68, 0.05);
                }

                .feed-item.high {
                  border-color: rgba(167, 139, 250, 0.3);
                  background: rgba(167, 139, 250, 0.05);
                }
                
                .feed-item.high .move-title {
                    color: #a78bfa;
                }

                .icon-box {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .action {
                    font-size: 0.8rem;
                    line-height: 1.2;
                    margin-bottom: 2px;
                }

                .project-name {
                    font-weight: 800;
                    color: white;
                }

                .move-title {
                    color: var(--secondary);
                    font-weight: 600;
                }

                .desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .revenue-badge {
                    font-size: 0.65rem;
                    font-weight: 700;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 0.1rem 0.5rem;
                    border-radius: 4px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .time {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .jump-btn {
                    background: none;
                    border: none;
                    color: var(--secondary);
                    font-size: 0.65rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    cursor: pointer;
                    padding: 0;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }

                .jump-btn:hover { opacity: 1; }

                .empty-feed {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 0;
                }
            `}</style>
        </div>
    );
}
