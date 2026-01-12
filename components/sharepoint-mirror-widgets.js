"use client";

import { useState } from 'react';
import { X, ExternalLink, Calendar, Users, Briefcase, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

export function FinishingSoonWidget({ data, onExpand }) {
    if (!data) return null;

    return (
        <div className="mirror-card finishing-soon" onClick={onExpand}>
            <div className="card-header">
                <div className="flex flex-col">
                    <h3>Finishing / Top Up</h3>
                    <span className="last-sync">Last synced: {data.lastSynced}</span>
                </div>
                <RefreshCw size={14} className="text-secondary opacity-50" />
            </div>

            <div className="summary-grid">
                {data.summary.slice(0, 4).map((item, i) => (
                    <div key={i} className="summary-item">
                        <span className="count" style={{ color: item.color || 'var(--secondary)' }}>{item.count}</span>
                        <span className="label">{item.code}</span>
                    </div>
                ))}
            </div>

            <div className="card-footer">
                <span>View Full Dashboard</span>
                <ExternalLink size={12} />
            </div>

            <style jsx>{`
                .mirror-card {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    min-height: 200px;
                }
                .mirror-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                }
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                h3 { font-size: 1rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
                .last-sync { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-top: 4px; }
                
                .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                .summary-item { display: flex; flex-direction: column; align-items: flex-start; }
                .count { font-size: 1.5rem; font-weight: 900; line-height: 1; }
                .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }
                
                .card-footer { margin-top: auto; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }
            `}</style>
        </div>
    );
}

export function ClientDemandWidget({ data, onExpand }) {
    if (!data) return null;

    const confirmedCount = data.rows.filter(r => r.status === 'Confirmed').length;
    const floatedCount = data.rows.filter(r => r.status.includes('Floated')).length;

    return (
        <div className="mirror-card client-demand" onClick={onExpand}>
            <div className="card-header">
                <div className="flex flex-col">
                    <h3>Live Client Demand</h3>
                    <span className="last-sync">Mirrored from SharePoint</span>
                </div>
                <Users size={14} className="text-secondary opacity-50" />
            </div>

            <div className="demand-summary">
                <div className="demand-row">
                    <div className="status-bead confirmed"></div>
                    <span className="label">Confirmed</span>
                    <span className="value">{confirmedCount} Roles</span>
                </div>
                <div className="demand-row">
                    <div className="status-bead floated"></div>
                    <span className="label">Floated</span>
                    <span className="value">{floatedCount} Roles</span>
                </div>
            </div>

            <div className="card-footer">
                <span>Open Build Demand</span>
                <ExternalLink size={12} />
            </div>

            <style jsx>{`
                .mirror-card {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    min-height: 200px;
                }
                .mirror-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                }
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                h3 { font-size: 1rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
                .last-sync { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-top: 4px; }
                
                .demand-summary { display: flex; flex-direction: column; gap: 0.75rem; }
                .demand-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; }
                .status-bead { width: 8px; height: 8px; border-radius: 50%; }
                .status-bead.confirmed { background: var(--secondary); box-shadow: 0 0 10px var(--secondary); }
                .status-bead.floated { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }
                .label { color: var(--text-muted); font-weight: 700; text-transform: uppercase; flex: 1; }
                .value { color: white; font-weight: 800; }
                
                .card-footer { margin-top: auto; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }
            `}</style>
        </div>
    );
}

export function SharePointModal({ isOpen, onClose, type, data }) {
    const [activeFilter, setActiveFilter] = useState(null);

    if (!isOpen) return null;

    const filteredRows = activeFilter
        ? data.rows.filter(row => row.code === activeFilter || row.status === activeFilter)
        : data.rows;

    const handleStatClick = (code) => {
        setActiveFilter(activeFilter === code ? null : code);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-info">
                        <h2>{type === 'finishingSoon' ? 'Finishing or Top Up Candidates' : 'Client Demand - Build'}</h2>
                        <span className="source-tag">Live SharePoint Mirror {activeFilter && `• Filtering by ${activeFilter}`}</span>
                    </div>
                    <div className="header-actions">
                        {activeFilter && (
                            <button className="btn-clear" onClick={() => setActiveFilter(null)}>
                                <X size={14} /> Clear Filter
                            </button>
                        )}
                        <a href="https://stellar2.sharepoint.com/:x:/r/sites/aucklandteam/_layouts/15/Doc.aspx?sourcedoc=%7B36AF1379-745E-4492-A6B9-40CBA75A4F1F%7D" target="_blank" rel="noreferrer" className="btn-secondary">
                            <ExternalLink size={16} /> Open in SharePoint
                        </a>
                        <button className="close-btn" onClick={onClose}><X size={24} /></button>
                    </div>
                </div>

                <div className="modal-body">
                    {type === 'finishingSoon' ? (
                        <div className="data-layout">
                            <div className="stats-strip">
                                <div
                                    className={`stat-pill total ${!activeFilter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(null)}
                                >
                                    <span className="stat-val">{data.rows.length}</span>
                                    <span className="stat-label">TOTAL</span>
                                    <span className="stat-detail">All tracked candidates</span>
                                </div>
                                {data.summary.map((s, i) => (
                                    <div
                                        key={i}
                                        className={`stat-pill ${activeFilter === s.code ? 'active' : ''}`}
                                        style={{ borderLeftColor: s.color }}
                                        onClick={() => handleStatClick(s.code)}
                                    >
                                        <span className="stat-val">{s.count}</span>
                                        <span className="stat-label">{s.code}</span>
                                        <span className="stat-detail">{s.description}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="data-grid">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Name</th>
                                            <th>Trade</th>
                                            <th>Client</th>
                                            <th>End Date</th>
                                            <th>Location</th>
                                            <th>Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRows.map((row, i) => (
                                            <tr key={i}>
                                                <td><span className="code-badge" style={{ backgroundColor: data.summary.find(s => s.code === row.code)?.color + '33', color: data.summary.find(s => s.code === row.code)?.color }}>{row.code}</span></td>
                                                <td className="font-bold text-white">{row.name}</td>
                                                <td>{row.trade}</td>
                                                <td>{row.client}</td>
                                                <td><div className="flex items-center gap-2"><Calendar size={12} /> {row.endDate}</div></td>
                                                <td><div className="flex items-center gap-2"><MapPin size={12} /> {row.location}</div></td>
                                                <td className="text-xs text-slate-400">{row.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="data-layout">
                            <div className="stats-strip">
                                <div
                                    className={`stat-pill total ${!activeFilter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(null)}
                                >
                                    <span className="stat-val">{data.rows.length}</span>
                                    <span className="stat-label">TOTAL</span>
                                    <span className="stat-detail">Open Roles</span>
                                </div>
                                {['Confirmed', 'Floated AM', 'Rejected'].map((status, i) => {
                                    const count = data.rows.filter(r => r.status === status).length;
                                    const color = status === 'Confirmed' ? '#4ade80' : status === 'Rejected' ? '#f87171' : '#fbbf24';
                                    return (
                                        <div
                                            key={i}
                                            className={`stat-pill ${activeFilter === status ? 'active' : ''}`}
                                            style={{ borderLeftColor: color }}
                                            onClick={() => handleStatClick(status)}
                                        >
                                            <span className="stat-val">{count}</span>
                                            <span className="stat-label">{status}</span>
                                            <span className="stat-detail">{status === 'Confirmed' ? 'Ready to Start' : status === 'Rejected' ? 'Needs Attention' : 'In Review'}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="data-grid">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Role</th>
                                            <th>AM</th>
                                            <th>Client</th>
                                            <th>Location</th>
                                            <th>Start</th>
                                            <th>Duration</th>
                                            <th>#</th>
                                            <th>Status</th>
                                            <th>Filled By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRows.map((row, i) => (
                                            <tr key={i}>
                                                <td className="font-bold text-white">{row.role}</td>
                                                <td>{row.am}</td>
                                                <td>{row.client}</td>
                                                <td>{row.location}</td>
                                                <td>{row.start}</td>
                                                <td>{row.duration}</td>
                                                <td>{row.count}</td>
                                                <td>
                                                    <span className={`status-pill-v2 ${row.status.toLowerCase().replace(' ', '-')}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="fillers-container">
                                                        {row.fillers.map((f, fi) => (
                                                            <span key={fi} className="filler-tag">{f}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.85); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(12px); padding: 2rem; }
                .modal-content { width: 100%; max-width: 1400px; height: 90vh; background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%); border: 1px solid var(--border); border-radius: var(--radius-xl); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.6); }
                .modal-header { padding: 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: rgba(15, 23, 42, 0.4); }
                .header-info h2 { font-size: 1.75rem; font-weight: 900; color: white; margin: 0; letter-spacing: -0.03em; }
                .source-tag { font-size: 0.7rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; letter-spacing: 0.2em; margin-top: 8px; display: block; }
                .header-actions { display: flex; align-items: center; gap: 1.5rem; }
                
                .btn-clear { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; padding: 0.6rem 1rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.2s; }
                .btn-clear:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; }

                .btn-secondary { display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; padding: 0.8rem 1.5rem; border-radius: var(--radius-md); font-weight: 700; text-decoration: none; font-size: 0.85rem; transition: all 0.2s; }
                .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: white; }
                .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
                .close-btn:hover { color: white; }

                .modal-body { flex: 1; overflow-y: auto; padding: 2rem; }
                .stats-strip { display: flex; gap: 1rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 1rem; }
                .stat-pill { background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-left: 4px solid var(--secondary); padding: 1rem 1.5rem; border-radius: var(--radius-md); min-width: 200px; display: flex; flex-direction: column; gap: 4px; cursor: pointer; transition: all 0.2s; }
                .stat-pill:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
                .stat-pill.active { background: rgba(0, 242, 255, 0.1); border-color: var(--secondary); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 242, 255, 0.2); }
                .stat-pill.total { border-left-color: white; }
                .stat-val { font-size: 1.5rem; font-weight: 900; color: white; }
                .stat-label { font-size: 0.7rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; letter-spacing: 0.05em; }
                .stat-pill.active .stat-label { color: white; }
                .stat-detail { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; }

                .data-grid { background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
                table { width: 100%; border-collapse: collapse; text-align: left; }
                th { background: rgba(15, 23, 42, 0.6); padding: 1rem; font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border); }
                td { padding: 1.25rem 1rem; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--text-main); }
                tr:hover td { background: rgba(255,255,255,0.02); }

                .code-badge { padding: 4px 10px; border-radius: 4px; font-weight: 900; font-size: 0.7rem; }
                .status-pill-v2 { padding: 4px 12px; border-radius: 99px; font-weight: 900; font-size: 0.7rem; text-transform: uppercase; }
                .status-pill-v2.confirmed { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
                .status-pill-v2.floated-am { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
                .status-pill-v2.rejected { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

                .fillers-container { display: flex; flex-wrap: wrap; gap: 4px; }
                .filler-tag { background: rgba(0, 242, 255, 0.1); color: var(--secondary); padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
