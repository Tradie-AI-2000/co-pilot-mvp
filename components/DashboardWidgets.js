"use client";

import { TrendingUp, AlertTriangle, ArrowRight, Activity } from "lucide-react";

export default function DashboardWidgets({ projects }) {
    // Calculate stats
    const urgentRoles = projects.reduce((acc, proj) => {
        // Find signals where the 'date' is imminent or passed, or urgency is strictly Critical/High from DataContext
        const urgent = (proj.hiringSignals || []).filter(s => {
            if (s.urgency === "Critical") return true;
            // Check if it's a date-based trigger that is "Now" or "Due"
            if (s.date && (s.date === "ASAP" || s.date.includes("Lead") || new Date(s.date) <= new Date())) {
                return true;
            }
            return false;
        });
        return acc + urgent.length;
    }, 0);

    const activeProjects = projects.filter(p => p.status === "Active").length;

    const upcomingPhases = projects.reduce((acc, proj) => {
        const nextPhase = (proj.phases || []).find(p => p.status === "Upcoming");
        return nextPhase ? acc + 1 : acc;
    }, 0);

    return (
        <div className="widgets-grid">
            <div className="widget-card highlight">
                <div className="widget-icon red">
                    <AlertTriangle size={20} />
                </div>
                <div className="widget-content">
                    <span className="widget-label">Urgent Hiring Needs</span>
                    <span className="widget-value">{urgentRoles}</span>
                    <span className="widget-trend">Across {activeProjects} active projects</span>
                </div>
            </div>

            <div className="widget-card">
                <div className="widget-icon blue">
                    <Activity size={20} />
                </div>
                <div className="widget-content">
                    <span className="widget-label">Phase Transitions</span>
                    <span className="widget-value">{upcomingPhases}</span>
                    <span className="widget-trend">Projects entering new phase soon</span>
                </div>
            </div>

            <div className="widget-card">
                <div className="widget-icon green">
                    <TrendingUp size={20} />
                </div>
                <div className="widget-content">
                    <span className="widget-label">Total Pipeline Value</span>
                    <span className="widget-value">$850M+</span>
                    <span className="widget-trend">Active construction value</span>
                </div>
            </div>

            <style jsx>{`
                .widgets-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .widget-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: transform 0.2s;
                }

                .widget-card:hover {
                    transform: translateY(-2px);
                }

                .widget-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .widget-icon.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .widget-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .widget-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                .widget-content {
                    display: flex;
                    flex-direction: column;
                }

                .widget-label {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 0.25rem;
                }

                .widget-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1.2;
                }

                .widget-trend {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 0.25rem;
                }
            `}</style>
        </div>
    );
}
