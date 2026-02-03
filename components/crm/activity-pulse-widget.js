"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/data-context.js';
import {
    Mail, MessageCircle, Phone, Maximize2, Minimize2,
    AlertTriangle, CheckCircle, Target, BarChart2, Download
} from "lucide-react";
import { isSameDay, isSameWeek } from 'date-fns';

const KPI_TARGETS = {
    DAILY: { calls: 30, sms: 20, emails: 20, floats: 5 },
    WEEKLY: { calls: 150, sms: 100, emails: 100, floats: 25 }
};

export default function ActivityPulseWidget() {
    const { activityLogs } = useData();
    const [viewMode, setViewMode] = useState('DAILY');
    const [selectedDayIndex, setSelectedDayIndex] = useState(4);
    const [isExpanded, setIsExpanded] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const getDays = () => {
        const today = new Date();
        const day = today.getDay(); // 0 (Sun) - 6 (Sat)
        // If today is Sunday (0), treat it as part of the previous week (Monday = -6)
        // If today is Monday (1), diff is 0. If Tuesday (2), diff is 1.
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
        
        const monday = new Date(today.setDate(diff));
        const days = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(d);
        }
        return days;
    };
    const days = getDays();

    const analytics = useMemo(() => {
        const now = new Date();
        const todayLogs = activityLogs.filter(l => isSameDay(new Date(l.timestamp), now));
        const weekLogs = activityLogs.filter(l => isSameWeek(new Date(l.timestamp), now, { weekStartsOn: 1 }));

        const countTypes = (logs) => ({
            calls: logs.filter(l => l.type === 'contact').length,
            sms: logs.filter(l => l.type === 'sms').length,
            emails: logs.filter(l => l.type === 'email').length,
            floats: logs.filter(l => l.title?.toLowerCase().includes('floated')).length
        });

        const actuals = viewMode === 'DAILY' ? countTypes(todayLogs) : countTypes(weekLogs);
        const targets = viewMode === 'DAILY' ? KPI_TARGETS.DAILY : KPI_TARGETS.WEEKLY;

        const stats = Object.keys(targets).map(key => {
            const actual = actuals[key];
            const target = targets[key];
            const percent = Math.min((actual / target) * 100, 100);

            let status = 'danger';
            if (percent >= 100) status = 'success';
            else if (percent >= 50) status = 'warning';

            let advice = "On Track";
            if (actual < target) {
                const diff = target - actual;
                advice = `${diff} more needed`;
            } else {
                advice = "Target Hit! 🚀";
            }
            return { key, label: key.charAt(0).toUpperCase() + key.slice(1), actual, target, percent, status, advice };
        });

        const overallScore = Math.round(stats.reduce((acc, curr) => acc + curr.percent, 0) / stats.length);
        return { stats, overallScore };
    }, [activityLogs, viewMode]);

    const chartData = useMemo(() => {
        return days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            // Fix timezone issue by comparing localized date strings or strict day matching
            const dayLogs = activityLogs.filter(log => {
                const logDate = new Date(log.timestamp);
                return isSameDay(logDate, date);
            });
            
            return {
                date: date,
                label: date.getDate() === new Date().getDate() ? 'TODAY' : date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                emails: dayLogs.filter(l => l.type === 'email').length,
                sms: dayLogs.filter(l => l.type === 'sms').length,
                calls: dayLogs.filter(l => l.type === 'contact').length,
                total: dayLogs.length,
                logs: dayLogs
            };
        });
    }, [activityLogs]);

    // Default to the current day index (0-4), or 4 (Friday) if weekend
    const getCurrentDayIndex = () => {
        const today = new Date().getDay(); // 0-6
        if (today === 0 || today === 6) return 4; // Weekend -> Show Friday
        return today - 1; // Mon(1)->0, Tue(2)->1...
    };

    useEffect(() => {
        setSelectedDayIndex(getCurrentDayIndex());
    }, []);

    const selectedData = chartData[selectedDayIndex] || chartData[4];

    // --- JOB ADDER EXPORT ---
    const handleExport = () => {
        const logsToExport = selectedData.logs;
        if (!logsToExport || logsToExport.length === 0) return alert("No logs to export for this day.");

        // Define Comprehensive Headers
        const headers = [
            "Date", "Time", "Activity Type", "Method",
            "Client Company", "Project", "Contact Person",
            "Subject/Title", "Message Body"
        ];

        const rows = logsToExport.map(log => {
            const dateObj = new Date(log.timestamp);
            const date = dateObj.toLocaleDateString('en-GB');
            const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            // Extract details safely
            const details = log.details || log.meta_data || {};

            // Safe Defaults
            const clientName = details.clientName || "N/A";
            const projectName = details.projectName || "General Float";
            const contactName = details.contactName || "N/A";
            const method = details.method || (log.type === 'sms' ? 'SMS' : log.type === 'email' ? 'Email' : 'Call');
            const messageBody = details.messageBody || log.description || "";

            const clean = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

            return [
                clean(date),
                clean(time),
                clean(log.type.toUpperCase()),
                clean(method),
                clean(clientName),
                clean(projectName),
                clean(contactName),
                clean(log.title),
                clean(messageBody)
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `JobAdder_Log_${selectedData.date.toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!mounted) return <div className="pulse-widget">Loading...</div>;

    return (
        <>
            {isExpanded && <div className="backdrop" onClick={() => setIsExpanded(false)} />}
            <div className={`pulse-widget ${isExpanded ? 'expanded' : ''}`}>
                <div className="widget-header">
                    <div className="title-row">
                        <div className="flex items-center gap-2">
                            <h3>ACTIVITY PULSE</h3>
                            <div className={`score-badge ${analytics.overallScore >= 80 ? 'good' : 'bad'}`}>
                                {analytics.overallScore}% Perf.
                            </div>
                        </div>
                        <div className="controls">
                            <div className="tabs">
                                <button className={`tab ${viewMode === 'DAILY' ? 'active' : ''}`} onClick={() => setViewMode('DAILY')}>DAILY</button>
                                <button className={`tab ${viewMode === 'WEEKLY' ? 'active' : ''}`} onClick={() => setViewMode('WEEKLY')}>WEEKLY</button>
                            </div>
                            <button className="action-btn" onClick={handleExport} title="Export CSV for JobAdder"><Download size={14} /></button>
                            <button className="action-btn" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Minimize" : "Expand"}>
                                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="analytics-dashboard">
                        <div className="section-title"><Target size={16} className="text-secondary" /> <span>Performance vs Targets ({viewMode})</span></div>
                        <div className="kpi-grid">
                            {analytics.stats.map((stat) => (
                                <div key={stat.key} className="kpi-card">
                                    <div className="kpi-header"><span className="kpi-label">{stat.label}</span><span className={`kpi-status ${stat.status}`}>{stat.actual} <span className="text-slate-500">/ {stat.target}</span></span></div>
                                    <div className="progress-track"><div className={`progress-fill ${stat.status}`} style={{ width: `${stat.percent}%` }} /></div>
                                    <div className="kpi-advice">{stat.status === 'success' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}{stat.advice}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="chart-wrapper">
                    <div className="legend">
                        <div className="legend-item"><span className="dot blue"></span> Email</div>
                        <div className="legend-item"><span className="dot purple"></span> SMS</div>
                        <div className="legend-item"><span className="dot green"></span> Call</div>
                    </div>
                    <div className="chart-container">
                        {chartData.map((data, index) => {
                            const maxScale = 15;
                            const emailH = Math.min((data.emails / maxScale) * 100, 100);
                            const smsH = Math.min((data.sms / maxScale) * 100, 100);
                            const callH = Math.min((data.calls / maxScale) * 100, 100);
                            const isSelected = index === selectedDayIndex;
                            return (
                                <div key={index} className={`chart-col ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedDayIndex(index)}>
                                    <div className="bar-val-top">{data.total > 0 ? data.total : ''}</div>
                                    <div className="bar-track">
                                        {data.emails > 0 && <div className="bar-seg blue" style={{ height: `${emailH}%` }}></div>}
                                        {data.sms > 0 && <div className="bar-seg purple" style={{ height: `${smsH}%` }}></div>}
                                        {data.calls > 0 && <div className="bar-seg green" style={{ height: `${callH}%` }}></div>}
                                    </div>
                                    <div className="day-label">{data.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="drill-down-panel">
                    <div className="panel-header">
                        <span className="font-bold text-slate-300">Activity Log: {selectedData.label}</span>
                        <span className="text-xs text-slate-500">{selectedData.date.toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="log-list custom-scrollbar">
                        {selectedData.logs.length > 0 ? (
                            selectedData.logs.map((log, index) => (
                                <div key={log.id || index} className="log-item">
                                    <div className={`icon-box ${log.type}`}>
                                        {log.type === 'email' && <Mail size={14} />}
                                        {log.type === 'sms' && <MessageCircle size={14} />}
                                        {log.type === 'contact' && <Phone size={14} />}
                                    </div>
                                    <div className="log-details">
                                        <div className="log-title">{log.title}</div>
                                        <div className="log-sub">
                                            {/* Show Client/Project if available, else Description */}
                                            {log.details?.clientName ? `${log.details.clientName} • ${log.details.projectName}` : log.description}
                                        </div>
                                    </div>
                                    <div className="log-time">{new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state"><BarChart2 size={20} className="text-slate-600 mb-2" /><p>No activity recorded.</p></div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 9998; }
                .pulse-widget { background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 12px; padding: 1.25rem; height: 100%; display: flex; flex-direction: column; gap: 1rem; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .pulse-widget.expanded { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; max-width: 900px; height: 85vh; z-index: 9999; background: #0f172a; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid #38bdf8; }
                .widget-header { display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0; }
                .title-row { display: flex; justify-content: space-between; align-items: center; }
                h3 { font-size: 0.9rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
                .score-badge { font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid; }
                .score-badge.good { background: rgba(34, 197, 94, 0.1); color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }
                .score-badge.bad { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
                .controls { display: flex; gap: 0.5rem; align-items: center; }
                .tabs { display: flex; background: #1e293b; border-radius: 6px; padding: 2px; }
                .tab { padding: 4px 12px; font-size: 0.65rem; font-weight: 700; color: #64748b; background: transparent; border: none; border-radius: 4px; cursor: pointer; }
                .tab.active { background: #38bdf8; color: #0f172a; }
                .action-btn { background: #1e293b; color: #94a3b8; border: none; border-radius: 6px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .action-btn:hover { color: white; background: #334155; }
                .analytics-dashboard { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; flex-shrink: 0; }
                .section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; }
                .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
                .kpi-card { background: rgba(15, 23, 42, 0.6); padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; }
                .kpi-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                .kpi-label { font-size: 0.7rem; font-weight: 600; color: #94a3b8; }
                .kpi-status { font-size: 0.85rem; font-weight: 700; color: white; }
                .kpi-status.success { color: #34d399; }
                .kpi-status.warning { color: #fbbf24; }
                .kpi-status.danger { color: #f87171; }
                .progress-track { height: 4px; background: #334155; border-radius: 2px; overflow: hidden; margin-bottom: 0.5rem; }
                .progress-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
                .progress-fill.success { background: #34d399; }
                .progress-fill.warning { background: #fbbf24; }
                .progress-fill.danger { background: #f87171; }
                .kpi-advice { font-size: 0.65rem; display: flex; align-items: center; gap: 4px; color: #cbd5e1; }
                .chart-wrapper { display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0; }
                .legend { display: flex; gap: 1rem; font-size: 0.7rem; color: #94a3b8; }
                .legend-item { display: flex; align-items: center; gap: 4px; }
                .dot { width: 6px; height: 6px; border-radius: 50%; }
                .dot.blue { background: #38bdf8; }
                .dot.purple { background: #a855f7; }
                .dot.green { background: #22c55e; }
                .chart-container { display: flex; justify-content: space-between; align-items: flex-end; height: 120px; padding-bottom: 0.5rem; border-bottom: 1px solid #1e293b; }
                .chart-col { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; cursor: pointer; transition: opacity 0.2s; }
                .chart-col:hover { opacity: 0.8; }
                .chart-col.selected .day-label { color: #38bdf8; font-weight: 700; }
                .bar-val-top { font-size: 0.75rem; color: white; font-weight: 600; min-height: 16px; }
                .bar-track { width: 24px; height: 80px; background: rgba(255,255,255,0.03); border-radius: 4px; display: flex; flex-direction: column-reverse; overflow: hidden; }
                .bar-seg { width: 100%; transition: height 0.5s ease; }
                .bar-seg.blue { background: #38bdf8; }
                .bar-seg.purple { background: #a855f7; }
                .bar-seg.green { background: #22c55e; }
                .day-label { font-size: 0.65rem; color: #64748b; font-weight: 600; margin-top: 4px; }
                .drill-down-panel { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; min-height: 0; }
                .panel-header { display: flex; justify-content: space-between; align-items: baseline; }
                .log-list { overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 4px; max-height: ${isExpanded ? 'none' : '150px'}; flex: ${isExpanded ? '1' : '0 1 auto'}; }
                .log-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid #1e293b; border-radius: 8px; }
                .icon-box { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .icon-box.email { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
                .icon-box.sms { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
                .icon-box.contact { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
                .log-details { flex: 1; overflow: hidden; }
                .log-title { font-size: 0.85rem; color: white; font-weight: 600; }
                .log-sub { font-size: 0.7rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .log-time { font-size: 0.7rem; color: #64748b; font-weight: 500; font-variant-numeric: tabular-nums; }
                .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 0; color: #475569; font-size: 0.75rem; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
            `}</style>
        </>
    );
}