"use client";

import { useState } from "react";
import { X, Save, Building2, Users, Layers, Calendar, Truck, MapPin } from "lucide-react";

export default function AddProjectModal({ isOpen, onClose, onSave, initialData }) {
    const [activeTab, setActiveTab] = useState("core");
    const defaultFormData = {
        // Tab 1: The Core
        name: "",
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
        safetyOfficer: "",
        gateCode: "",

        // Tab 3: Package Matrix
        packages: {
            civil: { name: "", status: "Tendering" },
            concrete: { name: "", status: "Tendering" },
            steel: { name: "", status: "Tendering" },
            roofing: { name: "", status: "Tendering" },
            facade: { name: "", status: "Tendering" },
            framing: { name: "", status: "Tendering" },
            hvac: { name: "", status: "Tendering" },
            flooring: { name: "", status: "Tendering" }
        },

        // Tab 4: Virtual PM
        startDate: "",
        completionDate: "",
        triggers: {
            excavation: "",
            structure: "",
            lockUp: "",
            fitOut: ""
        },

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
                                        <label>Site Manager</label>
                                        <input
                                            type="text"
                                            value={formData.siteManager}
                                            onChange={(e) => updateFormData("siteManager", e.target.value)}
                                            placeholder="Name / Phone"
                                        />
                                    </div>
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
                                        <div key={key} className="package-row">
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

                                <div className="triggers-grid">
                                    <div className="trigger-item">
                                        <label>Excavation Ends</label>
                                        <input
                                            type="date"
                                            value={formData.triggers.excavation}
                                            onChange={(e) => {
                                                const newTriggers = { ...formData.triggers, excavation: e.target.value };
                                                updateFormData("triggers", newTriggers);
                                            }}
                                        />
                                        <span className="trigger-hint">Stop looking for operators</span>
                                    </div>
                                    <div className="trigger-item">
                                        <label>Structure Starts</label>
                                        <input
                                            type="date"
                                            value={formData.triggers.structure}
                                            onChange={(e) => {
                                                const newTriggers = { ...formData.triggers, structure: e.target.value };
                                                updateFormData("triggers", newTriggers);
                                            }}
                                        />
                                        <span className="trigger-hint">Start Hammer Hands & Formworkers</span>
                                    </div>
                                    <div className="trigger-item">
                                        <label>Lock-up / Watertight</label>
                                        <input
                                            type="date"
                                            value={formData.triggers.lockUp}
                                            onChange={(e) => {
                                                const newTriggers = { ...formData.triggers, lockUp: e.target.value };
                                                updateFormData("triggers", newTriggers);
                                            }}
                                        />
                                        <span className="trigger-hint">Start Gib Stoppers & Interiors</span>
                                    </div>
                                    <div className="trigger-item">
                                        <label>Fit-out Starts</label>
                                        <input
                                            type="date"
                                            value={formData.triggers.fitOut}
                                            onChange={(e) => {
                                                const newTriggers = { ...formData.triggers, fitOut: e.target.value };
                                                updateFormData("triggers", newTriggers);
                                            }}
                                        />
                                        <span className="trigger-hint">Start Flooring & Painters</span>
                                    </div>
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
                    gap: 0.5rem;
                }

                .package-header {
                    display: grid;
                    grid-template-columns: 150px 1fr 150px;
                    gap: 1rem;
                    padding: 0.5rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    border-bottom: 1px solid var(--border);
                }

                .package-row {
                    display: grid;
                    grid-template-columns: 150px 1fr 150px;
                    gap: 1rem;
                    align-items: center;
                    padding: 0.5rem;
                    background: var(--background);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }

                .package-name {
                    font-weight: 500;
                    color: var(--text-main);
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
