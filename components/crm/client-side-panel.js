"use client";

import { useState } from "react";
import { X, Building2, Users, Calendar, Phone, Mail, CheckCircle, AlertTriangle, MessageSquare, Briefcase, MapPin, Clock, TrendingUp } from "lucide-react";
import { useData } from "../../context/data-context.js";

export default function ClientSidePanel({ client, onClose, onEdit }) {
    const { projects, placements } = useData();
    const [activeTab, setActiveTab] = useState("overview");

    if (!client) return null;

    // Filter projects linked to this client
    const clientProjects = projects.filter(p => p.assignedCompanyIds?.includes(client.id));
    
    // Recent Placements for this client
    const clientPlacements = placements.filter(pl => 
        clientProjects.some(p => p.id === pl.projectId)
    ).slice(0, 5);

    return (
        <>
            <div className="scrim" onClick={onClose}></div>
            <div className="drawer-panel">
                <div className="drawer-header">
                    <div className="header-content">
                        <div className="title-row">
                            <Building2 size={24} className="text-secondary" />
                            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                        </div>
                        <div className="sub-header">
                            <span className="industry">{client.industry}</span>
                            <span className="dot">•</span>
                            <span className="tier text-amber-400">Tier {client.tier}</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={onClose} className="close-btn" title="Close">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'pulse' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pulse')}
                    >
                        Pulse
                    </button>
                    <button
                        className={`tab ${activeTab === 'people' ? 'active' : ''}`}
                        onClick={() => setActiveTab('people')}
                    >
                        People
                    </button>
                    <button
                        className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </button>
                </div>

                <div className="drawer-content">
                    {activeTab === 'overview' && (
                        <div className="overview-view space-y-6">
                            {/* Alert Banner */}
                            {client.actionAlerts && client.actionAlerts.length > 0 && (
                                <div className="alert-banner">
                                    {client.actionAlerts.map((alert, idx) => (
                                        <div key={idx} className={`alert-item ${alert.type}`}>
                                            <AlertTriangle size={16} />
                                            <span>{alert.message}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Financials & Status */}
                            <div className="info-block">
                                <h3 className="section-title">Account Health</h3>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <label>Active Jobs</label>
                                        <div className="value">{client.activeJobs}</div>
                                    </div>
                                    <div className="stat-box">
                                        <label>YTD Revenue</label>
                                        <div className="value text-emerald-400">{client.financials?.ytdRevenue || '$0'}</div>
                                    </div>
                                    <div className="stat-box">
                                        <label>Status</label>
                                        <div className="value text-sm">{client.status}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Placements */}
                            <div className="info-block">
                                <h3 className="section-title">Recent Placements</h3>
                                <div className="placement-list">
                                    {clientPlacements.map(pl => (
                                        <div key={pl.id} className="mini-card">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-white">Candidate #{pl.candidateId}</span>
                                                <span className="text-xs text-secondary">{pl.status}</span>
                                            </div>
                                            <div className="text-xs text-muted mt-1">
                                                Project: {projects.find(p => p.id === pl.projectId)?.name}
                                            </div>
                                        </div>
                                    ))}
                                    {clientPlacements.length === 0 && (
                                        <div className="text-muted text-sm italic">No recent placement data.</div>
                                    )}
                                </div>
                            </div>

                            {/* Hiring Insights */}
                            {client.hiringInsights && (
                                <div className="info-block">
                                    <h3 className="section-title">Hiring Intelligence</h3>
                                    <div className="insight-card">
                                        <div className="insight-row">
                                            <span className="label">Avg Time to Hire:</span>
                                            <span className="val">{client.hiringInsights.avgTimeToHire}</span>
                                        </div>
                                        <div className="insight-row">
                                            <span className="label">Most Hired Role:</span>
                                            <span className="val">{client.hiringInsights.mostHiredRole}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-muted italic border-t border-slate-700 pt-2">
                                            "{client.hiringInsights.commonFeedback}"
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pulse' && (
                        <div className="pulse-view space-y-6">
                            {/* Ghost Risk */}
                            <div className="risk-indicator">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-sky-400" size={20} />
                                    <div>
                                        <h4 className="text-white font-medium">Last Contact</h4>
                                        <p className="text-sm text-muted">{client.lastContact || 'No recent contact recorded'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Tasks */}
                            <div className="info-block">
                                <h3 className="section-title">Tasks & Follow-ups</h3>
                                <div className="task-list">
                                    {(client.tasks || []).map(task => (
                                        <div key={task.id} className="task-item">
                                            <div className={`check-circle ${task.completed ? 'completed' : ''}`}></div>
                                            <div className="task-info">
                                                <div className="task-text">{task.text}</div>
                                                <div className="task-meta">Due: {task.dueDate} • {task.urgency}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!client.tasks || client.tasks.length === 0) && (
                                        <div className="text-muted text-sm italic">No active tasks.</div>
                                    )}
                                </div>
                            </div>

                            {/* CRM Notes */}
                            <div className="info-block">
                                <h3 className="section-title">Recent Notes</h3>
                                <div className="notes-stack">
                                    {(client.notes || []).map((note, idx) => (
                                        <div key={idx} className="note-item">
                                            <div className="note-header">
                                                <span className="note-date">{note.date}</span>
                                                <span className="note-author">{note.author}</span>
                                            </div>
                                            <p className="note-text">{note.text}</p>
                                        </div>
                                    ))}
                                    {(!client.notes || client.notes.length === 0) && (
                                        <div className="text-muted text-sm italic">No history notes yet.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'people' && (
                        <div className="people-view space-y-4">
                            {(client.keyContacts || []).map((contact, idx) => (
                                <div key={idx} className="contact-card">
                                    <div className="contact-header">
                                        <div className="avatar">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="contact-main">
                                            <h4 className="name">{contact.name}</h4>
                                            <span className="role">{contact.role}</span>
                                        </div>
                                        <div className={`influence-badge ${contact.influence?.toLowerCase() || 'neutral'}`}>
                                            {contact.influence || 'Contact'}
                                        </div>
                                    </div>
                                    
                                    <div className="contact-actions">
                                        <button className="action-btn"><Phone size={14} /> Call</button>
                                        <button className="action-btn"><Mail size={14} /> Email</button>
                                    </div>

                                    {contact.relationshipDNA && (
                                        <div className="dna-section">
                                            <h5 className="dna-title">Relationship DNA</h5>
                                            <div className="dna-grid">
                                                <div className="dna-item">
                                                    <span className="label">Ice Breaker:</span>
                                                    <span className="val">{contact.relationshipDNA.iceBreaker}</span>
                                                </div>
                                                <div className="dna-item">
                                                    <span className="label">Comm Style:</span>
                                                    <span className="val">{contact.relationshipDNA.commStyle}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(client.keyContacts?.length === 0) && (
                                <div className="text-muted text-sm italic">No key contacts recorded.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="projects-view space-y-4">
                            <h3 className="section-title">Linked Projects</h3>
                            <div className="project-grid-mini">
                                {clientProjects.map(project => (
                                    <div key={project.id} className="project-mini-card">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-semibold text-sm">{project.name}</h4>
                                                <div className="flex items-center gap-1 text-xs text-muted mt-1">
                                                    <MapPin size={10} />
                                                    {project.location}
                                                </div>
                                            </div>
                                            <span className="status-tag">{project.stage}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800">
                                            <span className="text-xs font-bold text-secondary">{project.value}</span>
                                            <button className="text-xs text-sky-400 hover:underline">View Intel</button>
                                        </div>
                                    </div>
                                ))}
                                {clientProjects.length === 0 && (
                                    <div className="text-muted text-sm italic">No projects linked to this client.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .scrim {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(2px);
                    z-index: 900;
                }

                .drawer-panel {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 500px;
                    background: #0f172a;
                    border-left: 1px solid var(--border);
                    box-shadow: -5px 0 25px rgba(0,0,0,0.5);
                    z-index: 950;
                    display: flex;
                    flex-direction: column;
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .drawer-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: #1e293b;
                }

                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.25rem;
                }

                .sub-header {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .close-btn:hover { color: white; }

                .tabs {
                    display: flex;
                    border-bottom: 1px solid var(--border);
                    background: #1e293b;
                    padding: 0 1.5rem;
                }

                .tab {
                    background: none;
                    border: none;
                    padding: 1rem 1.2rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                    font-size: 0.85rem;
                }

                .tab:hover { color: var(--text-main); }
                .tab.active {
                    color: var(--secondary);
                    border-bottom-color: var(--secondary);
                }

                .drawer-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    background: var(--background);
                }

                .section-title {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.75rem;
                }

                /* Alert Banner */
                .alert-banner {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .alert-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                .alert-item.warning { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
                .alert-item.info { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                }
                .stat-box {
                    background: rgba(255,255,255,0.03);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }
                .stat-box label { display: block; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.25rem; }
                .stat-box .value { font-size: 1.1rem; font-weight: 700; color: white; }

                /* Mini Cards */
                .mini-card {
                    background: rgba(255,255,255,0.03);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    margin-bottom: 0.5rem;
                }

                /* Hiring Insights */
                .insight-card {
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }
                .insight-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }
                .insight-row .label { color: var(--text-muted); }
                .insight-row .val { color: white; font-weight: 500; }

                /* Pulse View */
                .risk-indicator {
                    background: rgba(56, 189, 248, 0.05);
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                }

                .notes-stack { display: flex; flex-direction: column; gap: 0.75rem; }
                .note-item {
                    background: rgba(255,255,255,0.03);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }
                .note-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    margin-bottom: 0.4rem;
                }
                .note-text { font-size: 0.85rem; color: var(--text-main); line-height: 1.4; }

                /* Task List */
                .task-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .task-item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }
                .check-circle {
                    width: 18px;
                    height: 18px;
                    border: 2px solid var(--text-muted);
                    border-radius: 50%;
                    margin-top: 2px;
                }
                .check-circle.completed { background: var(--secondary); border-color: var(--secondary); }
                .task-text { font-size: 0.9rem; color: white; margin-bottom: 0.25rem; }
                .task-meta { font-size: 0.75rem; color: var(--text-muted); }

                /* Project Grid */
                .project-mini-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                }
                .status-tag {
                    font-size: 0.65rem;
                    background: rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: white;
                    text-transform: uppercase;
                }

                /* Contacts */
                .contact-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                }
                .contact-header {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }
                .contact-main { flex: 1; }
                .contact-main .name { font-size: 1rem; font-weight: 600; color: white; margin: 0; }
                .contact-main .role { font-size: 0.8rem; color: var(--text-muted); }
                
                .influence-badge {
                    font-size: 0.7rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: 99px;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .influence-badge.champion { background: rgba(16, 185, 129, 0.1); color: #34d399; }
                .influence-badge.blocker { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .influence-badge.neutral { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }

                .contact-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                .action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--border);
                    padding: 0.4rem;
                    border-radius: 4px;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    cursor: pointer;
                }
                .action-btn:hover { background: var(--secondary); color: #0f172a; border-color: var(--secondary); }

                .dna-section {
                    background: rgba(0,0,0,0.2);
                    padding: 0.75rem;
                    border-radius: 4px;
                }
                .dna-title {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--secondary);
                    margin: 0 0 0.5rem 0;
                }
                .dna-item { font-size: 0.8rem; margin-bottom: 0.25rem; }
                .dna-item .label { color: var(--text-muted); margin-right: 0.5rem; }
                .dna-item .val { color: white; }
            `}</style>
        </>
    );
}
