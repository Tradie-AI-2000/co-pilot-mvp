"use client";

import { useState } from "react";
import { Users, DollarSign, Briefcase, Trash2, ExternalLink, Shield, Hammer, HardHat, Plus, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";

export default function SquadCard({ squad, onRemoveMember, onDeploy, onDisband, onRename }) {
    const { id, name, members, status } = squad;
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate Blended Rate
    const totalRate = members.reduce((sum, m) => sum + (parseFloat(m.chargeOutRate?.replace('$', '')) || 0), 0);
    const blendedRate = members.length > 0 ? (totalRate / members.length).toFixed(2) : "0.00";

    // Group members by role for visualization
    const groupedMembers = {
        leadership: members.filter(m => m.role?.toLowerCase().includes('lead') || m.role?.toLowerCase().includes('foreman')),
        trades: members.filter(m => !m.role?.toLowerCase().includes('lead') && !m.role?.toLowerCase().includes('labour')),
        labour: members.filter(m => m.role?.toLowerCase().includes('labour'))
    };

    const getRoleIcon = (role) => {
        if (role?.toLowerCase().includes('lead')) return <Shield size={14} className="text-purple-400" />;
        if (role?.toLowerCase().includes('labour')) return <HardHat size={14} className="text-orange-400" />;
        return <Hammer size={14} className="text-blue-400" />;
    };

    // Determine Status Color
    const statusColor = members.length > 0 ? "bg-green-500" : "bg-red-500";
    const statusText = members.length > 0 ? "Ready to Deploy" : "Drafting";

    if (!isExpanded) {
        return (
            <div
                onClick={() => setIsExpanded(true)}
                className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer hover:bg-slate-800 transition-all duration-300 shadow-lg group h-48 flex flex-col justify-center"
            >
                {/* Left Border Indicator */}
                <div className={"absolute left-0 top-0 bottom-0 w-1.5 " + statusColor}></div>

                <div className="pl-4 flex items-start justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-slate-600 transition-colors">
                                <AlertCircle className={members.length > 0 ? "text-green-400" : "text-red-400"} size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{name}</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{statusText}</p>
                            </div>
                        </div>

                        <div>
                            <span className="text-5xl font-bold text-white tracking-tighter">{members.length}</span>
                            <span className="text-sm text-slate-500 ml-2 font-medium">Members</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Rate</div>
                        <div className="text-xl font-bold text-white flex items-center justify-end tracking-tight">
                            <span className="text-green-400 mr-0.5">$</span>{blendedRate}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-300 shadow-lg hover:shadow-secondary/10">
            {/* Header Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>

            <div className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <input
                            className="w-full bg-transparent text-xl font-bold text-white outline-none border-b border-transparent focus:border-secondary placeholder-slate-600 transition-colors"
                            value={name}
                            onChange={(e) => onRename(id, e.target.value)}
                            placeholder="Squad Name"
                        />
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                            <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md">
                                <Users size={12} /> {members.length} Members
                            </span>
                            <span className={`px-2 py-1 rounded-md border ${status === 'Deployed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                {status || 'Draft'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Blended Rate</div>
                            <div className="text-2xl font-bold text-white flex items-center justify-end tracking-tight">
                                <span className="text-green-400 mr-0.5">$</span>{blendedRate}<span className="text-sm text-slate-500 font-normal ml-1">/hr</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <ChevronUp size={20} />
                        </button>
                    </div>
                </div>

                {/* Members Grid */}
                <div className="space-y-4 min-h-[120px]">
                    {members.length === 0 ? (
                        <div className="h-full border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 text-sm italic bg-slate-800/20 py-8 gap-2">
                            <Users size={24} className="opacity-20" />
                            <span>Add members from bench</span>
                        </div>
                    ) : (
                        <>
                            {/* Leadership */}
                            {groupedMembers.leadership.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-[10px] uppercase text-purple-400/80 font-bold tracking-wider flex items-center gap-2">
                                        <div className="h-px bg-purple-500/20 flex-1"></div>
                                        Leadership
                                        <div className="h-px bg-purple-500/20 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {groupedMembers.leadership.map(m => (
                                            <SquadMemberRow key={m.id} member={m} onRemove={() => onRemoveMember(id, m.id)} icon={getRoleIcon(m.role)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trades */}
                            {groupedMembers.trades.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-[10px] uppercase text-blue-400/80 font-bold tracking-wider flex items-center gap-2">
                                        <div className="h-px bg-blue-500/20 flex-1"></div>
                                        Trades
                                        <div className="h-px bg-blue-500/20 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {groupedMembers.trades.map(m => (
                                            <SquadMemberRow key={m.id} member={m} onRemove={() => onRemoveMember(id, m.id)} icon={getRoleIcon(m.role)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Labour */}
                            {groupedMembers.labour.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-[10px] uppercase text-orange-400/80 font-bold tracking-wider flex items-center gap-2">
                                        <div className="h-px bg-orange-500/20 flex-1"></div>
                                        Support
                                        <div className="h-px bg-orange-500/20 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {groupedMembers.labour.map(m => (
                                            <SquadMemberRow key={m.id} member={m} onRemove={() => onRemoveMember(id, m.id)} icon={getRoleIcon(m.role)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="pt-4 mt-auto border-t border-slate-800 flex gap-3">
                    <button
                        className="flex-1 bg-secondary hover:bg-secondary-light text-slate-900 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onDeploy(id)}
                        disabled={members.length === 0}
                    >
                        <Briefcase size={16} /> Deploy Squad
                    </button>
                    <button
                        className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors border border-slate-700 hover:border-red-500/30"
                        onClick={() => onDisband(id)}
                        title="Disband Squad"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function SquadMemberRow({ member, onRemove, icon }) {
    return (
        <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50 group hover:border-slate-600 hover:bg-slate-800 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                    {member.firstName[0]}{member.lastName[0]}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-200 font-medium leading-none mb-1">{member.firstName} {member.lastName}</span>
                    <div className="flex items-center gap-1.5">
                        {icon}
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{member.role}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-secondary font-medium bg-secondary/10 px-1.5 py-0.5 rounded">{member.chargeOutRate}</span>
                <button
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-500/10 rounded"
                    onClick={onRemove}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
