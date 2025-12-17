import { Hammer, Users, ChevronRight, Wrench, HardHat, Zap, PaintBucket, Truck } from "lucide-react";

export default function TradeGrid({ candidates, onTradeClick, regionName }) {
    // Group candidates by role (Trade)
    const trades = candidates.reduce((acc, candidate) => {
        const trade = candidate.role || "General Labour";
        if (!acc[trade]) {
            acc[trade] = { name: trade, count: 0 };
        }
        acc[trade].count++;
        return acc;
    }, {});

    const tradeList = Object.values(trades).sort((a, b) => b.count - a.count);

    const getTradeIcon = (tradeName) => {
        const lower = tradeName.toLowerCase();
        if (lower.includes('electr')) return <Zap size={24} className="text-yellow-400" />;
        if (lower.includes('plumb')) return <Wrench size={24} className="text-blue-400" />;
        if (lower.includes('paint')) return <PaintBucket size={24} className="text-pink-400" />;
        if (lower.includes('driver') || lower.includes('operator')) return <Truck size={24} className="text-green-400" />;
        if (lower.includes('labour')) return <HardHat size={24} className="text-orange-400" />;
        return <Hammer size={24} className="text-secondary" />;
    };

    return (
        <div className="trade-grid">
            {tradeList.map((trade) => (
                <div
                    key={trade.name}
                    onClick={() => onTradeClick(trade.name)}
                    className="trade-card"
                >
                    <div className="icon-wrapper">
                        {getTradeIcon(trade.name)}
                    </div>

                    <h3 className="trade-title">{trade.name}</h3>
                    <p className="trade-count">{trade.count} Available</p>

                    <div className="card-footer">
                        <span>View Candidates</span>
                        <ChevronRight size={14} className="arrow-icon" />
                    </div>
                </div>
            ))}
            <style jsx>{`
                .trade-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    overflow: hidden;
                }

                .trade-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }

                .icon-wrapper {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    transition: transform 0.2s;
                }

                .trade-card:hover .icon-wrapper {
                    transform: scale(1.1);
                    border-color: var(--secondary);
                }

                .trade-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .trade-count {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                }

                .card-footer {
                    margin-top: auto;
                    width: 100%;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .trade-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2.5rem; /* gap-10 approx */
                    width: 100%;
                }

                @media (min-width: 768px) {
                    .trade-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (min-width: 1024px) {
                    .trade-grid { grid-template-columns: repeat(3, 1fr); }
                }

                .trade-card:hover .card-footer,
                .trade-card:hover .arrow-icon {
                    color: var(--secondary);
                }
            `}</style>
        </div>
    );
}
