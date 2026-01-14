"use client";

import { useData } from "../../context/data-context";
import { Building, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";

export default function ClientProjectsView() {
    const { projects } = useData();
    // Mock filtering for the logged-in client (e.g., ID 1)
    const clientProjects = projects.filter(p => p.assignedCompanyIds?.includes(1));

    return (
        <div className="p-6 text-white">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Building className="text-secondary" /> Project History
                    </h2>
                    <p className="text-slate-400 text-sm">Manage and review your active and past sites.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientProjects.length === 0 ? (
                    <div className="col-span-full p-8 rounded-xl bg-slate-800/50 border border-slate-700 text-center text-slate-400 italic">
                        No projects found. Use the Project Builder to create one.
                    </div>
                ) : (
                    clientProjects.map(p => (
                        <div key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-secondary transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg">{p.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded border ${p.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                    }`}>
                                    {p.status || 'Active'}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-500" />
                                    {p.address || p.location || "No address"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-500" />
                                    {p.startDate ? `Started: ${p.startDate}` : "Start TBD"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-slate-500" />
                                    {p.duration || "Duration TBD"}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Site Manager: {p.siteManager || "N/A"}</span>
                                <CheckCircle size={16} className="text-slate-600 group-hover:text-secondary" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
