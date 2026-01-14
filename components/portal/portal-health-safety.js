"use client";

import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function PortalHealthSafety() {
    const [incidents, setIncidents] = useState(false);
    const [hazards, setHazards] = useState(false);
    const [comments, setComments] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Health & Safety Report Submitted. Thank you for keeping the site safe.");
        setComments("");
        setIncidents(false);
        setHazards(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <Shield className="text-green-500" size={32} /> Health & Safety Check
                </h2>
                <p className="text-slate-400">Weekly H&S declaration for active sites.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl space-y-6">

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-white font-semibold mb-3">1. Incident Reporting</h3>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input type="radio" name="incidents" checked={!incidents} onChange={() => setIncidents(false)} className="accent-green-500" />
                            <CheckCircle size={18} className="text-green-500" /> No incidents to report
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input type="radio" name="incidents" checked={incidents} onChange={() => setIncidents(true)} className="accent-red-500" />
                            <AlertTriangle size={18} className="text-red-500" /> Incident occured
                        </label>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-white font-semibold mb-3">2. New Hazards</h3>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input type="radio" name="hazards" checked={!hazards} onChange={() => setHazards(false)} className="accent-green-500" />
                            <CheckCircle size={18} className="text-green-500" /> No new hazards
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input type="radio" name="hazards" checked={hazards} onChange={() => setHazards(true)} className="accent-orange-500" />
                            <AlertTriangle size={18} className="text-orange-500" /> New hazard identified
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Comments / Details</label>
                    <textarea
                        className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white h-32 focus:border-secondary focus:outline-none"
                        placeholder="Please provide details of any incidents, hazards, or general feedback..."
                        value={comments}
                        onChange={e => setComments(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
                    Submit Report
                </button>
            </form>
        </div>
    );
}
