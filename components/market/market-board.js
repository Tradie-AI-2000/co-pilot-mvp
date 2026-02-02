"use client";
import { useState } from 'react';
import { TenderCard } from './tender-card';
import { TenderModal } from './tender-modal';

const COLUMNS = [
    { id: 'New', label: 'New Opportunities' },
    { id: 'Contacted', label: 'Contacted' },
    { id: 'Tender', label: 'Tendering' },
    { id: 'Won', label: 'Won' },
    { id: 'Lost', label: 'Lost' }
];

export function MarketBoard({ initialTenders = [] }) {
    const [tenders, setTenders] = useState(initialTenders);
    const [selectedTender, setSelectedTender] = useState(null);

    return (
        <div className="market-board">
            <div className="board-container">
                {COLUMNS.map(col => {
                    const colTenders = tenders.filter(t => t.status === col.id);
                    return (
                        <div key={col.id} className="board-column">
                            <div className="column-header">
                                <h3>{col.label}</h3>
                                <span className="count">{colTenders.length}</span>
                            </div>
                            <div className="column-content">
                                {colTenders.map(tender => (
                                    <TenderCard 
                                        key={tender.id} 
                                        tender={tender} 
                                        onClick={setSelectedTender} 
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <TenderModal 
                tender={selectedTender} 
                isOpen={!!selectedTender} 
                onClose={() => setSelectedTender(null)} 
            />

            <style jsx>{`
                .market-board {
                    height: 100%;
                    overflow-x: auto;
                    padding-bottom: 1rem;
                }
                .board-container {
                    display: flex;
                    gap: 1rem;
                    height: 100%;
                    min-width: fit-content;
                }
                .board-column {
                    width: 320px;
                    flex-shrink: 0;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border);
                }
                .column-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                }
                .count {
                    background: var(--surface);
                    padding: 0.2rem 0.6rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .column-content {
                    padding: 1rem;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
            `}</style>
        </div>
    );
}
