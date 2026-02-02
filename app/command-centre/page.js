"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from "../../context/data-context.js";
import {
    Shield, Users, TrendingUp, Radar, Briefcase,
    Send, Activity, X, Cpu, AlertTriangle, PlayCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AgentSignalCard from '../../components/agent-signal-card.js';

// --- AGENT REGISTRY ---
const AGENTS = [
    { id: 'gm', name: 'Stellar GM', title: 'Headquarters', icon: <Shield size={18} />, desc: "Executive Strategy & Board Orchestration." },
    { id: 'jarvis', name: 'Jarvis', title: 'Logistics', icon: <Cpu size={18} />, desc: "Operational Orchestrator." },
    { id: 'scout', name: 'Tender Scout', title: 'Market Intel', icon: <Radar size={18} />, desc: "Market Intelligence." },
    { id: 'sales', name: 'Sales Lead', title: 'Growth', icon: <TrendingUp size={18} />, desc: "Head of Growth." },
    { id: 'candidate', name: 'Candidate Mgr', title: 'Talent Ops', icon: <Users size={18} />, desc: "Head of Talent." },
    { id: 'accountant', name: 'The Accountant', title: 'CFO', icon: <Briefcase size={18} />, desc: "Financial Controller." },
    { id: 'compliance', name: 'Compliance', title: 'Gatekeeper', icon: <AlertTriangle size={18} />, desc: "Safety Guard." },
    { id: 'systems', name: 'Systems IT', title: 'Sentinel', icon: <Cpu size={18} />, desc: "Data Integrity." },
    { id: 'immigration', name: 'Immigration', title: 'Visa Guard', icon: <Shield size={18} />, desc: "Visa Logic." }
];

export default function CommandCentre() {
    const { candidates, projects, clients, moneyMoves, weeklyRevenue, activityLogs } = useData();

    // State
    const [gmHistory, setGmHistory] = useState([]);
    const [agentStatuses, setAgentStatuses] = useState({
        gm: 'active', scout: 'neutral', sales: 'neutral',
        candidate: 'neutral', accountant: 'neutral', jarvis: 'neutral',
        systems: 'neutral', immigration: 'neutral'
    });

    // --- CONTEXT BUILDER ---
    const buildContext = useMemo(() => {
        return {
            financials: { weeklyRevenue: weeklyRevenue || 0 },
            activityLogs: activityLogs || [],
            candidates: candidates.map(c => ({
                id: c.id,
                name: c.name || `${c.firstName} ${c.lastName}`,
                status: c.status,
                role: c.role || c.trade || "General Labor",
                currentProject: c.projectId, // Simplified for token limits
                financials: { chargeRate: c.chargeRate, payRate: c.payRate },
                compliance: { visa: c.visaExpiry, siteSafe: c.siteSafeExpiry },
                region: c.region
            })),
            clients: clients.map(c => ({ name: c.name, tier: c.tier, lastContact: c.lastContact })), // Minified
            projects: projects.map(p => ({ name: p.name, status: p.status, region: p.location })), // Minified
            lastSyncTime: new Date().toISOString()
        };
    }, [candidates, projects, clients, moneyMoves, weeklyRevenue]);

    // --- INITIAL BOOT SEQUENCE ---
    useEffect(() => {
        if (gmHistory.length === 0) {
            setGmHistory([{ id: 'init', role: 'assistant', content: "# COMMAND DECK ONLINE\n\n**Stellar GM:** I am ready. My Board of Directors (Accountant, Sales, Ops) is standing by." }]);
        }
    }, []);

    // --- PARSE DELEGATION FROM RESPONSE ---
    const updateAgentStatus = (response) => {
        // Reset all to neutral except GM
        const newStatuses = { ...agentStatuses };
        Object.keys(newStatuses).forEach(k => newStatuses[k] = k === 'gm' ? 'active' : 'neutral');

        // Check for "[AgentName]:" pattern from ADK
        const match = response.match(/^\\\[(.*?)]:|^\*\*(.*?):/);
        if (match) {
            const agentName = (match[1] || match[2]).toLowerCase();
            // Map ADK names to UI IDs
            const map = {
                'accountant': 'accountant',
                'candidatemgr': 'candidate',
                'saleslead': 'sales',
                'systemsit': 'systems',
                'immigration': 'immigration',
                'gm': 'gm'
            };
            const id = map[agentName] || 'gm';
            newStatuses[id] = 'active';
        }
        setAgentStatuses(newStatuses);
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
            {/* SIDEBAR - BOARD STATUS */}
            <aside className="w-72 border-r border-slate-800 bg-[#020617] flex flex-col flex-shrink-0 z-10">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="text-sky-500" size={24} />
                    <span className="font-bold text-sm uppercase tracking-widest text-slate-300">The Board</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                    {AGENTS.map(agent => (
                        <div key={agent.id} className={`transition-all duration-300 ${agentStatuses[agent.id] === 'active' ? 'scale-105 opacity-100' : 'opacity-60'}`}>
                            <AgentSignalCard
                                agent_id={agent.name}
                                status={agentStatuses[agent.id] === 'active' ? 'success' : 'neutral'}
                                meta={agent.title}
                            />
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest flex justify-between">
                    <span>Orchestrator Mode</span>
                    <span className="text-emerald-500 font-bold">Online</span>
                </div>
            </aside>

            {/* MAIN STAGE: UNIFIED CHAT */}
            <main className="flex-1 flex flex-col relative bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
                <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_currentColor] animate-pulse" />
                        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                            Executive Command <span className="text-sky-500">//</span> Live Feed
                        </h1>
                    </div>
                </header>

                <ChatInterface
                    context={buildContext}
                    history={gmHistory}
                    onUpdateHistory={(h) => {
                        setGmHistory(h);
                        const lastMsg = h[h.length - 1];
                        if (lastMsg?.role === 'assistant') updateAgentStatus(lastMsg.content);
                    }}
                />
            </main>

            <style jsx global>{`
                .prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(148, 163, 184, 0.1); }
                .prose th { background: rgba(15, 23, 42, 0.8); color: #38bdf8; text-transform: uppercase; padding: 0.75rem; text-align: left; font-weight: 800; letter-spacing: 0.05em; border-bottom: 2px solid rgba(148, 163, 184, 0.2); }
                .prose td { padding: 0.75rem; border-bottom: 1px solid rgba(148, 163, 184, 0.1); color: #cbd5e1; }
                .prose strong { color: #00f2ff; }
            `}</style>
        </div>
    );
}

// --- UNIFIED CHAT COMPONENT ---
function ChatInterface({ context, history, onUpdateHistory }) {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

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
                    agentId: 'gm', // ALWAYS GM
                    context: context,
                    history: history
                })
            });
            const data = await res.json();
            onUpdateHistory([...newHistory, {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.chat_response
            }]);
        } catch (error) {
            onUpdateHistory([...newHistory, { id: Date.now(), role: 'assistant', content: "**Error:** Connection to HQ failed." }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Helper to get icon based on message content
    const getMessageIcon = (content) => {
        if (content.startsWith('[Accountant]')) return <Briefcase size={16} />;
        if (content.startsWith('[CandidateMgr]')) return <Users size={16} />;
        if (content.startsWith('[SalesLead]')) return <TrendingUp size={16} />;
        if (content.startsWith('[SystemsIT]')) return <Cpu size={16} />;
        if (content.startsWith('[Immigration]')) return <Shield size={16} />;
        return <Shield size={16} />; // Default GM
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar pb-32">
                {history.map((m) => (
                    <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1 ${m.role === 'assistant' ? 'bg-slate-800 text-sky-400' : 'bg-sky-900/20 text-sky-300'}`}>
                            {m.role === 'assistant' ? getMessageIcon(m.content) : <Users size={16} />}
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
                        <span>Orchestrating Response...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl opacity-20 blur"></div>
                    <div className="relative bg-slate-900 border border-slate-800 rounded-xl flex items-center p-1 shadow-2xl">
                        <input
                            type="text"
                            placeholder="Direct the General Manager..."
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
