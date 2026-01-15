"use client";

import { useState, useMemo } from "react";
import { EyeOff, Trash2, Plus, Calendar, Layers, Truck, Users, MapPin, Building2, Save, ChevronDown, ChevronUp, Clock, Info, AlertCircle, X, RotateCcw, TrendingUp } from 'lucide-react';
import { PHASE_TEMPLATES, WORKFORCE_MATRIX, RELATED_ROLES, PHASE_MAP } from '../services/construction-logic.js';
import { useData } from "../context/data-context.js";
import CandidateModal from "./candidate-modal.js";

// --- Micro-Component: Labor Requirement Builder ---
const LaborRequirementBuilder = ({ requirements = [], phaseId, onChange, candidates, projectId, availableRoles = [], onAddRole }) => {
    const { assignCandidateToProject, unassignCandidate } = useData();
    const [newTrade, setNewTrade] = useState("");
    const [newCount, setNewCount] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [expandedReq, setExpandedReq] = useState(null);

    const suggestedTrades = WORKFORCE_MATRIX[phaseId] ? Object.keys(WORKFORCE_MATRIX[phaseId]) : [];
    const otherRoles = availableRoles.filter(r => !suggestedTrades.includes(r));

    const handleAdd = () => {
        if (!newTrade || !newCount) return;
        if (isCustom && onAddRole) onAddRole(newTrade);

        const newItem = {
            id: `req-${Date.now()}`,
            trade: newTrade,
            requiredCount: parseInt(newCount),
            assignedIds: []
        };
        onChange([...requirements, newItem]);
        setNewTrade("");
        setNewCount("");
        setIsCustom(false);
    };

    const handleRemove = (id) => {
        onChange(requirements.filter(r => r.id !== id));
    };

    return (
        <div className="labor-builder">
            <div className="req-list">
                {requirements.map(req => {
                    const assignedIds = req.assignedIds || [];
                    const gap = req.requiredCount - assignedIds.length;
                    const isExpanded = expandedReq === req.id;
                    const related = RELATED_ROLES[req.trade] || [];
                    const searchRoles = [req.trade, ...related];
                    const matches = candidates.filter(c => searchRoles.includes(c.role) && c.status === "Available");
                    const assignedCandidates = candidates.filter(c => assignedIds.includes(c.id));

                    return (
                        <div key={req.id} className={`req-group ${isExpanded ? 'expanded' : ''}`}>
                            <div className="req-item" onClick={() => setExpandedReq(isExpanded ? null : req.id)}>
                                <div className="req-info">
                                    <span className="req-trade">{req.trade}</span>
                                    <span className={`req-status-pill ${gap <= 0 ? 'filled' : 'gap'}`}>
                                        {assignedIds.length} / {req.requiredCount} Allocated
                                    </span>
                                </div>
                                <div className="req-actions">
                                    <div className={`traffic-light ${matches.length >= gap ? 'green' : 'red'}`}>
                                        {matches.length} Avail
                                    </div>
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(req.id); }} className="btn-icon-danger">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="allocation-drawer">
                                    {assignedCandidates.length > 0 && (
                                        <div className="assigned-section">
                                            <label>Allocated Talent</label>
                                            {assignedCandidates.map(c => (
                                                <div key={c.id} className="assigned-row">
                                                    <span className="name">{c.firstName} {c.lastName}</span>
                                                    <span className="role-tag">{c.role}</span>
                                                    <button onClick={() => unassignCandidate(c.id, projectId, req.id)} className="btn-remove-assign">Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {gap > 0 && (
                                        <div className="match-section">
                                            <label>Match & Allocate ({matches.length} Matches)</label>
                                            <div className="match-list">
                                                {matches.slice(0, 5).map(c => (
                                                    <div key={c.id} className="match-card">
                                                        <div className="match-avatar">
                                                            {c.firstName?.[0]}{c.lastName?.[0]}
                                                        </div>
                                                        <div className="match-info">
                                                            <div className="match-name">{c.firstName} {c.lastName}</div>
                                                            <div className="match-meta">
                                                                <span className="match-role">{c.role}</span>
                                                                <span className="dot"></span>
                                                                <span className="match-suburb">{c.suburb}</span>
                                                            </div>
                                                        </div>
                                                        <button className="btn-allocate" onClick={() => assignCandidateToProject(c.id, projectId, req.id)}>
                                                            Allocate
                                                        </button>
                                                    </div>
                                                ))}
                                                {matches.length === 0 && <div className="empty-match">No immediate matches in bench.</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="add-interface">
                {isCustom ? (
                    <div className="flex-1 flex gap-1">
                        <input type="text" placeholder="Custom..." value={newTrade} onChange={(e) => setNewTrade(e.target.value)} className="input-sm flex-1" autoFocus />
                        <button type="button" className="btn-icon-danger" onClick={() => setIsCustom(false)}><X size={14} /></button>
                    </div>
                ) : (
                    <select value={newTrade} onChange={(e) => e.target.value === "custom" ? setIsCustom(true) : setNewTrade(e.target.value)} className="input-sm flex-1">
                        <option value="">+ Requirement...</option>
                        <optgroup label="Suggested">{suggestedTrades.map(t => <option key={t} value={t}>{t}</option>)}</optgroup>
                        <optgroup label="All">{otherRoles.map(r => <option key={r} value={r}>{r}</option>)}</optgroup>
                        <option value="custom">Add Custom Role</option>
                    </select>
                )}
                <input type="number" value={newCount} onChange={(e) => setNewCount(e.target.value)} className="input-sm input-count" placeholder="Qty" />
                <button type="button" onClick={handleAdd} disabled={!newTrade || !newCount} className="btn-add-sm">
                    <Plus size={16} /> Check Availability
                </button>
            </div>
            
            <style jsx>{`
                .labor-builder { display: flex; flex-direction: column; gap: 1rem; width: 100%; border-top: 1px solid var(--border); padding-top: 1.5rem; }
                .req-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .req-group { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: rgba(15, 23, 42, 0.4); transition: all 0.3s; }
                .req-group.expanded { border-color: var(--secondary); box-shadow: 0 0 20px rgba(0, 242, 255, 0.05); }
                .req-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; cursor: pointer; }
                .req-item:hover { background: rgba(255, 255, 255, 0.02); }
                .req-trade { font-weight: 800; font-size: 0.85rem; color: white; text-transform: uppercase; letter-spacing: 0.02em; }
                .req-status-pill { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); }
                .req-status-pill.filled { color: var(--secondary); border-color: var(--secondary); }
                .req-status-pill.gap { color: #f59e0b; border-color: #f59e0b; }

                .req-actions { display: flex; align-items: center; gap: 1rem; }
                .traffic-light { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 900; text-transform: uppercase; }
                .traffic-light.green { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
                .traffic-light.red { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

                .allocation-drawer { padding: 1rem; background: rgba(0,0,0,0.3); border-top: 1px solid var(--border); }
                .assigned-section label, .match-section label { display: block; font-size: 0.6rem; color: var(--secondary); font-weight: 900; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }

                .match-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .match-card {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px;
                    transition: all 0.3s;
                }
                .match-card:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--secondary); transform: translateX(4px); }

                .match-avatar {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: rgba(0, 242, 255, 0.1); color: var(--secondary);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 900; border: 1px solid rgba(0, 242, 255, 0.2);
                }
                .match-info { flex: 1; }
                .match-name { font-size: 0.85rem; font-weight: 700; color: white; margin-bottom: 2px; }
                .match-meta { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }
                .match-meta .dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); }

                .btn-allocate {
                    background: rgba(0, 242, 255, 0.1); color: var(--secondary);
                    border: 1px solid rgba(0, 242, 255, 0.2); border-radius: 6px;
                    padding: 6px 12px; font-size: 0.7rem; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-allocate:hover { background: var(--secondary); color: #0f172a; border-color: var(--secondary); transform: scale(1.05); }

                .add-interface { 
                    display: flex; gap: 0.75rem; padding: 1.25rem 1.5rem; 
                    background: rgba(255, 255, 255, 0.03); 
                    border-radius: 0 0 12px 12px; 
                    border: 1px solid var(--border);
                    border-top: none; 
                    align-items: center; 
                }

                .input-sm { 
                    padding: 10px 14px; 
                    background: var(--primary-light); 
                    border: 1px solid var(--border); 
                    border-radius: 8px; 
                    color: var(--text-main); 
                    font-size: 0.85rem;
                    font-weight: 500;
                    outline: none;
                    transition: all 0.2s;
                }

                select.input-sm {
                    cursor: pointer;
                }

                .input-sm:focus { 
                    border-color: var(--secondary); 
                    background: rgba(30, 41, 59, 1); 
                    box-shadow: 0 0 0 2px rgba(0, 242, 255, 0.1); 
                }

                .input-sm option, 
                .input-sm optgroup { 
                    background: var(--primary); 
                    color: var(--text-main); 
                }

                .input-sm optgroup { 
                    font-weight: 800; 
                    text-transform: uppercase; 
                    font-size: 0.7rem; 
                    color: var(--secondary); 
                    padding: 8px; 
                }

                .input-count { width: 80px; text-align: center; }

                .btn-add-sm { 
                    background: var(--secondary); 
                    color: var(--primary); 
                    border: none; 
                    border-radius: 8px; 
                    padding: 10px 24px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 0.75rem; 
                    cursor: pointer; 
                    transition: all 0.2s; 
                    font-size: 0.8rem; 
                    font-weight: 900; 
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .btn-add-sm:hover { background: white; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0, 242, 255, 0.3); }
                .btn-add-sm:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
                .btn-icon-danger {
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid transparent;
                    border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center;
                }
                .btn-icon-danger:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; }
                .btn-remove-assign {
                    background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);
                    padding: 2px 8px; border-radius: 4px; font-size: 0.6rem; font-weight: 700;
                    text-transform: uppercase; cursor: pointer; margin-left: auto;
                }
                .btn-remove-assign:hover { background: rgba(239, 68, 68, 0.1); }
                .assigned-row {
                    display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem;
                    background: rgba(255,255,255,0.02); border-radius: 6px; margin-bottom: 4px;
                }
                .assigned-row .name { font-size: 0.8rem; font-weight: 700; color: white; }
                .assigned-row .role-tag { font-size: 0.65rem; color: var(--text-muted); }
            `}</style>
        </div>
    );
};

export default function AddProjectModal({ isOpen, onClose, onSave, initialData }) {
    const { clients, candidates, availableRoles, addRole, moneyMoves } = useData();
    const [activeTab, setActiveTab] = useState("core");
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [tempId] = useState(() => `new-${Date.now()}`);

    // Safety check for templates
    const defaultPhase = PHASE_TEMPLATES?.Commercial_Multi_Use?.[0]?.phaseId || "01_civil";
    const [selectedPhaseId, setSelectedPhaseId] = useState(defaultPhase);

    const defaultFormData = {
        name: "", description: "", assetOwner: "", client: "", assignedCompanyIds: [], address: "", tier: "Tier 1", type: "Healthcare", value: "", funding: "Government/Public", cartersLink: "", greenStar: "No", status: "Planning",
        projectDirector: "", seniorQS: "", siteManager: "", additionalSiteManagers: [], safetyOfficer: "", gateCode: "",
        engagementType: "confirmed", // 'confirmed' | 'speculative'
        phaseSettings: {},
        packages: {
            civilWorks: { name: "", status: "Tendering", phase: "01_civil", label: "Civil & Excavation" },
            piling: { name: "", status: "Tendering", phase: "01_civil", label: "Piling" },
            concrete: { name: "", status: "Tendering", phase: "02a_concrete", label: "Concrete Structure" },
            steel: { name: "", status: "Tendering", phase: "02b_steel", label: "Structural Steel" },
            framing: { name: "", status: "Tendering", phase: "02c_framing", label: "Timber Framing" },
            crane: { name: "", status: "Tendering", phase: "02b_steel", label: "Tower Crane" },
            facade: { name: "", status: "Tendering", phase: "03b_facade", label: "Facade & Glazing" },
            scaffolding: { name: "", status: "Tendering", phase: "03c_scaffolding", label: "Scaffolding" },
            roofing: { name: "", status: "Tendering", phase: "03a_roofing", label: "Roofing" },
            electrical: { name: "", status: "Tendering", phase: "04a_electrical_rough", label: "Electrical" },
            hydraulics: { name: "", status: "Tendering", phase: "04b_plumbing_rough", label: "Hydraulics (Plumbing)" },
            mechanical: { name: "", status: "Tendering", phase: "04c_hvac", label: "Mechanical (HVAC)" },
            interiors: { name: "", status: "Tendering", phase: "05a_linings_stopping", label: "Interiors (Walls/Ceilings)" },
            flooring: { name: "", status: "Tendering", phase: "05c_flooring", label: "Flooring" },
            painting: { name: "", status: "Tendering", phase: "05d_painting", label: "Painting" },
            joinery: { name: "", status: "Tendering", phase: "05b_carpentry_trim", label: "Joinery" },
            cleaning: { name: "", status: "Tendering", phase: "06_handover", label: "Final Clean" }
        },
        parking: "On-site", publicTransport: "Yes", drugTesting: "Pre-employment only", induction: "", ppe: []
    };

    const [formData, setFormData] = useState({
        ...defaultFormData,
        ...initialData,
        packages: { ...defaultFormData.packages, ...(initialData?.packages || {}) },
        phaseSettings: { ...defaultFormData.phaseSettings, ...(initialData?.phaseSettings || {}) },
        ppe: initialData?.ppe || defaultFormData.ppe
    });

    // Use existing ID or stable temp ID
    const effectiveProjectId = initialData?.id || formData.id || tempId;

    // Intelligence Data
    const projectMoneyMoves = (moneyMoves || []).filter(m => m.projectId === effectiveProjectId);
    const nextTrigger = projectMoneyMoves[0];

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const updateFormData = (field, value) => {
        setFormData(prev => {
            const newValue = typeof value === 'function' ? value(prev[field]) : value;
            return { ...prev, [field]: newValue };
        });
    };

    const tabs = [
        { id: "core", label: "The Core", icon: Building2 },
        { id: "intel", label: "Intelligence", icon: TrendingUp },
        { id: "contacts", label: "Key Contacts", icon: Users },
        { id: "packages", label: "Workforce Strategy", icon: Layers },
        { id: "candidates", label: "Candidates", icon: Users },
        { id: "logistics", label: "Site Logistics", icon: Truck },
    ];

    const getPhaseReadiness = (phaseId) => {
        const pkgs = Object.values(formData.packages).filter(p => p.phase === phaseId);
        let totalReq = 0;
        let totalAssigned = 0;

        pkgs.forEach(pkg => {
            (pkg.laborRequirements || []).forEach(req => {
                totalReq += req.requiredCount || 0;
                totalAssigned += (req.assignedIds || []).length;
            });
        });

        if (totalReq === 0) return { score: 100, status: 'secure' };
        const score = Math.round((totalAssigned / totalReq) * 100);
        return {
            score,
            status: score === 100 ? 'secure' : score > 50 ? 'warning' : 'critical'
        };
    };

    const activePhaseData = PHASE_TEMPLATES.Commercial_Multi_Use.find(p => p.phaseId === selectedPhaseId);
    const settings = formData.phaseSettings[selectedPhaseId] || { startDate: "", offsetWeeks: 2, skipped: false };
    const phasePkgs = Object.entries(formData.packages).filter(([_, p]) => p.phase === selectedPhaseId);

    let alertDate = null;
    if (settings.startDate && !settings.skipped) {
        const d = new Date(settings.startDate);
        d.setDate(d.getDate() - (settings.offsetWeeks * 7));
        alertDate = d.toISOString().split('T')[0];
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-white tracking-tight">
                            {initialData ? "RECONFIGURE PROJECT" : "INITIALIZE NEW PROJECT"}
                        </h2>
                        <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Antigravity Command Console</span>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <div className="tabs-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            type="button"
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="tab-content">
                        {activeTab === "core" && (
                            <div className="tab-pane">
                                {/* Engagement Mode Toggle */}
                                <div className="engagement-toggle">
                                    <button
                                        type="button"
                                        className={`toggle-option ${formData.engagementType === 'confirmed' ? 'active' : ''}`}
                                        onClick={() => updateFormData("engagementType", "confirmed")}
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-bold text-sm">Active Project</span>
                                            <span className="text-[10px] opacity-70 font-normal">Confirmed Work with Client</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        className={`toggle-option ${formData.engagementType === 'speculative' ? 'active' : ''}`}
                                        onClick={() => updateFormData("engagementType", "speculative")}
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-bold text-sm">Speculative</span>
                                            <span className="text-[10px] opacity-70 font-normal">Market Intel & Tendering</span>
                                        </div>
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label>Project Name</label>
                                    <input type="text" required value={formData.name || ""} onChange={(e) => updateFormData("name", e.target.value)} placeholder="e.g. Whangarei Hospital" />
                                </div>
                                <div className="form-group">
                                    <label>Project Description</label>
                                    <textarea value={formData.description || ""} onChange={(e) => updateFormData("description", e.target.value)} placeholder="Brief overview..." rows={3} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Project Owner (Asset)</label>
                                        <input type="text" value={formData.assetOwner || ""} onChange={(e) => updateFormData("assetOwner", e.target.value)} placeholder="e.g. MoE" />
                                    </div>
                                    <div className="form-group">
                                        <label>Main Contractor</label>
                                        <select
                                            className="appearance-none"
                                            value={formData.assignedCompanyIds?.[0] || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (!val) {
                                                    setFormData(prev => ({ ...prev, assignedCompanyIds: [], client: "" }));
                                                    return;
                                                }
                                                // Handle ID matching safely (String vs Number)
                                                const client = clients.find(c => String(c.id) === String(val));
                                                // Use the client's actual ID type (string/number) to maintain consistency
                                                const idToSave = client ? client.id : val;

                                                setFormData(prev => ({
                                                    ...prev,
                                                    assignedCompanyIds: [idToSave],
                                                    client: client ? client.name : ""
                                                }));
                                            }}
                                        >
                                            <option value="">Select Contractor...</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Project Address</label>
                                    <div className="address-input-group">
                                        <input type="text" value={formData.address || ""} onChange={(e) => updateFormData("address", e.target.value)} placeholder="e.g. 123 Queen Street" />
                                        <button type="button" className="btn-find" onClick={() => alert('Mock Geocode')}>
                                            <MapPin size={16} /> Find
                                        </button>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Project Type</label>
                                        <select className="appearance-none" value={formData.type} onChange={(e) => updateFormData("type", e.target.value)}>
                                            <option>Healthcare</option><option>Commercial High-Rise</option><option>Industrial/Shed</option><option>Social Housing</option><option>Education</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Est. Value</label>
                                        <input type="text" value={formData.value || ""} onChange={(e) => updateFormData("value", e.target.value)} placeholder="e.g. $150M" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Funding Source</label>
                                        <select className="appearance-none" value={formData.funding} onChange={(e) => updateFormData("funding", e.target.value)}>
                                            <option>Government/Public</option><option>Private Developer</option><option>PPP</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Current Status</label>
                                        <select className="appearance-none" value={formData.status} onChange={(e) => updateFormData("status", e.target.value)}>
                                            <option>Planning</option><option>Tender</option><option>Construction</option><option>Fitout</option><option>Handover</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "contacts" && (
                            <div className="tab-pane">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Project Director</label>
                                        <input type="text" value={formData.projectDirector || ""} onChange={(e) => updateFormData("projectDirector", e.target.value)} placeholder="Name / Phone" />
                                    </div>
                                    <div className="form-group">
                                        <label>Senior QS</label>
                                        <input type="text" value={formData.seniorQS || ""} onChange={(e) => updateFormData("seniorQS", e.target.value)} placeholder="Name / Phone" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Site Manager (Lead)</label>
                                        <input type="text" value={formData.siteManager || ""} onChange={(e) => updateFormData("siteManager", e.target.value)} placeholder="Name / Phone" />
                                    </div>
                                    <div className="form-group">
                                        <label>Health & Safety Officer</label>
                                        <input type="text" value={formData.safetyOfficer || ""} onChange={(e) => updateFormData("safetyOfficer", e.target.value)} placeholder="Name / Phone" />
                                    </div>
                                </div>
                                {(formData.additionalSiteManagers || []).map((sm, index) => (
                                    <div className="form-group" key={index}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <label>Site Manager #{index + 2}</label>
                                            <button type="button" onClick={() => {
                                                const newSMs = formData.additionalSiteManagers.filter((_, i) => i !== index);
                                                updateFormData("additionalSiteManagers", newSMs);
                                            }} className="text-red-400 text-[10px] font-black uppercase tracking-widest">Remove</button>
                                        </div>
                                        <input type="text" value={sm} onChange={(e) => {
                                            const newSMs = [...(formData.additionalSiteManagers || [])];
                                            newSMs[index] = e.target.value;
                                            updateFormData("additionalSiteManagers", newSMs);
                                        }} placeholder="Name / Phone" />
                                    </div>
                                ))}
                                <button type="button" onClick={() => updateFormData("additionalSiteManagers", [...(formData.additionalSiteManagers || []), ""])} className="btn-dashed">
                                    + Add Associate Site Manager
                                </button>
                            </div>
                        )}

                        {activeTab === "packages" && (
                            <div className="tab-pane-strategy">
                                <div className="strategy-sidebar">
                                    <div className="sidebar-header">
                                        <span>Phase Readiness</span>
                                    </div>
                                    {PHASE_TEMPLATES.Commercial_Multi_Use.map(phase => {
                                        const pSettings = formData.phaseSettings[phase.phaseId] || { skipped: false };
                                        const readiness = getPhaseReadiness(phase.phaseId);
                                        return (
                                            <button
                                                key={phase.phaseId}
                                                type="button"
                                                className={`phase-nav-item ${selectedPhaseId === phase.phaseId ? 'active' : ''} ${pSettings.skipped ? 'skipped' : ''}`}
                                                onClick={() => setSelectedPhaseId(phase.phaseId)}
                                            >
                                                <div className="phase-nav-info">
                                                    <div className={`status-indicator ${readiness.status}`}></div>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="phase-name">{PHASE_MAP[phase.phaseId]?.label || phase.name}</span>
                                                        <div className="readiness-bar">
                                                            <div className={`readiness-fill ${readiness.status}`} style={{ width: `${readiness.score}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <span className="readiness-pct">{readiness.score}%</span>
                                                </div>
                                                {pSettings.skipped && <span className="skipped-tag">Skipped</span>}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="strategy-detail">
                                    <div className="phase-detail-view">
                                        <div className="phase-detail-header">
                                            <div className="header-title">
                                                <div className="flex flex-col">
                                                    <h3>{PHASE_MAP[selectedPhaseId]?.label || activePhaseData?.name}</h3>
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Personnel Strategy & Procurement</span>
                                                </div>
                                                <div className="skip-toggle">
                                                    <input
                                                        type="checkbox"
                                                        id={`skip-${selectedPhaseId}`}
                                                        checked={settings.skipped}
                                                        onChange={(e) => {
                                                            const newSettings = { ...formData.phaseSettings };
                                                            newSettings[selectedPhaseId] = { ...settings, skipped: e.target.checked };
                                                            updateFormData("phaseSettings", newSettings);
                                                        }}
                                                    />
                                                    <label htmlFor={`skip-${selectedPhaseId}`}>Skip Phase</label>
                                                </div>
                                            </div>

                                            {!settings.skipped && (
                                                <div className="header-controls-v2">
                                                    <div className="control-group">
                                                        <label>Target Commencement</label>
                                                        <input
                                                            type="date"
                                                            className="date-input"
                                                            value={settings.startDate || ''}
                                                            onChange={(e) => {
                                                                const newSettings = { ...formData.phaseSettings };
                                                                newSettings[selectedPhaseId] = { ...settings, startDate: e.target.value };
                                                                updateFormData("phaseSettings", newSettings);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="control-group">
                                                        <label>Alert Horizon (Wks)</label>
                                                        <input
                                                            type="number"
                                                            min="1" max="12"
                                                            className="input-sm"
                                                            style={{ width: '80px' }}
                                                            value={settings.offsetWeeks}
                                                            onChange={(e) => {
                                                                const newSettings = { ...formData.phaseSettings };
                                                                newSettings[selectedPhaseId] = { ...settings, offsetWeeks: parseInt(e.target.value) };
                                                                updateFormData("phaseSettings", newSettings);
                                                            }}
                                                        />
                                                    </div>
                                                    {alertDate && (
                                                        <div className="alert-countdown">
                                                            <Clock size={14} className="animate-pulse" />
                                                            <span>Signal Trigger: {alertDate}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {settings.skipped ? (
                                            <div className="skipped-placeholder">
                                                <EyeOff size={48} className="text-slate-700" />
                                                <p className="font-bold text-slate-500">PHASE_DEACTIVATED</p>
                                            </div>
                                        ) : (
                                            <div className="phase-packages-list">
                                                {phasePkgs.length === 0 ? (
                                                    <div className="skipped-placeholder">
                                                        <Info size={48} className="text-secondary opacity-20" />
                                                        <p className="text-sm font-bold text-slate-500">No Packages Defined for this Phase</p>
                                                        <button
                                                            type="button"
                                                            className="btn-dashed"
                                                            onClick={() => {
                                                                updateFormData("packages", (prev) => ({
                                                                    ...prev,
                                                                    [`pkg-${Date.now()}`]: {
                                                                        name: "New Work Package",
                                                                        status: "Tendering",
                                                                        phase: selectedPhaseId,
                                                                        label: PHASE_MAP[selectedPhaseId]?.label || "Custom Package",
                                                                        laborRequirements: []
                                                                    }
                                                                }));
                                                            }}
                                                        >
                                                            <Plus size={16} />
                                                            {formData.engagementType === 'speculative' ? "Create Work Package" : "Add Labor Resource"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    phasePkgs.map(([key, pkg]) => (
                                                        <div key={key} className="package-card-v2">
                                                            <div className="package-card-header">
                                                                <span className="pkg-label">{pkg.label || key}</span>
                                                                <button
                                                                    type="button"
                                                                    className="delete-pkg-btn"
                                                                    onClick={() => {
                                                                        updateFormData("packages", (prev) => {
                                                                            const next = { ...prev };
                                                                            delete next[key];
                                                                            return next;
                                                                        });
                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            {/* Only show Tender/Subcontractor details for Speculative Projects */}
                                                            {formData.engagementType === 'speculative' && (
                                                                <div className="package-card-main">
                                                                    <div className="card-input">
                                                                        <label>Subcontractor</label>
                                                                        <input
                                                                            type="text"
                                                                            value={pkg.name || ""}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                updateFormData("packages", (prev) => ({
                                                                                    ...prev,
                                                                                    [key]: { ...prev[key], name: val }
                                                                                }));
                                                                            }}
                                                                            placeholder="Tender Winner / Contractor"
                                                                        />
                                                                    </div>
                                                                    <div className="card-input">
                                                                        <label>Status</label>
                                                                        <select
                                                                            value={pkg.status}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                updateFormData("packages", (prev) => ({
                                                                                    ...prev,
                                                                                    [key]: { ...prev[key], status: val }
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <option>Tendering</option><option>Awarded</option><option>On-Site</option><option>Completed</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="package-card-footer">
                                                                <LaborRequirementBuilder
                                                                    requirements={pkg.laborRequirements || []}
                                                                    phaseId={pkg.phase}
                                                                    candidates={candidates}
                                                                    projectId={effectiveProjectId}
                                                                    availableRoles={availableRoles}
                                                                    onAddRole={addRole}
                                                                    onChange={(reqs) => {
                                                                        updateFormData("packages", (prev) => ({
                                                                            ...prev,
                                                                            [key]: { ...prev[key], laborRequirements: reqs }
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "candidates" && (
                            <div className="tab-pane">
                                <div className="candidates-list">
                                    <div className="list-header">
                                        <h3>Assigned Workforce</h3>
                                        <span className="badge-count">
                                            {candidates.filter(c => c.projectId === formData.id).length} Active
                                        </span>
                                    </div>

                                    <div className="candidates-grid">
                                        {candidates.filter(c => c.projectId === formData.id).map(c => (
                                            <div key={c.id} className="candidate-card" onClick={() => setSelectedCandidateId(c.id)}>
                                                <div className="c-avatar">{c.firstName?.[0]}{c.lastName?.[0]}</div>
                                                <div className="c-info">
                                                    <div className="c-name">{c.firstName} {c.lastName}</div>
                                                    <div className="c-role">{c.role}</div>
                                                </div>
                                                <div className="c-dates">
                                                    <div className="date-row">
                                                        <span className="label">Start:</span>
                                                        <span className="value">{c.startDate || 'TBD'}</span>
                                                    </div>
                                                    <div className="date-row">
                                                        <span className="label">End:</span>
                                                        <span className="value">{c.finishDate || 'Open'}</span>
                                                    </div>
                                                </div>
                                                <div className={`c-status ${c.status.toLowerCase().replace(' ', '-')}`}>
                                                    {c.status}
                                                </div>
                                            </div>
                                        ))}
                                        {candidates.filter(c => c.projectId === formData.id).length === 0 && (
                                            <div className="empty-state">
                                                <Users size={48} />
                                                <p>No candidates currently assigned to this project.</p>
                                                <small>Allocate candidates via the Workforce Strategy tab or Float modal.</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "logistics" && (
                            <div className="tab-pane">
                                {/* --- SECTION 1: SITE SAFETY ASSESSMENT (SSA) --- */}
                                <div className="form-group mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-secondary flex items-center gap-2">
                                            <AlertCircle size={14} /> Site Safety Assessment (SSA)
                                        </label>
                                        {/* Status Badge Logic */}
                                        {(() => {
                                            const lastDate = formData.ssaDate ? new Date(formData.ssaDate) : null;
                                            const today = new Date();
                                            const isExpired = lastDate && (today - lastDate) / (1000 * 60 * 60 * 24) > 365;
                                            const status = !formData.ssaType ? "missing" : isExpired ? "expired" : "valid";

                                            const badges = {
                                                missing: { color: "bg-red-500/20 text-red-400 border-red-500/50", label: "NO SSA ON FILE" },
                                                expired: { color: "bg-amber-500/20 text-amber-400 border-amber-500/50", label: "SSA EXPIRED" },
                                                valid: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50", label: "SITE COMPLIANT" }
                                            };

                                            return (
                                                <span className={`px-2 py-1 rounded text-[10px] font-black border ${badges[status].color}`}>
                                                    {badges[status].label}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-4">
                                        {/* Row 1: Assessment Type & Date */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label>Assessment Type</label>
                                                <select
                                                    value={formData.ssaType || ""}
                                                    onChange={(e) => updateFormData("ssaType", e.target.value)}
                                                    className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                                                >
                                                    <option value="">Select Type...</option>
                                                    <option value="Site Visit">Full Site Visit (New Client)</option>
                                                    <option value="Visual Check">Site Visual (Existing Client)</option>
                                                    <option value="Phone Questionnaire">Phone Questionnaire (Remote/Low Risk)</option>
                                                    <option value="Systems Review">Systems Review (Multi-Site)</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Last Assessment Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.ssaDate || ""}
                                                    onChange={(e) => updateFormData("ssaDate", e.target.value)}
                                                    className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white date-input"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Hazards & Controls */}
                                        <div className="form-group">
                                            <label>Critical Site Hazards</label>
                                            <textarea
                                                value={formData.siteHazards || ""}
                                                onChange={(e) => updateFormData("siteHazards", e.target.value)}
                                                placeholder="e.g. Overhead powerlines, confined spaces, asbestos risk..."
                                                rows={2}
                                                className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white w-full"
                                            />
                                        </div>

                                        {/* ALERT LOGIC: Triggered if Missing or Expired */}
                                        {(!formData.ssaType || (formData.ssaDate && (new Date() - new Date(formData.ssaDate)) / (1000 * 60 * 60 * 24) > 365)) && (
                                            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-md mt-2">
                                                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider m-0">Action Required</h4>
                                                    <p className="text-slate-300 text-xs mt-1">
                                                        Candidates cannot be deployed until an SSA is recorded.
                                                        <br />
                                                        <strong>Call Site Supervisor ({formData.siteManager || "Unknown"}) immediately</strong> to arrange a
                                                        {formData.client ? " Site Visual" : " Full Assessment"}.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- SECTION 2: STANDARD LOGISTICS --- */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Parking & Access</label>
                                        <select value={formData.parking} onChange={(e) => updateFormData("parking", e.target.value)}>
                                            <option>On-site (Free)</option>
                                            <option>Street Only (Free)</option>
                                            <option>Paid Parking (Reimbursed)</option>
                                            <option>Paid Parking (Not Reimbursed)</option>
                                            <option>No Parking (Drop-off Only)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Public Transport</label>
                                        <select value={formData.publicTransport} onChange={(e) => updateFormData("publicTransport", e.target.value)}>
                                            <option>Yes - Easy Access</option>
                                            <option>Yes - Limited/Far</option>
                                            <option>No - Vehicle Required</option>
                                        </select>
                                    </div>
                                </div>

                                {/* --- SECTION 3: PPE & INDUCTION --- */}
                                <div className="form-group mt-4">
                                    <label>Mandatory PPE & Induction</label>
                                    <div className="checkbox-grid">
                                        {["Hard Hat", "Steel Caps", "Hi-Vis", "Safety Glasses", "Gloves", "Hearing Protection", "Site Safe Passport", "ConstructSafe"].map(item => (
                                            <label key={item} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={(formData.ppe || []).includes(item)}
                                                    onChange={(e) => {
                                                        const newPPE = e.target.checked
                                                            ? [...(formData.ppe || []), item]
                                                            : (formData.ppe || []).filter(i => i !== item);
                                                        updateFormData("ppe", newPPE);
                                                    }}
                                                />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save"><Save size={16} /> Save Project</button>
                    </div>
                </form>
            </div>

            {selectedCandidateId && (
                <CandidateModal
                    candidate={candidates.find(c => c.id === selectedCandidateId)}
                    squads={[]}
                    projects={[]}
                    onClose={() => setSelectedCandidateId(null)}
                    onSave={() => setSelectedCandidateId(null)}
                />
            )}

            <style jsx>{`
                .candidates-list { display: flex; flex-direction: column; gap: 1.5rem; width: 100%; }
                .list-header { display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
                .list-header h3 { margin: 0; color: white; font-size: 1.1rem; }
                .badge-count { background: var(--secondary); color: #0f172a; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; }
                
                .candidates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
                
                .candidate-card {
                    background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border);
                    border-radius: var(--radius-md); padding: 1rem;
                    display: flex; align-items: center; gap: 1rem;
                    cursor: pointer; transition: all 0.2s;
                }
                .candidate-card:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--secondary); transform: translateY(-2px); }

                /* Intelligence Tab Styles */
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-box {
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .stat-box label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; text-transform: uppercase; }
                .stat-box .value { font-size: 1.1rem; font-weight: 700; color: white; }
                .stat-box .subtext { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .stat-box.warning .value { color: #f59e0b; }

                .feed-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .feed-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    border-left: 3px solid transparent;
                }
                .feed-item.priority-critical { border-left-color: #ef4444; }
                .feed-item.priority-high { border-left-color: #f59e0b; }
                .feed-item .feed-icon { margin-top: 2px; color: var(--text-muted); }
                .feed-content { flex: 1; }
                .feed-title { font-weight: 600; color: white; font-size: 0.9rem; }
                .feed-desc { font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0; line-height: 1.4; }
                .feed-date { font-size: 0.75rem; color: var(--primary); font-weight: 500; margin-top: 0.25rem; }

                .gap-row-mini {
                    display: flex; justify-content: space-between;
                    padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);
                    font-size: 0.9rem;
                }
                .gap-row-mini .trade { color: white; }
                
                .c-avatar {
                    width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; color: var(--secondary); border: 1px solid var(--border);
                }
                .c-info { flex: 1; min-width: 0; }
                .c-name { font-weight: 700; color: white; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .c-role { font-size: 0.75rem; color: var(--text-muted); }
                
                .c-dates { display: flex; flex-direction: column; gap: 2px; font-size: 0.7rem; color: var(--text-muted); margin-right: 1rem; }
                .date-row { display: flex; gap: 6px; }
                .date-row .label { color: var(--text-muted); width: 35px; }
                .date-row .value { color: white; font-weight: 600; }
                
                .c-status {
                    font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                    padding: 2px 6px; border-radius: 4px; border: 1px solid transparent;
                }
                .c-status.on-job { background: rgba(59, 130, 246, 0.2); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); }
                .c-status.available { background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
                
                .empty-state {
                    grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 3rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--border);
                    border-radius: var(--radius-lg); color: var(--text-muted); text-align: center;
                }
                .empty-state p { font-weight: 600; margin: 1rem 0 0.5rem 0; font-size: 0.95rem; }

                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(2, 6, 23, 0.85); display: flex;
                    align-items: center; justify-content: center;
                    z-index: 1000; backdrop-filter: blur(12px);
                }
                .modal-content {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg); width: 100%; max-width: 1200px;
                    height: 90vh; max-height: 850px; display: flex;
                    flex-direction: column; box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.6);
                    overflow: hidden;
                }
                .modal-header {
                    padding: 1.5rem 2rem; display: flex; justify-content: space-between;
                    align-items: center; border-bottom: 1px solid var(--border);
                    background: rgba(15, 23, 42, 0.4);
                }
                .modal-header h2 { font-size: 1.5rem; font-weight: 900; color: white; margin: 0; letter-spacing: -0.03em; }
                .close-btn { background: rgba(255,255,255,0.05); border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 50%; transition: all 0.2s; }
                .close-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                .tabs-nav {
                    display: flex; padding: 0 2rem; border-bottom: 1px solid var(--border);
                    background: rgba(0,0,0,0.2); overflow-x: auto; gap: 2rem;
                }
                .tab-btn {
                    display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 0;
                    background: none; border: none; border-bottom: 3px solid transparent;
                    color: var(--text-muted); cursor: pointer; font-size: 0.85rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.1em;
                    transition: all 0.2s; white-space: nowrap;
                }
                .tab-btn:hover { color: white; }
                .tab-btn.active { color: var(--secondary); border-bottom-color: var(--secondary); text-shadow: 0 0 10px rgba(0, 242, 255, 0.3); }

                form { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
                .tab-content { flex: 1; overflow-y: auto; padding: 0; display: flex; flex-direction: column; }
                .tab-pane { padding: 2rem; display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto; width: 100%; }

                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
                label { font-size: 0.75rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
                
                input, select, textarea {
                    background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border);
                    padding: 0.8rem 1rem; border-radius: var(--radius-md); color: white;
                    outline: none; font-size: 0.95rem; width: 100%; font-family: inherit;
                    transition: all 0.2s;
                }
                .date-input { 
                    color-scheme: dark; 
                    background: #0f172a !important;
                    color: white !important;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                input:focus, select:focus, textarea:focus { border-color: var(--secondary); background: rgba(15, 23, 42, 0.8); box-shadow: 0 0 15px rgba(0, 242, 255, 0.05); }

                .address-input-group { display: flex; gap: 0.75rem; }
                .btn-find {
                    display: flex; align-items: center; gap: 0.5rem; padding: 0 1.5rem;
                    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
                    color: white; border-radius: var(--radius-md); cursor: pointer; font-weight: 700; font-size: 0.85rem;
                }

                .tab-pane-strategy { display: grid; grid-template-columns: 280px 1fr; height: 100%; overflow: hidden; }
                .strategy-sidebar {
                    background: rgba(15, 23, 42, 0.4); border-right: 1px solid var(--border);
                    overflow-y: auto; display: flex; flex-direction: column;
                }
                .sidebar-header {
                    padding: 1.5rem 1.25rem; border-bottom: 1px solid var(--border);
                    font-size: 11px; color: var(--secondary); font-weight: 900; text-transform: uppercase; letter-spacing: 0.25em;
                    background: rgba(0,0,0,0.2);
                }
                .strategy-detail { overflow-y: auto; padding: 2.5rem; background: rgba(2, 6, 23, 0.4); }

                .phase-nav-item {
                    display: flex; flex-direction: column; align-items: flex-start; padding: 1.5rem 1.25rem;
                    background: transparent; border: none; border-left: 4px solid transparent;
                    color: var(--text-muted); cursor: pointer; transition: all 0.3s;
                    border-bottom: 1px solid rgba(255,255,255,0.03); width: 100%; text-align: left;
                }
                .phase-nav-item:hover { background: rgba(255,255,255,0.03); color: white; }
                .phase-nav-item.active { background: rgba(0, 242, 255, 0.08); border-left-color: var(--secondary); color: white; box-shadow: inset 4px 0 15px rgba(0, 242, 255, 0.05); }
                .phase-nav-item.skipped { opacity: 0.4; }
                
                .phase-nav-info { display: flex; gap: 1rem; align-items: center; width: 100%; }
                .status-indicator { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .status-indicator.secure { background: var(--secondary); box-shadow: 0 0 10px var(--secondary); }
                .status-indicator.warning { background: #f59e0b; }
                .status-indicator.critical { background: #ef4444; box-shadow: 0 0 10px #ef4444; }

                .phase-name { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
                .readiness-bar { height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; width: 100%; overflow: hidden; }
                .readiness-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease-in-out; }
                .readiness-fill.secure { background: var(--secondary); }
                .readiness-fill.warning { background: #f59e0b; }
                .readiness-fill.critical { background: #ef4444; }
                .readiness-pct { font-size: 0.7rem; font-weight: 900; color: white; min-width: 30px; text-align: right; }

                .phase-detail-header { margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
                .header-title { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .header-title h3 { margin: 0; font-size: 1.75rem; font-weight: 900; color: white; letter-spacing: -0.02em; }
                .skip-toggle { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase; }
                
                .header-controls-v2 { display: flex; gap: 2rem; align-items: flex-end; }
                .control-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .control-group label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 900; color: var(--text-muted); }
                
                .alert-countdown {
                    display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem;
                    background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.1);
                    color: var(--secondary); border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 900;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }

                .package-card-v2 {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg); margin-bottom: 1.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .package-card-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1rem 1.5rem; background: rgba(15, 23, 42, 0.4); border-bottom: 1px solid var(--border);
                }
                .pkg-label { font-size: 0.75rem; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.1em; }
                .delete-pkg-btn { background: rgba(239, 68, 68, 0.05); border: 1px solid transparent; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; }
                .delete-pkg-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }

                .package-card-main { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 1.5rem; }
                .card-input { display: flex; flex-direction: column; gap: 0.5rem; }
                .card-input label { font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; letter-spacing: 0.05em; }
                .package-card-footer { padding: 0 1.5rem 1.5rem 1.5rem; }

                .skipped-placeholder {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    height: 300px; color: var(--text-muted); gap: 1.25rem; text-align: center;
                    background: rgba(15, 23, 42, 0.2); border: 2px dashed rgba(255,255,255,0.05); border-radius: var(--radius-lg);
                }
                .btn-dashed {
                    background: rgba(255,255,255,0.02); border: 2px dashed var(--border); color: var(--text-muted);
                    padding: 1rem; width: 100%; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 800; text-transform: uppercase;
                    border-radius: var(--radius-md); transition: all 0.2s; margin-top: 1rem;
                }
                .btn-dashed:hover { border-color: var(--secondary); color: var(--secondary); background: rgba(0, 242, 255, 0.05); }

                .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; padding: 1.5rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); border: 1px solid var(--border); }
                .checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-size: 0.9rem; color: white; font-weight: 500; }
                .checkbox-label input { width: 18px; height: 18px; margin: 0; appearance: none; border: 2px solid var(--border); border-radius: 4px; background: rgba(0,0,0,0.3); cursor: pointer; position: relative; }
                .checkbox-label input:checked { background: var(--secondary); border-color: var(--secondary); }
                .checkbox-label input:checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #0f172a; font-weight: 900; font-size: 12px; }

                .modal-actions {
                    padding: 1.5rem 2rem; border-top: 1px solid var(--border); background: rgba(15, 23, 42, 0.6);
                    display: flex; justify-content: flex-end; gap: 1rem;
                }
                .btn-cancel { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; padding: 0.8rem 2rem; border-radius: var(--radius-md); cursor: pointer; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.8rem; }
                .btn-cancel:hover { background: rgba(255,255,255,0.1); }
                .btn-save {
                    background: var(--secondary); border: none; color: #0f172a; padding: 0.8rem 2rem;
                    border-radius: var(--radius-md); cursor: pointer; font-weight: 900;
                    display: flex; align-items: center; gap: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.8rem;
                    box-shadow: 0 4px 15px rgba(0, 242, 255, 0.2);
                }
                .btn-save:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 242, 255, 0.3); }

                /* Engagement Toggle */
                .engagement-toggle {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
                    background: rgba(0,0,0,0.2); p: 0.5rem; border-radius: var(--radius-md);
                    border: 1px solid var(--border); margin-bottom: 2rem;
                    padding: 4px;
                }
                .toggle-option {
                    background: transparent; border: none; padding: 0.75rem 1rem;
                    border-radius: var(--radius-sm); cursor: pointer; color: var(--text-muted);
                    transition: all 0.2s; border: 1px solid transparent;
                }
                .toggle-option:hover { background: rgba(255,255,255,0.02); color: white; }
                .toggle-option.active {
                    background: var(--surface-highlight, rgba(30, 41, 59, 1));
                    border-color: var(--secondary); color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}