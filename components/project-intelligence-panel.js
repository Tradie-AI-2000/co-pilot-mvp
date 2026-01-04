"use client";

import { useState } from "react";
import {
    X, Edit, Calendar, AlertTriangle, Truck,
    HardHat, MapPin, Phone, Mail, FileText,
    TrendingUp, Users, Clock, ShieldAlert, Building2
} from "lucide-react";
import { useData } from "../context/data-context.js";

export default function ProjectIntelligencePanel({ project, onClose, onEdit }) {
    const { clients, moneyMoves } = useData();
    const [activeTab, setActiveTab] = useState("overview");

    if (!project) return null;

    // Derived Data (Safe access added for clients array)
    const client = (clients || []).find(c => c.id === project.assignedCompanyIds?.[0]) || { name: project.client || "Unknown" };
    const projectMoneyMoves = moneyMoves.filter(m => m.projectId === project.id);
    const nextTrigger = projectMoneyMoves[0];

    const tabs = [
        { id: "overview", label: "Overview", icon: TrendingUp },
        { id: "site-intel", label: "Site Intel", icon: MapPin },
        { id: "workforce", label: "Workforce", icon: Users },
        { id: "specs", label: "Specs", icon: FileText },
    ];

    return (
        <div className="panel-overlay" onClick={(e) => {
            if (e.target.className === "panel-overlay") onClose();
        }}>
            <div className="panel-content">
                {/* Header */}
                <div className="panel-header">
                    <div className="header-left">
                        <div className="status-badge">{project.status}</div>
                        <h2>{project.name}</h2>
                        <div className="meta-row">
                            <span className="meta-item"><Building2 size={14} /> {client.name} (Main Contractor)</span>
                            {project.assetOwner && (
                                <span className="meta-item text-muted">• Owner: {project.assetOwner}</span>
                            )}
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => onEdit(project)} className="btn-edit">
                            <Edit size={16} /> Edit
                        </button>
                        <button onClick={onClose} className="btn-close">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="panel-body">
                    {activeTab === "overview" && (
                        <div className="tab-pane">
                            {/* Project Description */}
                            {project.description && (
                                <div className="section">
                                    <h3><FileText size={16} /> Concept & Scope</h3>
                                    <p className="description-text">
                                        {project.description}
                                    </p>
                                </div>
                            )}

                            {/* Key Stats Row */}
                            <div className="stats-grid">
                                <div className="stat-box">
                                    <label>Value</label>
                                    <div className="value">{project.value || "TBD"}</div>
                                </div>
                                <div className="stat-box">
                                    <label>Next Phase</label>
                                    <div className="value">{nextTrigger ? nextTrigger.date : "None"}</div>
                                    <div className="subtext">{nextTrigger ? nextTrigger.title : "No upcoming triggers"}</div>
                                </div>
                                <div className="stat-box warning">
                                    <label>Compliance</label>
                                    <div className="value">1 Alert</div>
                                    <div className="subtext">Site Safe Expiring</div>
                                </div>
                            </div>

                            {/* Money Moves / Alerts */}
                            <div className="section">
                                <h3><AlertTriangle size={16} /> Live Intelligence</h3>
                                <div className="feed-list">
                                    {projectMoneyMoves.length > 0 ? (
                                        projectMoneyMoves.map(move => (
                                            <div key={move.id} className={`feed-item ${move.type} priority-${move.urgency?.toLowerCase()}`}>
                                                <div className="feed-icon">
                                                    {move.type === 'signal' ? <Users size={14} /> : <Calendar size={14} />}
                                                </div>
                                                <div className="feed-content">
                                                    <div className="feed-title">{move.title}</div>
                                                    <div className="feed-desc">{move.description}</div>
                                                    <div className="feed-date">Target: {move.date}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">No active signals found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "site-intel" && (
                        <div className="tab-pane">
                            <div className="info-grid">
                                <div className="info-card">
                                    <h4>Logistics</h4>
                                    <div className="info-row">
                                        <Truck size={14} />
                                        <span>Parking: {project.parking || "On-site"}</span>
                                    </div>
                                    <div className="info-row">
                                        <ShieldAlert size={14} />
                                        <span>PPE: {(project.ppe || []).join(", ") || "Standard"}</span>
                                    </div>
                                    <div className="info-row">
                                        <Clock size={14} />
                                        <span>Induction: {project.induction || "Pre-start"}</span>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h4>Key Contacts</h4>
                                    <div className="contact-list">
                                        {(project.keyContacts || [
                                            { name: project.siteManager || "Site Manager", role: "Site Manager", phone: "021..." },
                                            { name: project.projectDirector || "Project Director", role: "Project Director", phone: "021..." }
                                        ]).map((contact, i) => (
                                            <div key={i} className="contact-item">
                                                <div className="contact-avatar">{contact.name?.[0]}</div>
                                                <div className="contact-details">
                                                    <div className="contact-name">{contact.name}</div>
                                                    <div className="contact-role">{contact.role}</div>
                                                </div>
                                                <div className="contact-actions">
                                                    <button title="Call"><Phone size={14} /></button>
                                                    <button title="Email"><Mail size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "workforce" && (
                        <div className="tab-pane">
                            <div className="gap-analysis">
                                <h3>The Gap (Planned vs Actual)</h3>
                                <div className="gap-table">
                                    <div className="gap-header">
                                        <span className="col-left">Trade</span>
                                        <span className="col-center">Required</span>
                                        <span className="col-center">Deployed</span>
                                        <span className="col-center">Gap</span>
                                    </div>

                                    {/* Logic: Aggregate all requirements from all packages */}
                                    {(() => {
                                        let hasGranularData = false;
                                        const allRows = [];

                                        Object.values(project.packages || {}).forEach(pkg => {
                                            if (pkg.laborRequirements && pkg.laborRequirements.length > 0) {
                                                hasGranularData = true;
                                                pkg.laborRequirements.forEach(req => {
                                                    const deployed = req.assigned ? req.assigned.length : 0;
                                                    const gap = req.count - deployed;
                                                    allRows.push({
                                                        trade: req.trade,
                                                        req: req.count,
                                                        dep: deployed,
                                                        gap: gap
                                                    });
                                                });
                                            }
                                        });

                                        if (hasGranularData) {
                                            return allRows.map((row, i) => (
                                                <div key={i} className="gap-row">
                                                    <span className="trade-name col-left">{row.trade}</span>
                                                    <span className="req col-center">{row.req}</span>
                                                    <span className="dep col-center">{row.dep}</span>
                                                    <span className={`gap col-center ${row.gap > 0 ? "negative" : "positive"}`}>
                                                        {row.gap > 0 ? `-${row.gap}` : "✓"}
                                                    </span>
                                                </div>
                                            ));
                                        } else {
                                            // Fallback to Signals (Legacy)
                                            return (project.hiringSignals || []).map((signal, i) => (
                                                <div key={i} className="gap-row">
                                                    <span className="trade-name col-left">{signal.role}</span>
                                                    <span className="req col-center">{signal.count}</span>
                                                    <span className="dep col-center">0</span>
                                                    <span className="gap negative col-center">-{signal.count}</span>
                                                </div>
                                            ));
                                        }
                                    })()}

                                    {(!project.hiringSignals?.length && !Object.values(project.packages || {}).some(p => p.laborRequirements?.length)) && (
                                        <div className="empty-state">No workforce planning data available.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "specs" && (
                        <div className="tab-pane">
                            <div className="specs-list">
                                {Object.entries(project.packages || {}).map(([key, pkg]) => (
                                    <div key={key} className="spec-item">
                                        <div className="spec-header">
                                            <span className="spec-title">{key}</span>
                                            <span className={`spec-status status-${pkg.status?.toLowerCase()}`}>{pkg.status}</span>
                                        </div>
                                        <div className="spec-body">
                                            <div className="spec-row">
                                                <span className="label">Subcontractor:</span>
                                                <span className="val">{pkg.name || "TBD"}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="label">Value:</span>
                                                <span className="val">${pkg.commercialValue || "0"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(project.packages || {}).length === 0 && (
                                    <div className="empty-state">No packages defined.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .panel-overlay {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 1000; /* Increased Z-Index */
                    display: flex;
                    justify-content: flex-end;
                    backdrop-filter: blur(3px);
                }

                .panel-content {
                    width: 100%;
                    max-width: 500px; /* Responsive Width */
                    background: var(--surface);
                    border-left: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    box-shadow: -10px 0 25px rgba(0,0,0,0.5);
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .panel-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    background: rgba(15, 23, 42, 0.6);
                    position: relative;
                }

                .header-left {
                    padding-right: 80px; /* Prevent text overlap with buttons */
                }

                .status-badge {
                    display: inline-block;
                    font-size: 0.7rem;
                    padding: 0.25rem 0.75rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 99px;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                h2 {
                    font-size: 1.4rem;
                    margin: 0 0 0.5rem 0;
                    color: white;
                    line-height: 1.2;
                }

                .meta-row {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .header-actions {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-close, .btn-edit {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-edit {
                    width: auto;
                    border-radius: 6px;
                    padding: 0 1rem;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                    background: var(--primary);
                    border-color: var(--primary);
                }

                .btn-close:hover { background: rgba(255,255,255,0.1); }
                .btn-edit:hover { filter: brightness(1.1); }

                .tabs-nav {
                    display: flex;
                    padding: 0 1.5rem;
                    border-bottom: 1px solid var(--border);
                    background: rgba(0,0,0,0.2);
                    flex-shrink: 0;
                }

                .tab-btn {
                    flex: 1;
                    padding: 1rem 0.5rem;
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    color: var(--text-muted);
                    font-weight: 500;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn:hover { color: white; }
                .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }

                .panel-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                }
                
                /* Custom Scrollbar Styling */
                .panel-body::-webkit-scrollbar {
                    width: 6px;
                }
                .panel-body::-webkit-scrollbar-track {
                    background: transparent;
                }
                .panel-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .panel-body::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .section { margin-bottom: 2rem; }
                .section h3 {
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .description-text {
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: #cbd5e1;
                    white-space: pre-wrap;
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: 6px;
                    border: 1px solid var(--border);
                }

                /* Overview Stats */
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-box {
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .stat-box label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; text-transform: uppercase; }
                .stat-box .value { font-size: 1.1rem; font-weight: 700; color: white; }
                .stat-box .subtext { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .stat-box.warning .value { color: #f59e0b; }

                /* Feed Items */
                .feed-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .feed-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    border-left: 3px solid transparent;
                }
                .feed-item.priority-critical { border-left-color: #ef4444; }
                .feed-item.priority-high { border-left-color: #f59e0b; }
                .feed-item .feed-icon { margin-top: 2px; color: var(--text-muted); }
                .feed-content { flex: 1; }
                .feed-title { font-weight: 600; color: white; font-size: 0.9rem; }
                .feed-desc { font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0; line-height: 1.4; }
                .feed-date { font-size: 0.75rem; color: var(--primary); font-weight: 500; margin-top: 0.25rem; }

                /* Site Intel */
                .info-grid { display: grid; gap: 1.5rem; }
                .info-card { background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border); }
                .info-card h4 { margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
                .info-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.9rem; color: #cbd5e1; }
                
                .contact-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .contact-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }
                .contact-avatar { width: 36px; height: 36px; background: var(--secondary); color: #0f172a; display: flex; align-items: center; justify-content: center; font-weight: 700; border-radius: 50%; font-size: 0.8rem; flex-shrink: 0; }
                .contact-details { flex: 1; }
                .contact-name { font-weight: 600; font-size: 0.9rem; color: white; }
                .contact-role { font-size: 0.75rem; color: var(--text-muted); }
                .contact-actions { display: flex; gap: 0.5rem; }
                .contact-actions button { background: none; border: 1px solid var(--border); color: var(--text-muted); width: 30px; height: 30px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .contact-actions button:hover { background: var(--primary); color: white; border-color: var(--primary); }

                /* Workforce Gap */
                .gap-table { display: flex; flex-direction: column; gap: 0.5rem; }
                .gap-header, .gap-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 0.5rem; padding: 0.75rem; font-size: 0.85rem; }
                .gap-header { color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border); }
                .gap-row { background: rgba(255,255,255,0.03); border-radius: 4px; align-items: center; }
                
                .col-left { text-align: left; }
                .col-center { text-align: center; }

                .trade-name { color: white; font-weight: 500; }
                .gap.negative { color: #ef4444; font-weight: 700; }
                .gap.positive { color: #10b981; font-weight: 700; }

                /* Specs */
                .specs-list { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
                .spec-item { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
                .spec-header { padding: 0.5rem 0.75rem; background: rgba(0,0,0,0.2); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
                .spec-title { font-weight: 600; font-size: 0.85rem; color: white; text-transform: capitalize; }
                .spec-status { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; font-weight: 700; }
                .status-tendering { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
                .status-awarded { color: #10b981; background: rgba(16, 185, 129, 0.1); }
                .spec-body { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem; }
                .spec-row { display: flex; justify-content: space-between; font-size: 0.8rem; }
                .spec-row .label { color: var(--text-muted); }
                .spec-row .val { color: #cbd5e1; }
            `}</style>
        </div>
    );
}