"use client";

import { useState } from "react";
import { X, Save, Building2, Users, Layers, Calendar, Truck, MapPin } from "lucide-react";
import { PHASE_TEMPLATES } from '@/services/constructionLogic';

export default function AddProjectModal({ isOpen, onClose, onSave, initialData }) {
    const [activeTab, setActiveTab] = useState("core");
    const defaultFormData = {
        // Tab 1: The Core
        // Tab 1: The Core
        name: "",
        projectOwner: "", // Main Contractor / Company Name
        address: "",
        tier: "Tier 1",
        type: "Healthcare",
        value: "",
        funding: "Government/Public",
        cartersLink: "",
        greenStar: "No",
        status: "Planning",

        // Tab 2: Command Chain
        projectDirector: "",
        seniorQS: "",
        siteManager: "",
        additionalSiteManagers: [], // Array for extra site managers
        safetyOfficer: "",
        gateCode: "",

        // Tab 3: Package Matrix (Reflecting Master Phase Schema)
        packages: {
            // 01 Civil
            civilWorks: { name: "", status: "Tendering", phase: "01_civil", label: "Civil & Excavation" },
            piling: { name: "", status: "Tendering", phase: "01_civil", label: "Piling" },

            // 02 Structure
            concrete: { name: "", status: "Tendering", phase: "02_structure", label: "Concrete Structure" },
            steel: { name: "", status: "Tendering", phase: "02_structure", label: "Structural Steel" },
            framing: { name: "", status: "Tendering", phase: "02_structure", label: "Timber Framing" },
            crane: { name: "", status: "Tendering", phase: "02_structure", label: "Tower Crane" },

            // 03 Envelope
            facade: { name: "", status: "Tendering", phase: "03_envelope", label: "Facade & Glazing" },
            scaffolding: { name: "", status: "Tendering", phase: "03_envelope", label: "Scaffolding" },
            roofing: { name: "", status: "Tendering", phase: "03_envelope", label: "Roofing" },

            // 04 Services
            electrical: { name: "", status: "Tendering", phase: "04_services_roughin", label: "Electrical" },
            hydraulics: { name: "", status: "Tendering", phase: "04_services_roughin", label: "Hydraulics (Plumbing)" },
            mechanical: { name: "", status: "Tendering", phase: "04_services_roughin", label: "Mechanical (HVAC)" },

            // 05 Fitout
            interiors: { name: "", status: "Tendering", phase: "05_fitout", label: "Interiors (Walls/Ceilings)" },
            flooring: { name: "", status: "Tendering", phase: "05_fitout", label: "Flooring" },
            painting: { name: "", status: "Tendering", phase: "05_fitout", label: "Painting" },
            joinery: { name: "", status: "Tendering", phase: "05_fitout", label: "Joinery" },

            // 06 Handover
            cleaning: { name: "", status: "Tendering", phase: "06_handover", label: "Final Clean" }
        },

        // Tab 4: Virtual PM
        startDate: "",
        completionDate: "",
        triggers: {}, // Populated dynamically by PHASE_TEMPLATES

        // Tab 5: Site Logistics
        parking: "On-site",
        publicTransport: "Yes",
        drugTesting: "Pre-employment only",
        induction: "",
        ppe: []
    };

    const [formData, setFormData] = useState({
        ...defaultFormData,
        ...initialData,
        packages: { ...defaultFormData.packages, ...(initialData?.packages || {}) },
        triggers: { ...defaultFormData.triggers, ...(initialData?.triggers || {}) },
        ppe: initialData?.ppe || defaultFormData.ppe
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const tabs = [
        { id: "core", label: "The Core", icon: Building2 },
        { id: "contacts", label: "Key Contacts", icon: Users },
        { id: "packages", label: "Package Matrix", icon: Layers },
        { id: "timeline", label: "Virtual PM", icon: Calendar },
        { id: "logistics", label: "Site Logistics", icon: Truck },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? "Edit Project" : "Add New Project"}</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="tabs-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            type="button"
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="tab-content">
                        {activeTab === "core" && (
                            <div className="tab-pane">
                                <div className="form-group">
                                    <label>Project Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateFormData("name", e.target.value)}
                                        placeholder="e.g. Whangarei Hospital - Acute Services Building"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Project Owner (Main Contractor)</label>
                                    <input
                                        type="text"
                                        value={formData.projectOwner}
                                        onChange={(e) => updateFormData("projectOwner", e.target.value)}
                                        placeholder="e.g. Naylor Love, MacCrennie"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Project Address</label>
                                    <div className="address-input-group">
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => updateFormData("address", e.target.value)}
                                            placeholder="e.g. 123 Queen Street, Auckland"
                                        />
                                        <button
                                            type="button"
                                            className="btn-find"
                                            onClick={async () => {
                                                if (!formData.address) return;
                                                try {
                                                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`);
                                                    const data = await res.json();
                                                    if (data && data.length > 0) {
                                                        updateFormData("lat", parseFloat(data[0].lat));
                                                        updateFormData("lng", parseFloat(data[0].lon));
                                                        alert(`Location found: ${data[0].display_name}`);
                                                    } else {
                                                        alert("Location not found");
                                                    }
                                                } catch (error) {
                                                    console.error("Geocoding error:", error);
                                                    alert("Error finding location");
                                                }
                                            }}
                                        >
                                            <MapPin size={16} />
                                            Find
                                        </button>
                                    </div>
                                    {formData.lat && <span className="location-status">Location Locked: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tier</label>
                                        <select
                                            value={formData.tier}
                                            onChange={(e) => updateFormData("tier", e.target.value)}
                                        >
                                            <option>Tier 1</option>
                                            <option>Tier 2</option>
                                            <option>Tier 3</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Project Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => updateFormData("type", e.target.value)}
                                        >
                                            <option>Healthcare</option>
                                            <option>Commercial High-Rise</option>
                                            <option>Industrial/Shed</option>
                                            <option>Social Housing</option>
                                            <option>Education</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Est. Value</label>
                                        <input
                                            type="text"
                                            value={formData.value}
                                            onChange={(e) => updateFormData("value", e.target.value)}
                                            placeholder="e.g. $150M"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Funding Source</label>
                                        <select
                                            value={formData.funding}
                                            onChange={(e) => updateFormData("funding", e.target.value)}
                                        >
                                            <option>Government/Public</option>
                                            <option>Private Developer</option>
                                            <option>PPP</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Carters Account Link</label>
                                        <input
                                            type="text"
                                            value={formData.cartersLink}
                                            onChange={(e) => updateFormData("cartersLink", e.target.value)}
                                            placeholder="Search Account Manager..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Green Star Rating</label>
                                        <select
                                            value={formData.greenStar}
                                            onChange={(e) => updateFormData("greenStar", e.target.value)}
                                        >
                                            <option>No</option>
                                            <option>4 Star</option>
                                            <option>5 Star</option>
                                            <option>6 Star</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Current Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => updateFormData("status", e.target.value)}
                                    >
                                        <option>Planning</option>
                                        <option>Tender</option>
                                        <option>Construction</option>
                                        <option>Fitout</option>
                                        <option>Handover</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === "contacts" && (
                            <div className="tab-pane">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Project Director</label>
                                        <input
                                            type="text"
                                            value={formData.projectDirector}
                                            onChange={(e) => updateFormData("projectDirector", e.target.value)}
                                            placeholder="Name / Phone"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Senior QS</label>
                                        <input
                                            type="text"
                                            value={formData.seniorQS}
                                            onChange={(e) => updateFormData("seniorQS", e.target.value)}
                                            placeholder="Name / Phone"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Site Manager (Lead)</label>
                                        <input
                                            type="text"
                                            value={formData.siteManager}
                                            onChange={(e) => updateFormData("siteManager", e.target.value)}
                                            placeholder="Name / Phone"
                                        />
                                    </div>

                                    {/* Additional Site Managers */}
                                    {(formData.additionalSiteManagers || []).map((sm, index) => (
                                        <div className="form-group" key={index}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label>Site Manager #{index + 2}</label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSMs = formData.additionalSiteManagers.filter((_, i) => i !== index);
                                                        updateFormData("additionalSiteManagers", newSMs);
                                                    }}
                                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={sm}
                                                onChange={(e) => {
                                                    const newSMs = [...(formData.additionalSiteManagers || [])];
                                                    newSMs[index] = e.target.value;
                                                    updateFormData("additionalSiteManagers", newSMs);
                                                }}
                                                placeholder="Name / Phone"
                                            />
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSMs = [...(formData.additionalSiteManagers || []), ""];
                                            updateFormData("additionalSiteManagers", newSMs);
                                        }}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px dashed var(--border)',
                                            color: 'var(--primary)',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            width: '100%'
                                        }}
                                    >
                                        + Add Associate Site Manager
                                    </button>
                                    <div className="form-group">
                                        <label>Health & Safety Officer</label>
                                        <input
                                            type="text"
                                            value={formData.safetyOfficer}
                                            onChange={(e) => updateFormData("safetyOfficer", e.target.value)}
                                            placeholder="Name / Phone"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Gate Code / Site Access Info</label>
                                    <input
                                        type="text"
                                        value={formData.gateCode}
                                        onChange={(e) => updateFormData("gateCode", e.target.value)}
                                        placeholder="e.g. Code 1234, Enter via Gate 3"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "packages" && (
                            <div className="tab-pane">
                                <div className="packages-grid">
                                    <div className="package-header">
                                        <span>Trade Package</span>
                                        <span>Subcontractor</span>
                                        <span>Status</span>
                                    </div>
                                    {Object.entries(formData.packages).map(([key, pkg]) => (
                                        <div key={key} className="package-row-expanded">
                                            <div className="package-main-row">
                                                <span className="package-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                <input
                                                    type="text"
                                                    value={pkg.name}
                                                    onChange={(e) => {
                                                        const newPackages = { ...formData.packages };
                                                        newPackages[key] = { ...pkg, name: e.target.value };
                                                        updateFormData("packages", newPackages);
                                                    }}
                                                    placeholder="Subcontractor Name"
                                                />
                                                <select
                                                    value={pkg.status}
                                                    onChange={(e) => {
                                                        const newPackages = { ...formData.packages };
                                                        newPackages[key] = { ...pkg, status: e.target.value };
                                                        updateFormData("packages", newPackages);
                                                    }}
                                                    className={`status-${pkg.status.toLowerCase()}`}
                                                >
                                                    <option>Tendering</option>
                                                    <option>Awarded</option>
                                                    <option>On-Site</option>
                                                    <option>Completed</option>
                                                </select>
                                            </div>

                                            {/* Smart Data Fields */}
                                            <div className="package-details-row">
                                                <div className="detail-input">
                                                    <label>Est. Headcount</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Auto"
                                                        value={pkg.estimatedHeadcount || ''}
                                                        onChange={(e) => {
                                                            const newPackages = { ...formData.packages };
                                                            newPackages[key] = { ...pkg, estimatedHeadcount: e.target.value };
                                                            updateFormData("packages", newPackages);
                                                        }}
                                                    />
                                                </div>
                                                <div className="detail-input">
                                                    <label>Value ($)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 500000"
                                                        value={pkg.commercialValue || ''}
                                                        onChange={(e) => {
                                                            const newPackages = { ...formData.packages };
                                                            newPackages[key] = { ...pkg, commercialValue: e.target.value };
                                                            updateFormData("packages", newPackages);
                                                        }}
                                                    />
                                                </div>
                                                <div className="detail-input">
                                                    <label>Lead Time (Wks)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="3"
                                                        value={pkg.leadTimeWeeks || 3}
                                                        onChange={(e) => {
                                                            const newPackages = { ...formData.packages };
                                                            newPackages[key] = { ...pkg, leadTimeWeeks: e.target.value };
                                                            updateFormData("packages", newPackages);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tender Tracker */}
                                            {pkg.status === "Tendering" && (
                                                <div className="package-bidders-row">
                                                    <label>Bidding Subcontractors (Tender Tracker):</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. CJM Concrete, Higgins, Dempsey Wood"
                                                        value={pkg.biddingSubcontractors || ''}
                                                        onChange={(e) => {
                                                            const newPackages = { ...formData.packages };
                                                            newPackages[key] = { ...pkg, biddingSubcontractors: e.target.value };
                                                            updateFormData("packages", newPackages);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === "timeline" && (
                            <div className="tab-pane">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Project Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => updateFormData("startDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Est. Completion Date</label>
                                        <input
                                            type="date"
                                            value={formData.completionDate}
                                            onChange={(e) => updateFormData("completionDate", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="section-header">
                                    <h3>Key Phase Triggers</h3>
                                    <p>Set dates to trigger recruitment alerts</p>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Alert Lead Time (Weeks)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input
                                            type="range"
                                            min="1"
                                            max="8"
                                            step="1"
                                            value={formData.triggers.offsetWeeks || 2}
                                            onChange={(e) => {
                                                const newTriggers = { ...formData.triggers, offsetWeeks: parseInt(e.target.value) };
                                                updateFormData("triggers", newTriggers);
                                            }}
                                            style={{ flex: 1 }}
                                        />
                                        <span style={{ fontWeight: 600, color: 'var(--primary)', minWidth: '80px' }}>
                                            {formData.triggers.offsetWeeks || 2} Weeks
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted">We will alert you this many weeks BEFORE the phase starts.</p>
                                </div>

                                <div className="triggers-grid">
                                    {PHASE_TEMPLATES.Commercial_Multi_Use.map(phase => (
                                        <div className="trigger-item" key={phase.phaseId}>
                                            <label>{phase.name}</label>
                                            <input
                                                type="date"
                                                value={formData.triggers[phase.phaseId] || ''}
                                                onChange={(e) => {
                                                    const newTriggers = { ...formData.triggers, [phase.phaseId]: e.target.value };
                                                    updateFormData("triggers", newTriggers);
                                                }}
                                            />
                                            <span className="trigger-hint">Target: {phase.decisionMaker}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "logistics" && (
                            <div className="tab-pane">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Parking Situation</label>
                                        <select
                                            value={formData.parking}
                                            onChange={(e) => updateFormData("parking", e.target.value)}
                                        >
                                            <option>On-site</option>
                                            <option>Street Only</option>
                                            <option>Paid Parking</option>
                                            <option>Shuttle Bus</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Public Transport</label>
                                        <select
                                            value={formData.publicTransport}
                                            onChange={(e) => updateFormData("publicTransport", e.target.value)}
                                        >
                                            <option>Yes - Close (&lt;500m)</option>
                                            <option>Yes - Moderate (500m-1km)</option>
                                            <option>No</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Drug Testing Policy</label>
                                    <select
                                        value={formData.drugTesting}
                                        onChange={(e) => updateFormData("drugTesting", e.target.value)}
                                    >
                                        <option>Pre-employment only</option>
                                        <option>Random</option>
                                        <option>Zero Tolerance</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Induction Process</label>
                                    <textarea
                                        value={formData.induction}
                                        onChange={(e) => updateFormData("induction", e.target.value)}
                                        placeholder="e.g. Every Tuesday at 7am, takes 2 hours, unpaid"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>PPE Requirements</label>
                                    <div className="checkbox-grid">
                                        {["Hard Hat", "Steel Caps", "Hi-Vis", "Safety Glasses", "Lace-up boots only", "Gloves", "Hearing Protection"].map(item => (
                                            <label key={item} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.ppe.includes(item)}
                                                    onChange={(e) => {
                                                        const newPPE = e.target.checked
                                                            ? [...formData.ppe, item]
                                                            : formData.ppe.filter(i => i !== item);
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
                        <button type="submit" className="btn-save">
                            <Save size={16} />
                            Save Project
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }

                .modal-content {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    width: 100%;
                    max-width: 800px;
                    height: 90vh;
                    max-height: 800px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }

                .modal-header {
                    padding: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border);
                }

                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0;
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
                    color: var(--text-main);
                }

                .tabs-nav {
                    display: flex;
                    padding: 0 1.5rem;
                    border-bottom: 1px solid var(--border);
                    background: rgba(0,0,0,0.2);
                    overflow-x: auto;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    transition: all 0.2s;
                }

                .tab-btn:hover {
                    color: var(--text-main);
                }

                .tab-btn.active {
                    color: var(--primary);
                    border-bottom-color: var(--primary);
                }

                form {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    overflow: hidden;
                }

                .tab-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                }

                .tab-pane {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                label {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                input, select, textarea {
                    background: var(--background);
                    border: 1px solid var(--border);
                    padding: 0.6rem;
                    border-radius: var(--radius-sm);
                    color: var(--text-main);
                    outline: none;
                    font-size: 0.95rem;
                    font-family: inherit;
                }

                input:focus, select:focus, textarea:focus {
                    border-color: var(--primary);
                }

                /* Package Matrix Styles */
                .packages-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .phase-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .phase-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border);
                }

                .phase-header h4 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--primary);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .phase-badges {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    background: rgba(255,255,255,0.03);
                    padding: 0.2rem 0.6rem;
                    border-radius: 12px;
                }

                .package-row-expanded {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: var(--background);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .package-main-row {
                    display: grid;
                    grid-template-columns: 150px 1fr 150px;
                    gap: 1rem;
                    align-items: center;
                }

                .package-details-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                .detail-input {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .detail-input label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--text-muted);
                }

                .detail-input input {
                    padding: 0.4rem;
                    font-size: 0.85rem;
                }
                
                .package-bidders-row {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .package-bidders-row label {
                    font-size: 0.7rem;
                    color: var(--primary);
                    text-transform: uppercase;
                }

                .status-tendering { color: #f59e0b; }
                .status-awarded { color: #3b82f6; }
                .status-on-site { color: #10b981; }
                .status-completed { color: var(--text-muted); }

                /* Timeline Styles */
                .section-header {
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 0.5rem;
                }

                .section-header h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0 0 0.25rem 0;
                }

                .section-header p {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin: 0;
                }

                .triggers-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .trigger-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    background: var(--background);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .trigger-hint {
                    font-size: 0.8rem;
                    color: var(--primary);
                    font-style: italic;
                }

                /* Logistics Styles */
                .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 0.75rem;
                    background: var(--background);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    color: var(--text-main);
                }

                .checkbox-label input {
                    width: auto;
                }

                .modal-actions {
                    padding: 1.5rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    background: var(--surface);
                }

                .btn-cancel {
                    background: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                }

                .btn-save {
                    background: var(--primary);
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                }

                .btn-save:hover {
                    opacity: 0.9;
                }

                .btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </div>
    );
}
