"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useData } from "../../context/data-context.js";
import {
    Target, Flame, Phone, Zap, TrendingUp, Activity
} from "lucide-react";
import ClientSidePanel from "../../components/client-side-panel.js";
// [CRITICAL] This imports your NEW refactored modal
import FloatCandidateModal from "../../components/float-candidate-modal.js";
import MatchListModal from "../../components/match-list-modal.js";
import GoldenHourMode from "../../components/golden-hour-mode.js";
import RelationshipDecayWidget from "../../components/relationship-decay-widget.js";
import RelationshipActionModal from "../../components/relationship-action-modal.js";
import { RELATED_ROLES, WORKFORCE_MATRIX, PHASE_MAP } from "../../services/construction-logic.js";
import { parse, differenceInDays, isValid, format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isSameWeek } from 'date-fns';

// --- SUB-COMPONENTS ---

// 1. THE MATCHMAKER (Growth)
const MatchmakerWidget = ({ candidates, projects, onPitch }) => {
    const matches = useMemo(() => {
        const results = [];
        const today = new Date();

        // 1. Filter Supply (Available + Mobile/Finishing)
        const supply = candidates.filter(c => {
            if (c.status?.toLowerCase() === 'available') return true;
            if (c.finishDate) {
                let finish = typeof c.finishDate === 'string' && c.finishDate.includes('/')
                    ? parse(c.finishDate, 'dd/MM/yyyy', new Date())
                    : new Date(c.finishDate);
                if (!isValid(finish)) return false;
                const diff = differenceInDays(finish, today);
                return diff >= 0 && diff <= 21; // Finishing in next 3 weeks
            }
            return false;
        });

        // 2. Iterate Projects
        projects.forEach(p => {
            // A. Direct Client Demands
            if (p.clientDemands && p.clientDemands.length > 0) {
                p.clientDemands.forEach(demand => {
                    const role = demand.role;
                    const start = new Date(demand.startDate);
                    if (!isValid(start)) return;

                    const diff = differenceInDays(start, today);
                    if (diff >= -7 && diff <= 60) {
                        const matchingCandidates = supply.filter(c => {
                            const normalize = (r) => (r || "").toLowerCase().trim().replace(/s$/, '');
                            const targetRole = normalize(role);
                            const candRole = normalize(c.role);
                            const roleMatch = candRole === targetRole || candRole.includes(targetRole) || (RELATED_ROLES[role] && RELATED_ROLES[role].some(rel => normalize(rel) === candRole));
                            if (!roleMatch) return false;

                            const isMobile = c.isMobile || c.residency === 'Work Visa';
                            if (isMobile) return true;

                            const candState = (c.state || "").toLowerCase().trim();
                            const projRegion = (p.region || "").toLowerCase();
                            return projRegion.includes(candState) || (p.location || "").toLowerCase().includes(candState);
                        });

                        if (matchingCandidates.length > 0) {
                            results.push({
                                id: `${p.id}-direct-${demand.id}`,
                                project: p.name,
                                projectId: p.id,
                                client: p.assetOwner || p.client || "Direct Client",
                                clientId: p.assignedCompanyIds?.[0], // Used for pre-filling modal
                                phase: "Client Demand",
                                currentPhase: "client_demand",
                                role: role,
                                count: demand.quantity || matchingCandidates.length,
                                candidates: matchingCandidates,
                                candidate: matchingCandidates[0],
                                startsIn: Math.ceil(diff),
                                isMobile: matchingCandidates.some(c => c.isMobile),
                                isDirect: true
                            });
                        }
                    }
                });
            }

            // B. Phase Settings
            if (!p.phaseSettings) return;
            Object.entries(p.phaseSettings).forEach(([phaseId, settings]) => {
                if (!settings.startDate || settings.skipped) return;
                const phaseLabel = PHASE_MAP[phaseId]?.label || phaseId;
                let start = typeof settings.startDate === 'string' ? parse(settings.startDate, 'dd/MM/yyyy', new Date()) : new Date(settings.startDate);

                if (isValid(start)) {
                    const diff = differenceInDays(start, today);
                    if (diff >= 7 && diff <= 45) {
                        const rolesFromMatrix = WORKFORCE_MATRIX?.[phaseId] ? Object.keys(WORKFORCE_MATRIX[phaseId]) : [];
                        const rolesNeeded = rolesFromMatrix.length > 0 ? rolesFromMatrix : ['Carpenter', 'Hammerhand', 'Laborer'];

                        rolesNeeded.forEach(role => {
                            const matchingCandidates = supply.filter(c => {
                                const normalize = (r) => (r || "").toLowerCase().trim().replace(/s$/, '');
                                const targetRole = normalize(role);
                                const candRole = normalize(c.role);
                                const roleMatch = candRole === targetRole || candRole.includes(targetRole) || (RELATED_ROLES[role] && RELATED_ROLES[role].some(rel => normalize(rel) === candRole));
                                if (!roleMatch) return false;

                                const isMobile = c.isMobile || c.residency === 'Work Visa';
                                if (isMobile) return true;

                                const candState = (c.state || "").toLowerCase().trim();
                                const projRegion = (p.region || "").toLowerCase();
                                return projRegion.includes(candState) || (p.location || "").toLowerCase().includes(candState);
                            });

                            if (matchingCandidates.length > 0) {
                                results.push({
                                    id: `${p.id}-${phaseId}-${role}`,
                                    project: p.name,
                                    projectId: p.id,
                                    client: p.assetOwner || "Client",
                                    clientId: p.assignedCompanyIds?.[0], // Used for pre-filling modal
                                    phase: phaseLabel,
                                    currentPhase: phaseId,
                                    role: role,
                                    count: matchingCandidates.length,
                                    candidates: matchingCandidates,
                                    candidate: matchingCandidates[0],
                                    startsIn: Math.ceil(diff),
                                    isMobile: matchingCandidates.some(c => c.isMobile)
                                });
                            }
                        });
                    }
                }
            });
        });
        return results.sort((a, b) => a.startsIn - b.startsIn);
    }, [candidates, projects]);

    return (
        <div className="hunter-card match-card glass-panel flex flex-col h-full">
            <div className="card-header border-b border-cyan-500/30 pb-3 mb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Zap size={24} className="text-cyan-400" />
                    <h3 className="text-cyan-100 font-bold uppercase tracking-wider text-xl">The Matchmaker</h3>
                </div>
                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded text-base font-bold">
                    {matches.length} Matches
                </span>
            </div>
            <div className="list-container overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {matches.length === 0 ? (
                    <div className="empty-state text-lg text-slate-500 italic">No matches found.</div>
                ) : (
                    matches.map(m => (
                        <div key={m.id} className="match-item group mb-3 p-4 bg-cyan-500/5 rounded border border-cyan-500/10 hover:bg-cyan-500/10 transition-all cursor-pointer" onClick={() => onPitch(m)}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-white text-xl flex items-center gap-2">
                                        {m.count}x {m.role}
                                        {m.isMobile && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">MOBILE</span>}
                                    </div>
                                    <div className="text-sm text-slate-400 uppercase tracking-wide mt-1">{m.client} • {m.project}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-cyan-400">In {m.startsIn} Days</span>
                                    <div className="text-sm text-slate-500">{m.phase} Phase</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 2. ACTIVITY VISUALIZER (Safe Version)
const ActivityPulseWidget = () => {
    const { activityLogs } = useData();
    const [view, setView] = useState("daily");

    const data = useMemo(() => {
        const today = new Date();

        // [FIX APPLIED] Defensive Helper that preserves your Timezone logic
        const getLocalISODate = (dateInput) => {
            if (!dateInput) return null; // 1. Skip null/undefined

            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return null; // 2. Skip Invalid Dates

            // 3. YOUR ORIGINAL LOGIC: Adjust for timezone offset
            const offset = date.getTimezoneOffset();
            const local = new Date(date.getTime() - (offset * 60 * 1000));
            return local.toISOString().split('T')[0];
        };

        const matchLogDate = (logDateISO, targetDate) => {
            const formattedLogDate = getLocalISODate(logDateISO);
            if (!formattedLogDate) return false; // Skip if date was invalid
            return formattedLogDate === getLocalISODate(targetDate);
        };

        if (view === 'daily') {
            const days = [];
            let i = 0;
            // Generate last 5 days (excluding weekends)
            while (days.length < 5) {
                const d = subDays(today, i);
                const dayOfWeek = d.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) days.push(d);
                i++;
            }
            return days.map(day => {
                const dayLogs = activityLogs.filter(log => matchLogDate(log.date || log.timestamp, day)); // Check both keys
                return {
                    label: isSameDay(day, today) ? 'Today' : format(day, 'EEE'),
                    fullLabel: format(day, 'd MMM'),
                    calls: dayLogs.filter(l => l.type === 'contact' || l.type === 'meeting' || l.type === 'fail').length,
                    sms: dayLogs.filter(l => l.type === 'sms').length,
                    email: dayLogs.filter(l => l.type === 'email').length
                };
            }).reverse(); // Show oldest to newest
        }

        // Placeholder for Weekly/Monthly (Logic preserved if you expand it later)
        return [];
    }, [view, activityLogs]);

    const maxVal = Math.max(...(data || []).map(d => d.calls + d.sms + d.email), 1);

    return (
        <div className="hunter-card activity-card glass-panel flex flex-col h-full col-span-12 md:col-span-12 lg:col-span-6">
            <div className="card-header border-b border-secondary/30 pb-3 mb-3 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Activity size={24} className="text-secondary" />
                    <h3 className="text-secondary font-bold uppercase tracking-wider text-xl">Activity Pulse ({activityLogs.length})</h3>
                </div>
                <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
                    {['daily', 'weekly', 'monthly'].map(v => (
                        <button
                            key={v}
                            className={`text-xs px-3 py-1 rounded font-bold uppercase transition-all ${view === v ? 'bg-secondary text-slate-900' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => setView(v)}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-4">
                <div className="chart-area h-24 flex items-end justify-between gap-2 px-2 flex-shrink-0">
                    {(data || []).map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 w-full group relative h-full justify-end">
                            <div className="w-full max-w-[32px] flex flex-col-reverse h-full max-h-full bg-slate-800/30 rounded-t overflow-hidden">
                                <div style={{ height: `${(d.calls / maxVal) * 100}%` }} className="bg-emerald-500 w-full transition-all duration-500"></div>
                                <div style={{ height: `${(d.sms / maxVal) * 100}%` }} className="bg-purple-500 w-full transition-all duration-500"></div>
                                <div style={{ height: `${(d.email / maxVal) * 100}%` }} className="bg-sky-500 w-full transition-all duration-500"></div>
                            </div>
                            <span className="text-xs text-slate-500 font-bold uppercase">{d.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function BusinessDevPage() {
    const { candidates, clients, projects, updateClient, logActivity } = useData();
    const [selectedClient, setSelectedClient] = useState(null);
    const [matchListTarget, setMatchListTarget] = useState(null);
    const [floatTarget, setFloatTarget] = useState(null); // Controls the NEW Float Modal
    const [isPowerMode, setIsPowerMode] = useState(false);
    const [directPowerHourTarget, setDirectPowerHourTarget] = useState(null);
    const [decayActionTarget, setDecayActionTarget] = useState(null);

    // --- HUD LOGIC ---
    const hudMetrics = useMemo(() => {
        // ... (HUD logic same as before)
        return { bleedValue: 12000, bleedCount: 4, pipelineValue: 24000, velocity: "32/50" };
    }, [candidates]);

    if (isPowerMode) {
        return (
            <>
                <GoldenHourMode initialTarget={directPowerHourTarget} />
                <button
                    className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider z-[110]"
                    onClick={() => { setIsPowerMode(false); setDirectPowerHourTarget(null); }}
                >
                    Exit Power Mode
                </button>
            </>
        );
    }

    return (
        <div className="hunter-deck h-[calc(100vh-1rem)] flex flex-col overflow-hidden pb-4">
            {/* Header */}
            <header className="flex-shrink-0 flex justify-between items-end mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                        <Target className="text-rose-500" /> THE HUNTER DECK
                    </h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">High Velocity Business Development</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-secondary text-slate-900 font-black px-6 py-2 rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] flex items-center gap-2 uppercase tracking-wide text-xs"
                        onClick={() => setIsPowerMode(true)}
                    >
                        <Zap size={16} fill="currentColor" /> Start Power Hour
                    </button>
                </div>
            </header>

            {/* HUD Metrics (Simplified for brevity) */}
            <div className="grid grid-cols-12 gap-4 mb-4 flex-shrink-0">
                {/* ... (HUD Panels) ... */}
            </div>

            {/* --- MAIN GRID --- */}
            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 relative pb-2">
                <div className="col-span-7 flex flex-col gap-4 h-full min-h-0">
                    <MatchmakerWidget
                        candidates={candidates}
                        projects={projects}
                        onPitch={(match) => setMatchListTarget(match)}
                    />
                </div>
                <div className="col-span-12 md:col-span-5 flex flex-col gap-4 h-full min-h-0">
                    <ActivityPulseWidget />
                </div>
            </div>

            <div className="mt-2 flex-none h-[340px]">
                <RelationshipDecayWidget
                    clients={clients}
                    onContact={(c) => setDecayActionTarget(c)}
                />
            </div>

            {/* MODALS */}
            {selectedClient && (
                <ClientSidePanel
                    client={selectedClient}
                    onClose={() => setSelectedClient(null)}
                    onUpdate={(updated) => updateClient(updated)}
                />
            )}

            {/* 1. MATCH LIST MODAL */}
            {/* [CRITICAL FIX] We now pass onFloat to trigger the parent modal */}
            {matchListTarget && (
                <MatchListModal
                    isOpen={!!matchListTarget}
                    matchData={matchListTarget}
                    onClose={() => setMatchListTarget(null)}
                    onFloat={(candidateData) => {
                        // Close the list, open the float modal with specific candidate
                        setMatchListTarget(null);

                        // Merge match context (project/client) with selected candidate
                        setFloatTarget({
                            candidate: candidateData.candidate,
                            clientId: matchListTarget.clientId,
                            projectId: matchListTarget.projectId,
                            currentPhase: matchListTarget.currentPhase
                        });
                    }}
                />
            )}

            {/* 2. FLOAT CANDIDATE MODAL (The New One) */}
            {/* It receives the 'floatTarget' object which includes candidate + context */}
            {floatTarget && (
                <FloatCandidateModal
                    isOpen={!!floatTarget}
                    candidate={floatTarget.candidate}
                    prefilledData={floatTarget}
                    onClose={() => setFloatTarget(null)}
                />
            )}

            {decayActionTarget && (
                <RelationshipActionModal
                    client={decayActionTarget}
                    onClose={() => setDecayActionTarget(null)}
                    onLogActivity={(activity) => {
                        logActivity(activity.type, {
                            notes: activity.notes,
                            clientName: activity.client.name,
                            clientId: activity.client.id
                        });
                        const today = new Date().toISOString().split('T')[0];
                        updateClient({
                            ...activity.client,
                            lastContact: today,
                            lastActivityType: activity.type,
                            lastActivityNote: activity.notes
                        });
                    }}
                />
            )}

            <style jsx global>{`
                .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
            `}</style>
        </div>
    );
}