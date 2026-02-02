"use client";
import { useMemo } from 'react';
import { Trophy, PieChart, TrendingUp, Users } from 'lucide-react';

export function MarketAnalytics({ tenders }) {
    // 1. Calculate Stats
    const stats = useMemo(() => {
        const builders = {};
        const sectors = {};
        let totalValue = 0;

        tenders.forEach(t => {
            const val = parseFloat(t.projectValueRaw || 0);
            totalValue += val;

            // Group by Builder
            if (t.mainContractor) {
                builders[t.mainContractor] = (builders[t.mainContractor] || 0) + val;
            }

            // Group by Sector
            if (t.sector) {
                sectors[t.sector] = (sectors[t.sector] || 0) + 1;
            }
        });

        // Sort builders by value
        const topBuilders = Object.entries(builders)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        return { totalValue, topBuilders, sectors };
    }, [tenders]);

    const formatCurrency = (val) => {
        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
        if (val >= 1000000) return `$${(val / 1000000).toFixed(0)}M`;
        return `$${val.toLocaleString()}`;
    };

    return (
        <div className="market-analytics">
            <div className="stats-grid">
                <div className="stat-card gold">
                    <TrendingUp size={24} />
                    <div className="stat-content">
                        <label>Total Market Value</label>
                        <div className="value">{formatCurrency(stats.totalValue)}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <Users size={24} />
                    <div className="stat-content">
                        <label>Active Builders</label>
                        <div className="value">{Object.keys(stats.topBuilders).length}</div>
                    </div>
                </div>
            </div>

            <div className="charts-row">
                {/* Leaderboard */}
                <div className="chart-box leaderboard">
                    <h3><Trophy size={18} /> Construction League Top 10</h3>
                    <div className="rank-list">
                        {stats.topBuilders.map((builder, i) => (
                            <div key={builder.name} className="rank-item">
                                <span className="rank-num">#{i + 1}</span>
                                <div className="rank-details">
                                    <span className="builder-name">{builder.name}</span>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${(builder.value / stats.topBuilders[0].value) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="rank-value">{formatCurrency(builder.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sector Split */}
                <div className="chart-box sectors">
                    <h3><PieChart size={18} /> Sector Breakdown</h3>
                    <div className="sector-list">
                        {Object.entries(stats.sectors).map(([name, count]) => (
                            <div key={name} className="sector-item">
                                <div className="sector-info">
                                    <span className="dot" style={{ background: getSectorColor(name) }}></span>
                                    <span className="name">{name}</span>
                                </div>
                                <span className="count">{count} Projects</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .market-analytics {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 1rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .stat-card {
                    background: var(--surface);
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .stat-card.gold { border-color: #ffd700; background: rgba(255, 215, 0, 0.05); }
                .stat-card label { display: block; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }
                .stat-card .value { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }

                .charts-row {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 1.5rem;
                }
                .chart-box {
                    background: var(--surface);
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                }
                h3 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; color: var(--text-main); }

                .rank-list { display: flex; flex-direction: column; gap: 1rem; }
                .rank-item { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; }
                .rank-num { width: 30px; font-weight: 700; color: var(--text-muted); }
                .rank-details { flex: 1; }
                .builder-name { font-weight: 600; display: block; margin-bottom: 4px; color: var(--text-main); }
                .progress-bar { height: 8px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden; }
                .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), #3b82f6); transition: width 0.5s ease-out; }
                .rank-value { font-weight: 600; min-width: 60px; text-align: right; }

                .sector-list { display: flex; flex-direction: column; gap: 1rem; }
                .sector-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
                .sector-info { display: flex; align-items: center; gap: 0.75rem; }
                .dot { width: 10px; height: 10px; border-radius: 50%; }
                .sector-item .count { font-weight: 600; color: var(--text-muted); }

                @media (max-width: 768px) {
                    .charts-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

function getSectorColor(sector) {
    const colors = {
        'Commercial': '#3b82f6',
        'Industrial': '#10b981',
        'Residential': '#f59e0b',
        'Community': '#8b5cf6',
        'Legal & Military': '#6b7280'
    };
    return colors[sector] || '#94a3b8';
}
