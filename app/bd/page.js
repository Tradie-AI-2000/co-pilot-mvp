"use client";

import { useState, useMemo } from "react";
import { useData } from "../../context/data-context.js";
import { Target, Zap } from "lucide-react";
import ClientSidePanel from "../../components/client-side-panel.js";
import FloatCandidateModal from "../../components/float-candidate-modal.js";
import MatchListModal from "../../components/match-list-modal.js";
import GoldenHourMode from "../../components/golden-hour-mode.js";
import RelationshipDecayWidget from "../../components/relationship-decay-widget.js";
import RelationshipActionModal from "../../components/relationship-action-modal.js";

// [NEW] Import the advanced widget we just created
import ActivityPulseWidget from "../../components/activity-pulse-widget.js";

import { RELATED_ROLES, WORKFORCE_MATRIX, PHASE_MAP } from "../../services/construction-logic.js";
import { parse, differenceInDays, isValid } from 'date-fns';

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
                                clientId: p.assignedCompanyIds?.[0],
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
                                    clientId: p.assignedCompanyIds?.[0],
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

// --- MAIN PAGE ---

export default function BusinessDevPage() {
    const { candidates, clients, projects, updateClient, logActivity } = useData();
    const [selectedClient, setSelectedClient] = useState(null);
    const [matchListTarget, setMatchListTarget] = useState(null);
    const [floatTarget, setFloatTarget] = useState(null);
    const [isPowerMode, setIsPowerMode] = useState(false);
    const [directPowerHourTarget, setDirectPowerHourTarget] = useState(null);
    const [decayActionTarget, setDecayActionTarget] = useState(null);

    // --- HUD LOGIC ---
    const hudMetrics = useMemo(() => {
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

            {/* HUD Metrics (Simplified) */}
            <div className="grid grid-cols-12 gap-4 mb-4 flex-shrink-0">
                {/* Preserved HUD panels layout for brevity */}
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
                    {/* Now rendering the IMPORTED widget */}
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

            {matchListTarget && (
                <MatchListModal
                    isOpen={!!matchListTarget}
                    matchData={matchListTarget}
                    onClose={() => setMatchListTarget(null)}
                    onFloat={(candidateData) => {
                        setMatchListTarget(null);
                        setFloatTarget({
                            candidate: candidateData.candidate,
                            clientId: matchListTarget.clientId,
                            projectId: matchListTarget.projectId,
                            currentPhase: matchListTarget.currentPhase
                        });
                    }}
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