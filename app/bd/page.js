"use client";

import { useState } from "react";
import { useData } from "../../context/data-context.js";
import { Target, Map as MapIcon, Crosshair, Zap, FileText, List } from "lucide-react";
import TenderRadar from "../../components/tender-radar.js";
import GoldenHourMode from "../../components/golden-hour-mode.js";
import FocusFeedCard from "../../components/focus-feed-card.js";
import ActionDrawer from "../../components/action-drawer.js";

export default function BusinessDevPage() {
    const { moneyMoves } = useData();
    const [activeMode, setActiveMode] = useState('feed'); // 'feed', 'radar', 'map', 'golden-hour'
    const [selectedNudge, setSelectedNudge] = useState(null);

    // Priority Scoring Logic
    const getPriorityScore = (action) => {
        // 1. Critical Revenue (Buying Signals / Immediate Risks)
        if (action.urgency === 'Critical' || action.type === 'signal') return 100;
        
        // 2. High Urgency (Tasks / Flight Risks)
        if (action.urgency === 'High') return 80;
        
        // 3. Medium (Compliance Warnings)
        if (action.urgency === 'Medium') return 50;
        
        // 4. Low (Long-term Visa warnings) -> BURY THESE
        return 10; 
    };

    // Sort: Highest Score First
    const sortedMoves = [...moneyMoves].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

    return (
        <div className="bd-container">
            <header className="page-header">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Target className="text-rose-500" /> The Hunter Deck
                </h1>
                <div className="header-actions">
                    <button 
                        className={`mode-btn ${activeMode === 'feed' ? 'active' : ''}`}
                        onClick={() => setActiveMode('feed')}
                    >
                        <List size={18} /> Nudge Feed
                    </button>
                    <button 
                        className={`mode-btn ${activeMode === 'radar' ? 'active' : ''}`}
                        onClick={() => setActiveMode('radar')}
                    >
                        <FileText size={18} /> Tender Radar
                    </button>
                    <button 
                        className={`mode-btn ${activeMode === 'map' ? 'active' : ''}`}
                        onClick={() => setActiveMode('map')}
                    >
                        <MapIcon size={18} /> Site Spotter
                    </button>
                    <button 
                        className={`mode-btn ${activeMode === 'golden-hour' ? 'active' : ''}`}
                        onClick={() => setActiveMode('golden-hour')}
                    >
                        <Zap size={18} /> Golden Hour
                    </button>
                </div>
            </header>

            <div className="bd-content">
                {activeMode === 'feed' && (
                    <div className="nudge-feed-container">
                        <div className="feed-header">
                            <h2>Priority Actions</h2>
                            <span className="badge">{sortedMoves.length} Active</span>
                        </div>
                        <div className="feed-grid">
                            {sortedMoves.map((action) => {
                                let cardType = action.type;
                                if (action.type === 'signal') {
                                    if (action.urgency === 'Critical') cardType = 'risk';
                                    else if (action.urgency === 'High') cardType = 'urgent';
                                    else cardType = 'lead';
                                }
                                
                                return (
                                    <FocusFeedCard
                                        key={action.id}
                                        type={cardType}
                                        title={action.title}
                                        subtitle={action.description}
                                        meta={action.projectName || (action.candidateId ? "Candidate Alert" : "Client Alert")}
                                        onAction={() => setSelectedNudge(action)}
                                    />
                                );
                            })}
                            {sortedMoves.length === 0 && (
                                <div className="empty-state">
                                    <Zap size={48} className="text-slate-600 mb-4" />
                                    <p>All clear! No urgent nudges right now.</p>
                                    <button className="text-secondary hover:underline" onClick={() => setActiveMode('golden-hour')}>
                                        Start a Power Hour?
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {activeMode === 'radar' && <TenderRadar />}
                {activeMode === 'map' && <div className="placeholder">Site Spotter Map (Coming Soon)</div>}
                {activeMode === 'golden-hour' && <GoldenHourMode />}
            </div>

            <ActionDrawer 
                isOpen={!!selectedNudge} 
                nudge={selectedNudge} 
                onClose={() => setSelectedNudge(null)} 
            />

            <style jsx>{`
                .bd-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    height: calc(100vh - 4rem);
                    overflow-y: auto;
                    padding-right: 1rem;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .header-actions {
                    display: flex;
                    gap: 1rem;
                    background: rgba(15, 23, 42, 0.6);
                    padding: 0.25rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                }

                .mode-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }

                .mode-btn:hover {
                    color: white;
                }

                .mode-btn.active {
                    background: var(--secondary);
                    color: #0f172a;
                    box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
                }

                .bd-content {
                    flex: 1;
                }

                .placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 400px;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius-lg);
                    color: var(--text-muted);
                    background: rgba(255,255,255,0.02);
                }

                /* Nudge Feed Styles */
                .nudge-feed-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .feed-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .feed-header h2 {
                    font-size: 1.2rem;
                    color: white;
                    font-weight: 600;
                }

                .badge {
                    background: rgba(255,255,255,0.1);
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    font-size: 0.8rem;
                    color: var(--secondary);
                }

                .feed-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                    gap: 1rem;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    background: rgba(255,255,255,0.02);
                    border-radius: 12px;
                    color: var(--text-muted);
                    border: 1px dashed var(--border);
                }
            `}</style>
        </div>
    );
}
