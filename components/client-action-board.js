"use client";

import { useData } from "../context/data-context.js";
import { Flame, CheckCircle, Clock, TrendingUp, AlertTriangle, Phone, ArrowRight, Zap, Ghost } from "lucide-react";

export default function ClientActionBoard({ onViewDeal }) {
    const { moneyMoves, clients, placements, projects, candidates } = useData();

    // 1. Filter & Categorize Data
    // We only want CLIENT-related signals from moneyMoves (Buying Signals, Tasks, Risks)
    // We EXCLUDE candidate-specific compliance stuff unless it blocks a deal
    const clientSignals = moneyMoves.filter(m => 
        m.type === 'buying_signal' || 
        m.type === 'task' || 
        m.type === 'risk' || 
        m.type === 'deal_risk' ||
        (m.type === 'signal' && m.urgency === 'Critical') // Critical project gaps
    );

    // 2. Build Columns
    const columns = {
        fires: { title: "Fires & Risks", icon: Flame, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", items: [] },
        tasks: { title: "Today's Actions", icon: CheckCircle, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", items: [] },
        deals: { title: "Active Deals", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", items: [] }
        ,
        leads: { title: "Radar & Leads", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", items: [] }
    };

    // 3. Sort Items into Columns
    clientSignals.forEach(item => {
        if (item.type === 'task') {
            columns.tasks.items.push(item);
        } else if (item.urgency === 'Critical' || item.type === 'risk' || item.type === 'deal_risk') {
            columns.fires.items.push(item);
        } else if (item.type === 'buying_signal') {
            columns.leads.items.push(item);
        }
    });

    // Add Active Deals (Floated / Interview) directly from Placements if not already caught as 'Stalled'
    placements.filter(p => p.status === 'Floated' || p.status === 'Interview').forEach(p => {
        // Only add if NOT already in 'fires' as a stalled deal
        const isStalled = columns.fires.items.some(fire => fire.placementId === p.id);
        if (!isStalled) {
            const project = projects.find(proj => proj.id === p.projectId);
            const candidate = candidates.find(c => c.id === p.candidateId);
            if (project && candidate) {
                columns.deals.items.push({ 
                    id: `deal-${p.id}`,
                    title: `${candidate.firstName} @ ${project.name}`,
                    description: `Status: ${p.status}`,
                    type: 'deal',
                    urgency: 'Medium',
                    meta: 'Active Deal'
                });
            }
        }
    });

    // 4. Generate Assistant Summary
    const fireCount = columns.fires.items.length;
    const dealCount = columns.deals.items.length;
    const leadCount = columns.leads.items.length;
    
    let greeting = "All quiet on the western front.";
    if (fireCount > 0) greeting = `⚠️ Attention: ${fireCount} critical risks require immediate action.`;
    else if (dealCount > 0) greeting = `🚀 Momentum: You have ${dealCount} active deals in play. Close them!`;
    else if (leadCount > 0) greeting = `🌱 Pipeline: ${leadCount} new buying signals detected. Time to hunt.`;

    return (
        <div className="board-container">
            {/* Assistant Header */}
            <div className="assistant-header">
                <div className="assistant-avatar">
                    <Zap size={20} className="text-secondary" />
                </div>
                <div className="assistant-text">
                    <span className="assistant-label">Mission Control AI</span>
                    <p className="assistant-message">{greeting}</p>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="kanban-grid">
                {Object.entries(columns).map(([key, col]) => (
                    <div key={key} className={`kanban-col ${col.bg} ${col.border}`}>
                        <div className="col-header">
                            <div className="flex items-center gap-2">
                                <col.icon size={16} className={col.color} />
                                <h3 className={`text-sm font-bold uppercase ${col.color}`}>{col.title}</h3>
                            </div>
                            <span className="count-badge">{col.items.length}</span>
                        </div>
                        
                        <div className="col-content">
                            {col.items.map((item, idx) => (
                                <div key={idx} className="kanban-card">
                                    <div className="card-top">
                                        <span className={`urgency-dot ${item.urgency === 'Critical' ? 'critical' : ''}`}></span>
                                        <h4 className="card-title">{item.title}</h4>
                                    </div>
                                    <p className="card-desc">{item.description}</p>
                                    
                                    <div className="card-actions">
                                        {/* Dynamic Actions based on Type */}
                                        {(item.type === 'risk' || item.type === 'deal_risk') && (
                                            <button className="card-btn risk"><Phone size={12} /> Call Now</button>
                                        )}
                                        {item.type === 'task' && (
                                            <button className="card-btn task"><CheckCircle size={12} /> Complete</button>
                                        )}
                                        {item.type === 'deal' && (
                                            <button 
                                                className="card-btn deal"
                                                onClick={() => onViewDeal && onViewDeal(item.id.replace('deal-', ''))}
                                            >
                                                <ArrowRight size={12} /> View
                                            </button>
                                        )}
                                        {item.type === 'buying_signal' && (
                                            <button className="card-btn lead"><Phone size={12} /> Pitch</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {col.items.length === 0 && (
                                <div className="empty-state">No active items</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .board-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                /* Assistant Header */
                .assistant-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    backdrop-filter: blur(10px);
                }

                .assistant-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(56, 189, 248, 0.1);
                    border: 1px solid rgba(56, 189, 248, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
                }

                .assistant-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    letter-spacing: 0.05em;
                    font-weight: 700;
                }

                .assistant-message {
                    font-size: 1rem;
                    color: white;
                    font-weight: 500;
                }

                /* Kanban Grid */
                .kanban-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    height: 350px; /* Fixed height for the widget */
                }

                .kanban-col {
                    border: 1px solid;
                    border-radius: var(--radius-md);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .col-header {
                    padding: 0.75rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .count-badge {
                    font-size: 0.7rem;
                    background: rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 99px;
                    color: white;
                }

                .col-content {
                    flex: 1;
                    padding: 0.75rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .col-content::-webkit-scrollbar { width: 4px; }
                .col-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

                /* Cards */
                .kanban-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.75rem;
                    transition: transform 0.2s;
                }
                .kanban-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.2);
                }

                .card-top {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    margin-bottom: 0.4rem;
                }

                .urgency-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--text-muted);
                    margin-top: 4px;
                    flex-shrink: 0;
                }
                .urgency-dot.critical { background: #f43f5e; box-shadow: 0 0 8px #f43f5e; }

                .card-title {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                    line-height: 1.3;
                }

                .card-desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                }

                /* Actions */
                .card-actions {
                    display: flex;
                    justify-content: flex-end;
                }

                .card-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.7rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    border: 1px solid transparent;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .card-btn.risk { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border-color: rgba(244, 63, 94, 0.3); }
                .card-btn.risk:hover { background: #f43f5e; color: white; }

                .card-btn.task { background: rgba(56, 189, 248, 0.1); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3); }
                .card-btn.task:hover { background: #38bdf8; color: #0f172a; }

                .card-btn.deal { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); }
                .card-btn.deal:hover { background: #fbbf24; color: #0f172a; }

                .card-btn.lead { background: rgba(52, 211, 153, 0.1); color: #34d399; border-color: rgba(52, 211, 153, 0.3); }
                .card-btn.lead:hover { background: #34d399; color: #0f172a; }

                .empty-state {
                    text-align: center;
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.2);
                    padding: 1rem;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
