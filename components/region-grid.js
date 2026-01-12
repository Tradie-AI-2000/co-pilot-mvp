"use client";

import { MapPin } from "lucide-react";

export default function RegionGrid({ clients, candidates, onSelectRegion, onRegionClick }) {
    const regions = ["National", "Auckland", "Waikato", "BoP", "Northland", "Hawkes Bay"];
    
    // Normalize props
    const data = clients || candidates || [];
    const isClients = !!clients;
    const clickHandler = onSelectRegion || onRegionClick;

    // Dynamic stats
    const getStats = (region) => {
        if (!data || data.length === 0) return { active: 0, total: 0 };

        const relevantItems = region === "National" 
            ? data 
            : data.filter(item => {
                // Clients use 'region', Candidates use 'state' (legacy field name for region)
                const itemRegion = isClients ? item.region : item.state;
                return itemRegion === region;
            });
        
        let activeCount = 0;
        if (isClients) {
            activeCount = relevantItems.filter(c => c.activeJobs > 0).length;
        } else {
            // Candidates: 'On Job' or 'Deployed' implies active
            activeCount = relevantItems.filter(c => c.status === 'On Job' || c.status === 'Deployed').length;
        }

        return { active: activeCount, total: relevantItems.length };
    };

    return (
        <div className="region-grid">
            {regions.map(region => {
                const stats = getStats(region);
                const isActive = stats.total > 0;

                return (
                    <div 
                        key={region} 
                        className={`region-card ${isActive ? 'active' : 'inactive'}`}
                        onClick={() => isActive && clickHandler && clickHandler(region)}
                    >
                        <div className="card-bg-icon"><MapPin size={100} /></div>
                        <h3 className="region-title">{region}</h3>
                        
                        <div className="stats">
                            <div className="stat-row">
                                <span className="stat-val text-green-400">{stats.active}</span>
                                <span className="stat-label">Active {isClients ? 'Clients' : 'Workers'}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-val text-white">{stats.total}</span>
                                <span className="stat-label">Total {isClients ? 'Clients' : 'Pool'}</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
                .region-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1.5rem;
                }

                .region-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1.5rem;
                    height: 180px;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .region-card.active:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: var(--secondary);
                    transform: translateY(-2px);
                }

                .region-card.inactive {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: rgba(15, 23, 42, 0.4);
                }

                .card-bg-icon {
                    position: absolute;
                    right: -20px;
                    bottom: -20px;
                    opacity: 0.05;
                    transform: rotate(-15deg);
                }

                .region-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    z-index: 1;
                }

                .stats {
                    display: flex;
                    gap: 1.5rem;
                    z-index: 1;
                }

                .stat-row {
                    display: flex;
                    flex-direction: column;
                }

                .stat-val {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
