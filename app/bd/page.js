"use client";

import { useState, useMemo, useRef } from "react";
import { useData } from "../../context/data-context.js";
import {
    Target, Flame, MapPin, Phone, ArrowRight, Zap,
    TrendingUp, AlertTriangle, CheckCircle, Clock,
    Briefcase, Calendar, DollarSign, X, Filter, User
} from "lucide-react";
import ActionDrawer from "../../components/action-drawer.js";
import FocusFeedCard from "../../components/focus-feed-card.js";
import ClientSidePanel from "../../components/client-side-panel.js";
import FloatCandidateModal from "../../components/float-candidate-modal.js";
import GoldenHourMode from "../../components/golden-hour-mode.js";
import { RELATED_ROLES, WORKFORCE_MATRIX, PHASE_MAP } from "../../services/construction-logic.js";
import { parse, differenceInDays, isValid } from 'date-fns';

// --- Sub-Components for the Hunter Grid ---

// 1. THE BLEED (Retention Risk)
const TheBleedWidget = ({ candidates, placements, forwardRef }) => {
    // Logic: Calculate margin expiring in next 14 days
    const bleedMetrics = useMemo(() => {
        const today = new Date();
        const twoWeeks = new Date();
        twoWeeks.setDate(today.getDate() + 14);

        let weeklyMarginAtRisk = 0;
        let count = 0;
        let criticalList = [];

        // Filter active placements ending soon
        candidates.forEach(c => {
            if (c.status !== 'On Job' || !c.finishDate) return;

            // Handle dd/MM/yyyy format or standard ISO
            let finish;
            if (typeof c.finishDate === 'string' && c.finishDate.includes('/')) {
                finish = parse(c.finishDate, 'dd/MM/yyyy', new Date());
            } else {
                finish = new Date(c.finishDate);
            }

            if (isValid(finish) && finish >= today && finish <= twoWeeks) {
                const charge = parseFloat(c.chargeRate) || 55;
                const pay = parseFloat(c.payRate) || 35;
                const margin = (charge - (pay * 1.30)) * (parseFloat(c.guaranteedHours) || 40);
                weeklyMarginAtRisk += margin;
                count++;
                criticalList.push({
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`,
                    role: c.role,
                    finishDate: finish,
                    value: Math.round(margin),
                    project: c.currentEmployer || "Unknown Site"
                });
            }
        });

        return { value: Math.round(weeklyMarginAtRisk), count, list: criticalList };
    }, [candidates]);

    return (
        <div ref={forwardRef} className="hunter-card bleed-card col-span-12 md:col-span-3 glass-panel">
            <div className="card-header border-b border-rose-500/30 pb-2 mb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Flame size={18} className="text-rose-500 animate-pulse" />
                    <h3 className="text-rose-100 font-bold uppercase tracking-wider text-xs">The Bleed (14 Days)</h3>
                </div>
                <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    -{bleedMetrics.count} Heads
                </span>
            </div>

            <div className="main-metric text-rose-500 text-2xl font-black mb-3">
                -${bleedMetrics.value.toLocaleString()}
                <span className="text-sm text-rose-400/50 font-medium ml-1">/wk GP</span>
            </div>

            <div className="list-container overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {bleedMetrics.list.length === 0 ? (
                    <div className="empty-state text-xs text-slate-500 italic">No imminent retention risks.</div>
                ) : (
                    bleedMetrics.list.map(item => (
                        <div key={item.id} className="list-item mb-2 p-2 bg-rose-500/5 rounded border border-rose-500/10">
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                                <span className="text-rose-400 text-xs font-mono">-${item.value}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                                <span>{item.role} @ {item.project}</span>
                                <span>{item.finishDate.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 2. THE MATCHMAKER (Growth & Mobility)
const MatchmakerWidget = ({ candidates, projects, onPitch }) => {
    // Logic: Cross reference Finishing Candidates with Starting Phases
    const matches = useMemo(() => {
        const results = [];
        const today = new Date();

        // Supply: Available or Finishing < 21 Days
        const supply = candidates.filter(c => {
            if (c.status === 'Available') return true;
            if (c.finishDate) {
                let finish;
                if (typeof c.finishDate === 'string' && c.finishDate.includes('/')) {
                    finish = parse(c.finishDate, 'dd/MM/yyyy', new Date());
                } else {
                    finish = new Date(c.finishDate);
                }

                if (!isValid(finish)) return false;

                const diff = differenceInDays(finish, today);
                return diff >= 0 && diff <= 21;
            }
            return false;
        });

        // Demand: Projects entering new phases
        projects.forEach(p => {
            // Check specific phase columns from Google Sheet
            const phases = [
                { id: 'civil', label: 'Civil', date: p.civilStart },
                { id: 'structure', label: 'Structure', date: p.structureStart },
                { id: 'fitout', label: 'Fitout', date: p.fitoutStart }
            ];

            phases.forEach(phase => {
                if (phase.date) {
                    let start;
                    if (typeof phase.date === 'string' && phase.date.includes('/')) {
                        start = parse(phase.date, 'dd/MM/yyyy', new Date());
                    } else {
                        start = new Date(phase.date);
                    }

                    if (isValid(start)) {
                        const diff = differenceInDays(start, today);

                        // Look ahead 7-45 days
                        if (diff >= 7 && diff <= 45) {
                            const rolesNeeded = WORKFORCE_MATRIX?.[phase.id] ? Object.keys(WORKFORCE_MATRIX[phase.id]) : ['Carpenter', 'Hammerhand', 'Laborer'];

                            rolesNeeded.forEach(role => {
                                const matchingCandidates = supply.filter(c => {
                                    const roleMatch = c.role === role || (RELATED_ROLES[role] && RELATED_ROLES[role].includes(c.role));
                                    if (!roleMatch) return false;

                                    // Mobility Logic
                                    const isMobile = c.residency === 'Work Visa' || c.residency === 'Filipino Crew';
                                    if (isMobile) return true;

                                    // Local Logic - simple check against Location column
                                    return p.location && c.address1 && p.location.includes(c.address1);
                                });

                                if (matchingCandidates.length > 0) {
                                    results.push({
                                        id: `${p.id}-${phase.id}-${role}`,
                                        project: p.name,
                                        projectId: p.id,
                                        client: p.client,
                                        clientId: p.assignedCompanyIds?.[0],
                                        phase: phase.label,
                                        role: role,
                                        count: matchingCandidates.length,
                                        candidate: matchingCandidates[0],
                                        startsIn: Math.ceil(diff),
                                        isMobile: matchingCandidates.some(c => c.residency === 'Work Visa' || c.residency === 'Filipino Crew')
                                    });
                                }
                            });
                        }
                    }
                }
            });
        });
        return results.sort((a, b) => a.startsIn - b.startsIn);
    }, [candidates, projects]);

    return (
        <div className="hunter-card match-card col-span-12 md:col-span-5 glass-panel">
            <div className="card-header border-b border-cyan-500/30 pb-2 mb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-cyan-400" />
                    <h3 className="text-cyan-100 font-bold uppercase tracking-wider text-xs">The Matchmaker</h3>
                </div>
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    {matches.length} Opportunities
                </span>
            </div>

            <div className="list-container overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {matches.length === 0 ? (
                    <div className="empty-state text-xs text-slate-500 italic">No predictive matches found today.</div>
                ) : (
                    matches.map(m => (
                        <div key={m.id} className="match-item group mb-2 p-2 bg-cyan-500/5 rounded border border-cyan-500/10 hover:bg-cyan-500/10 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm">{m.count}x {m.role}</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">{m.client} • {m.project}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-cyan-400">In {m.startsIn} Days</span>
                                    <div className="text-[10px] text-slate-500">{m.phase} Phase</div>
                                </div>
                            </div>
                            {m.isMobile && (
                                <div className="mb-2">
                                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 font-bold tracking-wide">
                                        MOBILE CREW
                                    </span>
                                </div>
                            )}
                            <button
                                className="w-full py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded border border-cyan-500/20 transition-all flex items-center justify-center gap-2"
                                onClick={() => onPitch(m)}
                            >
                                Generate Pitch <ArrowRight size={12} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 3. RELATIONSHIP HEATMAP (CRM)
const RelationshipHeatmap = ({ clients, onClientClick }) => {
    // Logic: Bucket clients by Tier and Last Contact
    const heatmap = useMemo(() => {
        const buckets = {
            tier1_risk: [],
            tier2_risk: [],
            dormant: []
        };

        const today = new Date();

        clients.forEach(c => {
            let daysSince = "Never";
            let rawDays = 999;

            if (c.lastContact && c.lastContact !== "Never" && c.lastContact !== "Unknown") {
                let lastDate;
                // Parse DD/MM/YYYY
                if (c.lastContact.includes('/')) {
                    lastDate = parse(c.lastContact, 'dd/MM/yyyy', new Date());
                } else {
                    lastDate = new Date(c.lastContact);
                }

                if (isValid(lastDate)) {
                    rawDays = differenceInDays(today, lastDate);
                    daysSince = rawDays;
                }
            }

            const isTier1 = c.tier === '1' || c.tier === 'Tier 1';
            const isTier2 = c.tier === '2' || c.tier === 'Tier 2';

            const riskItem = {
                id: c.id,
                name: c.name,
                tier: c.tier,
                daysSince,
                status: c.status,
                owner: c.clientOwner || "Unassigned",
                raw: c
            };

            if (isTier1 && rawDays > 14) {
                buckets.tier1_risk.push(riskItem);
            } else if (isTier2 && rawDays > 30) {
                buckets.tier2_risk.push(riskItem);
            }

            // Dormant Check (60+ days)
            if (rawDays > 60 && c.status !== 'Never Used') {
                buckets.dormant.push(riskItem);
            }
        });

        // Sort each bucket by daysSince desc
        const sorter = (a, b) => (typeof b.daysSince === 'number' ? b.daysSince : 999) - (typeof a.daysSince === 'number' ? a.daysSince : 999);
        buckets.tier1_risk.sort(sorter);
        buckets.tier2_risk.sort(sorter);
        buckets.dormant.sort(sorter);

        return buckets;
    }, [clients]);

    return (
        <div className="hunter-card heatmap-card col-span-12 md:col-span-4 glass-panel flex flex-col">
            <div className="card-header border-b border-amber-500/30 pb-2 mb-2 flex items-center gap-2">
                <Target size={18} className="text-amber-400" />
                <h3 className="text-amber-100 font-bold uppercase tracking-wider text-xs">Relationship Decay</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto custom-scrollbar pb-2">
                {/* Quadrant 1: Tier 1 Risk */}
                <div className="quadrant bg-rose-500/5 border border-rose-500/20 rounded p-2">
                    <div className="quad-head text-rose-400 text-[10px] font-bold uppercase mb-2">Tier 1 Drift ({heatmap.tier1_risk.length})</div>
                    <div className="quad-list flex flex-col gap-1">
                        {heatmap.tier1_risk.slice(0, 5).map(c => (
                            <div key={c.id} className="quad-item flex justify-between text-xs p-1 hover:bg-white/5 rounded cursor-pointer" onClick={() => onClientClick(c.raw)}>
                                <span className="name text-slate-300 truncate">{c.name}</span>
                                <span className="days text-rose-500 font-mono">{c.daysSince}d</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quadrant 2: Tier 2 Risk */}
                <div className="quadrant bg-amber-500/5 border border-amber-500/20 rounded p-2">
                    <div className="quad-head text-amber-400 text-[10px] font-bold uppercase mb-2">Tier 2 Drift ({heatmap.tier2_risk.length})</div>
                    <div className="quad-list flex flex-col gap-1">
                        {heatmap.tier2_risk.slice(0, 5).map(c => (
                            <div key={c.id} className="quad-item flex justify-between text-xs p-1 hover:bg-white/5 rounded cursor-pointer" onClick={() => onClientClick(c.raw)}>
                                <span className="name text-slate-300 truncate">{c.name}</span>
                                <span className="days text-amber-500 font-mono">{c.daysSince}d</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quadrant 3: Dormant Giants (Full Width) */}
                <div className="quadrant col-span-2 bg-slate-800/50 border border-slate-700 rounded p-2">
                    <div className="quad-head text-slate-400 text-[10px] font-bold uppercase mb-2">Dormant Accounts ({heatmap.dormant.length})</div>
                    <div className="quad-list flex flex-wrap gap-2">
                        {heatmap.dormant.slice(0, 6).map(c => (
                            <div key={c.id} className="chip bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-300 hover:border-slate-500 cursor-pointer" onClick={() => onClientClick(c.raw)}>
                                {c.name} <span className="text-slate-500">({c.daysSince}d)</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. POWER BLOCK (Execution)
const PowerBlockWidget = ({ clients, moneyMoves, onStartPowerMode }) => {
    // Logic: Get top 5 prioritized actions
    const missionList = useMemo(() => {
        // Filter & Deduplicate
        const uniqueIds = new Set();
        const missions = [];

        // 1. Critical Signals
        moneyMoves.forEach(m => {
            if (uniqueIds.has(m.id)) return;

            // Logic: Critical Signals OR Buying Signals OR Critical Risks
            if (m.type === 'buying_signal' || m.urgency === 'Critical' || (m.type === 'risk' && m.urgency === 'High')) {
                uniqueIds.add(m.id);
                missions.push(m);
            }
        });

        // Top 5 only
        return missions.slice(0, 5);
    }, [moneyMoves]);

    return (
        <div className="hunter-card power-card col-span-12 glass-panel flex flex-col min-h-[150px]">
            <div className="card-header border-b border-emerald-500/30 pb-2 mb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <h3 className="text-emerald-100 font-bold uppercase tracking-wider text-xs">The Mission (Top 5)</h3>
                </div>
                <button
                    className="text-[10px] bg-emerald-500 text-slate-900 font-bold px-3 py-1 rounded hover:bg-emerald-400 transition-colors"
                    onClick={onStartPowerMode}
                >
                    START POWER BLOCK
                </button>
            </div>

            <div className="list-container flex-1 overflow-x-auto custom-scrollbar">
                {missionList.length === 0 ? (
                    <div className="empty-state text-xs text-slate-500 italic p-4 text-center">No mission critical tasks. Go hunting.</div>
                ) : (
                    <div className="flex gap-4 pb-2">
                        {missionList.map((item, i) => (
                            <div key={i} className="mission-item min-w-[250px] bg-slate-800/50 p-3 rounded border border-slate-700 flex gap-3 items-start">
                                <div className="mt-1 w-4 h-4 rounded-full border-2 border-slate-600 hover:border-emerald-500 cursor-pointer flex-shrink-0"></div>
                                <div className="mission-content overflow-hidden">
                                    <div className="flex justify-between items-center mb-1 gap-2">
                                        <span className="font-bold text-white text-xs truncate">{item.title}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${item.type === 'risk' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {item.type === 'risk' ? 'DEFEND' : 'ATTACK'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

export default function BusinessDevPage() {
    const { candidates, clients, projects, moneyMoves, updateClient } = useData();
    const bleedRef = useRef(null);

    // UI State
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [floatTarget, setFloatTarget] = useState(null);
    const [isPowerMode, setIsPowerMode] = useState(false);

    // --- 1. HUD METRICS (The Bleed & Growth) ---
    const hudMetrics = useMemo(() => {
        const today = new Date();
        const twoWeeks = new Date();
        twoWeeks.setDate(today.getDate() + 14);

        let bleedValue = 0;
        let bleedCount = 0;

        // Calculate Bleed (Expiring Margin)
        candidates.forEach(c => {
            if (c.status !== 'On Job' || !c.finishDate) return;

            let finish;
            if (typeof c.finishDate === 'string' && c.finishDate.includes('/')) {
                finish = parse(c.finishDate, 'dd/MM/yyyy', new Date());
            } else {
                finish = new Date(c.finishDate);
            }

            if (isValid(finish) && finish >= today && finish <= twoWeeks) {
                const charge = parseFloat(c.chargeRate) || 55;
                const pay = parseFloat(c.payRate) || 35;
                const margin = (charge - (pay * 1.30)) * (parseFloat(c.guaranteedHours) || 40);
                bleedValue += margin;
                bleedCount++;
            }
        });

        return {
            bleedValue: Math.round(bleedValue),
            bleedCount,
            pipelineValue: 24000,
            velocity: "12/40"
        };
    }, [candidates]);

    const handlePitch = (match) => {
        setFloatTarget({
            candidate: match.candidate,
            clientId: match.clientId,
            clientName: match.client,
            projectId: match.projectId,
            projectName: match.project,
            currentPhase: match.phase,
            siteManagerName: "Site Manager"
        });
    };

    const scrollToBleed = () => {
        if (bleedRef.current) {
            bleedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optional: trigger highlight
            bleedRef.current.classList.add('highlight-pulse');
            setTimeout(() => {
                if (bleedRef.current) bleedRef.current.classList.remove('highlight-pulse');
            }, 2000);
        }
    };

    if (isPowerMode) {
        return (
            <>
                <GoldenHourMode />
                <button
                    className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider z-50"
                    onClick={() => setIsPowerMode(false)}
                >
                    Exit Power Mode
                </button>
            </>
        );
    }

    return (
        <div className="hunter-deck flex flex-col h-[calc(100vh-2rem)] overflow-hidden gap-6">
            {/* Header */}
            <header className="deck-header flex-shrink-0 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                        <Target className="text-rose-500" /> THE HUNTER DECK
                    </h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        High Velocity Business Development
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="kpi-pill bg-slate-800 px-3 py-1 rounded border border-slate-700 flex flex-col items-center">
                        <span className="label text-[9px] text-slate-400 uppercase font-bold">CALL VELOCITY</span>
                        <span className="value text-white font-black">{hudMetrics.velocity}</span>
                    </div>
                    <div className="kpi-pill highlight bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 flex flex-col items-center">
                        <span className="label text-[9px] text-emerald-400 uppercase font-bold">PIPELINE ADDED</span>
                        <span className="value text-emerald-400 font-black">+${hudMetrics.pipelineValue.toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* --- TOP ROW: HUD STATS --- */}
            <div className="grid grid-cols-12 gap-6 h-32 flex-shrink-0">
                {/* The Bleed */}
                <div
                    className="col-span-3 glass-panel p-4 flex flex-col justify-between border-l-4 border-l-rose-500 relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={scrollToBleed}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flame size={48} className="text-rose-500" />
                    </div>
                    <div className="flex justify-between items-start z-10">
                        <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={14} /> Retention Risk
                        </h3>
                        <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded">14 Days</span>
                    </div>
                    <div className="z-10">
                        <div className="text-3xl font-black text-white tracking-tight">
                            -${hudMetrics.bleedValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                            Weekly Margin at Risk ({hudMetrics.bleedCount} Workers)
                        </div>
                    </div>
                </div>

                {/* Pipeline Growth */}
                <div
                    className="col-span-3 glass-panel p-4 flex flex-col justify-between border-l-4 border-l-emerald-500 relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => alert('Pipeline Intelligence: Detailed breakdown of the $24k growth coming in next update.')}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={48} className="text-emerald-500" />
                    </div>
                    <div className="flex justify-between items-start z-10">
                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Target size={14} /> Pipeline Added
                        </h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">This Week</span>
                    </div>
                    <div className="z-10">
                        <div className="text-3xl font-black text-white tracking-tight">
                            +${hudMetrics.pipelineValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                            Est. New Gross Margin
                        </div>
                    </div>
                </div>

                {/* Call Velocity */}
                <div
                    className="col-span-3 glass-panel p-4 flex flex-col justify-between border-l-4 border-l-sky-500 relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => alert('Call Log: 12 calls made today. Target is 40. Keep dialing!')}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Phone size={48} className="text-sky-500" />
                    </div>
                    <div className="flex justify-between items-start z-10">
                        <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={14} /> Call Velocity
                        </h3>
                        <span className="bg-sky-500/10 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded">Live</span>
                    </div>
                    <div className="z-10">
                        <div className="text-3xl font-black text-white tracking-tight">
                            {hudMetrics.velocity}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                            Calls Made vs Target
                        </div>
                    </div>
                </div>

                {/* Action Center Link */}
                <div
                    className="col-span-3 bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 transition-all group text-center"
                    onClick={() => setIsPowerMode(true)}
                >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Zap size={24} className="text-secondary" />
                    </div>
                    <span className="text-sm font-black text-secondary uppercase tracking-wider">Start Power Hour</span>
                    <span className="text-[10px] text-secondary/60">Launch High Velocity Mode</span>
                </div>
            </div>

            {/* The Hunter Grid (Bento Layout) */}
            <div className="hunter-grid grid grid-cols-12 gap-6 flex-1 min-h-0">
                <TheBleedWidget
                    candidates={candidates}
                    placements={[]}
                    forwardRef={bleedRef}
                />
                <MatchmakerWidget
                    candidates={candidates}
                    projects={projects}
                    onPitch={handlePitch}
                />
                <RelationshipHeatmap
                    clients={clients}
                    onClientClick={setSelectedClient}
                />
                <PowerBlockWidget
                    clients={clients}
                    moneyMoves={moneyMoves}
                    onStartPowerMode={() => setIsPowerMode(true)}
                />
            </div>

            {/* INTERACTION LAYERS */}

            <ActionDrawer
                isOpen={!!selectedAction}
                nudge={selectedAction}
                onClose={() => setSelectedAction(null)}
            />

            {selectedClient && (
                <ClientSidePanel
                    client={selectedClient}
                    onClose={() => setSelectedClient(null)}
                    onUpdate={(updated) => updateClient(updated)}
                />
            )}

            {floatTarget && (
                <FloatCandidateModal
                    isOpen={!!floatTarget}
                    candidate={floatTarget.candidate}
                    prefilledData={floatTarget}
                    onClose={() => setFloatTarget(null)}
                />
            )}

            <style jsx global>{`
                .hunter-deck {
                    /* Ensures the page fits viewport */
                    height: calc(100vh - 2rem);
                }
                .glass-panel {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                @keyframes highlightPulse {
                    0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(244, 63, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
                }
                
                .highlight-pulse {
                    animation: highlightPulse 2s ease-out;
                    border-color: #f43f5e !important;
                }
            `}</style>
        </div>
    );
}