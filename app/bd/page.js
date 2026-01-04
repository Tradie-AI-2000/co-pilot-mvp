"use client";

import { useState } from "react";
import { Target, Map as MapIcon, Crosshair, Zap, FileText } from "lucide-react";
import TenderRadar from "../../components/tender-radar.js";
import GoldenHourMode from "../../components/golden-hour-mode.js";

export default function BusinessDevPage() {
    const [activeMode, setActiveMode] = useState('radar'); // 'radar', 'map', 'golden-hour'

    return (
        <div className="bd-container">
            <header className="page-header">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Target className="text-rose-500" /> The Hunter Deck
                </h1>
                <div className="header-actions">
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
                {activeMode === 'radar' && <TenderRadar />}
                {activeMode === 'map' && <div className="placeholder">Site Spotter Map (Coming Soon)</div>}
                {activeMode === 'golden-hour' && <GoldenHourMode />}
            </div>

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
            `}</style>
        </div>
    );
}
