"use client";

import { useState, useEffect } from "react";
import { X, Save, Bell, Zap, ChevronRight, CheckCircle, AlertTriangle, Phone, Mail, User } from "lucide-react";
import { useData } from "../context/data-context.js";

export default function ProjectDetailPanel({ client, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState("details");
    const [localClient, setLocalClient] = useState(client);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved
    const { clients } = useData();

    // Find parent client context
    const parentClient = clients.find(c => c.id === client.assignedCompanyIds?.[0]) || client;

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
                    <button
                        className={`tab ${activeTab === 'intelligence' ? 'active' : ''}`}
                        onClick={() => setActiveTab('intelligence')}
                    >
                        Intelligence
                    </button>
                    <button
                        className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                </div>

                <div className="drawer-content">
                    {activeTab === 'details' && (
                        <div className="details-view space-y-6">
                            <div className="form-group">
                                <label>Project Name</label>
                                <input
                                    value={localClient.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label>Main Contractor (Owner)</label>
                                <select
                                    value={localClient.assignedCompanyIds?.[0] || ""}
                                    onChange={(e) => {
                                        const newClientId = parseInt(e.target.value);
                                        const newClient = clients.find(c => c.id === newClientId);
                                        const updated = {
                                            ...localClient,
                                            assignedCompanyIds: [newClientId],
                                            client: newClient ? newClient.name : localClient.client
                                        };
                                        setLocalClient(updated);
                                        // Trigger auto-save immediately for this critical field
                                        setSaveStatus("saving");
                                        setIsSaving(true);
                                        setTimeout(() => {
                                            onUpdate(updated);
                                            setSaveStatus("saved");
                                            setIsSaving(false);
                                            setTimeout(() => setSaveStatus("idle"), 2000);
                                        }, 800);
                                    }}
                                    className="input-field"
                                >
                                    <option value="">Select Contractor...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
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
                                <h3 className="section-title">Relationship DNA (Key Contacts)</h3>
                                <div className="contacts-grid">
                                    {(parentClient?.keyContacts || localClient.keyContacts)?.map((contact, idx) => (
                                        <div key={idx} className="contact-card">
                                            <div className="contact-header">
                                                <div>
                                                    <div className="contact-name">{contact.name}</div>
                                                    <div className="contact-role">{contact.role}</div>
                                                </div>
                                                <div className={`sentiment-badge ${contact.influence === 'Champion' ? 'champion' : contact.influence === 'Blocker' ? 'blocker' : ''}`}>
                                                    {contact.influence}
                                                </div>
                                            </div>
                                            {contact.relationshipDNA && (
                                                <div className="dna-section">
                                                    <div className="dna-item">
                                                        <span className="dna-label">Ice-Breaker:</span> {contact.relationshipDNA.iceBreaker}
                                                    </div>
                                                    <div className="dna-item">
                                                        <span className="dna-label">Comm Style:</span> {contact.relationshipDNA.commStyle}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="contact-actions">
                                                <a href={`tel:${contact.phone}`} className="contact-btn"><Phone size={12} /> Call</a>
                                                <div className="contact-btn"><Mail size={12} /> Email</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'intelligence' && (
                        <div className="intelligence-view space-y-6">
                            {parentClient?.siteLogistics && (
                                <div className="info-block">
                                    <h3 className="section-title">Site Logistics</h3>
                                    <div className="logistics-grid">
                                        <div className="logistics-item">
                                            <div className="logistics-label">PPE Requirements</div>
                                            <div className="logistics-value">{parentClient.siteLogistics.ppe}</div>
                                        </div>
                                        <div className="logistics-item">
                                            <div className="logistics-label">Induction Loop</div>
                                            <div className="logistics-value">{parentClient.siteLogistics.induction}</div>
                                        </div>
                                        <div className="logistics-item">
                                            <div className="logistics-label">Site Parking</div>
                                            <div className="logistics-value">{parentClient.siteLogistics.parking}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {parentClient?.hiringInsights && (
                                <div className="info-block">
                                    <h3 className="section-title">Hiring Insights</h3>
                                    <div className="insights-row">
                                        <div className="insight-pill">
                                            <span className="label">Avg Time to Hire:</span>
                                            <span className="value">{parentClient.hiringInsights.avgTimeToHire}</span>
                                        </div>
                                        <div className="insight-pill">
                                            <span className="label">Most Hired:</span>
                                            <span className="value">{parentClient.hiringInsights.mostHiredRole}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-muted leading-relaxed">
                                        <span className="font-bold text-slate-300">Strategy Note:</span> {parentClient.hiringInsights.commonFeedback}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-view">
                            <div className="info-block">
                                <h3 className="section-title">Placement History</h3>
                                <div className="history-ledger">
                                    <div className="ledger-item">
                                        <div className="ledger-main">
                                            <div className="worker-name">James Wilson</div>
                                            <div className="worker-role">Hammerhand (Active)</div>
                                        </div>
                                        <div className="ledger-date">Joined 4h ago</div>
                                    </div>
                                    <div className="ledger-item ghosted">
                                        <div className="ledger-main">
                                            <div className="worker-name">Sarah Ross</div>
                                            <div className="worker-role">Project Coordinator</div>
                                        </div>
                                        <div className="ledger-date">Completed May 2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'automation' && (
                        // ... existing automation tab ...

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
                .contacts-grid {
                  display: flex;
                  flex-direction: column;
                  gap: 0.75rem;
                }

                .contact-card {
                  background: rgba(255,255,255,0.03);
                  border: 1px solid var(--border);
                  border-radius: var(--radius-sm);
                  padding: 1rem;
                  transition: all 0.2s;
                }

                .contact-card:hover {
                  border-color: var(--secondary);
                }

                .contact-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 0.75rem;
                }

                .contact-name {
                  font-weight: 700;
                  color: white;
                  font-size: 0.9rem;
                }

                .contact-role {
                  font-size: 0.75rem;
                  color: var(--text-muted);
                }

                .sentiment-badge {
                  font-size: 8px;
                  font-weight: 900;
                  text-transform: uppercase;
                  padding: 2px 6px;
                  border-radius: 4px;
                  background: rgba(255,255,255,0.1);
                  color: var(--text-muted);
                }

                .sentiment-badge.champion {
                  background: rgba(16, 185, 129, 0.1);
                  color: #10b981;
                  border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .sentiment-badge.blocker {
                  background: rgba(239, 68, 68, 0.1);
                  color: #ef4444;
                  border: 1px solid rgba(239, 68, 68, 0.2);
                }

                .dna-section {
                  padding-top: 0.75rem;
                  margin-top: 0.75rem;
                  border-top: 1px solid rgba(255,255,255,0.05);
                  display: flex;
                  flex-direction: column;
                  gap: 0.4rem;
                }

                .dna-item {
                  font-size: 0.75rem;
                  color: var(--text-muted);
                  line-height: 1.4;
                }

                .dna-label {
                  font-weight: 800;
                  color: var(--secondary);
                  font-size: 10px;
                  text-transform: uppercase;
                  margin-right: 4px;
                }

                .contact-actions {
                  display: flex;
                  gap: 0.5rem;
                  margin-top: 1rem;
                }

                .contact-btn {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 0.4rem;
                  background: rgba(255,255,255,0.05);
                  border: 1px solid var(--border);
                  padding: 0.4rem;
                  border-radius: 4px;
                  font-size: 0.7rem;
                  font-weight: 700;
                  color: white;
                  text-decoration: none;
                  cursor: pointer;
                }

                .contact-btn:hover {
                  background: var(--secondary);
                  color: #0f172a;
                  border-color: var(--secondary);
                }

                /* Logistics & Insights */
                .logistics-grid {
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                }

                .logistics-item {
                  background: rgba(255,255,255,0.02);
                  padding: 0.75rem;
                  border-radius: var(--radius-sm);
                  border-left: 3px solid var(--secondary);
                }

                .logistics-label {
                  font-size: 10px;
                  font-weight: 900;
                  text-transform: uppercase;
                  color: var(--secondary);
                  margin-bottom: 4px;
                }

                .logistics-value {
                  font-size: 0.8rem;
                  color: white;
                  line-height: 1.4;
                }

                .insights-row {
                  display: flex;
                  gap: 0.5rem;
                  flex-wrap: wrap;
                }

                .insight-pill {
                  background: rgba(255,255,255,0.05);
                  padding: 6px 12px;
                  border-radius: 999px;
                  font-size: 0.75rem;
                  display: flex;
                  gap: 6px;
                }

                .insight-pill .label { color: var(--text-muted); }
                .insight-pill .value { color: white; font-weight: 700; }

                /* History Ledger */
                .history-ledger {
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                }

                .ledger-item {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0.75rem;
                  background: rgba(255,255,255,0.03);
                  border-radius: var(--radius-sm);
                  border-left: 3px solid #10b981;
                }

                .ledger-item.ghosted {
                  border-left-color: var(--text-muted);
                  opacity: 0.6;
                }

                .worker-name { font-weight: 700; color: white; font-size: 0.85rem; }
                .worker-role { font-size: 0.7rem; color: var(--text-muted); }
                .ledger-date { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }

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
