"use client";

import { useState } from "react";
import { X, Send, CheckSquare, Square, Plus, Calendar, Clock, Phone, Mail, Briefcase, TrendingUp, Users, DollarSign, AlertCircle } from "lucide-react";

export default function ClientDetailsModal({ client, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState("summary");
    const [newNote, setNewNote] = useState("");
    const [newTask, setNewTask] = useState("");
    const [localClient, setLocalClient] = useState(client);

    if (!client) return null;

    const handlePipelineChange = (stage) => {
        const updated = { ...localClient, pipelineStage: stage };
        setLocalClient(updated);
        onUpdate(updated);
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = {
            id: Date.now(),
            text: newNote,
            date: new Date().toISOString().split('T')[0],
            author: "You"
        };
        const updated = {
            ...localClient,
            notes: [note, ...(localClient.notes || [])]
        };
        setLocalClient(updated);
        onUpdate(updated);
        setNewNote("");
    };

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        const task = {
            id: Date.now(),
            text: newTask,
            completed: false,
            dueDate: new Date().toISOString().split('T')[0]
        };
        const updated = {
            ...localClient,
            tasks: [task, ...(localClient.tasks || [])]
        };
        setLocalClient(updated);
        onUpdate(updated);
        setNewTask("");
    };

    const toggleTask = (taskId) => {
        const updatedTasks = localClient.tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const updated = { ...localClient, tasks: updatedTasks };
        setLocalClient(updated);
        onUpdate(updated);
    };

    const pipelineStages = ["Lead", "Contacted", "Proposal", "Active", "Closed"];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{localClient.name}</h2>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-400">{localClient.industry}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                {localClient.tier || "Standard Client"}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="pipeline-tracker">
                    {pipelineStages.map((stage, idx) => {
                        const isActive = stage === localClient.pipelineStage;
                        const isPast = pipelineStages.indexOf(localClient.pipelineStage) > idx;
                        return (
                            <div
                                key={stage}
                                className={`pipeline-step ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                                onClick={() => handlePipelineChange(stage)}
                            >
                                <div className="step-dot"></div>
                                <span className="step-label">{stage}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}
                    >
                        Summary
                    </button>
                    <button
                        className={`tab ${activeTab === 'pipeline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pipeline')}
                    >
                        Pipeline
                    </button>
                    <button
                        className={`tab ${activeTab === 'recruitment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recruitment')}
                    >
                        Recruitment
                    </button>
                    <button
                        className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        Activity Log
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'summary' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="card-section">
                                <h3 className="section-title"><Users size={18} /> Internal Team</h3>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Client Owner</div>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent text-white font-medium focus:outline-none"
                                            value={localClient.clientOwner || ""}
                                            onChange={(e) => {
                                                const updated = { ...localClient, clientOwner: e.target.value };
                                                setLocalClient(updated);
                                                onUpdate(updated);
                                            }}
                                            placeholder="Assign..."
                                        />
                                    </div>
                                    <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Account Manager</div>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent text-white font-medium focus:outline-none"
                                            value={localClient.accountManager || ""}
                                            onChange={(e) => {
                                                const updated = { ...localClient, accountManager: e.target.value };
                                                setLocalClient(updated);
                                                onUpdate(updated);
                                            }}
                                            placeholder="Assign..."
                                        />
                                    </div>
                                </div>

                                <h3 className="section-title"><Users size={18} /> Key Contacts</h3>
                                <div className="space-y-3">
                                    {localClient.keyContacts?.map((contact, idx) => (
                                        <div key={idx} className="contact-item">
                                            <div className="font-semibold text-white">{contact.name}</div>
                                            <div className="text-sm text-slate-400">{contact.role}</div>
                                            <div className="text-xs text-sky-400 mt-1 flex items-center gap-2">
                                                <Phone size={12} /> {contact.phone}
                                            </div>
                                            <div className="text-xs text-emerald-400 mt-1">
                                                Prefers: {contact.preference}
                                            </div>
                                        </div>
                                    ))}
                                    {(!localClient.keyContacts || localClient.keyContacts.length === 0) && (
                                        <p className="text-slate-500 italic text-sm">No key contacts listed.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="card-section">
                                    <h3 className="section-title"><Briefcase size={18} /> Contract Status</h3>
                                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                        <div className="text-white font-medium">{localClient.contractStatus || "No active contract"}</div>
                                        <div className="text-xs text-slate-400 mt-1">Always check before submitting candidates.</div>
                                    </div>
                                </div>

                                <div className="card-section">
                                    <h3 className="section-title"><TrendingUp size={18} /> Hiring Insights</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="stat-box">
                                            <div className="label">Time to Hire</div>
                                            <div className="value">{localClient.hiringInsights?.avgTimeToHire || "-"}</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="label">Top Role</div>
                                            <div className="value">{localClient.hiringInsights?.mostHiredRole || "-"}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-slate-400 bg-slate-800/30 p-2 rounded">
                                        "{localClient.hiringInsights?.commonFeedback || "No feedback recorded"}"
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pipeline' && (
                        <div className="space-y-6">
                            <div className="card-section">
                                <h3 className="section-title">Active Projects</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-slate-400 border-b border-slate-700">
                                                <th className="pb-2">Project Name</th>
                                                <th className="pb-2">Location</th>
                                                <th className="pb-2">Stage</th>
                                                <th className="pb-2">Value</th>
                                                <th className="pb-2">Start Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300">
                                            {localClient.projects?.map((proj) => (
                                                <tr key={proj.id} className="border-b border-slate-800/50">
                                                    <td className="py-3 font-medium text-white">{proj.name}</td>
                                                    <td className="py-3">{proj.location}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${proj.stage === 'Won' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                proj.stage === 'Underway' ? 'bg-sky-500/20 text-sky-400' :
                                                                    'bg-slate-700 text-slate-300'
                                                            }`}>
                                                            {proj.stage}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">{proj.value}</td>
                                                    <td className="py-3">{proj.startDate}</td>
                                                </tr>
                                            ))}
                                            {(!localClient.projects || localClient.projects.length === 0) && (
                                                <tr><td colSpan="5" className="py-4 text-center text-slate-500">No active projects.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card-section">
                                <h3 className="section-title flex items-center gap-2">
                                    <AlertCircle size={18} className="text-amber-400" />
                                    Labour Prediction (Next 12 Months)
                                </h3>
                                <div className="space-y-3">
                                    {localClient.projects?.flatMap(p => p.labourPrediction || []).map((pred, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${pred.urgency === 'High' ? 'bg-red-500' :
                                                        pred.urgency === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                                                    }`} />
                                                <div>
                                                    <div className="font-medium text-white">{pred.count}x {pred.role}</div>
                                                    <div className="text-xs text-slate-400">Needed by {pred.start}</div>
                                                </div>
                                            </div>
                                            <button className="text-xs bg-secondary text-slate-900 px-3 py-1.5 rounded font-semibold hover:opacity-90">
                                                Source Now
                                            </button>
                                        </div>
                                    ))}
                                    {(!localClient.projects?.some(p => p.labourPrediction?.length > 0)) && (
                                        <p className="text-slate-500 italic text-sm">No labour predictions available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'recruitment' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="card-section">
                                <h3 className="section-title">Open Job Orders</h3>
                                <div className="space-y-3">
                                    {localClient.recruitmentActivity?.openJobs?.map((job) => (
                                        <div key={job.id} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                            <div className="flex justify-between items-start">
                                                <div className="font-medium text-white">{job.title}</div>
                                                <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded">{job.status}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">Posted {job.posted}</div>
                                        </div>
                                    ))}
                                    {(!localClient.recruitmentActivity?.openJobs?.length) && (
                                        <p className="text-slate-500 italic text-sm">No open jobs.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="card-section">
                                    <h3 className="section-title">Recent Placements</h3>
                                    <div className="space-y-3">
                                        {localClient.recruitmentActivity?.recentPlacements?.map((placement) => (
                                            <div key={placement.id} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                                <div className="font-medium text-white">{placement.candidate}</div>
                                                <div className="text-sm text-slate-300">{placement.role}</div>
                                                <div className="flex justify-between mt-2 text-xs text-slate-400">
                                                    <span>{placement.date}</span>
                                                    <span className="text-emerald-400">{placement.fee}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!localClient.recruitmentActivity?.recentPlacements?.length) && (
                                            <p className="text-slate-500 italic text-sm">No recent placements.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="card-section">
                                    <h3 className="section-title"><DollarSign size={18} /> Financial Snapshot</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="stat-box">
                                            <div className="label">YTD Revenue</div>
                                            <div className="value text-emerald-400">{localClient.financials?.ytdRevenue || "$0"}</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="label">Avg Fee</div>
                                            <div className="value">{localClient.financials?.avgFee || "$0"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-6">
                            <div className="notes-section">
                                <h3 className="section-title mb-3">Notes</h3>
                                <div className="add-note">
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add a meeting note..."
                                        rows={3}
                                    />
                                    <button onClick={handleAddNote} className="send-btn">
                                        <Send size={16} /> Add Note
                                    </button>
                                </div>
                                <div className="notes-list">
                                    {localClient.notes?.map(note => (
                                        <div key={note.id} className="note-item">
                                            <div className="note-header">
                                                <span className="note-author">{note.author}</span>
                                                <span className="note-date">{note.date}</span>
                                            </div>
                                            <p className="note-text">{note.text}</p>
                                        </div>
                                    ))}
                                    {(!localClient.notes || localClient.notes.length === 0) && (
                                        <p className="empty-state">No notes yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="tasks-section">
                                <h3 className="section-title mb-3">Tasks</h3>
                                <div className="add-task">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        placeholder="Add a new task..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                    />
                                    <button onClick={handleAddTask} className="add-btn">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="tasks-list">
                                    {localClient.tasks?.map(task => (
                                        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                            <button onClick={() => toggleTask(task.id)} className="check-btn">
                                                {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                            <span className="task-text">{task.text}</span>
                                            {task.dueDate && (
                                                <span className="task-date">
                                                    <Calendar size={14} /> {task.dueDate}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {(!localClient.tasks || localClient.tasks.length === 0) && (
                                        <p className="empty-state">No tasks yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .modal-content {
                    background: #1e293b;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    width: 100%;
                    max-width: 800px;
                    height: 85vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: rgba(15, 23, 42, 0.5);
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                }
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .pipeline-tracker {
                    display: flex;
                    justify-content: space-between;
                    padding: 1.5rem;
                    background: rgba(15, 23, 42, 0.3);
                    position: relative;
                    border-bottom: 1px solid var(--border);
                }
                
                .pipeline-tracker::before {
                    content: '';
                    position: absolute;
                    top: 28px;
                    left: 2rem;
                    right: 2rem;
                    height: 2px;
                    background: var(--border);
                    z-index: 0;
                }

                .pipeline-step {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    flex: 1;
                }

                .step-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--border);
                    border: 2px solid #1e293b;
                    transition: all 0.2s;
                }

                .pipeline-step.active .step-dot {
                    background: var(--secondary);
                    transform: scale(1.2);
                    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2);
                }

                .pipeline-step.completed .step-dot {
                    background: var(--secondary);
                }

                .step-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .pipeline-step.active .step-label,
                .pipeline-step.completed .step-label {
                    color: var(--secondary);
                }

                .tabs {
                    display: flex;
                    border-bottom: 1px solid var(--border);
                    padding: 0 1.5rem;
                    background: rgba(15, 23, 42, 0.2);
                }

                .tab {
                    background: none;
                    border: none;
                    padding: 1rem 1.5rem;
                    color: var(--text-muted);
                    font-weight: 500;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: color 0.2s;
                }

                .tab:hover {
                    color: var(--text-main);
                }

                .tab.active {
                    color: var(--secondary);
                    border-bottom-color: var(--secondary);
                }

                .tab-content {
                    padding: 1.5rem;
                    overflow-y: auto;
                    flex: 1;
                }

                .section-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .card-section {
                    background: rgba(30, 41, 59, 0.5);
                    padding: 0;
                }

                .contact-item {
                    padding: 1rem;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                }

                .stat-box {
                    background: rgba(15, 23, 42, 0.5);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .stat-box .label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-bottom: 0.25rem;
                }

                .stat-box .value {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: white;
                }

                /* Notes Styles */
                .add-note {
                    margin-bottom: 1.5rem;
                }
                
                .add-note textarea {
                    width: 100%;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.75rem;
                    color: white;
                    margin-bottom: 0.5rem;
                    resize: vertical;
                }

                .send-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    margin-left: auto;
                }

                .note-item {
                    background: rgba(15, 23, 42, 0.3);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    margin-bottom: 1rem;
                }

                .note-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .note-author {
                    font-weight: 600;
                    color: var(--secondary);
                }

                .note-text {
                    color: var(--text-main);
                    font-size: 0.875rem;
                    white-space: pre-wrap;
                }

                /* Tasks Styles */
                .add-task {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .add-task input {
                    flex: 1;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.75rem;
                    color: white;
                }

                .add-btn {
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    width: 42px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .task-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-bottom: 1px solid var(--border);
                }

                .task-item:last-child {
                    border-bottom: none;
                }

                .check-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0;
                }

                .task-item.completed .check-btn {
                    color: var(--secondary);
                }

                .task-text {
                    flex: 1;
                    color: var(--text-main);
                }

                .task-item.completed .task-text {
                    text-decoration: line-through;
                    color: var(--text-muted);
                }

                .task-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .empty-state {
                    text-align: center;
                    color: var(--text-muted);
                    padding: 2rem;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
