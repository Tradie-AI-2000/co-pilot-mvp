"use client";

import { useState } from "react";
import { useData } from "../../context/data-context.js";
import FloatCandidateModal from "../../components/float-candidate-modal.js";
import PlacementTicketModal from "../../components/placement-ticket-modal.js";
import FinancialForecastWidget from "../../components/financial-forecast-widget.js";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart, ArrowRight } from "lucide-react";

export default function FinancialsPage() {
    const { candidates, placements } = useData();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [isFloatModalOpen, setIsFloatModalOpen] = useState(false);

    // --- Financial Engine ---
    const BURDEN_MULTIPLIER = 1.20; // 20% burden for ACC, Holiday Pay, Kiwisaver
    const WORK_WEEK_HOURS = 40;

    // 1. Calculate Revenue (Active Placements)
    const activeCandidates = candidates.filter(c => c.status === "On Job");
    const weeklyRevenue = activeCandidates.reduce((sum, c) => sum + ((c.chargeRate || 0) * WORK_WEEK_HOURS), 0);

    // 2. Calculate Payroll (Active + Bench Liability)
    const activePayroll = activeCandidates.reduce((sum, c) => sum + ((c.payRate || 0) * BURDEN_MULTIPLIER * WORK_WEEK_HOURS), 0);
    
    // Bench Liability: Candidates "Available" with Guaranteed Hours
    const benchCandidates = candidates.filter(c => c.status === "Available" && c.guaranteedHours > 0);
    const benchLiability = benchCandidates.reduce((sum, c) => sum + ((c.payRate || 0) * BURDEN_MULTIPLIER * (c.guaranteedHours || 30)), 0);

    const totalPayroll = activePayroll + benchLiability;
    const weeklyGrossProfit = weeklyRevenue - totalPayroll;
    const grossMarginPercent = weeklyRevenue > 0 ? ((weeklyGrossProfit / weeklyRevenue) * 100).toFixed(1) : "0.0";

    const handleFloatClick = (candidate) => {
        setSelectedCandidate(candidate);
        setIsFloatModalOpen(true);
    };

    const handleViewPlacement = (candidateId) => {
        // Find the active placement for this candidate
        const placement = placements.find(p => p.candidateId === candidateId && p.status === 'Deployed');
        if (placement) {
            setSelectedPlacement(placement);
        }
    };

    return (
        <div className="financials-container">
            <header className="page-header">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <DollarSign className="text-emerald-400" /> Financial Command Center
                </h1>
                <div className="header-meta">
                    <span className="text-muted text-sm">Week ending: Jan 7, 2026</span>
                </div>
            </header>

            {/* Zone 1: The Ledger */}
            <div className="ledger-grid">
                <div className="ledger-card revenue">
                    <div className="card-label">Weekly Revenue</div>
                    <div className="card-value">${weeklyRevenue.toLocaleString()}</div>
                    <div className="card-sub text-emerald-400 flex items-center gap-1">
                        <TrendingUp size={14} /> {activeCandidates.length} Billable Heads
                    </div>
                </div>

                <div className="ledger-card payroll">
                    <div className="card-label">Weekly Payroll (Est)</div>
                    <div className="card-value">${totalPayroll.toLocaleString()}</div>
                    <div className="card-sub text-slate-400 flex items-center gap-1">
                        Includes 20% Burden
                    </div>
                </div>

                <div className="ledger-card profit">
                    <div className="card-label">Net Weekly Profit</div>
                    <div className={`card-value ${weeklyGrossProfit >= 0 ? 'text-white' : 'text-rose-500'}`}>
                        ${weeklyGrossProfit.toLocaleString()}
                    </div>
                    <div className="card-sub text-emerald-400 flex items-center gap-1">
                        {grossMarginPercent}% Margin
                    </div>
                </div>

                <div className={`ledger-card liability ${benchLiability > 0 ? 'alert' : ''}`}>
                    <div className="card-label">Bench Bleed (Liability)</div>
                    <div className="card-value text-rose-500">-${benchLiability.toLocaleString()}</div>
                    <div className="card-sub text-rose-400 flex items-center gap-1">
                        <AlertCircle size={14} /> {benchCandidates.length} Guaranteed Salaries
                    </div>
                </div>
            </div>

            <div className="main-content-grid">
                {/* Zone 2: The Bleed (Bench Liability) */}
                <div className="panel bleed-panel">
                    <div className="panel-header">
                        <h3 className="text-rose-400 flex items-center gap-2">
                            <AlertCircle size={18} /> Liability Watchlist
                        </h3>
                        <span className="badge rose">{benchCandidates.length} At Risk</span>
                    </div>
                    <div className="liability-table">
                        <div className="table-header">
                            <span>Candidate</span>
                            <span>Guaranteed</span>
                            <span>Wkly Cost</span>
                            <span>Action</span>
                        </div>
                        <div className="table-body">
                            {benchCandidates.map(c => (
                                <div key={c.id} className="table-row">
                                    <div className="candidate-info">
                                        <div className="font-bold text-white">{c.firstName} {c.lastName}</div>
                                        <div className="text-xs text-muted">{c.role}</div>
                                    </div>
                                    <div className="text-sm text-slate-300">{c.guaranteedHours} hrs</div>
                                    <div className="text-sm font-mono text-rose-400">
                                        -${Math.round((c.payRate * BURDEN_MULTIPLIER * c.guaranteedHours)).toLocaleString()}
                                    </div>
                                    <button 
                                        className="float-btn"
                                        onClick={() => handleFloatClick(c)}
                                    >
                                        Float Now
                                    </button>
                                </div>
                            ))}
                            {benchCandidates.length === 0 && (
                                <div className="empty-state">No bench liability. Great job!</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Zone 3: Margin Optimizer */}
                <div className="panel margin-panel">
                    <div className="panel-header">
                        <h3 className="text-amber-400 flex items-center gap-2">
                            <PieChart size={18} /> Margin Optimizer
                        </h3>
                        <span className="badge amber">Low Margin Focus</span>
                    </div>
                    <div className="margin-list">
                        {activeCandidates
                            .map(c => {
                                const margin = c.chargeRate ? ((c.chargeRate - (c.payRate * BURDEN_MULTIPLIER)) / c.chargeRate * 100) : 0;
                                return { ...c, margin };
                            })
                            .sort((a, b) => a.margin - b.margin) // Lowest margin first
                            .slice(0, 5) // Top 5 worst margins
                            .map(c => (
                                <div 
                                    key={c.id} 
                                    className="margin-row cursor-pointer hover:bg-slate-700/50 transition-colors"
                                    onClick={() => handleViewPlacement(c.id)}
                                    title="View Placement Details"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-white">{c.firstName} {c.lastName}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.margin < 20 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {c.margin.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-muted">
                                        <span>{c.currentEmployer}</span>
                                        <span>Pay ${c.payRate} / Chg ${c.chargeRate}</span>
                                    </div>
                                    <div className="margin-bar-track mt-2">
                                        <div 
                                            className={`margin-bar-fill ${c.margin < 20 ? 'low' : 'ok'}`}
                                            style={{ width: `${Math.min(c.margin, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Zone 4: Forecasting */}
            <div className="forecast-section">
                <FinancialForecastWidget />
            </div>

            {selectedCandidate && (
                <FloatCandidateModal
                    candidate={selectedCandidate}
                    isOpen={isFloatModalOpen}
                    onClose={() => setIsFloatModalOpen(false)}
                />
            )}

            {selectedPlacement && (
                <PlacementTicketModal
                    placement={selectedPlacement}
                    onClose={() => setSelectedPlacement(null)}
                />
            )}

            <style jsx>{`
                .financials-container {
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

                /* Ledger Grid */
                .ledger-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }

                .ledger-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .ledger-card.liability.alert {
                    border-color: rgba(244, 63, 94, 0.3);
                    background: rgba(244, 63, 94, 0.05);
                }

                .card-label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    font-weight: 700;
                }

                .card-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    line-height: 1;
                }

                .card-sub {
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                /* Main Content Grid */
                .main-content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                    flex: 1;
                }

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
                .badge.rose { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
                .badge.amber { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }

                /* Liability Table */
                .liability-table {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .table-header {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    padding: 0 1rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }

                .table-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    transition: all 0.2s;
                }

                .table-row:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .float-btn {
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.4rem 0.8rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-transform: uppercase;
                }
                .float-btn:hover { background: #34d399; }

                /* Margin Optimizer */
                .margin-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .margin-row {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                }

                .margin-bar-track {
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .margin-bar-fill {
                    height: 100%;
                    border-radius: 3px;
                }
                .margin-bar-fill.low { background: #f43f5e; }
                .margin-bar-fill.ok { background: #10b981; }

                .empty-state {
                    text-align: center;
                    color: var(--text-muted);
                    padding: 2rem;
                    font-style: italic;
                }
                /* Forecast Section */
                .forecast-section {
                    margin-bottom: 2rem;
                }
            `}</style>
        </div>
    );
}
