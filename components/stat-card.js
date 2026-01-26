"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, subtext, progress, status = "neutral", trend, onClick, cursor }) {
    // Status colors
    const colors = {
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        neutral: "#3b82f6",
        purple: "#a855f7"
    };

    const color = colors[status] || colors.neutral;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    
    // Ensure progress is a valid number to prevent NaN in SVG attributes
    const validProgress = typeof progress === 'number' && !isNaN(progress) ? progress : 0;
    const strokeDashoffset = circumference - (validProgress / 100) * circumference;

    return (
        <div 
            className={`stat-card glass-panel ${onClick ? 'clickable' : ''}`} 
            onClick={onClick}
            style={{ cursor: cursor || 'default' }}
        >
            <div className="content">
                <div className="label">{title}</div>
                <div className="value">{value}</div>
                <div className="subtext flex items-center gap-1">
                    {trend === 'up' && <ArrowUpRight size={14} className="text-emerald-400" />}
                    {trend === 'down' && <ArrowDownRight size={14} className="text-rose-400" />}
                    {subtext}
                </div>
            </div>

            {progress !== undefined && !isNaN(progress) && (
                <div className="chart">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 40 40)"
                        />
                        <text
                            x="40"
                            y="44"
                            textAnchor="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                        >
                            {Math.round(validProgress)}%
                        </text>
                    </svg>
                </div>
            )}

            <style jsx>{`
                .stat-card {
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    background: rgba(15, 23, 42, 0.6);
                    transition: transform 0.2s, border-color 0.2s;
                }

                .stat-card.clickable:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(30, 41, 59, 0.8);
                }

                .label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 0.25rem;
                    font-weight: 500;
                }

                .value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .subtext {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .chart {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
}
