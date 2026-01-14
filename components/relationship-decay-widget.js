"use client";

import { useMemo } from "react";
import { Clock, AlertTriangle, Shield, Trophy, History } from "lucide-react";
import { differenceInDays, parse, isValid } from "date-fns";

export default function RelationshipDecayWidget({ clients, onContact }) {

    // Process and Group Clients by Tier
    const groupedClients = useMemo(() => {
        const today = new Date();
        const groups = { 1: [], 2: [], 3: [] };

        clients.forEach(client => {
            // 1. Determine Tier (Default to 2)
            const tier = client.tier || 2;
            let frequency = 14;
            if (tier === 1) frequency = 7;
            else if (tier === 3) frequency = 30;

            // 2. Calculate Days Since Last Contact
            let lastContactDate = null;
            if (client.lastContact) {
                if (client.lastContact.includes('/')) {
                    lastContactDate = parse(client.lastContact, 'dd/MM/yyyy', new Date());
                } else {
                    lastContactDate = new Date(client.lastContact);
                }
            }

            let daysSince = 999;
            if (isValid(lastContactDate)) {
                daysSince = differenceInDays(today, lastContactDate);
            }

            // 3. Status
            const isOverdue = daysSince > frequency;

            // 4. Add to Group
            if (groups[tier]) {
                groups[tier].push({
                    ...client,
                    daysSince,
                    frequency,
                    isOverdue
                });
            }
        });

        // Sort each group: Overdue first, then by days waiting desc
        const sorter = (a, b) => b.daysSince - a.daysSince;

        return {
            1: groups[1].sort(sorter),
            2: groups[2].sort(sorter),
            3: groups[3].sort(sorter)
        };
    }, [clients]);

    const renderTierColumn = (tier, title, icon, colorClass, borderClass, bgClass) => {
        const tierClients = groupedClients[tier];
        const overdueCount = tierClients.filter(c => c.isOverdue).length;

        return (
            <div className="flex flex-col h-full bg-slate-800/20 rounded-xl border border-slate-700/50 overflow-hidden">
                {/* Header */}
                <div className={`p-3 border-b ${borderClass} flex justify-between items-center bg-slate-900/50`}>
                    <div className="flex items-center gap-2">
                        {icon}
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{title}</h4>
                    </div>
                    {overdueCount > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bgClass} ${colorClass}`}>
                            {overdueCount} At Risk
                        </span>
                    )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {tierClients.length === 0 ? (
                        <div className="text-center py-4 text-slate-600 text-[10px] italic">No clients</div>
                    ) : (
                        tierClients.map(client => (
                            <div
                                key={client.id}
                                onClick={() => onContact && onContact(client)}
                                className={`
                                    group relative p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center
                                    ${client.isOverdue
                                        ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                    }
                                `}
                            >
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className={`text-xs font-bold truncate ${client.isOverdue ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                        {client.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {client.daysSince === 999 ? 'Never' : `${client.daysSince}d ago`}
                                    </span>
                                </div>
                                <div className="shrink-0">
                                    {client.isOverdue ? (
                                        <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                                    ) : (
                                        <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="hunter-card decay-card glass-panel flex flex-col h-full w-full">
            <div className="card-header border-b border-orange-500/30 pb-3 mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Clock size={20} className="text-orange-400" />
                    <h3 className="text-orange-100 font-bold uppercase tracking-wider text-lg">Relationship Decay</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
                {renderTierColumn(1, "Tier 1: Defense", <Shield size={14} className="text-rose-400" />, "text-rose-400", "border-rose-500/20", "bg-rose-500/10")}
                {renderTierColumn(2, "Tier 2: Growth", <Trophy size={14} className="text-amber-400" />, "text-amber-400", "border-amber-500/20", "bg-amber-500/10")}
                {renderTierColumn(3, "Tier 3: Revival", <History size={14} className="text-cyan-400" />, "text-cyan-400", "border-cyan-500/20", "bg-cyan-500/10")}
            </div>
        </div>
    );
}
