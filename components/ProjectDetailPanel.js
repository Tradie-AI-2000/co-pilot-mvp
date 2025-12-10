"use client";

import { useState, useEffect } from "react";
import { X, Save, Bell, Zap, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";

export default function ProjectDetailPanel({ client, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState("details");
    const [localClient, setLocalClient] = useState(client);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved

    // Automation Builder State
    const [automationLogic, setAutomationLogic] = useState({
        trigger: "Project Stage",
        condition: "Completed",
        action: "Notify",
        target: "Key Contact"
    });

    useEffect(() => {
        setLocalClient(client);
    }, [client]);

    const handleFieldChange = (field, value) => {
        const updated = { ...localClient, [field]: value };
        setLocalClient(updated);

        // Optimistic Auto-Save Simulation
        setSaveStatus("saving");
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            onUpdate(updated);
            setSaveStatus("saved");
            setIsSaving(false);
            setTimeout(() => setSaveStatus("idle"), 2000);
        }, 800);
    };

    const handleActivateAlert = () => {
        // Logic to persist alert configuration
        alert(`Alert Activated: IF ${automationLogic.trigger} IS ${automationLogic.condition} THEN ${automationLogic.action} FOR ${automationLogic.target}`);
    };

    if (!client) return null;

    return (
        <>
            <div className="scrim" onClick={onClose}></div>
            <div className="drawer-panel">
                <div className="drawer-header">
                    <div className="header-content">
                        <h2 className="text-2xl font-bold text-white">{localClient.name}</h2>
                        <div className="status-indicator">
                            {saveStatus === "saving" && <span className="text-amber-400 text-xs flex items-center gap-1">Saving...</span>}
                            {saveStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Saved</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('automation')}
                    >
                        Automation
                    </button>
                </div>

                <div className="drawer-content">
                    {activeTab === 'details' && (
                        <div className="details-view space-y-6">
                            <div className="form-group">
                                <label>Client Name</label>
                                <input
                                    value={localClient.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>Industry</label>
                                <input
                                    value={localClient.industry}
                                    onChange={(e) => handleFieldChange('industry', e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            {/* Trade Stack Section */}
                            {localClient.tradeStack && (
                                <div className="info-block">
                                    <h3 className="section-title">Trade Stack</h3>
                                    <div className="trade-stack-grid">
                                        <div className="stack-column">
                                            <span className="label">Current Phase</span>
                                            <div className="stack-list">
                                                {localClient.tradeStack.current.map((item, i) => (
                                                    <div key={i} className="stack-item active">
                                                        <div className="count">{item.count}</div>
                                                        <div className="role">{item.role}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="stack-column">
                                            <span className="label">Next Phase (Unfilled)</span>
                                            <div className="stack-list">
                                                {localClient.tradeStack.next.map((item, i) => (
                                                    <div key={i} className="stack-item opportunity">
                                                        <div className="count">{item.count}</div>
                                                        <div className="role">{item.role}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="pitch-btn">Pitch Candidates Now</button>
                                </div>
                            )}

                            {/* Placeholder for more detailed fields from the old modal */}
                            <div className="info-block">
                                <h3 className="section-title">Key Contacts</h3>
                                {localClient.keyContacts?.map((contact, idx) => (
                                    <div key={idx} className="contact-item">
                                        <div className="font-bold">{contact.name}</div>
                                        <div className="text-sm text-muted">{contact.role}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'automation' && (
                        <div className="automation-view space-y-8">
                            <div className="visual-builder">
                                <h3 className="section-title flex items-center gap-2">
                                    <Zap size={16} className="text-yellow-400" /> Visual Alert Builder
                                </h3>

                                <div className="builder-row">
                                    <span className="keyword">IF</span>
                                    <select
                                        value={automationLogic.trigger}
                                        onChange={(e) => setAutomationLogic({ ...automationLogic, trigger: e.target.value })}
                                        className="builder-select"
                                    >
                                        <option>Project Stage</option>
                                        <option>Labour Demand</option>
                                        <option>Last Contact</option>
                                    </select>
                                </div>

                                <div className="builder-row">
                                    <span className="keyword">IS</span>
                                    <select
                                        value={automationLogic.condition}
                                        onChange={(e) => setAutomationLogic({ ...automationLogic, condition: e.target.value })}
                                        className="builder-select"
                                    >
                                        <option>Completed</option>
                                        <option>Starting</option>
                                        <option>Delayed</option>
                                    </select>
                                </div>

                                <div className="builder-row">
                                    <span className="keyword">THEN</span>
                                    <select
                                        value={automationLogic.action}
                                        onChange={(e) => setAutomationLogic({ ...automationLogic, action: e.target.value })}
                                        className="builder-select"
                                    >
                                        <option>Notify</option>
                                        <option>Create Task</option>
                                        <option>Send Email</option>
                                    </select>
                                </div>

                                <div className="builder-row">
                                    <span className="keyword">FOR</span>
                                    <select
                                        value={automationLogic.target}
                                        onChange={(e) => setAutomationLogic({ ...automationLogic, target: e.target.value })}
                                        className="builder-select"
                                    >
                                        <option>Key Contact</option>
                                        <option>Account Manager</option>
                                        <option>Recruitment Team</option>
                                    </select>
                                </div>

                                <button onClick={handleActivateAlert} className="activate-btn">
                                    Activate Alert
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .scrim {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(2px);
                    z-index: 900;
                }

                .drawer-panel {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 500px;
                    background: #0f172a;
                    border-left: 1px solid var(--border);
                    box-shadow: -5px 0 25px rgba(0,0,0,0.5);
                    z-index: 950;
                    display: flex;
                    flex-direction: column;
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .drawer-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: #1e293b;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                }
                
                .close-btn:hover { color: white; }

                .tabs {
                    display: flex;
                    border-bottom: 1px solid var(--border);
                    background: #1e293b;
                    padding: 0 1.5rem;
                }

                .tab {
                    background: none;
                    border: none;
                    padding: 1rem 1.5rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                }

                .tab.active {
                    color: var(--secondary);
                    border-bottom-color: var(--secondary);
                }

                .drawer-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .input-field {
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--border);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    color: white;
                    outline: none;
                }

                .input-field:focus {
                    border-color: var(--secondary);
                }

                .section-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1rem;
                }

                .contact-item {
                    background: rgba(255,255,255,0.05);
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 0.5rem;
                }

                /* Trade Stack Styles */
                .trade-stack-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .stack-column {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .stack-column .label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .stack-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .stack-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                }

                .stack-item.active {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .stack-item.opportunity {
                    background: rgba(168, 85, 247, 0.1);
                    border: 1px dashed rgba(168, 85, 247, 0.4);
                }

                .stack-item .count {
                    font-weight: 700;
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 0.75rem;
                }

                .stack-item.opportunity .count {
                    background: rgba(168, 85, 247, 0.2);
                    color: #d8b4fe;
                }

                .pitch-btn {
                    width: 100%;
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .pitch-btn:hover {
                    background: #0ea5e9; /* Sky 500 */
                }

                /* Visual Builder Styles */
                .visual-builder {
                    background: rgba(255,255,255,0.03);
                    padding: 1.5rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }

                .builder-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .keyword {
                    font-weight: 800;
                    color: var(--secondary);
                    width: 50px;
                    text-align: right;
                    font-size: 0.9rem;
                }

                .builder-select {
                    flex: 1;
                    background: #0f172a;
                    border: 1px solid var(--border);
                    padding: 0.5rem;
                    border-radius: var(--radius-sm);
                    color: white;
                    outline: none;
                }

                .activate-btn {
                    width: 100%;
                    background: var(--secondary);
                    color: #0f172a;
                    border: none;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    margin-top: 1rem;
                    cursor: pointer;
                }

                .activate-btn:hover {
                    background: #0ea5e9;
                }
            `}</style>
        </>
    );
}
