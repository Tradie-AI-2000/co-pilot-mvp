"use client";

import { useState, useMemo } from "react";
import { X, Phone, MessageCircle, Mail, MapPin, Users, Briefcase, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

const SMS_TEMPLATES = [
    {
        id: "placement_check",
        label: "Placement Check",
        text: "Hi [Name], just checking in on how the guys are settling in on site? Any issues let me know."
    },
    {
        id: "labour_needs",
        label: "Labour Needs",
        text: "Hi [Name], expecting to have some strong [Trades] available next week. Any gaps opening up on your projects?"
    },
    {
        id: "coffee",
        label: "Coffee Catch-up",
        text: "Hi [Name], in the area on Thursday. Keen to grab a quick coffee and catch up on the upcoming projects?"
    },
    {
        id: "ssa",
        label: "SSA Check",
        text: "Hi [Name], sending over the SSA (Site Safety Check) for the new guys today. Can you please sign off when you get a chance?"
    }
];

const EMAIL_TEMPLATES = [
    {
        id: "check_in",
        label: "General Check-in",
        subject: "Project Update / Check-in",
        text: "Hi [Name],\n\nHope the week is treating you well.\n\nJust wanted to touch base regarding the current placements on your [Project] site. Are things running smoothly with the team?\n\nAlso, we have some capacity opening up next week for [Trade]. Let me know if you need any extra hands.\n\nCheers,\n[My Name]"
    },
    {
        id: "site_visit",
        label: "Site Visit Request",
        subject: "Site Visit Request",
        text: "Hi [Name],\n\nI'm planning my site runs for later this week and would love to swing by [Project] to see the progress and say hello to the crew.\n\nDoes Thursday morning work for you?\n\nCheers,\n[My Name]"
    }
];

export default function RelationshipActionModal({ client, onClose, onLogActivity }) {
    const [activeTab, setActiveTab] = useState("overview"); // overview, sms, email
    const [message, setMessage] = useState("");
    const [emailSubject, setEmailSubject] = useState("");

    const handleTemplateClick = (template, type) => {
        let msg = template.text.replace("[Name]", client.name.split(' ')[0]);
        // Simple mock replacements - in real app would use actual project data if available
        msg = msg.replace("[Project]", client.projects?.[0]?.name || "your project");

        setMessage(msg);
        if (type === 'email') {
            setEmailSubject(template.subject);
        }
    };

    const handleSendAndLog = () => {
        onLogActivity({
            type: activeTab === 'sms' ? 'sms' : activeTab === 'email' ? 'email' : 'contact',
            notes: message,
            client: client
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADLINE */}
                <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-white">{client.name}</h2>
                            <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${client.tier === 1 ? 'bg-rose-500/20 text-rose-400' :
                                    client.tier === 2 ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-cyan-500/20 text-cyan-400'
                                }`}>
                                Tier {client.tier || 2}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {client.location || "Auckland"}</span>
                            <span className="flex items-center gap-1"><Briefcase size={14} /> {client.projects?.length || 0} Projects</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 min-h-0">

                    {/* SIDEBAR - SUMMARY */}
                    <div className="w-1/3 bg-slate-800/20 border-r border-slate-700 p-5 overflow-y-auto">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Key People</h3>
                        <div className="space-y-4">
                            {client.contacts && client.contacts.length > 0 ? (
                                client.contacts.map((contact, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">{contact.name}</div>
                                            <div className="text-xs text-slate-500">{contact.role}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 italic">No specific contacts listed.</div>
                            )}
                        </div>

                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-4">Active Projects</h3>
                        <div className="space-y-3">
                            {client.projects && client.projects.length > 0 ? (
                                client.projects.map(p => (
                                    <div key={p.id} className="text-sm border-l-2 border-slate-600 pl-3 py-1">
                                        <div className="font-medium text-slate-300">{p.name}</div>
                                        <div className="text-xs text-slate-500">{p.address}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 italic">No active projects linked.</div>
                            )}
                        </div>
                    </div>

                    {/* MAIN CONTENT - TABS */}
                    <div className="flex-1 flex flex-col bg-slate-900/50">
                        {/* TABS HEADER */}
                        <div className="flex border-b border-slate-700">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'overview' ? 'text-secondary border-b-2 border-secondary bg-secondary/5' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('sms')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'sms' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                SMS
                            </button>
                            <button
                                onClick={() => setActiveTab('email')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'email' ? 'text-sky-400 border-b-2 border-sky-400 bg-sky-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Email
                            </button>
                        </div>

                        {/* TAB CONTENT */}
                        <div className="flex-1 p-6 overflow-y-auto">

                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                                        <Phone size={32} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">Ready to Re-engage?</h3>
                                        <p className="text-slate-400 max-w-xs mx-auto text-sm">
                                            This client hasn't been contacted in a while. A quick call or message can reset the decay timer.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleSendAndLog()}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                                    >
                                        <CheckCircle size={20} />
                                        Call & Log Activity
                                    </button>
                                </div>
                            )}

                            {/* SMS TAB */}
                            {activeTab === 'sms' && (
                                <div className="h-full flex flex-col">
                                    <div className="mb-4 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Load Template</label>
                                        <div className="flex flex-wrap gap-2">
                                            {SMS_TEMPLATES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleTemplateClick(t, 'sms')}
                                                    className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300 transition-all font-medium"
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4 flex flex-col relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your SMS message..."
                                            className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-200 text-sm placeholder:text-slate-600 font-sans"
                                        />
                                        <div className="absolute bottom-2 right-2 text-xs text-slate-600 font-mono">{message.length} chars</div>
                                    </div>
                                    <button
                                        onClick={handleSendAndLog}
                                        disabled={!message.trim()}
                                        className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <MessageCircle size={18} /> Send SMS & Log
                                    </button>
                                </div>
                            )}

                            {/* EMAIL TAB */}
                            {activeTab === 'email' && (
                                <div className="h-full flex flex-col">
                                    <div className="mb-4 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Load Template</label>
                                        <div className="flex flex-wrap gap-2">
                                            {EMAIL_TEMPLATES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleTemplateClick(t, 'email')}
                                                    className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:text-sky-300 transition-all font-medium"
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        placeholder="Subject Line"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white mb-3 focus:outline-none focus:border-sky-500/50"
                                    />
                                    <div className="flex-1 bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4 flex flex-col">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your email..."
                                            className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-200 text-sm placeholder:text-slate-600 font-sans"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendAndLog}
                                        disabled={!message.trim()}
                                        className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Mail size={18} /> Send Email & Log
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
