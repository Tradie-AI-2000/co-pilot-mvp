"use client";
import { useState } from 'react';
import { LayoutGrid, BarChart3 } from 'lucide-react';
import { MarketBoard } from './market-board';
import { MarketAnalytics } from './market-analytics';

export function MarketView({ tenders }) {
    const [view, setView] = useState('analytics'); // Default to Analytics (The League)

    return (
        <div className="market-view">
            <div className="view-switcher">
                <button 
                    className={view === 'analytics' ? 'active' : ''} 
                    onClick={() => setView('analytics')}
                >
                    <BarChart3 size={16} /> Construction League
                </button>
                <button 
                    className={view === 'tenders' ? 'active' : ''} 
                    onClick={() => setView('tenders')}
                >
                    <LayoutGrid size={16} /> Tender Board
                </button>
            </div>

            <div className="view-content">
                {view === 'analytics' ? (
                    <MarketAnalytics tenders={tenders} />
                ) : (
                    <MarketBoard initialTenders={tenders} />
                )}
            </div>

            <style jsx>{`
                .market-view {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    height: 100%;
                }
                .view-switcher {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0 0.5rem;
                }
                button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    background: var(--surface);
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                button.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }
                .view-content {
                    flex: 1;
                    min-height: 0;
                }
            `}</style>
        </div>
    );
}
