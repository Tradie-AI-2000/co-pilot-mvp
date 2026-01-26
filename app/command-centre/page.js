"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from "../../context/data-context.js";
import {
    Shield, Users, TrendingUp, Radar, Briefcase,
    Send, Activity, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AgentSignalCard from '../../components/agent-signal-card.js';

// --- AGENT REGISTRY ---
const AGENTS = [
    { id: 'gm', name: 'General Manager', title: 'Strategy', icon: <Shield size={18} /> },
    { id: 'scout', name: 'Tender Scout', title: 'Intel', icon: <Radar size={18} /> },
    { id: 'sales', name: 'Sales Lead', title: 'Revenue', icon: <TrendingUp size={18} /> },
    { id: 'candidate', name: 'Candidate Mgr', title: 'Supply', icon: <Users size={18} /> },
    { id: 'accountant', name: 'Accountant', title: 'Profit', icon: <Briefcase size={18} /> },
];

export default function CommandCentre() {
    const { candidates, projects, clients, moneyMoves, weeklyRevenue } = useData();

    // State
    const [activeModalAgent, setActiveModalAgent] = useState(null);
    const [gmHistory, setGmHistory] = useState([]);
    const [messages, setMessages] = useState({});
    const [agentStatuses, setAgentStatuses] = useState({
        gm: 'neutral', scout: 'neutral', sales: 'neutral',
        candidate: 'neutral', accountant: 'neutral'
    });

    // --- CONTEXT BUILDER (Robust Real-Data Mapper) ---
    const buildContext = useMemo(() => {
        return {
            financials: { weeklyRevenue: weeklyRevenue || 0 },
            candidates: candidates.map(c => {
                // 1. NAME RESOLVER (Handles Snake_Case and CamelCase)
                const fName = c.firstName || c.first_name || "";
                const lName = c.lastName || c.last_name || "";

                let displayName = "Unknown Candidate";
                if (fName || lName) {
                    displayName = `${fName} ${lName}`.trim();
                } else if (c.name) {
                    displayName = c.name;
                }

                // 2. PROJECT LOOKUP
                const projId = c.projectId || c.project_id;
                const activeProject = projects.find(p => p.id === projId);
                const projectName = activeProject ? activeProject.name : "Unassigned";
                const clientName = activeProject ? (clients.find(cl => cl.id === activeProject.clientId)?.name || "Unknown") : "Unknown";

                // 3. RATE SANITIZER (Prevents Negative Math)
                const rawCharge = parseFloat(String(c.chargeRate || c.charge_out_rate || 0).replace(/[^0-9.]/g, ''));
                const rawPay = parseFloat(String(c.payRate || c.pay_rate || 0).replace(/[^0-9.]/g, ''));

                const charge = rawCharge > 0 ? rawCharge : 65;
                const pay = rawPay > 0 ? rawPay : 35;

                return {
                    id: c.id,
                    name: displayName,
                    status: c.status,
                    role: c.role || c.trade || "General Labor",
                    currentProject: projectName,
                    client: clientName,
                    financials: {
                        chargeRate: charge,
                        payRate: pay,
                        guaranteedHours: parseFloat(String(c.guaranteedHours || c.guaranteed_hours || 40).replace(/[^0-9.]/g, ''))
                    },
                    splits: {
                        recruiter: c.recruiter || "Joe Ward",
                        clientOwner: c.clientOwner || "Unknown",
                        accountManager: c.accountManager || "Joe Ward"
                    },
                    compliance: {
                        visa: c.visaExpiry || c.visa_expiry || "Unknown",
                        siteSafe: c.siteSafeExpiry || "Unknown"
                    },
                    daysUntilFinish: c.finishDate ? Math.ceil((new Date(c.finishDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
                };
            }),
            clients: clients,
            projects: projects,
            criticalRisks: moneyMoves?.filter(m => m.urgency === 'Critical') || []
        };
    }, [candidates, projects, clients, moneyMoves, weeklyRevenue]);

    // --- INITIAL BOOT SEQUENCE (Morning Briefing) ---
    useEffect(() => {
        if (gmHistory.length === 0 && weeklyRevenue !== undefined) {
            triggerMorningBriefing();
        }
    }, [weeklyRevenue]);

    const triggerMorningBriefing = async () => {
        setGmHistory([{ id: 'init', role: 'assistant', content: "*Initializing Command Deck...*" }]);

        try {
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "BOOT_SEQUENCE",
                    agentId: 'gm',
                    context: buildContext
                })
            });
            const data = await res.json();
            setGmHistory([{
                id: Date.now(),
                role: 'assistant',
                content: data.chat_response
            }]);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-72 border-r border-slate-800 bg-[#020617] flex flex-col flex-shrink-0 z-10">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="text-sky-500" size={24} />
                    <span className="font-bold text-sm uppercase tracking-widest text-slate-300">Command Dock</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                    {AGENTS.map(agent => (
                        <div
                            key={agent.id}
                            onClick={() => { if (agent.id !== 'gm') setActiveModalAgent(agent); }}
                            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${agent.id === 'gm' ? 'opacity-50 cursor-default' : ''}`}
                        >
                            <AgentSignalCard
                                agent_id={agent.name}
                                status={agentStatuses[agent.id]}
                                meta={agent.id === 'gm' ? "MAIN DECK" : agent.title}
                            />
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest flex justify-between">
                    <span>System Status</span>
                    <span className="text-emerald-500 font-bold">Live Data</span>
                </div>
            </aside>

            {/* MAIN STAGE: GM CHAT */}
            <main className="flex-1 flex flex-col relative bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
                <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_currentColor] animate-pulse" />
                        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                            General Manager <span className="text-sky-500">//</span> Strategy Deck
                        </h1>
                    </div>
                </header>

                <ChatInterface
                    agent={{ id: 'gm', name: 'Stellar GM', icon: <Shield size={18} /> }}
                    context={buildContext}
                    history={gmHistory}
                    onUpdateHistory={setGmHistory}
                    onSignalUpdate={(updates) => {
                        const newStatuses = { ...agentStatuses };
                        updates.forEach(u => {
                            const key = u.agent_id.toLowerCase().includes('account') ? 'accountant' :
                                u.agent_id.toLowerCase().includes('sales') ? 'sales' :
                                    u.agent_id.toLowerCase().includes('candidate') ? 'candidate' :
                                        u.agent_id.toLowerCase().includes('scout') ? 'scout' : 'gm';
                            newStatuses[key] = u.status;
                        });
                        setAgentStatuses(newStatuses);
                    }}
                    isMainPage={true}
                />
            </main>

            {/* SUB-AGENT MODALS */}
            {activeModalAgent && (
                <div className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
                    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                                {activeModalAgent.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-white">{activeModalAgent.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider">Live Connection</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setActiveModalAgent(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                            <X size={24} />
                        </button>
                    </header>

                    <ChatInterface
                        agent={activeModalAgent}
                        context={buildContext}
                        history={messages[activeModalAgent.id] || []}
                        onUpdateHistory={(newMsgs) => setMessages(prev => ({ ...prev, [activeModalAgent.id]: newMsgs }))}
                        onSignalUpdate={(updates) => { /* Update signals from modal too */ }}
                    />
                </div>
            )}

            <style jsx global>{`
                .prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(148, 163, 184, 0.1); }
                .prose th { background: rgba(15, 23, 42, 0.8); color: #38bdf8; text-transform: uppercase; padding: 0.75rem; text-align: left; font-weight: 800; letter-spacing: 0.05em; border-bottom: 2px solid rgba(148, 163, 184, 0.2); }
                .prose td { padding: 0.75rem; border-bottom: 1px solid rgba(148, 163, 184, 0.1); color: #cbd5e1; }
                .prose strong { color: #00f2ff; }
            `}</style>
        </div>
    );
}

// --- SHARED CHAT COMPONENT ---
function ChatInterface({ agent, context, history, onUpdateHistory, onSignalUpdate, isMainPage = false }) {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    useEffect(() => {
        if (!isMainPage && history.length === 0) {
            onUpdateHistory([{
                id: 'init',
                role: 'assistant',
                content: `# ${agent.name.toUpperCase()} ONLINE\n${agent.title} Protocols Active. Ready for directive.`
            }]);
        }
    }, []);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        const newHistory = [...history, userMsg];
        onUpdateHistory(newHistory);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    agentId: agent.id,
                    context: context
                })
            });
            const data = await res.json();
            onUpdateHistory([...newHistory, {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.chat_response
            }]);
            if (data.signal_updates && onSignalUpdate) {
                onSignalUpdate(data.signal_updates);
            }
        } catch (error) {
            onUpdateHistory([...newHistory, { id: Date.now(), role: 'assistant', content: "**Error:** Connection failed." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar pb-32">
                {history.map((m) => (
                    <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1 ${m.role === 'assistant' ? 'bg-slate-800 text-sky-400' : 'bg-sky-900/20 text-sky-300'
                            }`}>
                            {m.role === 'assistant' ? agent.icon : <Users size={16} />}
                        </div>
                        <div className={`max-w-[85%] p-5 rounded-xl border text-sm leading-relaxed shadow-lg ${m.role === 'assistant'
                                ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                                : 'bg-sky-600 text-white border-sky-500'
                            }`}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {m.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4 items-center text-xs text-slate-500 uppercase tracking-widest animate-pulse ml-12">
                        <Activity size={14} className="text-sky-500 animate-spin" />
                        <span>Processing Directive...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-8 ${isMainPage ? '' : 'bg-gradient-to-t from-[#020617] via-[#020617] to-transparent'}`}>
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl opacity-20 blur"></div>
                    <div className="relative bg-slate-900 border border-slate-800 rounded-xl flex items-center p-1 shadow-2xl">
                        <input
                            type="text"
                            placeholder={`Directive for ${agent.name}...`}
                            className="flex-1 bg-transparent border-none text-slate-100 focus:ring-0 placeholder:text-slate-600 font-mono text-sm uppercase tracking-wider h-12 px-4"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="bg-slate-800 hover:bg-sky-600 text-white p-3 rounded-lg transition-all border border-slate-700">
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}