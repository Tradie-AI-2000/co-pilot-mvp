"use client";

import { useState } from "react";
import { Plus, Users, Search, Filter, GripVertical, UserPlus, ArrowRight } from "lucide-react";
import SquadCard from "./SquadCard";

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
        <div className="flex h-[calc(100vh-12rem)] gap-6 relative">
            {/* Deployment Modal */}
            {deployingSquadId && (
                <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-96 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Deploy Squad</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Select a project to assign <span className="text-white font-semibold">{squads.find(s => s.id === deployingSquadId)?.name}</span> to.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Target Project</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm outline-none focus:border-secondary"
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                >
                                    <option value="">Select Project...</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    className="flex-1 bg-secondary text-slate-900 py-2 rounded-lg font-bold hover:bg-secondary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={confirmDeploy}
                                    disabled={!selectedProjectId}
                                >
                                    Confirm Deployment
                                </button>
                                <button
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                                    onClick={() => setDeployingSquadId(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Panel: The Bench */}
            <div className="w-80 flex-shrink-0 flex flex-col gap-4 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users className="text-slate-400" /> The Bench
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{benchCandidates.length}</span>
                    </h3>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-secondary"
                        placeholder="Search candidates..."
                        value={benchFilter}
                        onChange={(e) => setBenchFilter(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {benchCandidates.map(candidate => (
                        <div
                            key={candidate.id}
                            className="bg-slate-800 border border-slate-700 p-3 rounded-lg hover:border-slate-500 transition-colors group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                        {candidate.firstName[0]}{candidate.lastName[0]}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{candidate.firstName} {candidate.lastName}</div>
                                        <div className="text-xs text-slate-400">{candidate.role}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-secondary">{candidate.chargeOutRate}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Squad Zone (Grid Style) */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-lg font-bold text-white">Active Squads</h3>
                    <button
                        onClick={createNewSquad}
                        className="bg-secondary text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-secondary-light transition-colors"
                    >
                        <Plus size={16} /> New Squad
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                        {squads.map(squad => (
                            <div
                                key={squad.id}
                                className="h-full"
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

                        {/* Empty State / Add Squad Hint */}
                        {squads.length === 0 && (
                            <div className="col-span-full h-64 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-4">
                                <Users size={48} className="opacity-20" />
                                <p>Create a squad to start assembling your team</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
