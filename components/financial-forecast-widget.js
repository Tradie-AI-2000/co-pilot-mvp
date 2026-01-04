"use client";

import { TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { useData } from "../context/data-context.js";

export default function FinancialForecastWidget() {
    const { placements, candidates, projects } = useData();

    // --- Configuration ---
    const BURDEN_MULTIPLIER = 1.20;
    const WORK_WEEK_HOURS = 40;
    const PROBABILITY = {
        'Floated': 0.20,
        'Interview': 0.50,
        'Offer': 0.90
    };

    // 1. Filter Active Deals (Pipeline)
    const pipelineDeals = placements.filter(p => 
        ['Floated', 'Interview', 'Offer'].includes(p.status)
    );

    // 2. Calculate Values per Deal
    const dealsWithFinancials = pipelineDeals.map(deal => {
        const candidate = candidates.find(c => c.id === deal.candidateId);
        if (!candidate) return null;

        // Use deal-specific rates if stored, otherwise fallback to candidate defaults
        const chargeRate = deal.chargeRate || candidate.chargeRate || 0;
        const payRate = deal.payRate || candidate.payRate || 0;
        
        const weeklyGP = (chargeRate - (payRate * BURDEN_MULTIPLIER)) * WORK_WEEK_HOURS;
        const probability = PROBABILITY[deal.status] || 0;
        const weightedValue = weeklyGP * probability;

        return { ...deal, weeklyGP, weightedValue, probability };
    }).filter(Boolean);

    // 3. Aggregate Stats
    const totalPipelineValue = dealsWithFinancials.reduce((sum, d) => sum + d.weeklyGP, 0);
    const weightedPipelineValue = dealsWithFinancials.reduce((sum, d) => sum + d.weightedValue, 0);
    
    // Group by Stage for Visualization
    const stageValues = {
        'Floated': dealsWithFinancials.filter(d => d.status === 'Floated').reduce((sum, d) => sum + d.weeklyGP, 0),
        'Interview': dealsWithFinancials.filter(d => d.status === 'Interview').reduce((sum, d) => sum + d.weeklyGP, 0),
        'Offer': dealsWithFinancials.filter(d => d.status === 'Offer').reduce((sum, d) => sum + d.weeklyGP, 0)
    };

    const maxStageValue = Math.max(...Object.values(stageValues), 1);

    return (
        <div className="panel forecast-panel">
            <div className="panel-header">
                <h3 className="text-emerald-400 flex items-center gap-2">
                    <TrendingUp size={18} /> Profit Forecast
                </h3>
                <span className="badge emerald">Projected Growth</span>
            </div>

            <div className="forecast-grid">
                {/* Metric Box */}
                <div className="metric-box">
                    <div className="label">Weighted Pipeline Value</div>
                    <div className="value text-emerald-400">
                        +${Math.round(weightedPipelineValue).toLocaleString()}
                        <span className="unit">/wk</span>
                    </div>
                    <div className="subtext">
                        Best Case: +${Math.round(totalPipelineValue).toLocaleString()}/wk
                    </div>
                </div>

                {/* Funnel Viz */}
                <div className="funnel-viz">
                    {['Offer', 'Interview', 'Floated'].map(stage => (
                        <div key={stage} className="funnel-row">
                            <div className="stage-label">
                                <span className="name">{stage}</span>
                                <span className="prob">{PROBABILITY[stage] * 100}%</span>
                            </div>
                            <div className="bar-container">
                                <div 
                                    className={`bar-fill ${stage.toLowerCase()}`}
                                    style={{ width: `${(stageValues[stage] / maxStageValue) * 100}%` }}
                                ></div>
                            </div>
                            <div className="stage-value">
                                ${Math.round(stageValues[stage]).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .panel {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .panel-header h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 0;
                }

                .badge {
                    font-size: 0.7rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    font-weight: 700;
                }
                .badge.emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                .forecast-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                    align-items: center;
                }

                /* Metric Box */
                .metric-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    text-align: center;
                }

                .metric-box .label {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }

                .metric-box .value {
                    font-size: 2rem;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }

                .metric-box .unit {
                    font-size: 1rem;
                    font-weight: 600;
                    opacity: 0.7;
                    margin-left: 2px;
                }

                .metric-box .subtext {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                /* Funnel Viz */
                .funnel-viz {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .funnel-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .stage-label {
                    width: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .stage-label .name {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: white;
                }

                .stage-label .prob {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                }

                .bar-container {
                    flex: 1;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                    overflow: hidden;
                }

                .bar-fill {
                    height: 100%;
                    border-radius: 6px;
                    transition: width 0.5s ease-out;
                }

                .bar-fill.offer { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
                .bar-fill.interview { background: #f59e0b; }
                .bar-fill.floated { background: #3b82f6; }

                .stage-value {
                    width: 60px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                    text-align: right;
                    font-family: monospace;
                }
            `}</style>
        </div>
    );
}
