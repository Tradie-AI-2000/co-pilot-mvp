"use client";

import { useState } from "react";
import { useData } from "../../context/data-context.js";
import { FileText, ArrowRight, CheckCircle, Users, AlertTriangle, FileUp, Loader2 } from "lucide-react";
import { mockTenders } from "../../services/enhanced-mock-data.js";

// Helper to simulate the AI Agent extracting roles from a tender description
const simulateAgentExtraction = (tender) => {
    // Deterministic "AI" logic for demo purposes
    if (tender.title.includes("Airport")) {
        return [
            { role: "Steel Fixer", count: 15 },
            { role: "Formworker", count: 10 },
            { role: "Site Manager", count: 3 }
        ];
    }
    if (tender.title.includes("Housing") || tender.title.includes("Apartments")) {
        return [
            { role: "Carpenter", count: 25 },
            { role: "Hammerhand", count: 12 },
            { role: "Laborer", count: 8 }
        ];
    }
    // Default Commercial
    return [
        { role: "Carpenter", count: 8 },
        { role: "Electrician", count: 4 },
        { role: "HVAC Tech", count: 3 }
    ];
};

export default function TenderRadar() {
    const { candidates } = useData();
    const [analyzingId, setAnalyzingId] = useState(null);
    const [generatedId, setGeneratedId] = useState(null);

    // Map the mockTenders to the UI format
    const tenders = mockTenders.map(t => ({
        ...t,
        startDate: t.closingDate, // Just using closing date as proxy for start for now
        agency: t.client,
        rolesRequired: simulateAgentExtraction(t),
        status: t.isPursuing ? "Pursuing" : "Open"
    }));

    const getBenchMatch = (roles) => {
        // Simple logic: check how many candidates we have with matching roles
        let matchScore = 0;
        let totalRequired = 0;
        let details = [];

        roles.forEach(req => {
            totalRequired += req.count;
            const supply = candidates.filter(c => c.role === req.role && (c.status === 'Available' || (c.finishDate && new Date(c.finishDate) < new Date('2026-04-01')))).length;

            // Cap match at required count
            const match = Math.min(supply, req.count);
            matchScore += match;

            details.push({
                role: req.role,
                required: req.count,
                supply: supply,
                gap: req.count - supply
            });
        });

        const percent = Math.round((matchScore / totalRequired) * 100);
        return { percent, details };
    };

    const handleGenerateBidPack = (id) => {
        setAnalyzingId(id);
        setTimeout(() => {
            setAnalyzingId(null);
            setGeneratedId(id);
        }, 2000); // Simulate AI processing
    };

    return (
        <div className="radar-container">
            <div className="radar-grid">
                {tenders.map(tender => {
                    const matchData = getBenchMatch(tender.rolesRequired);
                    const isWinning = matchData.percent > 70;

                    return (
                        <div key={tender.id} className="tender-card">
                            <div className="card-header">
                                <div className="agency-badge">{tender.agency}</div>
                                <span className="value-badge">{tender.value}</span>
                            </div>

                            <h3 className="tender-title">{tender.title}</h3>

                            <div className="timeline-row">
                                <div className="time-item">
                                    <span className="label">Closes</span>
                                    <span className="val">{new Date(tender.closeDate).toLocaleDateString()}</span>
                                </div>
                                <div className="time-item">
                                    <span className="label">Starts</span>
                                    <span className="val">{new Date(tender.startDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="supply-match-box">
                                <div className="match-header">
                                    <span className="label">Supply Win Probability</span>
                                    <span className={`score ${isWinning ? 'high' : 'low'}`}>{matchData.percent}%</span>
                                </div>
                                <div className="match-bar-track">
                                    <div
                                        className={`match-bar-fill ${isWinning ? 'high' : 'low'}`}
                                        style={{ width: `${matchData.percent}%` }}
                                    ></div>
                                </div>
                                <div className="gap-analysis">
                                    {matchData.details.slice(0, 2).map((d, i) => (
                                        <div key={i} className="gap-item">
                                            <span>{d.role}</span>
                                            <span className={d.gap <= 0 ? "text-emerald-400" : "text-rose-400"}>
                                                {d.supply} / {d.required}
                                            </span>
                                        </div>
                                    ))}
                                    {matchData.details.length > 2 && (
                                        <div className="gap-item text-xs text-muted">+{matchData.details.length - 2} more roles...</div>
                                    )}
                                </div>
                            </div>

                            <div className="card-actions">
                                {generatedId === tender.id ? (
                                    <button className="action-btn success w-full">
                                        <CheckCircle size={16} /> Bid Pack Ready
                                    </button>
                                ) : (
                                    <button
                                        className={`action-btn ${analyzingId === tender.id ? 'loading' : 'primary'} w-full`}
                                        onClick={() => handleGenerateBidPack(tender.id)}
                                        disabled={analyzingId === tender.id}
                                    >
                                        {analyzingId === tender.id ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" /> Matching Candidates...
                                            </>
                                        ) : (
                                            <>
                                                <FileUp size={16} /> Generate Bid Pack
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .radar-container {
                    padding: 1rem 0;
                }

                .radar-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .tender-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    backdrop-filter: blur(10px);
                    transition: all 0.2s;
                }

                .tender-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-2px);
                    background: rgba(30, 41, 59, 0.6);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .agency-badge {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    background: rgba(255,255,255,0.05);
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                }

                .value-badge {
                    font-weight: 700;
                    color: var(--secondary);
                    font-size: 0.9rem;
                }

                .tender-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    line-height: 1.3;
                }

                .timeline-row {
                    display: flex;
                    gap: 2rem;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 1rem;
                }

                .time-item {
                    display: flex;
                    flex-direction: column;
                }

                .time-item .label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .time-item .val {
                    font-size: 0.9rem;
                    color: white;
                    font-weight: 500;
                }

                /* Supply Match Box */
                .supply-match-box {
                    background: rgba(15, 23, 42, 0.4);
                    border-radius: 8px;
                    padding: 1rem;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .match-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .match-header .label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .match-header .score {
                    font-weight: 800;
                    font-size: 0.9rem;
                }
                .score.high { color: #10b981; }
                .score.low { color: #f43f5e; }

                .match-bar-track {
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 0.75rem;
                }

                .match-bar-fill {
                    height: 100%;
                    border-radius: 3px;
                }
                .match-bar-fill.high { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
                .match-bar-fill.low { background: #f43f5e; }

                .gap-analysis {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .gap-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: var(--text-main);
                }

                /* Actions */
                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }

                .action-btn.primary {
                    background: var(--secondary);
                    color: #0f172a;
                }
                .action-btn.primary:hover {
                    background: #34d399;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
                }

                .action-btn.loading {
                    background: rgba(255,255,255,0.1);
                    color: var(--text-muted);
                    cursor: wait;
                }

                .action-btn.success {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid #10b981;
                }
            `}</style>
        </div>
    );
}
