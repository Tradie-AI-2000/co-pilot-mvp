"use client";

import { useState } from 'react';
import { Download, Edit, Save, X, Plus, AlertCircle, Briefcase, ArrowRight, UserCheck, Send } from 'lucide-react';
import { RELATED_ROLES } from '../services/construction-logic.js';
import { useData } from "../context/data-context.js";
import FloatCandidateModal from "./float-candidate-modal.js";

export default function CandidateModal({ candidate, squads, projects, onClose, onSave }) {
    const { assignCandidateToProject } = useData();
    const isNew = !candidate.firstName;
    const [isEditing, setIsEditing] = useState(isNew);
    const [formData, setFormData] = useState(candidate);
    const [isFloatModalOpen, setIsFloatModalOpen] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isNew) {
            onClose();
        } else {
            setFormData(candidate);
            setIsEditing(false);
        }
    };

    const handleExport = () => {
        const headers = Object.keys(candidate).join(",");
        const values = Object.values(candidate).map(v => `"${v}"`).join(",");
        const csvContent = `${headers}\n${values}`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${candidate.firstName}_${candidate.lastName}_profile.csv`;
        link.click();
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-btn" onClick={onClose}>&times;</button>

                    <div className="modal-header">
                        <div className="modal-avatar">
                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </div>
                        <div className="modal-title">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input
                                        className="edit-input title-input"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        placeholder="First Name"
                                    />
                                    <input
                                        className="edit-input title-input"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        placeholder="Last Name"
                                    />
                                </div>
                            ) : (
                                <h2>{formData.firstName} {formData.lastName}</h2>
                            )}
                            <p className="text-muted">Candidate ID: {formData.id}</p>
                        </div>

                        <div className="modal-actions">
                            {!isEditing ? (
                                <>
                                    <button className="icon-btn float-btn" onClick={() => setIsFloatModalOpen(true)}>
                                        <Send size={16} /> Float
                                    </button>
                                    <button className="icon-btn" onClick={handleExport} title="Export Candidate">
                                        <Download size={18} />
                                    </button>
                                    <button className="icon-btn primary" onClick={() => setIsEditing(true)}>
                                        <Edit size={18} /> Edit
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="icon-btn" onClick={handleCancel}>
                                        <X size={18} /> Cancel
                                    </button>
                                    <button className="icon-btn primary" onClick={handleSave}>
                                        <Save size={18} /> Save
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="info-section">
                            <h3>Recruiter Intelligence & Compliance</h3>
                            <div className="info-grid">
                                <div className="info-field">
                                    <span className="field-label">Residency Status</span>
                                    {isEditing ? (
                                        <select
                                            className="edit-input"
                                            value={formData.residency || "Citizen"}
                                            onChange={(e) => handleChange('residency', e.target.value)}
                                        >
                                            <option value="Citizen">NZ Citizen</option>
                                            <option value="Resident">Permanent Resident</option>
                                            <option value="Work Visa">Work Visa (Filipino/International)</option>
                                        </select>
                                    ) : (
                                        <span className="field-value">{formData.residency || 'Citizen'}</span>
                                    )}
                                </div>

                                {formData.residency === "Work Visa" && (
                                    <div className="info-field">
                                        <span className="field-label">Visa Expiry Date</span>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                className="edit-input"
                                                value={formData.visaExpiry || ''}
                                                onChange={(e) => handleChange('visaExpiry', e.target.value)}
                                            />
                                        ) : (
                                            <span className={`field-value ${new Date(formData.visaExpiry) < new Date() ? 'text-rose-500 font-bold' : ''}`}>
                                                {formData.visaExpiry || 'NOT SET'}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="info-field">
                                    <span className="field-label">Site Safe Expiry</span>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            className="edit-input"
                                            value={formData.siteSafeExpiry || ''}
                                            onChange={(e) => handleChange('siteSafeExpiry', e.target.value)}
                                        />
                                    ) : (
                                        <span className={`field-value ${new Date(formData.siteSafeExpiry) < new Date() ? 'text-rose-500 font-bold' : ''}`}>
                                            {formData.siteSafeExpiry || 'NOT SET'}
                                        </span>
                                    )}
                                </div>

                                <div className="info-field">
                                    <span className="field-label">Satisfaction Rating (1-5)</span>
                                    {isEditing ? (
                                        <select
                                            className="edit-input"
                                            value={formData.satisfactionRating || 5}
                                            onChange={(e) => handleChange('satisfactionRating', parseInt(e.target.value))}
                                        >
                                            <option value="1">1 - Critical Risk</option>
                                            <option value="2">2 - Unhappy</option>
                                            <option value="3">3 - Neutral</option>
                                            <option value="4">4 - Happy</option>
                                            <option value="5">5 - Excellent</option>
                                        </select>
                                    ) : (
                                        <span className="field-value">
                                            {"⭐".repeat(formData.satisfactionRating || 5)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Employment & Financials</h3>
                            <div className="info-grid">
                                <div className="info-field">
                                    <span className="field-label">Candidate Pay Rate ($/hr)</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="edit-input"
                                            value={formData.payRate || 0}
                                            onChange={(e) => handleChange('payRate', parseFloat(e.target.value))}
                                        />
                                    ) : (
                                        <span className="field-value">${formData.payRate || 0}/hr</span>
                                    )}
                                </div>

                                <div className="info-field">
                                    <span className="field-label">Client Charge Rate ($/hr)</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="edit-input"
                                            value={formData.chargeRate || 0}
                                            onChange={(e) => handleChange('chargeRate', parseFloat(e.target.value))}
                                        />
                                    ) : (
                                        <span className="field-value highlight">${formData.chargeRate || 0}/hr</span>
                                    )}
                                </div>

                                <div className="info-field">
                                    <span className="field-label">Guaranteed Hours / Wk</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="edit-input"
                                            value={formData.guaranteedHours || 30}
                                            onChange={(e) => handleChange('guaranteedHours', parseInt(e.target.value))}
                                        />
                                    ) : (
                                        <span className="field-value">{formData.guaranteedHours || 30} hrs</span>
                                    )}
                                </div>

                                {!isEditing && formData.chargeRate > 0 && (
                                    <div className="info-field margin-preview">
                                        <span className="field-label">Gross Margin (Est)</span>
                                        <span className="field-value text-emerald-400">
                                            ${(formData.chargeRate - (formData.payRate * 1.3)).toFixed(2)}/hr
                                            <small className="ml-2 text-xs text-muted">
                                                ({Math.round(((formData.chargeRate - (formData.payRate * 1.3)) / formData.chargeRate) * 100)}%)
                                            </small>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Status & Availability</h3>
                            <div className="info-grid">
                                <div className="info-field">
                                    <span className="field-label">Current Status</span>
                                    {isEditing ? (
                                        <select
                                            className="edit-input"
                                            value={formData.status}
                                            onChange={(e) => handleChange('status', e.target.value)}
                                        >
                                            <option value="Available">Available (On Bench)</option>
                                            <option value="On Job">On Job</option>
                                            <option value="Placed">Placed (Permanent)</option>
                                            <option value="Unavailable">Unavailable</option>
                                        </select>
                                    ) : (
                                        <span className={`status-badge ${formData.status?.toLowerCase().replace(' ', '-')}`}>
                                            {formData.status}
                                        </span>
                                    )}
                                </div>

                                {(formData.status === "On Job" || formData.status === "Placed") && (
                                    <>
                                        <div className="info-field">
                                            <span className="field-label">Finish Date</span>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    className="edit-input"
                                                    value={formData.finishDate || ''}
                                                    onChange={(e) => handleChange('finishDate', e.target.value)}
                                                />
                                            ) : (
                                                <span className="field-value">{formData.finishDate || 'N/A'}</span>
                                            )}
                                        </div>

                                        {formData.status === "On Job" && (
                                            <div className="info-field">
                                                <span className="field-label">Current Project</span>
                                                {isEditing ? (
                                                    <select
                                                        className="edit-input"
                                                        value={formData.projectId || ''}
                                                        onChange={(e) => {
                                                            const projectId = e.target.value;
                                                            const project = projects.find(p => p.id === projectId);
                                                            if (project) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    projectId: projectId,
                                                                    currentEmployer: project.client || project.name,
                                                                    lat: project.coordinates?.lat || -36.8485,
                                                                    lng: project.coordinates?.lng || 174.7633,
                                                                    suburb: project.region || project.location || "Unknown"
                                                                }));
                                                            } else {
                                                                handleChange('projectId', projectId);
                                                            }
                                                        }}
                                                    >
                                                        <option value="">Select Project...</option>
                                                        {projects.map(p => (
                                                            <option key={p.id} value={p.id}>{p.name} ({p.client})</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="field-value">
                                                        {projects.find(p => p.id === formData.projectId)?.name || formData.currentEmployer || 'N/A'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Squad Assignment</h3>
                            <div className="info-grid">
                                <div className="info-field">
                                    <span className="field-label">Assign to Squad</span>
                                    {isEditing ? (
                                        <select
                                            className="edit-input"
                                            value={formData.squadId || ''}
                                            onChange={(e) => {
                                                const squadId = e.target.value;
                                                handleChange('squadId', squadId);
                                            }}
                                        >
                                            <option value="">None</option>
                                            {squads.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="field-value">
                                            {squads.find(s => s.id === formData.squadId)?.name || 'None'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <div className="info-section">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="m-0">Active Demand Matches</h3>
                                    <span className="beta-tag">STREAK</span>
                                </div>
                                <div className="demand-matches-list">
                                    {(() => {
                                        const matches = [];
                                        const cRole = formData.role;
                                        const related = RELATED_ROLES[cRole] || [];
                                        const acceptableRoles = [cRole, ...related];

                                        projects.forEach(p => {
                                            if (p.hiringSignals) {
                                                p.hiringSignals.forEach(signal => {
                                                    if (acceptableRoles.includes(signal.role)) {
                                                        matches.push({
                                                            project: p,
                                                            signal: signal
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                        if (matches.length === 0) {
                                            return <div className="empty-state-lite">No project gaps currently match this candidate's role.</div>;
                                        }

                                        return matches.map((m, idx) => (
                                            <div key={`${m.project.id}-${idx}`} className="demand-item">
                                                <div className="demand-main">
                                                    <div className="demand-project">{m.project.name}</div>
                                                    <div className="demand-gap">Needs {m.signal.count}x {m.signal.role}</div>
                                                </div>
                                                <button
                                                    className="btn-allocate"
                                                    onClick={() => assignCandidateToProject(formData.id, m.project.id, m.signal.id)}
                                                >
                                                    Assign to Project <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}

                        <div className="info-section">
                            <h3>Personal Details</h3>
                            <div className="info-grid">
                                <InfoField label="First Name" field="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Last Name" field="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Known As" field="knownAs" value={formData.knownAs} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Date of Birth" field="dob" value={formData.dob} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Phone" field="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Mobile" field="mobile" value={formData.mobile} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Email" field="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Other Email" field="otherEmail" value={formData.otherEmail} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Address 1" field="address1" value={formData.address1} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Address 2" field="address2" value={formData.address2} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Suburb" field="suburb" value={formData.suburb} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="State" field="state" value={formData.state} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Postcode" field="postcode" value={formData.postcode} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Country" field="country" value={formData.country} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Residency" field="residency" value={formData.residency} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Residency Expiry" field="residencyExpiryDate" value={formData.residencyExpiryDate} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Indigenous" field="indigenous" value={formData.indigenous} isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Employment & Financials</h3>
                            <div className="info-grid">
                                <InfoField label="Current Employer" field="currentEmployer" value={formData.currentEmployer} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Current Position" field="currentPosition" value={formData.currentPosition} isEditing={isEditing} onChange={handleChange} />
                                <div className="info-field">
                                    <span className="field-label">Trade / Role</span>
                                    {isEditing ? (
                                        <RoleSelector
                                            value={formData.role}
                                            onChange={(val) => handleChange('role', val)}
                                        />
                                    ) : (
                                        <span className="field-value highlight">{formData.role || '-'}</span>
                                    )}
                                </div>
                                <InfoField label="Current Work Type" field="currentWorkType" value={formData.currentWorkType} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Current Salary" field="currentSalary" value={formData.currentSalary} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Charge Out Rate" field="chargeOutRate" value={formData.chargeOutRate} highlight isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Notice Period" field="noticePeriod" value={formData.noticePeriod} isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Ideal Role Preferences</h3>
                            <div className="info-grid">
                                <InfoField label="Ideal Position" field="idealPosition" value={formData.idealPosition} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Ideal Work Type" field="idealWorkType" value={formData.idealWorkType} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Ideal Salary" field="idealSalary" value={formData.idealSalary} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Ideal Location" field="idealLocation" value={formData.idealLocation} isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Emergency Contact</h3>
                            <div className="info-grid">
                                <InfoField label="Contact Name" field="emergencyContact" value={formData.emergencyContact} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Relationship" field="emergencyContactRelationship" value={formData.emergencyContactRelationship} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Phone" field="emergencyPhone" value={formData.emergencyPhone} isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Socials & Source</h3>
                            <div className="info-grid">
                                <InfoField label="LinkedIn" field="linkedin" value={formData.linkedin} isLink isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Twitter" field="twitter" value={formData.twitter} isLink isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Facebook" field="facebook" value={formData.facebook} isLink isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Source" field="source" value={formData.source} isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Internal Info</h3>
                            <div className="info-grid">
                                <InfoField label="Recruiter" field="recruiter" value={formData.recruiter} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Branch" field="branch" value={formData.branch} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Division" field="division" value={formData.division} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Internal Rating" field="internalRating" value={formData.internalRating} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Date Created" field="dateCreated" value={formData.dateCreated} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Date Updated" field="dateUpdated" value={formData.dateUpdated} isEditing={isEditing} onChange={handleChange} />
                                <InfoField label="Last Note" field="lastNote" value={formData.lastNote} fullWidth isEditing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FloatCandidateModal
                candidate={formData}
                isOpen={isFloatModalOpen}
                onClose={() => setIsFloatModalOpen(false)}
            />

            <style jsx>{`
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
            }

            .float-btn {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border-color: rgba(16, 185, 129, 0.2);
                font-weight: 600;
            }
            .float-btn:hover {
                background: #10b981;
                color: #0f172a;
            }

            .modal-content {
                background: #1e293b;
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border);
                display: flex;
                flex-direction: column;
                position: relative;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }

            .close-btn {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 2rem;
                cursor: pointer;
                z-index: 10;
                line-height: 1;
            }
            
            .close-btn:hover {
                color: var(--text-main);
            }

            .modal-header {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.03);
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .modal-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: var(--primary-light);
                color: var(--secondary);
                font-size: 2rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--border);
            }

            .modal-title {
                flex: 1;
            }

            .modal-title h2 {
                font-size: 1.75rem;
                font-weight: 700;
                color: var(--text-main);
                margin: 0;
            }

            .modal-actions {
                display: flex;
                gap: 0.75rem;
                margin-right: 2rem;
            }

            .icon-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-main);
                padding: 0.5rem 1rem;
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .icon-btn:hover {
                border-color: var(--secondary);
                color: var(--secondary);
            }

            .icon-btn.primary {
                background: var(--secondary);
                color: #0f172a;
                border-color: var(--secondary);
                font-weight: 600;
            }

            .icon-btn.primary:hover {
                background: var(--secondary-light);
            }

            .modal-body {
                padding: 2rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .info-section h3 {
                font-size: 1.1rem;
                color: var(--secondary);
                margin-bottom: 1rem;
                border-bottom: 1px solid var(--border);
                padding-bottom: 0.5rem;
            }

            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
            }

            .edit-input {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid var(--border);
                color: var(--text-main);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                width: 100%;
                font-size: 0.95rem;
            }

            .edit-input:focus {
                outline: none;
                border-color: var(--secondary);
            }

            .title-input {
                font-size: 1.5rem;
                font-weight: 700;
                padding: 0.25rem;
            }

            .status-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
                font-size: 0.75rem;
                font-weight: 500;
                display: inline-block;
                text-align: center;
                width: fit-content;
            }

            .status-badge.available { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
            .status-badge.on-job { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
            .status-badge.placed { background: rgba(16, 185, 129, 0.2); color: #10b981; }
            .status-badge.unavailable { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }

            .demand-matches-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .demand-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(255, 255, 255, 0.03);
                border: 1px border var(--border);
                padding: 0.75rem 1rem;
                border-radius: 8px;
                transition: transform 0.2s;
            }
            .demand-item:hover {
                transform: translateX(4px);
                background: rgba(255, 255, 255, 0.05);
            }
            .demand-main {
                display: flex;
                flex-direction: column;
            }
            .demand-project {
                font-weight: 600;
                color: white;
                font-size: 0.95rem;
            }
            .demand-gap {
                font-size: 0.75rem;
                color: var(--secondary);
                text-transform: uppercase;
                letter-spacing: 0.02em;
                font-weight: 700;
            }
            .btn-allocate {
                background: var(--secondary);
                color: #0f172a;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.2s;
            }
            .btn-allocate:hover {
                background: #34d399;
                box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
            }
            .empty-state-lite {
                padding: 1rem;
                text-align: center;
                color: var(--text-muted);
                font-size: 0.85rem;
                border: 1px dashed var(--border);
                border-radius: 8px;
            }
            .beta-tag {
                background: linear-gradient(135deg, var(--secondary), #10b981);
                color: #0f172a;
                font-size: 0.6rem;
                font-weight: 800;
                padding: 2px 6px;
                border-radius: 4px;
                letter-spacing: 0.05em;
            }
            .m-0 { margin: 0; }
            .mb-2 { margin-bottom: 0.5rem; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
          `}</style>
        </>
    );
}

// --- Internal Components ---

function RoleSelector({ value, onChange }) {
    const { availableRoles, addRole } = useData();
    const [isCreating, setIsCreating] = useState(false);
    const [newRole, setNewRole] = useState("");

    const handleCreate = () => {
        if (newRole) {
            addRole(newRole);
            onChange(newRole);
            setIsCreating(false);
            setNewRole("");
        }
    };

    if (isCreating) {
        return (
            <div className="flex gap-2">
                <input
                    className="edit-input"
                    placeholder="New Role Name..."
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    autoFocus
                />
                <button
                    className="icon-btn primary small"
                    onClick={handleCreate}
                    title="Add Role"
                >
                    <Save size={14} />
                </button>
                <button
                    className="icon-btn small"
                    onClick={() => setIsCreating(false)}
                    title="Cancel"
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <select
                className="edit-input"
                value={value || ""}
                onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                        setIsCreating(true);
                    } else {
                        onChange(e.target.value);
                    }
                }}
            >
                <option value="">Select Role...</option>
                {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
                <option value="__NEW__">+ Add New Role...</option>
            </select>
        </div>
    );
}

function InfoField({ label, value, field, highlight, isLink, fullWidth, isEditing, onChange }) {
    return (
        <div className="info-field" style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <span className="field-label">{label}</span>
            {isEditing ? (
                <input
                    className="edit-input"
                    value={value || ''}
                    onChange={(e) => onChange(field, e.target.value)}
                />
            ) : (
                <>
                    {isLink && value ? (
                        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="field-value link">
                            {value}
                        </a>
                    ) : (
                        <span className={`field-value ${highlight ? 'highlight' : ''}`}>{value || '-'}</span>
                    )}
                </>
            )}
            <style jsx>{`
                .info-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .field-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .field-value {
                    color: var(--text-main);
                    font-weight: 500;
                    font-size: 0.95rem;
                    word-break: break-word;
                }
                .field-value.highlight {
                    color: var(--secondary);
                    font-weight: 600;
                }
                .field-value.link {
                    color: var(--primary);
                    text-decoration: underline;
                }
                .field-value.link:hover {
                    color: var(--secondary);
                }
                .edit-input {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    width: 100%;
                    font-size: 0.95rem;
                }
                .edit-input:focus {
                    outline: none;
                    border-color: var(--secondary);
                }
            `}</style>
        </div>
    );
}