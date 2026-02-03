"use client";

import { Hammer, HardHat, Shield, Box, PenTool, Truck, Home, Grid, Scissors, PaintBucket } from "lucide-react";

export default function TradeGrid({ clients, candidates, region, onSelectTrade, onTradeClick, regionName }) {
    // Industries requested by user
    const industries = [
        { name: "Builder", icon: Hammer },
        { name: "Formwork", icon: Grid },
        { name: "Civil", icon: Truck },  // Moved up for visibility
        { name: "Electrical", icon: ZapIcon },
        { name: "Plumber", icon: WrenchIcon },
        { name: "Flooring", icon: Grid },
        { name: "Interior", icon: PaintBucket },
        { name: "Glazier", icon: Box },
        { name: "Landscaping", icon: Home },
        { name: "Demolition", icon: Scissors },
        { name: "Fire", icon: Shield }, // Renamed from "Passive Fire" to match Modal option short-code
        { name: "Carpenter", icon: Hammer },
    ];

    // Helper icons for dynamic roles
    function ZapIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>; }
    function WrenchIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>; }

    // Normalize Props
    const data = clients || candidates || [];
    const isClients = !!clients;
    const activeRegion = region || regionName || "National";
    const clickHandler = onSelectTrade || onTradeClick;

    // Filter by Region
    const regionItems = activeRegion === "National"
        ? data
        : data.filter(item => {
            const itemRegion = isClients ? item.region : item.state;
            return itemRegion === activeRegion;
        });

    const getStats = (industryName) => {
        const relevant = regionItems.filter(item => {
            const itemTrade = isClients ? item.industry : item.role;
            // Flexible matching
            return itemTrade === industryName || (itemTrade && itemTrade.includes(industryName));
        });
        return { count: relevant.length };
    };

    // For candidates, we discover roles that actually exist in the data
    const activeDataRoles = Array.from(new Set(
        regionItems
            .map(item => (isClients ? item.industry : item.role))
            .filter(role => role && typeof role === 'string' && role.trim() !== "")
    ));

    const allOptions = [
        ...industries,
        ...activeDataRoles
            .filter(role => !industries.some(ind => ind.name.toLowerCase() === role.toLowerCase()))
            .map(role => ({ name: role, icon: HardHat })) // Fallback icon
    ];

    // Ensure absolute uniqueness by name (case-insensitive)
    const displayedIndustries = allOptions.filter((v, i, a) =>
        a.findIndex(t => t.name.toLowerCase() === v.name.toLowerCase()) === i
    );

    return (
        <div className="trade-grid">
            {displayedIndustries.map(ind => {
                const stats = getStats(ind.name);
                const Icon = ind.icon;
                const isActive = stats.count > 0;

                // Hide empty cards if showing candidates (cleaner view)
                if (!isClients && !isActive) return null;

                return (
                    <div
                        key={ind.name}
                        className={`trade-card ${isActive ? 'active' : 'inactive'}`}
                        onClick={() => isActive && clickHandler && clickHandler(ind.name)}
                    >
                        <div className="icon-wrapper">
                            <Icon size={24} />
                        </div>
                        <div className="content">
                            <h3 className="trade-name">{ind.name}</h3>
                            <span className="client-count">{stats.count} {isClients ? 'Clients' : 'Workers'}</span>
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
                .trade-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .trade-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .trade-card.active:hover {
                    background: rgba(30, 41, 59, 0.8);
                    border-color: var(--secondary);
                    transform: translateX(4px);
                }

                .trade-card.inactive {
                    opacity: 0.4;
                    cursor: not-allowed;
                    background: rgba(15, 23, 42, 0.4);
                }

                .icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--secondary);
                }

                .trade-name {
                    font-weight: 700;
                    color: white;
                    font-size: 0.95rem;
                    margin-bottom: 0.1rem;
                }

                .client-count {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
}
