"use client";

import { useState, useEffect, useMemo } from "react";
import { useData } from "../../context/data-context.js";
import { Phone, CheckCircle, XCircle, Clock, Zap, Calendar, MessageSquare, ArrowRight, Trophy, Flame, History, Mail, MessageCircle, Play, Send, FileText, Coffee, HardHat, Users, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { mockLeads } from "../../services/enhanced-mock-data.js";
import { generateCallScript } from "../../services/growth-logic.js";

// --- TEMPLATES CONFIGURATION ---
export const RECOVERY_CONTEXTS = [
    {
        id: 'follow_up',
        label: 'Placement Check',
        icon: Users,
        sms: "Hi [Contact], just checking in on the crew we sent to [Project]. All running smoothly?",
        email: "Hi [Contact],\n\nQuick check-in regarding the team at [Project].\n\nAre they hitting the mark? Let me know if you need any adjustments.\n\nBest,\n[Recruiter]"
    },
    {
        id: 'labor_needs',
        label: 'Labour Needs',
        icon: HardHat,
        sms: "Hi [Contact], [Recruiter] here. We have 2 experienced carpenters finishing up nearby next week. Need any extra hands?",
        email: "Hi [Contact],\n\nI'm mapping out availability for next week and have a strong finishing squad becoming available.\n\nDo you have any gaps in the roster coming up?\n\nBest,\n[Recruiter]"
    },
    {
        id: 'social',
        label: 'Coffee / Lunch',
        icon: Coffee,
        sms: "Hi [Contact], long time. I'm in the area next Tuesday - free for a quick coffee/beer?",
        email: "Hi [Contact],\n\nIt's been a while! I'm going to be near [Location] next week.\n\nKeen to grab a quick lunch or coffee to catch up?\n\nCheers,\n[Recruiter]"
    },
    {
        id: 'ssa',
        label: 'SSA Booking',
        icon: FileText,
        sms: "Hi [Contact], urgent one - need 5 mins to clear the Site Safety Assessment for [Project] so we can deploy. When are you free?",
        email: "Hi [Contact],\n\nCompliance requires us to update the Site Safety Assessment for [Project] before we can send more guys.\n\nIt will only take 5 minutes over the phone. What time works for you?\n\nThanks,\n[Recruiter]"
    }
];

export default function GoldenHourMode(props) {
    const { clients, logActivity, updateClient } = useData();

    // Session State
    const [sessionStatus, setSessionStatus] = useState("lobby");
    const [selectedMode, setSelectedMode] = useState(null);
    const [queue, setQueue] = useState([]);

    // Action State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [callState, setCallState] = useState("idle"); // idle, success_input, recovery, drafting, logged
    const [isScriptExpanded, setIsScriptExpanded] = useState(false);

    // Drafting State
    const [draftingMode, setDraftingMode] = useState(null); // 'sms' or 'email'
    const [draftMessage, setDraftMessage] = useState("");

    // Success Input State
    const [callNote, setCallNote] = useState("");
    const [followUpTask, setFollowUpTask] = useState("");

    // Metrics
    const [streak, setStreak] = useState(0);
    const [sessionScore, setSessionScore] = useState(0);
    const [timer, setTimer] = useState(3600);

    // --- 1. THE LOBBY LOGIC ---
    const getDaysSilence = (dateString) => {
        if (!dateString || dateString === 'Never') return 999;
        let last;
        if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            last = new Date(`${year}-${month}-${day}`);
        } else {
            last = new Date(dateString);
        }
        if (isNaN(last.getTime())) return 999;
        const today = new Date();
        return Math.floor((today - last) / (1000 * 60 * 60 * 24));
    };

    const playlists = useMemo(() => {
        const p1 = [], p2 = [], p3 = [];
        const realClients = clients || [];
        const pool = [...realClients.map(c => ({ ...c, type: 'CLIENT' })), ...mockLeads.map(l => ({ ...l, type: 'LEAD', isLead: true }))];

        pool.forEach(c => {
            const dateToUse = c.lastContact || c.lastContacted;
            const days = getDaysSilence(dateToUse);
            let rawTier = c.tier ? c.tier.toString() : '3';
            const tier = rawTier.replace('Tier ', '').trim();
            const isLead = c.type === 'LEAD';

            if (!isLead && tier === '1' && days > 30) {
                p1.push({ type: 'CLIENT', data: c, reason: `${days} Days Silence` });
            } else if (!isLead && tier === '2' && days > 45) {
                p2.push({ type: 'CLIENT', data: c, reason: "Mid-Tier Drift" });
            } else if (isLead || tier === '3' || days > 60) {
                p3.push({ type: c.type, data: c, reason: isLead ? 'Fresh Lead' : 'Dormant' });
            }
        });

        return {
            defense: p1.sort((a, b) => getDaysSilence(b.data.lastContact) - getDaysSilence(a.data.lastContact)),
            growth: p2,
            revival: p3
        };
    }, [clients]);

    const startSession = (mode, list) => {
        if (list.length === 0) return;
        setQueue(list);
        setSelectedMode(mode);
        setSessionStatus("active");
        setTimer(3600);
    };

    // --- DIRECT START LOGIC ---
    useEffect(() => {
        if (props.initialTarget) {
            // If initialized with a target, start "Direct" session immediately
            const target = { type: 'CLIENT', data: props.initialTarget, reason: 'Direct Selection' };
            setQueue([target]);
            setSelectedMode("Direct Action");
            setSessionStatus("active");
            setTimer(3600);
        }
    }, [props.initialTarget]);

    // --- 2. TIMER LOGIC ---
    useEffect(() => {
        let interval;
        if (sessionStatus === "active" && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [sessionStatus, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- 3. ACTION HANDLERS ---
    const currentTarget = queue[currentIndex];
    const entity = currentTarget?.data;
    const isClient = currentTarget?.type === 'CLIENT';

    // FIX: Safeguard these lookups so they don't crash when 'entity' is undefined (Lobby Mode)
    const contactName = entity ? (isClient ? (entity.keyContacts?.[0]?.name || "there") : entity.contactName) : "there";
    const contactPhone = entity ? (isClient ? (entity.keyContacts?.[0]?.phone || entity.phone || "No Phone") : entity.phone) : "";
    const contactRole = entity ? (isClient ? (entity.keyContacts?.[0]?.role || "Key Contact") : entity.contactRole) : "";

    const recruiterName = "Joe";
    const projectName = "the site";

    const handleInitialOutcome = (outcome) => {
        if (outcome === 'success') {
            setCallState("success_input");
        } else if (outcome === 'fail') {
            setCallState("recovery");
        }
    };

    const handleCompleteSuccess = () => {
        if (isClient && entity) {
            // 1. Prepare Note
            const noteText = callNote || "Call successful (Logged via Golden Hour)";
            const newNote = {
                id: `n-${Date.now()}`,
                text: noteText,
                date: new Date().toISOString(),
                author: recruiterName
            };

            // 2. Prepare Task (if any)
            let newTask = null;
            if (followUpTask) {
                newTask = {
                    id: `t-${Date.now()}`,
                    text: followUpTask,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 week
                    completed: false
                };
            }

            // 3. Update Client Logic
            const updatedClient = {
                ...entity,
                notes: [newNote, ...(entity.notes || [])],
                tasks: newTask ? [...(entity.tasks || []), newTask] : (entity.tasks || []),
                lastContact: new Date().toISOString().split('T')[0], // Update Last Contact Date
                lastActivityType: 'call', // For UI cues
                lastActivityNote: noteText
            };

            updateClient(updatedClient);
            processLog('contact', { notes: noteText, taskId: newTask?.id });
        } else {
            // Fallback for Leads (Activity Log only)
            processLog('contact', { notes: callNote });
        }

        // Cleanup
        setCallNote("");
        setFollowUpTask("");
    };

    const handleRecoverySelection = (mode) => {
        if (mode === 'skip') {
            processLog('skip');
            return;
        }
        setDraftingMode(mode);
        setCallState("drafting");
        setDraftMessage("");
    };

    const applyTemplate = (templateId) => {
        const template = RECOVERY_CONTEXTS.find(t => t.id === templateId);
        if (!template) return;

        let text = draftingMode === 'sms' ? template.sms : template.email;

        // Dynamic Replacement with safeguards
        text = text.replace('[Contact]', contactName.split(' ')[0]);
        text = text.replace('[Recruiter]', recruiterName);
        text = text.replace('[Project]', projectName);
        text = text.replace('[Location]', entity?.location || 'Auckland');

        setDraftMessage(text);
    };

    const handleSendDraft = () => {
        processLog(draftingMode, { notes: draftMessage });
        setDraftingMode(null);
    };

    const processLog = (actionType, additionalDetails = {}) => {
        setCallState("logged");

        // Log to Global Context
        logActivity(actionType, {
            entityId: entity?.id,
            entityName: isClient ? entity.name : entity.companyName,
            contactName,
            ...additionalDetails
        });

        if (['meeting', 'deal', 'contact'].includes(actionType)) {
            setStreak(s => s + 1);
            setSessionScore(s => s + 50 + (streak * 10));
        } else if (['sms', 'email'].includes(actionType)) {
            setSessionScore(s => s + 10);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            if (currentIndex < queue.length - 1) {
                setCurrentIndex(c => c + 1);
                setCallState("idle");
                setDraftMessage(""); // Cleanup
                setIsScriptExpanded(false);
            } else {
                setSessionStatus("finished");
            }
        }, 1500);
    };

    // --- RENDER: LOBBY ---
    if (sessionStatus === "lobby") {
        return (
            <div className="golden-hour-mode">
                <div className="lobby-container">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-4">
                            <Zap size={40} className="text-yellow-400 fill-yellow-400" /> Golden Hour
                        </h1>
                        <p className="text-slate-400 mt-3 text-lg">Select your high-velocity hunting strategy.</p>
                    </div>

                    <div className="lobby-grid">
                        <div className="lobby-card defense group">
                            <div className="icon-wrapper text-rose-400"><Flame size={32} /></div>
                            <h2>Tier 1 Defense</h2>
                            <div className="count">{playlists.defense.length} Targets</div>
                            <p>Protect the castle. High value clients silent for &gt;30 days.</p>
                            <button
                                onClick={() => startSession("Defense", playlists.defense)}
                                disabled={playlists.defense.length === 0}
                                className="start-btn bg-rose-500 hover:bg-rose-400"
                            >
                                <Play size={16} fill="currentColor" /> Start Defense
                            </button>
                        </div>

                        <div className="lobby-card growth group">
                            <div className="icon-wrapper text-amber-400"><Trophy size={32} /></div>
                            <h2>Tier 2 Growth</h2>
                            <div className="count">{playlists.growth.length} Targets</div>
                            <p>Expand territory. Mid-tier clients silent for &gt;45 days.</p>
                            <button
                                onClick={() => startSession("Growth", playlists.growth)}
                                disabled={playlists.growth.length === 0}
                                className="start-btn bg-amber-500 hover:bg-amber-400"
                            >
                                <Play size={16} fill="currentColor" /> Start Growth
                            </button>
                        </div>

                        <div className="lobby-card revival group">
                            <div className="icon-wrapper text-cyan-400"><History size={32} /></div>
                            <h2>Deep Revival</h2>
                            <div className="count">{playlists.revival.length} Targets</div>
                            <p>Wake the dead. Dormant accounts and new leads.</p>
                            <button
                                onClick={() => startSession("Revival", playlists.revival)}
                                disabled={playlists.revival.length === 0}
                                className="start-btn bg-cyan-500 hover:bg-cyan-400"
                            >
                                <Play size={16} fill="currentColor" /> Start Revival
                            </button>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .golden-hour-mode {
                        position: fixed; inset: 0; z-index: 100;
                        background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
                        display: flex; flex-direction: column; overflow-y: auto;
                    }
                    .lobby-container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; }
                    .lobby-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                    .lobby-card { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.3s ease; }
                    .lobby-card:hover { transform: translateY(-5px); background: rgba(30, 41, 59, 0.8); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
                    .lobby-card.defense { border-top: 4px solid #f43f5e; } .lobby-card.defense:hover { border-color: #f43f5e; }
                    .lobby-card.growth { border-top: 4px solid #f59e0b; } .lobby-card.growth:hover { border-color: #f59e0b; }
                    .lobby-card.revival { border-top: 4px solid #06b6d4; } .lobby-card.revival:hover { border-color: #06b6d4; }
                    .icon-wrapper { width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; transition: transform 0.3s; }
                    .lobby-card:hover .icon-wrapper { transform: scale(1.1); background: rgba(255,255,255,0.1); }
                    .lobby-card h2 { font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
                    .count { font-size: 0.9rem; font-weight: 700; color: white; margin-bottom: 1rem; opacity: 0.7; letter-spacing: 0.05em; text-transform: uppercase; }
                    .lobby-card p { font-size: 0.95rem; color: #94a3b8; margin-bottom: 2.5rem; flex: 1; line-height: 1.5; }
                    .start-btn { width: 100%; padding: 1rem; border: none; border-radius: 10px; color: white; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; position: relative; z-index: 10; }
                    .start-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #334155; }
                `}</style>
            </div>
        );
    }

    // --- RENDER: FINISHED ---
    if (sessionStatus === "finished") {
        return (
            <div className="golden-hour-mode flex-col items-center justify-center text-white p-8">
                <Trophy size={80} className="text-yellow-400 mb-6 animate-bounce" />
                <h2 className="text-4xl font-black mb-2">Session Complete!</h2>
                <div className="flex gap-12 mb-12 mt-8">
                    <div className="text-center">
                        <div className="text-6xl font-black text-white mb-2">{sessionScore}</div>
                        <div className="text-sm uppercase font-bold text-slate-500 tracking-widest">XP Earned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-6xl font-black text-white mb-2">{queue.length}</div>
                        <div className="text-sm uppercase font-bold text-slate-500 tracking-widest">Calls Made</div>
                    </div>
                </div>
                <button
                    className="px-8 py-4 bg-white text-slate-900 font-black rounded-full hover:bg-slate-200 transition-colors uppercase tracking-wider text-sm"
                    onClick={() => setSessionStatus("lobby")}
                >
                    Back to Lobby
                </button>
            </div>
        );
    }

    // --- RENDER: ACTIVE SESSION ---

    // Generate AI Script
    const script = generateCallScript(entity, currentTarget?.intent);

    // Example Script Lead
    const scriptPreview = "Gidday " + contactName.split(' ')[0] + ", Joe Ward here from Stellar... Just ringing to see if you require any temp labour workers for [Project] this week?";

    return (
        <div className="golden-hour-mode">
            {/* Top HUD */}
            <div className="hud-bar">
                <div className="timer">
                    <Clock size={20} className="text-rose-500 animate-pulse" />
                    <span className="font-mono text-xl font-bold">{formatTime(timer)}</span>
                </div>
                <div className="mode-badge">
                    {selectedMode} Mode
                </div>
                <div className="streak-meter">
                    <div className="flex items-center gap-2">
                        <Zap size={20} className={streak > 2 ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
                        <span className="text-lg font-bold">x{streak}</span>
                    </div>
                    <div className="score text-sm text-slate-400 font-mono">XP: {sessionScore}</div>
                </div>
            </div>

            <div className="main-stage">
                <div className="lead-card">
                    <div className="lead-header">
                        <div className="company-info">
                            <h1>{isClient ? entity.name : entity.companyName}</h1>
                            <span className="reason-badge">{currentTarget.reason}</span>
                        </div>
                        <div className="contact-info">
                            <div className="text-right">
                                <div className="name text-lg font-bold text-white">{contactName}</div>
                                <div className="role text-sm text-slate-400">{contactRole}</div>
                            </div>
                            <div className="avatar">{contactName?.[0]}</div>
                        </div>
                    </div>

                    <div className="lead-body">
                        {callState === "drafting" ? (
                            <div className="drafting-ui">
                                <div className="context-selector">
                                    {RECOVERY_CONTEXTS.map(ctx => (
                                        <button
                                            key={ctx.id}
                                            className="context-btn"
                                            onClick={() => applyTemplate(ctx.id)}
                                        >
                                            <ctx.icon size={20} className="mb-1" />
                                            <span>{ctx.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="message-area">
                                    <textarea
                                        value={draftMessage}
                                        onChange={(e) => setDraftMessage(e.target.value)}
                                        placeholder={`Draft your ${draftingMode === 'sms' ? 'text' : 'email'} here or select a template above...`}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        ) : callState === "success_input" ? (
                            <div className="success-input-ui w-full">
                                <h2 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} /> Good Chat! What's the update?
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Call Note (Added to Activity)</label>
                                        <textarea
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none placeholder-slate-600 text-sm"
                                            rows={3}
                                            placeholder="e.g. Needs 2 guys next Monday..."
                                            value={callNote}
                                            onChange={(e) => setCallNote(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Quick Task (Optional)</label>
                                        <div className="relative">
                                            <ClipboardList size={16} className="absolute left-3 top-3 text-slate-500" />
                                            <input
                                                type="text"
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-white focus:border-emerald-500 focus:outline-none placeholder-slate-600 text-sm"
                                                placeholder="e.g. Send CVs tonight"
                                                value={followUpTask}
                                                onChange={(e) => setFollowUpTask(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : callState === "recovery" ? (
                            <div className="recovery-message">
                                <XCircle size={48} className="text-rose-500 mb-4" />
                                <h3 className="text-rose-400 font-bold uppercase text-xl mb-2">No Answer?</h3>
                                <p className="text-slate-400 text-sm">Don't lose momentum. Select a follow-up action below.</p>
                            </div>
                        ) : callState === "logged" ? (
                            <div className="success-ui">
                                <CheckCircle size={64} className="text-emerald-400 mb-4 animate-bounce" />
                                <h2 className="text-2xl font-bold text-white">Action Logged!</h2>
                                <p className="text-slate-400 mt-2">Loading next target...</p>
                            </div>
                        ) : (
                            <div className="pre-call-ui">
                                {/* NEW: CONTACT INFO CARD */}
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contact Details</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone size={20} className="text-emerald-500" />
                                        <div>
                                            <div className="text-2xl font-black text-white tracking-wide">{contactPhone}</div>
                                            <div className="text-xs text-slate-500">M: {entity?.mobile || "Not Listed"}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* NEW: SCRIPT CARD (COLLAPSIBLE) */}
                                <div
                                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors"
                                    onClick={() => setIsScriptExpanded(!isScriptExpanded)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap size={16} className="text-yellow-400" />
                                            <span className="font-bold text-white">Call Purpose & Script</span>
                                        </div>
                                        {isScriptExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                    </div>

                                    {isScriptExpanded && (
                                        <div className="mt-4 pt-4 border-t border-slate-700/50 animate-in fade-in slide-in-from-top-1">
                                            <div className="mb-3">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Opening Line</span>
                                                <p className="text-slate-300 italic text-sm">"{scriptPreview}"</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">AI Context</span>
                                                <p className="text-slate-400 text-xs leading-relaxed">{script}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="intel-item">
                                        <label>Last Contact</label>
                                        <span>{getDaysSilence(isClient ? entity.lastContact : entity.lastContacted)} Days</span>
                                    </div>
                                    <div className="intel-item">
                                        <label>Location</label>
                                        <span className="text-emerald-400 truncate w-full">{isClient ? (entity.region || 'National') : (entity.location || 'NZ')}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lead-footer">
                        {callState === "drafting" ? (
                            <div className="drafting-actions">
                                <button className="outcome-btn skip-action" onClick={() => setCallState("recovery")}>
                                    Back
                                </button>
                                <button
                                    className="outcome-btn success"
                                    onClick={handleSendDraft}
                                    disabled={!draftMessage}
                                >
                                    <Send size={18} /> Send & Log
                                </button>
                            </div>
                        ) : callState === "success_input" ? (
                            <div className="success-actions flex gap-4 w-full">
                                <button className="outcome-btn skip-action w-1/3" onClick={() => setCallState("idle")}>
                                    Back
                                </button>
                                <button
                                    className="outcome-btn success flex-1"
                                    onClick={handleCompleteSuccess}
                                >
                                    <CheckCircle size={18} /> Complete & Next
                                </button>
                            </div>
                        ) : callState === "idle" ? (
                            <div className="idle-actions grid grid-cols-2 gap-4 w-full">
                                <button
                                    className="outcome-btn fail flex items-center justify-center gap-2 py-4 text-base"
                                    onClick={() => handleInitialOutcome('fail')}
                                >
                                    <XCircle size={20} /> No Answer
                                </button>
                                <button
                                    className="outcome-btn success flex items-center justify-center gap-2 py-4 text-base"
                                    onClick={() => handleInitialOutcome('success')}
                                >
                                    <Phone size={20} /> Call Success
                                </button>
                            </div>
                        ) : callState === "recovery" ? (
                            <div className="recovery-buttons">
                                <button className="outcome-btn text-action" onClick={() => handleRecoverySelection('sms')}>
                                    <MessageCircle size={20} /> Send SMS Follow-up
                                </button>
                                <button className="outcome-btn email-action" onClick={() => handleRecoverySelection('email')}>
                                    <Mail size={20} /> Send Email Follow-up
                                </button>
                                <button className="outcome-btn skip-action" onClick={() => handleRecoverySelection('skip')}>
                                    <ArrowRight size={20} /> Skip & Next
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .golden-hour-mode {
                    position: fixed; inset: 0; z-index: 100;
                    background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
                    display: flex; flex-direction: column; overflow: hidden;
                }

                .hud-bar {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1rem 2rem; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.1);
                    flex-shrink: 0;
                }
                .timer { display: flex; align-items: center; gap: 0.75rem; color: white; }
                .mode-badge { 
                    background: rgba(255,255,255,0.1); color: white; padding: 6px 16px; 
                    border-radius: 99px; font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
                }
                .streak-meter { display: flex; align-items: center; gap: 1.5rem; color: white; }

                .main-stage { flex: 1; display: flex; justify-content: center; align-items: center; padding: 2rem; position: relative; }
                
                .lead-card {
                    width: 100%; max-width: 650px; background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 2.5rem;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 2rem;
                    position: relative; z-index: 10;
                }

                .lead-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem; }
                .company-info h1 { margin: 0; font-size: 2rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
                .reason-badge { background: rgba(244, 63, 94, 0.15); color: #f43f5e; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; border: 1px solid rgba(244, 63, 94, 0.2); }
                .contact-info { display: flex; align-items: center; gap: 1rem; }
                .avatar { width: 56px; height: 56px; border-radius: 50%; background: #0f172a; color: white; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.5rem; }

                .lead-body { min-height: 250px; display: flex; align-items: center; justify-content: center; width: 100%; }
                .in-call-ui { width: 100%; display: flex; flex-direction: column; align-items: center; }
                .recovery-message { text-align: center; display: flex; flex-direction: column; align-items: center; padding: 2rem; }
                .script-box { background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 12px; width: 100%; border: 1px solid rgba(255,255,255,0.05); }
                .success-ui { text-align: center; }

                /* DRAFTING UI STYLES */
                .drafting-ui { width: 100%; display: flex; flex-direction: column; gap: 1rem; }
                .context-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
                .context-btn {
                    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                    padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px; color: #94a3b8; font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
                }
                .context-btn:hover { background: rgba(255,255,255,0.1); color: white; border-color: var(--secondary); }
                .message-area textarea {
                    width: 100%; height: 120px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px; padding: 1rem; color: white; font-family: inherit; font-size: 0.95rem; line-height: 1.5;
                    resize: none; outline: none;
                }
                .message-area textarea:focus { border-color: var(--secondary); }
                .drafting-actions { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; width: 100%; }

                .pre-call-ui { width: 100%; display: flex; flex-direction: column; gap: 1.5rem; }
                .intel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
                .intel-item { background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
                .intel-item label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 700; letter-spacing: 0.05em; }
                .intel-item span { font-size: 1.25rem; font-weight: 800; color: white; }
                .notes-preview { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 12px; }
                .notes-preview label { font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase; }
                .notes-preview p { font-style: italic; color: #cbd5e1; font-size: 1rem; line-height: 1.5; }

                .lead-footer { width: 100%; }
                .call-btn { width: 100%; padding: 1.25rem; background: #10b981; color: white; border: none; border-radius: 16px; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; box-shadow: 0 0 40px rgba(16, 185, 129, 0.3); transition: transform 0.1s; letter-spacing: 0.05em; text-transform: uppercase; }
                .call-btn:hover { transform: scale(1.02); background: #059669; }
                .call-btn:active { transform: scale(0.98); }

                .outcome-buttons, .recovery-buttons { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; width: 100%; }
                .outcome-btn { padding: 1.25rem 1rem; border: none; border-radius: 12px; color: white; font-weight: 700; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.85rem; transition: background 0.2s; }
                
                .outcome-btn.success { background: #10b981; } .outcome-btn.success:hover { background: #059669; }
                .outcome-btn.neutral { background: #3b82f6; } .outcome-btn.neutral:hover { background: #2563eb; }
                .outcome-btn.fail { background: #ef4444; } .outcome-btn.fail:hover { background: #dc2626; }

                .text-action { background: #8b5cf6; } .text-action:hover { background: #7c3aed; }
                .email-action { background: #06b6d4; } .email-action:hover { background: #0891b2; }
                .skip-action { background: rgba(255,255,255,0.1); color: #94a3b8; } .skip-action:hover { background: rgba(255,255,255,0.2); color: white; }
                
                .outcome-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
}