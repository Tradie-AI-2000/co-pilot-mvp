"use client";

import { useState } from "react";
import { Users, Briefcase, Trash2, Shield, Hammer, HardHat, AlertCircle, ChevronUp } from "lucide-react";

export default function SquadCard({ squad, onRemoveMember, onDeploy, onDisband, onRename }) {
    const { id, name, members, status } = squad;
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate Blended Rate
    const totalRate = members.reduce((sum, m) => sum + (parseFloat(m.chargeOutRate?.replace('$', '')) || 0), 0);
    const blendedRate = members.length > 0 ? (totalRate / members.length).toFixed(2) : "0.00";

    // Group members by role
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

    // Determine Status Text
    const statusText = members.length > 0 ? "Ready to Deploy" : "Drafting";

    // --- COLLAPSED VIEW ---
    if (!isExpanded) {
        return (
            <div
                onClick={() => setIsExpanded(true)}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 cursor-pointer hover:border-secondary/50 transition-all duration-300 shadow-xl hover:shadow-2xl group h-64 flex flex-col justify-between transform-gpu"
            >
                {/* Status Indicator Glow (Ambient) */}
                <div className={`absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-30 ${members.length > 0 ? 'bg-secondary' : 'bg-red-500'}`}></div>

                <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            {/* Icon Box */}
                            <div className="w-14 h-14 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center group-hover:border-secondary/40 transition-all duration-500 shadow-inner backdrop-blur-sm">
                                <AlertCircle className={members.length > 0 ? "text-secondary drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" : "text-red-500"} size={26} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white group-hover:text-secondary transition-colors tracking-tight">{name}</h3>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${members.length > 0 ? 'text-secondary/80' : 'text-red-500/80'}`}>{statusText}</p>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left transform-gpu">{members.length}</span>
                            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-widest">Operators</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] mb-2">Blended Rate</div>
                        <div className="text-3xl font-black text-white flex items-center justify-end tracking-tighter">
                            <span className="text-secondary mr-1 opacity-50">$</span>{blendedRate}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-auto">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-3">
                        {/* LED Pulse with physical shadow */}
                        <div className={`w-2 h-2 rounded-full ${members.length > 0 ? 'bg-secondary animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}></div>
                        System Status: {members.length > 0 ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    <span className="text-secondary text-[10px] font-black uppercase tracking-widest opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Expand Console →</span>
                </div>
            </div>
        );
    }

    // --- EXPANDED VIEW ---
    return (
        <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 transition-all duration-300">
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-blue-600 to-purple-600 opacity-80"></div>

            <div className="p-8 flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="flex-1 max-w-md">
                        {/* Borderless Input Fix */}
                        <input
                            className="w-full bg-transparent text-3xl font-black text-white outline-none border-none focus:ring-0 p-0 placeholder-slate-700 transition-all tracking-tight appearance-none"
                            value={name}
                            onChange={(e) => onRename(id, e.target.value)}
                            placeholder="INITIALIZE SQUAD NAME..."
                            autoFocus
                        />
                        <div className="flex items-center gap-3 mt-4">
                            <span className="flex items-center gap-2 bg-slate-800/50 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                <Users size={14} className="text-secondary" /> {members.length} PERSONNEL
                            </span>
                            <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${status === 'Deployed' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-slate-800/50 border-white/5 text-slate-500'}`}>
                                {status || 'DRAFT_MODE'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-6">
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] mb-2">Blended Rate</div>
                            <div className="text-4xl font-black text-white flex items-center justify-end tracking-tighter">
                                <span className="text-secondary mr-1 opacity-50">$</span>{blendedRate}<span className="text-xs text-slate-500 font-bold ml-2 tracking-normal">/HR</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all p-3 rounded-xl border border-white/5"
                        >
                            <ChevronUp size={20} />
                        </button>
                    </div>
                </div>

                {/* Members Grid */}
                <div className="space-y-6 min-h-[200px]">
                    {members.length === 0 ? (
                        <div className="h-48 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-widest bg-slate-950/30 gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
                                <Users size={32} className="opacity-20" />
                            </div>
                            <span>Awaiting Personnel Assignment</span>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Leadership Section */}
                            {groupedMembers.leadership.length > 0 && (
                                <div className="space-y-3">
                                    <div className="text-[10px] uppercase text-purple-400 font-black tracking-[0.3em] flex items-center gap-4 px-1">
                                        COMMAND
                                        <div className="h-px bg-purple-500/20 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {groupedMembers.leadership.map(m => (
                                            <SquadMemberRow key={m.id} member={m} onRemove={() => onRemoveMember(id, m.id)} icon={getRoleIcon(m.role)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trades Section */}
                            {groupedMembers.trades.length > 0 && (
                                <div className="space-y-3">
                                    <div className="text-[10px] uppercase text-secondary font-black tracking-[0.3em] flex items-center gap-4 px-1">
                                        OPERATIVES
                                        <div className="h-px bg-secondary/20 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {groupedMembers.trades.map(m => (
                                            <SquadMemberRow key={m.id} member={m} onRemove={() => onRemoveMember(id, m.id)} icon={getRoleIcon(m.role)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Labour Section */}
                            {groupedMembers.labour.length > 0 && (
                                <div className="space-y-3">
                                    {/* High Contrast Fix: Orange-400 to Orange-300 */}
                                    <div className="text-[10px] uppercase text-orange-300 font-black tracking-[0.3em] flex items-center gap-4 px-1">
                                        SUPPORT
                                        <div className="h-px bg-orange-500/20 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {groupedMembers.labour.map(m => (
                                            <SquadMemberRow key={m.id} member={m} onRemove={() => onRemoveMember(id, m.id)} icon={getRoleIcon(m.role)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="pt-8 border-t border-white/5 flex gap-4 mt-auto">
                    <button
                        className="flex-1 bg-secondary hover:bg-secondary-light text-slate-950 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:shadow-[0_0_30px_rgba(0,242,255,0.25)] disabled:opacity-30 disabled:grayscale disabled:shadow-none transform-gpu active:scale-[0.98]"
                        onClick={() => onDeploy(id)}
                        disabled={members.length === 0}
                    >
                        <Briefcase size={18} strokeWidth={2.5} /> Deploy Personnel
                    </button>
                    <button
                        className="px-6 py-4 bg-white/5 text-slate-500 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20"
                        onClick={() => onDisband(id)}
                        title="TERMINATE SQUAD"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function SquadMemberRow({ member, onRemove, icon }) {
    return (
        <div className="flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/80 p-3 rounded-xl border border-white/5 group/row hover:border-white/10 transition-all cursor-default">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-xs font-black text-secondary border border-white/5 shadow-inner">
                    {member.firstName[0]}{member.lastName[0]}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-white font-bold tracking-tight">{member.firstName} {member.lastName}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                        {icon}
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{member.role}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-md border border-secondary/10 font-mono shadow-[0_0_10px_rgba(0,242,255,0.05)]">
                    {member.chargeOutRate}
                </span>
                {/* Fat Finger Fix: Increased padding (p-3) */}
                <button
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-all p-3 rounded-lg hover:bg-red-500/10"
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}