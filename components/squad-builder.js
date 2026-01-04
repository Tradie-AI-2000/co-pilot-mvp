"use client";

import { useState } from "react";
import { Plus, Users, Search, Filter, GripVertical, UserPlus, ArrowRight, X } from "lucide-react";
import SquadCard from "./squad-card.js";

export default function SquadBuilder({ candidates, projects, squads, setSquads, onDeploySquad }) {
    const [benchFilter, setBenchFilter] = useState("");

    // Filter out candidates already in a squad
    const assignedCandidateIds = new Set(squads.flatMap(s => s.members.map(m => m.id)));
    const benchCandidates = candidates.filter(c =>
        !assignedCandidateIds.has(c.id) &&
        (c.firstName.toLowerCase().includes(benchFilter.toLowerCase()) ||
            c.lastName.toLowerCase().includes(benchFilter.toLowerCase()) ||
            c.role?.toLowerCase().includes(benchFilter.toLowerCase()))
    );

    const removeMemberFromSquad = (squadId, memberId) => {
        setSquads(prev => prev.map(s => {
            if (s.id === squadId) {
                return { ...s, members: s.members.filter(m => m.id !== memberId) };
            }
            return s;
        }));
    };

    const createNewSquad = () => {
        const newSquad = {
            id: `s${Date.now()}`,
            name: `New Squad ${squads.length + 1}`,
            members: [],
            status: 'Draft'
        };
        setSquads([...squads, newSquad]);
    };

    const disbandSquad = (squadId) => {
        if (confirm("Are you sure you want to disband this squad? Members will return to the bench.")) {
            setSquads(prev => prev.filter(s => s.id !== squadId));
        }
    };

    const renameSquad = (squadId, newName) => {
        setSquads(prev => prev.map(s => s.id === squadId ? { ...s, name: newName } : s));
    };

    const [deployingSquadId, setDeployingSquadId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const initiateDeploy = (squadId) => {
        setDeployingSquadId(squadId);
        setSelectedProjectId("");
    };

    const confirmDeploy = () => {
        const squad = squads.find(s => s.id === deployingSquadId);
        const project = projects.find(p => p.id === selectedProjectId);

        if (squad && project) {
            onDeploySquad(squad, project);

            // Update local squad status
            setSquads(prev => prev.map(s =>
                s.id === deployingSquadId ? { ...s, status: 'Deployed' } : s
            ));

            setDeployingSquadId(null);
        }
    };

    return (
        <div className="flex h-[calc(100vh-12rem)] gap-8 relative p-1">
            {/* Deployment Modal - Upgraded to Glassmorphism */}
            {deployingSquadId && (
                <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900/90 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Gradient Top Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-blue-500 to-purple-600"></div>

                        <button
                            onClick={() => setDeployingSquadId(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Deploy Squad</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Assign <span className="text-secondary font-bold border-b border-secondary/20 pb-0.5">{squads.find(s => s.id === deployingSquadId)?.name}</span> to a strategic project location.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-extrabold block mb-2.5 tracking-widest pl-1">Target Project Site</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-white text-sm outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all appearance-none cursor-pointer hover:bg-slate-950/80 font-medium"
                                            value={selectedProjectId}
                                            onChange={(e) => setSelectedProjectId(e.target.value)}
                                        >
                                            <option value="" className="bg-slate-900 text-slate-500">Select Target Project...</option>
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id} className="bg-slate-900 text-white py-2">{p.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ArrowRight size={14} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        className="flex-1 bg-secondary text-slate-950 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider hover:bg-secondary-light transition-all shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_30px_rgba(0,242,255,0.25)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-[0.98]"
                                        onClick={confirmDeploy}
                                        disabled={!selectedProjectId}
                                    >
                                        Confirm Deployment
                                    </button>
                                    <button
                                        className="px-6 py-3.5 bg-white/5 text-slate-300 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white transition-all border border-white/5 hover:border-white/10"
                                        onClick={() => setDeployingSquadId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Panel: The Bench (Antigravity Sidebar) */}
            <div className="w-85 flex-shrink-0 flex flex-col gap-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-white flex items-center gap-3 tracking-tight">
                        <Users className="text-secondary" size={20} /> The Bench
                        <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(0,242,255,0.1)]">
                            {benchCandidates.length}
                        </span>
                    </h3>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors pointer-events-none" size={18} />
                    <input
                        className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-secondary/30 focus:bg-slate-950/80 transition-all focus:ring-1 focus:ring-secondary/10"
                        placeholder="Search bench by role or name..."
                        value={benchFilter}
                        onChange={(e) => setBenchFilter(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar -mr-2">
                    {benchCandidates.map(candidate => (
                        <div
                            key={candidate.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("candidateId", candidate.id);
                                e.dataTransfer.effectAllowed = "move";
                            }}
                            className="bg-slate-800/20 border border-white/5 p-4 rounded-xl hover:border-secondary/30 hover:bg-slate-800/50 transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-lg relative overflow-hidden"
                        >
                            {/* Hover accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start pl-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-xs font-black text-secondary group-hover:border-secondary/50 transition-colors shadow-inner">
                                        {candidate.firstName[0]}{candidate.lastName[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-sm font-bold text-white group-hover:text-secondary transition-colors">{candidate.firstName} {candidate.lastName}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            {candidate.role}
                                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                            <span className="text-slate-500">{candidate.region || 'NZ'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-black text-secondary bg-secondary/5 px-2.5 py-1 rounded-lg border border-secondary/10 font-mono">
                                    {candidate.chargeOutRate}
                                </div>
                            </div>
                        </div>
                    ))}
                    {benchCandidates.length === 0 && (
                        <div className="text-center py-12 px-4 border border-dashed border-white/5 rounded-xl bg-white/5">
                            <p className="text-slate-500 text-sm font-medium">No matching talent found on bench.</p>
                            <button className="text-secondary text-xs font-bold mt-2 hover:underline">Clear Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Squad Zone */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Active Squads</h3>
                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.2em] mt-1 pl-0.5">Operational Configurations</p>
                    </div>
                    <button
                        onClick={createNewSquad}
                        className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 hover:bg-secondary hover:text-slate-950 hover:border-secondary hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} /> NEW SQUAD
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-24">
                        {squads.map(squad => (
                            <div
                                key={squad.id}
                                className="h-full transform transition-all"
                            >
                                <SquadCard
                                    squad={squad}
                                    onRemoveMember={removeMemberFromSquad}
                                    onDeploy={initiateDeploy}
                                    onDisband={disbandSquad}
                                    onRename={renameSquad}
                                />
                            </div>
                        ))}

                        {/* Empty State */}
                        {squads.length === 0 && (
                            <div className="col-span-full h-96 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-600 gap-6 backdrop-blur-sm group hover:border-white/10 transition-colors">
                                <div className="w-24 h-24 rounded-full bg-slate-950/50 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                    <Users size={40} className="opacity-20 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-slate-400 mb-2">Zero Squads Initialized</p>
                                    <p className="text-sm text-slate-600">Create a new squad to begin workforce orchestration.</p>
                                </div>
                                <button
                                    onClick={createNewSquad}
                                    className="text-secondary font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors bg-secondary/5 px-6 py-3 rounded-xl border border-secondary/10 hover:bg-secondary/10"
                                >
                                    + Initialize First Squad
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}