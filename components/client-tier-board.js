"use client";

import ClientCard from "./client-card.js";

export default function ClientTierBoard({ clients, region, industry, onClientClick }) {
    // Filter clients
    const filteredClients = clients.filter(c => 
        (region === "National" || c.region === region) &&
        c.industry === industry
    );

    // Group by Tier
    const tiers = {
        '1': filteredClients.filter(c => c.tier === '1'),
        '2': filteredClients.filter(c => c.tier === '2'),
        '3': filteredClients.filter(c => c.tier === '3')
    };

    return (
        <div className="tier-board">
            <div className="tier-column">
                <div className="column-header tier-1">
                    <h3>Tier 1</h3>
                    <span className="count">{tiers['1'].length}</span>
                </div>
                <div className="column-content">
                    {tiers['1'].map(client => (
                        <ClientCard 
                            key={client.id} 
                            client={client} 
                            onClick={() => onClientClick(client)} 
                            variant="compact"
                        />
                    ))}
                    {tiers['1'].length === 0 && <div className="empty-state">No Tier 1 Clients</div>}
                </div>
            </div>

            <div className="tier-column">
                <div className="column-header tier-2">
                    <h3>Tier 2</h3>
                    <span className="count">{tiers['2'].length}</span>
                </div>
                <div className="column-content">
                    {tiers['2'].map(client => (
                        <ClientCard 
                            key={client.id} 
                            client={client} 
                            onClick={() => onClientClick(client)} 
                            variant="compact"
                        />
                    ))}
                    {tiers['2'].length === 0 && <div className="empty-state">No Tier 2 Clients</div>}
                </div>
            </div>

            <div className="tier-column">
                <div className="column-header tier-3">
                    <h3>Tier 3</h3>
                    <span className="count">{tiers['3'].length}</span>
                </div>
                <div className="column-content">
                    {tiers['3'].map(client => (
                        <ClientCard 
                            key={client.id} 
                            client={client} 
                            onClick={() => onClientClick(client)} 
                            variant="compact"
                        />
                    ))}
                    {tiers['3'].length === 0 && <div className="empty-state">No Tier 3 Clients</div>}
                </div>
            </div>

            <style jsx>{`
                .tier-board {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    height: 100%;
                    min-height: 500px;
                }

                .tier-column {
                    background: rgba(15, 23, 42, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }

                .column-header {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                }

                .column-header h3 {
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .column-header.tier-1 { background: rgba(251, 191, 36, 0.1); color: var(--tier-1-gold); }
                .column-header.tier-2 { background: rgba(148, 163, 184, 0.1); color: var(--tier-2-silver); }
                .column-header.tier-3 { background: rgba(202, 138, 4, 0.1); color: var(--tier-3-bronze); }

                .count {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.1rem 0.5rem;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .column-content {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    flex: 1;
                    overflow-y: auto;
                }

                .empty-state {
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    padding: 2rem;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
