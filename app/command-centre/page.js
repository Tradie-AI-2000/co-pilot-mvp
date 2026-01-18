"use client";
import { useState } from 'react';
import { useData } from "@/context/data-context";
import BoardroomChat from "@/components/boardroom-chat";
import AgentSignalCard from "@/components/agent-signal-card";

export default function CommandCentre() {
    const { weeklyRevenue, revenueAtRisk } = useData();

    // 1. Define the Board State (Default Status)
    const [boardSignals, setBoardSignals] = useState([
        { id: 'acc', name: 'Accountant', icon: '💰', signal: 'caution', meta: 'Monitoring Margins' },
        { id: 'cand', name: 'Candidate Mgr', icon: '👷', signal: 'neutral', meta: 'Bench Stable' },
        { id: 'sales', name: 'Sales Lead', icon: '📈', signal: 'neutral', meta: 'Analyzing Demand' },
        { id: 'it', name: 'Systems-IT', icon: '🛡️', signal: 'success', meta: 'Systems Normal' },
        { id: 'imm', name: 'Immigration', icon: '✈️', signal: 'neutral', meta: 'Visa Check Complete' },
    ]);

    // 2. The Handler (Updates the UI when the Agent speaks)
    const handleSignalUpdate = (updates) => {
        if (!updates || updates.length === 0) return;

        setBoardSignals(prevSignals => prevSignals.map(sig => {
            const update = updates.find(u => u.agent_id === sig.id);
            return update ? { ...sig, signal: update.status, meta: update.meta } : sig;
        }));
    };

    return (
        <div className="command-centre-wrapper p-6 h-screen flex flex-col gap-6 bg-slate-950 text-white">
            {/* Header Area */}
            <header className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Stellar Command Centre
                    </h1>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                        General Manager Active • Gemini 2.0 Flash
                    </p>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase block">Revenue Pulse</span>
                        <span className="text-xl font-mono text-cyan-400">${(weeklyRevenue / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="text-right border-l border-white/10 pl-6">
                        <span className="text-[10px] text-slate-500 uppercase block">Bleed Alert</span>
                        <span className="text-xl font-mono text-amber-500">${(revenueAtRisk / 1000).toFixed(1)}k</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-[260px_1fr_300px] gap-6 flex-1 min-h-0">

                {/* Zone 1: Signal Grid */}
                <section className="flex flex-col gap-4 overflow-y-auto">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Board Signals</h2>
                    {boardSignals.map(agent => (
                        <AgentSignalCard key={agent.id} {...agent} />
                    ))}
                </section>

                {/* Zone 2: The Boardroom (Chat) */}
                <main className="glass-panel flex flex-col overflow-hidden relative border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,255,0.05)] rounded-xl">
                    {/* PASS THE HANDLER DOWN */}
                    <BoardroomChat agentId="stellar-gm" onSignalUpdate={handleSignalUpdate} />
                </main>

                {/* Zone 3: Strategic Feed (Placeholder for Nudges) */}
                <aside className="flex flex-col gap-4">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strategic Feed</h2>
                    <div className="glass-panel flex-1 p-4 border border-white/5 rounded-xl">
                        <div className="text-xs text-slate-500 italic">
                            Active Guardrails monitoring...
                        </div>
                        {/* Dynamic Nudges will go here in Phase 2 */}
                    </div>
                </aside>
            </div>

            <style jsx>{`
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
        }
      `}</style>
        </div>
    );
}