"use client";

import { useState } from "react";
import { Calendar, User, Clock, Save, Send } from "lucide-react";

export default function PortalTimesheets() {
    const [weekEnding, setWeekEnding] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [hours, setHours] = useState({
        mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: ""
    });

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    const calculateTotal = () => {
        return Object.values(hours).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Timesheet submitted for ${candidateName} (Total: ${calculateTotal()} hrs)`);
        // Reset
        setCandidateName("");
        setHours({ mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" });
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Digital Timesheet</h2>
                <p className="text-slate-400">Submit weekly hours for your Stellar crew.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <label className="flex items-center gap-2 text-sm text-secondary font-semibold mb-2">
                            <User size={16} /> Candidate Name
                        </label>
                        <input type="text" required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary focus:outline-none"
                            placeholder="e.g. John Doe"
                            value={candidateName} onChange={e => setCandidateName(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="flex items-center gap-2 text-sm text-secondary font-semibold mb-2">
                            <Calendar size={16} /> Week Ending
                        </label>
                        <input type="date" required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary focus:outline-none"
                            value={weekEnding} onChange={e => setWeekEnding(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm text-secondary font-semibold mb-4">
                        <Clock size={16} /> Hours Breakdown
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                        {days.map(day => (
                            <div key={day} className="text-center">
                                <span className="block text-xs text-slate-500 uppercase mb-1">{day}</span>
                                <input type="number" min="0" step="0.5"
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-center text-white focus:border-secondary focus:outline-none"
                                    value={hours[day]} onChange={e => setHours({ ...hours, [day]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                    <div className="text-xl font-bold text-white">
                        Total: <span className="text-secondary">{calculateTotal()}</span> Hours
                    </div>
                    <button type="submit" className="bg-secondary text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-secondary/90 flex items-center gap-2 transition-transform hover:scale-105">
                        <Send size={18} /> Submit Timesheet
                    </button>
                </div>
            </form>
        </div>
    );
}
