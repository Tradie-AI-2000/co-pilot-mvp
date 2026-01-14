"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useData } from "../../context/data-context.js";
import {
    Target, Flame, MapPin, Phone, ArrowRight, Zap,
    TrendingUp, AlertTriangle, CheckCircle, Clock,
    Briefcase, Calendar, DollarSign, X, Filter, User,
    BarChart2, Activity, MessageSquare, Mail
} from "lucide-react";
import ActionDrawer from "../../components/action-drawer.js";
import ClientSidePanel from "../../components/client-side-panel.js";
import FloatCandidateModal from "../../components/float-candidate-modal.js";
import GoldenHourMode from "../../components/golden-hour-mode.js";
import RelationshipDecayWidget from "../../components/relationship-decay-widget.js";
import RelationshipActionModal from "../../components/relationship-action-modal.js";
import { RELATED_ROLES, WORKFORCE_MATRIX, PHASE_MAP } from "../../services/construction-logic.js";
import { parse, differenceInDays, isValid, format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, startOfMonth, endOfMonth, isSameWeek, subMonths } from 'date-fns';

// --- SUB-COMPONENTS ---

// 1. THE BLEED (Retention Risk)
const TheBleedWidget = ({ candidates, forwardRef }) => {
    const bleedMetrics = useMemo(() => {
        const today = new Date();
        const twoWeeks = new Date();
        twoWeeks.setDate(today.getDate() + 14);
        let weeklyMarginAtRisk = 0;
        let count = 0;
        let criticalList = [];

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
        <div ref={forwardRef} className="hunter-card bleed-card glass-panel flex flex-col h-full">
            <div className="card-header border-b border-rose-500/30 pb-3 mb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Flame size={18} className="text-rose-500 animate-pulse" />
                    <h3 className="text-rose-100 font-bold uppercase tracking-wider text-xs">The Bleed (14 Days)</h3>
                </div>
                <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    -{bleedMetrics.count} Heads
                </span>
            </div>
            <div className="main-metric text-rose-500 text-3xl font-black mb-4">
                -${bleedMetrics.value.toLocaleString()}
                <span className="text-sm text-rose-400/50 font-medium ml-1">/wk GP</span>
            </div>
            <div className="list-container overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {bleedMetrics.list.length === 0 ? (
                    <div className="empty-state text-xs text-slate-500 italic">No imminent retention risks.</div>
                ) : (
                    bleedMetrics.list.map(item => (
                        <div key={item.id} className="list-item mb-2 p-3 bg-rose-500/5 rounded border border-rose-500/10 hover:border-rose-500/30 transition-colors">
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-200 text-xs">{item.name}</span>
                                <span className="text-rose-400 text-xs font-mono">-${item.value}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                                <span>{item.role} @ {item.project}</span>
                                <span>{format(item.finishDate, 'd MMM')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 2. THE MATCHMAKER (Growth)
const MatchmakerWidget = ({ candidates, projects, onPitch }) => {
    const matches = useMemo(() => {
        const results = [];
        const today = new Date();

        // 1. Filter Supply (Available + Mobile/Finishing)
        const supply = candidates.filter(c => {
            if (c.status === 'Available') return true;
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

        // 2. Iterate Projects via phaseSettings
        projects.forEach(p => {
            if (!p.phaseSettings) return;

            Object.entries(p.phaseSettings).forEach(([phaseId, settings]) => {
                if (!settings.startDate || settings.skipped) return;

                const phaseLabel = PHASE_MAP[phaseId]?.label || phaseId;

                let start = typeof settings.startDate === 'string' && settings.startDate.includes('/')
                    ? parse(settings.startDate, 'dd/MM/yyyy', new Date())
                    : new Date(settings.startDate);

                if (isValid(start)) {
                    const diff = differenceInDays(start, today);

                    // Match Window: 7 to 45 days out
                    if (diff >= 7 && diff <= 45) {
                        // Get Roles from Matrix or fallbacks
                        const rolesFromMatrix = WORKFORCE_MATRIX?.[phaseId] ? Object.keys(WORKFORCE_MATRIX[phaseId]) : [];
                        const rolesNeeded = rolesFromMatrix.length > 0 ? rolesFromMatrix : ['Carpenter', 'Hammerhand', 'Laborer'];

                        rolesNeeded.forEach(role => {
                            const matchingCandidates = supply.filter(c => {
                                // Role Match (Direct or Related)
                                const roleMatch = c.role === role || (RELATED_ROLES[role] && RELATED_ROLES[role].includes(c.role));
                                if (!roleMatch) return false;

                                // Location Match (Mobile/Visa Crew bypass location check)
                                const isMobile = c.isMobile || c.residency === 'Work Visa' || c.country === 'Philippines';
                                if (isMobile) return true;

                                // Local Candidates must match region/address
                                return p.region && c.state && (p.region === c.state || p.address?.includes(c.state));
                            });

                            if (matchingCandidates.length > 0) {
                                results.push({
                                    id: `${p.id}-${phaseId}-${role}`,
                                    project: p.name,
                                    projectId: p.id,
                                    client: p.assetOwner || "Client", // Fallback
                                    clientId: p.assignedCompanyIds?.[0], // For Modal
                                    phase: phaseLabel,
                                    currentPhase: phaseId, // Passthrough for Modal logic
                                    role: role,
                                    count: matchingCandidates.length,
                                    candidate: matchingCandidates[0], // Prime candidate for modal pre-fill
                                    startsIn: Math.ceil(diff),
                                    isMobile: matchingCandidates.some(c => c.isMobile || c.residency === 'Work Visa')
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

// 3. ACTIVITY VISUALIZER (NEW COMPONENT)
const ActivityPulseWidget = () => {
    const { activityLogs } = useData(); // Get logs from context
    const [view, setView] = useState("daily"); // Default to 'daily' for immediate feedback

    // Aggregation Logic
    const data = useMemo(() => {
        const today = new Date();
        const getLocalISODate = (date) => {
            const offset = date.getTimezoneOffset();
            const local = new Date(date.getTime() - (offset * 60 * 1000));
            return local.toISOString().split('T')[0];
        };

        const todayStr = getLocalISODate(today);

        // Helper: Robust Date Match
        const matchLogDate = (logDateISO, targetDate) => {
            // Parse log date (UTC ISO) to local YYYY-MM-DD for comparison
            const d = new Date(logDateISO);
            const logLocal = getLocalISODate(d);
            const targetLocal = getLocalISODate(targetDate);
            return logLocal === targetLocal;
        };

        if (view === 'daily') {
            // Show last 5 weekdays including today
            const days = [];
            let i = 0;
            while (days.length < 5) {
                const d = subDays(today, i);
                const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    days.push(d);
                }
                i++;
            }
            // Reverse so it's oldest to newest for the array map, but wait, the existing code mapped [4,3,2,1,0] then reverse()d later for listData.
            // Actually the current map order is efficient for chart.
            // Let's keep the order consistent: Array of Date objects.

            return days.map(day => {
                const dayLogs = activityLogs.filter(log => matchLogDate(log.date, day));
                return {
                    label: isSameDay(day, today) ? 'Today' : format(day, 'EEE'),
                    fullLabel: format(day, 'd MMM'),
                    calls: dayLogs.filter(l => l.type === 'contact' || l.type === 'meeting' || l.type === 'fail').length,
                    sms: dayLogs.filter(l => l.type === 'sms').length,
                    email: dayLogs.filter(l => l.type === 'email').length
                };
            });
        }

        if (view === 'weekly') {
            const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
            const end = endOfWeek(today, { weekStartsOn: 1 });
            const days = eachDayOfInterval({ start, end }).filter(d => {
                const day = d.getDay();
                return day !== 0 && day !== 6; // Exclude Sun (0) and Sat (6)
            });

            return days.map(day => {
                const dayLogs = activityLogs.filter(log => matchLogDate(log.date, day));
                return {
                    label: format(day, 'EEE'),
                    fullLabel: format(day, 'd MMM'),
                    calls: dayLogs.filter(l => l.type === 'contact' || l.type === 'meeting' || l.type === 'fail').length, // 'contact' is from GoldenHour
                    sms: dayLogs.filter(l => l.type === 'sms').length,
                    email: dayLogs.filter(l => l.type === 'email').length
                };
            });
        } else {
            // Monthly view (last 4 weeks)
            const weeks = [0, 1, 2, 3].map(n => {
                const weekStart = subDays(startOfWeek(today, { weekStartsOn: 1 }), n * 7);
                return {
                    label: `Wk ${format(weekStart, 'w')}`,
                    fullLabel: `Week of ${format(weekStart, 'd MMM')}`,
                    start: weekStart
                };
            }).reverse();

            return weeks.map(week => {
                const weekLogs = activityLogs.filter(log => isSameWeek(parseISO(log.date), week.start, { weekStartsOn: 1 }));
                return {
                    label: week.label,
                    fullLabel: week.fullLabel,
                    calls: weekLogs.filter(l => l.type === 'contact' || l.type === 'meeting' || l.type === 'fail').length,
                    sms: weekLogs.filter(l => l.type === 'sms').length,
                    email: weekLogs.filter(l => l.type === 'email').length
                };
            });
        }
    }, [view, activityLogs]);

    // Jarvis Logic
    const jarvisInsight = useMemo(() => {
        const totalCalls = data.reduce((acc, d) => acc + d.calls, 0);
        if (totalCalls > 150) return "🔥 You are on fire! Call volume is elite. Convert these to meetings.";
        if (totalCalls < 100 && (view === 'weekly' || view === 'monthly')) return "⚠️ Call volume is slightly low. Try a 'Power Hour' to boost numbers.";
        if (view === 'daily' && totalCalls > 30) return "🚀 Great daily momentum. Keep pushing!";
        return "✅ Consistent activity. Your SMS follow-up rate is improving.";
    }, [data, view]);

    const maxVal = Math.max(...data.map(d => d.calls + d.sms + d.email), 1); // Ensure maxVal is at least 1 to avoid NaN
    const listData = [...data].reverse();

    return (
        <div className="hunter-card activity-card glass-panel flex flex-col h-full col-span-12 md:col-span-12 lg:col-span-6">
            <div className="card-header border-b border-secondary/30 pb-3 mb-3 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Activity size={24} className="text-secondary" />
                    <h3 className="text-secondary font-bold uppercase tracking-wider text-xl">Activity Pulse ({activityLogs.length})</h3>
                </div>
                <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
                    <button
                        className={`text-xs px-3 py-1 rounded font-bold transition-all ${view === 'daily' ? 'bg-secondary text-slate-900' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setView('daily')}
                    >
                        DAY
                    </button>
                    <button
                        className={`text-xs px-3 py-1 rounded font-bold transition-all ${view === 'weekly' ? 'bg-secondary text-slate-900' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setView('weekly')}
                    >
                        WEEK
                    </button>
                    <button
                        className={`text-xs px-3 py-1 rounded font-bold transition-all ${view === 'monthly' ? 'bg-secondary text-slate-900' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setView('monthly')}
                    >
                        MONTH
                    </button>
                </div>
            </div>

            {/* CONTENT CONTAINER - Flex Column */}
            <div className="flex flex-col flex-1 min-h-0 gap-4">

                {/* 1. VISUAL CHART (Fixed Height) */}
                <div className="chart-area h-24 flex items-end justify-between gap-2 px-2 flex-shrink-0">
                    {data.map((d, i) => (
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

                {/* 2. DATA GRID (Scrollable) */}
                <div className="grid-area flex-1 overflow-y-auto custom-scrollbar border-t border-slate-700/50 pt-2 relative min-h-0">
                    <table className="w-full text-left border-collapse relative">
                        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md z-20 shadow-sm">
                            <tr className="text-sm uppercase text-slate-500 border-b border-slate-700/50">
                                <th className="pb-2 pl-2 font-bold">Timeframe</th>
                                <th className="pb-2 text-center font-bold text-emerald-500">Calls</th>
                                <th className="pb-2 text-center font-bold text-purple-500">SMS</th>
                                <th className="pb-2 text-center font-bold text-sky-500">Emails</th>
                                <th className="pb-2 pr-2 text-right font-bold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listData.map((d, i) => (
                                <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors group">
                                    <td className="py-3 pl-2 text-base font-bold text-slate-300 group-hover:text-white">
                                        <div className="flex flex-col">
                                            <span>{d.label}</span>
                                            {d.fullLabel !== d.label && <span className="text-xs text-slate-500 font-normal">{d.fullLabel}</span>}
                                        </div>
                                    </td>
                                    <td className="py-3 text-center text-base font-mono text-emerald-400 bg-emerald-500/5 rounded-sm">{d.calls}</td>
                                    <td className="py-3 text-center text-base font-mono text-purple-400 bg-purple-500/5 rounded-sm">{d.sms}</td>
                                    <td className="py-3 text-center text-base font-mono text-sky-400 bg-sky-500/5 rounded-sm">{d.email}</td>
                                    <td className="py-3 pr-2 text-right text-base font-black text-white">{d.calls + d.sms + d.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. INSIGHT (Fixed Bottom) */}
                <div className="jarvis-bar pt-3 border-t border-slate-700 flex items-start gap-4 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center flex-shrink-0">
                        <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Co-Pilot Insight</span>
                        <p className="text-base text-slate-300 leading-snug">{jarvisInsight}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function BusinessDevPage() {
    const { candidates, clients, projects, updateClient, logActivity } = useData();
    const [selectedClient, setSelectedClient] = useState(null);
    const [floatTarget, setFloatTarget] = useState(null);
    const [isPowerMode, setIsPowerMode] = useState(false);
    const [directPowerHourTarget, setDirectPowerHourTarget] = useState(null);
    const [decayActionTarget, setDecayActionTarget] = useState(null);

    // --- HUD LOGIC ---
    const hudMetrics = useMemo(() => {
        const today = new Date();
        const twoWeeks = new Date();
        twoWeeks.setDate(today.getDate() + 14);
        let bleedValue = 0;
        let bleedCount = 0;

        candidates.forEach(c => {
            if (c.status !== 'On Job' || !c.finishDate) return;
            let finish = typeof c.finishDate === 'string' && c.finishDate.includes('/')
                ? parse(c.finishDate, 'dd/MM/yyyy', new Date())
                : new Date(c.finishDate);
            if (isValid(finish) && finish >= today && finish <= twoWeeks) {
                const charge = parseFloat(c.chargeRate) || 55;
                const pay = parseFloat(c.payRate) || 35;
                bleedValue += (charge - (pay * 1.30)) * (parseFloat(c.guaranteedHours) || 40);
                bleedCount++;
            }
        });

        return {
            bleedValue: Math.round(bleedValue),
            bleedCount,
            pipelineValue: 24000,
            velocity: "32/50"
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

    if (isPowerMode) {
        return (
            <>
                <GoldenHourMode initialTarget={directPowerHourTarget} />
                <button
                    className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider z-[110]"
                    onClick={() => {
                        setIsPowerMode(false);
                        setDirectPowerHourTarget(null);
                    }}
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
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        High Velocity Business Development
                    </p>
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

            {/* --- TOP ROW: HUD METRICS --- */}
            <div className="grid grid-cols-12 gap-4 mb-4 flex-shrink-0">
                <div className="col-span-4 glass-panel p-4 border-l-4 border-l-rose-500 relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                            Retention Risk
                        </h3>
                        <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded">14 Days</span>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        -${hudMetrics.bleedValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-1">
                        GP at Risk ({hudMetrics.bleedCount} Workers)
                    </div>
                    <Flame size={64} className="absolute -bottom-4 -right-4 text-rose-500/10 group-hover:text-rose-500/20 transition-all" />
                </div>

                <div className="col-span-4 glass-panel p-4 border-l-4 border-l-emerald-500 relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            Pipeline Added
                        </h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">This Week</span>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        +${hudMetrics.pipelineValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-1">
                        Est. New Gross Margin
                    </div>
                    <TrendingUp size={64} className="absolute -bottom-4 -right-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all" />
                </div>

                <div className="col-span-4 glass-panel p-4 border-l-4 border-l-sky-500 relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 mb-2">
                        <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                            Call Velocity
                        </h3>
                        <span className="bg-sky-500/10 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded">Live</span>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        {hudMetrics.velocity}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-1">
                        Calls Made vs Target
                    </div>
                    <Phone size={64} className="absolute -bottom-4 -right-4 text-sky-500/10 group-hover:text-sky-500/20 transition-all" />
                </div>
            </div>

            {/* --- MAIN GRID (BENTO LAYOUT) --- */}
            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 relative pb-2">
                {/* COLUMN 1: RISKS (HIDDEN AS PER REQUEST) */}
                {/* <div className="col-span-3 flex flex-col gap-4 h-full">
                    <TheBleedWidget candidates={candidates} />
                </div> */}

                {/* COLUMN 2: OPPORTUNITIES (Expanded) */}
                <div className="col-span-7 flex flex-col gap-4 h-full min-h-0">
                    <MatchmakerWidget candidates={candidates} projects={projects} onPitch={handlePitch} />
                </div>

                {/* COLUMN 3: ACTIVITY & CRM (Expanded) */}
                <div className="col-span-12 md:col-span-5 flex flex-col gap-4 h-full min-h-0">
                    <ActivityPulseWidget />
                </div>
            </div>

            {/* --- BOTTOM ROW: RELATIONSHIP DECAY --- */}
            <div className="mt-2 flex-none h-[340px]">
                <RelationshipDecayWidget
                    clients={clients}
                    onContact={(c) => {
                        setDecayActionTarget(c);
                    }}
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

            {/* Relationship Action Modal */}
            {decayActionTarget && (
                <RelationshipActionModal
                    client={decayActionTarget}
                    onClose={() => setDecayActionTarget(null)}
                    onLogActivity={(activity) => {
                        // 1. Log Activity to Pulse
                        logActivity(activity.type, {
                            notes: activity.notes,
                            clientName: activity.client.name,
                            clientId: activity.client.id
                        });

                        // 2. Update Client (Clear Risk)
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

            {floatTarget && (
                <FloatCandidateModal
                    isOpen={!!floatTarget}
                    candidate={floatTarget.candidate}
                    prefilledData={floatTarget}
                    onClose={() => setFloatTarget(null)}
                />
            )}

            <style jsx global>{`
                .glass-panel {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}