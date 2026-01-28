"use client";

import { useState, useEffect } from "react";
import { X, Send, Calculator, User, Building2, Paperclip, AlertTriangle, Shield, Mail, MessageCircle, Smartphone } from "lucide-react";
import { useData } from "../context/data-context.js";
import { checkVisaCompliance, generatePhaseMessage, formatWhatsAppLink } from "../services/construction-logic.js";

export default function FloatCandidateModal({ candidate, isOpen, onClose, prefilledData }) {
    const { clients, projects, floatCandidate } = useData();

    // Initial Step Logic
    const initialStep = 1; // <--- Force start at Target selection
    const [step, setStep] = useState(initialStep);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState(prefilledData?.clientId || "");
    const [selectedProjectId, setSelectedProjectId] = useState(prefilledData?.projectId || "");

    // We now store the full contact object, not just the name
    const [selectedContact, setSelectedContact] = useState(null);

    const [chargeRate, setChargeRate] = useState(candidate?.chargeRate || 0);
    const [payRate, setPayRate] = useState(candidate?.payRate || 0);
    const [attachCV, setAttachCV] = useState(true);

    // Message Construction
    const defaultSubject = candidate ? `${candidate.role} Available: ${candidate.firstName} ${candidate.lastName}` : "Candidate Enquiry";
    const [emailSubject, setEmailSubject] = useState(defaultSubject);
    const [emailBody, setEmailBody] = useState("");
    const [smsBody, setSmsBody] = useState("");

    // Derived Data
    const selectedClient = clients.find(c => c.id === (typeof selectedClientId === 'string' ? selectedClientId : selectedClientId.toString()));
    // Combine client contacts and project-specific stakeholders if available
    const clientContacts = selectedClient?.keyContacts || [];

    const clientProjects = projects.filter(p =>
        // Handle both string/number ID mismatches
        String(p.clientId) === String(selectedClientId) ||
        (p.assignedCompanyIds && p.assignedCompanyIds.includes(String(selectedClientId)))
    );

    const selectedProject = projects.find(p => String(p.id) === String(selectedProjectId));

    // Visa Compliance Logic
    const complianceCheck = candidate && selectedProject
        ? checkVisaCompliance(candidate, selectedProject)
        : { valid: true, reason: '' };

    // Financials
    const margin = chargeRate - (payRate * 1.3);
    const marginPercent = chargeRate > 0 ? (margin / chargeRate) * 100 : 0;

    // --- EFFECT: Auto-Generate Messages ---
    useEffect(() => {
        if (!isOpen || !candidate) return;

        const contactName = selectedContact?.name ? selectedContact.name.split(' ')[0] : "there";
        const clientName = selectedClient?.name || "Client";
        const role = candidate.role || "Specialist";
        const projName = selectedProject?.name || "the project";

        // SMS Template
        const smsMsg = `Hey ${contactName}, hows ${projName} going? got a candidate available for an immediate start. If you need an extra pair of hands, I can do a cost rate to get him off the books?`;
        
        // Email Template
        const emailMsg = `Hey ${clientName}

${projName} going well?

Righto, got a strong candidate coming off a job next week at ........and thought I'd float him across if you guys needed an extra pair of hands. Good english and great worker.

See attached Report - If you want him let me know, if not no worries mate.

Cheers

Joe`;

        setSmsBody(smsMsg);
        setEmailBody(emailMsg);
        setEmailSubject(`${role} Available: ${candidate.firstName} ${candidate.lastName} - ${candidate.status === 'available' ? 'Available Now' : 'Finishing Soon'}`);

    }, [candidate, selectedContact, selectedProject, selectedClient, isOpen]);

    if (!isOpen) return null;

    const recordFloat = (method, body) => {
        // Trigger the internal float record for logging
        floatCandidate(candidate.id, selectedProjectId || null, {
            clientId: selectedClientId,
            contactName: selectedContact?.name || "Unknown",
            chargeRate,
            payRate,
            message: body,
            method: method
        });
    };

    const handleWhatsApp = () => {
        if (!selectedContact?.phone) return alert("No phone number for contact");
        const waLink = formatWhatsAppLink(selectedContact.phone);
        window.open(`${waLink}?text=${encodeURIComponent(smsBody)}`, '_blank');
        recordFloat('WhatsApp', smsBody);
    };

    const handleSMS = () => {
        if (!selectedContact?.phone) return alert("No phone number for contact");
        window.location.href = `sms:${selectedContact.phone}?body=${encodeURIComponent(smsBody)}`;
        recordFloat('SMS', smsBody);
    };

    const handleOutlook = () => {
        const to = selectedContact?.email || "";
        const mailto = `mailto:${to}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailto;
        recordFloat('Email', emailBody);
    };

    return (
        <div className="modal-overlay">
            <div className="float-modal">
                <div className="modal-header">
                    <div className="header-title">
                        <h3>Float Candidate</h3>
                        <span className="candidate-badge">{candidate?.firstName} {candidate?.lastName}</span>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    {/* Stepper */}
                    <div className="stepper">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Target</div>
                        <div className="line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Rates</div>
                        <div className="line"></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Compose</div>
                    </div>

                    {step === 1 && (
                        <div className="step-content space-y-4">
                            <div className="form-group">
                                <label>Client Company</label>
                                <select
                                    className="input-field"
                                    value={selectedClientId}
                                    onChange={(e) => {
                                        setSelectedClientId(e.target.value);
                                        setSelectedProjectId(""); // Reset project
                                        setSelectedContact(null); // Reset contact
                                    }}
                                >
                                    <option value="">Select Client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {selectedClientId && (
                                <>
                                    <div className="form-group">
                                        <label>Project (Optional)</label>
                                        <select
                                            className="input-field"
                                            value={selectedProjectId}
                                            onChange={(e) => setSelectedProjectId(e.target.value)}
                                        >
                                            <option value="">General Float (No specific project)</option>
                                            {clientProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Recipient (Key Contact)</label>
                                        <select
                                            className="input-field"
                                            value={selectedContact ? JSON.stringify(selectedContact) : ""} // Store object as string for Select
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSelectedContact(val ? JSON.parse(val) : null);
                                            }}
                                        >
                                            <option value="">Select Person...</option>
                                            {clientContacts.map((c, idx) => (
                                                <option key={idx} value={JSON.stringify(c)}>
                                                    {c.name} ({c.role}) {c.email ? `- ${c.email}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedContact && (
                                            <div className="email-hint">
                                                <Mail size={12} /> Contact Info: <span className="text-sky-400">{selectedContact.email || 'No Email'}</span> | <span className="text-emerald-400">{selectedContact.phone || 'No Phone'}</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content space-y-6">
                            <div className="financial-card">
                                <div className="row">
                                    <div className="col">
                                        <label>Pay Rate (Cost)</label>
                                        <div className="input-group">
                                            <span className="prefix">$</span>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={payRate}
                                                onChange={(e) => setPayRate(parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label>Charge Rate (Bill)</label>
                                        <div className="input-group">
                                            <span className="prefix">$</span>
                                            <input
                                                type="number"
                                                className="input-field highlight"
                                                value={chargeRate}
                                                onChange={(e) => setChargeRate(parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-display">
                                    <div className="label">Projected Margin</div>
                                    <div className={`value ${marginPercent < 20 ? 'low' : 'good'}`}>
                                        ${margin.toFixed(2)}/hr ({Math.round(marginPercent)}%)
                                    </div>
                                    <div className="subtext">Based on 30% burden/overhead</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-content space-y-4">
                            {/* Attachments */}
                            <div className="attachment-toggle" onClick={() => setAttachCV(!attachCV)}>
                                <div className="flex items-center gap-2">
                                    <Paperclip size={16} className={attachCV ? "text-sky-400" : "text-slate-500"} />
                                    <span>Attach Candidate CV</span>
                                </div>
                                {candidate?.cvUrl ? (
                                    <div className="checkbox-visual">
                                        {attachCV && <div className="checked" />}
                                    </div>
                                ) : (
                                    <span className="text-xs text-red-400">No CV on file</span>
                                )}
                            </div>

                            <div className="toggle-group bg-slate-800/50 p-1 rounded-lg flex mb-2">
                                <button className="flex-1 py-1.5 text-xs font-bold uppercase rounded bg-slate-700 text-sky-400">Email Draft</button>
                                <button className="flex-1 py-1.5 text-xs font-bold uppercase rounded text-slate-500">SMS Draft</button>
                            </div>

                            {/* Body Selection based on what user wants to edit (Keeping it simple by showing both or letting user choose) */}
                            <div className="form-group">
                                <label>Email Subject</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Body</label>
                                <textarea
                                    className="input-field message-box"
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="form-group">
                                <label>SMS / WhatsApp Message</label>
                                <textarea
                                    className="input-field message-box text-emerald-400 border-emerald-500/30"
                                    value={smsBody}
                                    onChange={(e) => setSmsBody(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Compliance Check UI */}
                            {!complianceCheck.valid ? (
                                <div className="compliance-bar error">
                                    <AlertTriangle size={14} /> Visa Issue: {complianceCheck.reason}
                                </div>
                            ) : (
                                <div className="compliance-bar success">
                                    <Shield size={14} /> Visa Compliant for this Project
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step > 1 && (
                        <button className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>
                    )}
                    <div className="spacer"></div>
                    {step < 3 ? (
                        <button
                            className="btn-primary"
                            disabled={!selectedClientId}
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                className="btn-whatsapp"
                                onClick={handleWhatsApp}
                                disabled={!selectedContact?.phone}
                                title="Send via WhatsApp"
                            >
                                <MessageCircle size={16} /> WhatsApp
                            </button>
                            <button
                                className="btn-sms"
                                onClick={handleSMS}
                                disabled={!selectedContact?.phone}
                                title="Send via Text"
                            >
                                <Smartphone size={16} /> SMS
                            </button>
                            <button
                                className="btn-success"
                                onClick={handleOutlook}
                                disabled={!complianceCheck.valid || !selectedContact?.email}
                                title="Open in Outlook"
                            >
                                <Mail size={16} /> Outlook
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.75);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1100; backdrop-filter: blur(4px);
                }
                .float-modal {
                    background: #0f172a; width: 550px;
                    border-radius: 12px; border: 1px solid #1e293b;
                    display: flex; flex-direction: column;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .modal-header {
                    padding: 1.25rem; border-bottom: 1px solid #1e293b;
                    display: flex; justify-content: space-between; align-items: center;
                    background: #1e293b; border-radius: 12px 12px 0 0;
                }
                .header-title h3 { margin: 0; font-size: 1rem; color: white; font-weight: 600; }
                .candidate-badge { font-size: 0.8rem; color: #38bdf8; font-weight: 500; }
                .close-btn { background: none; border: none; color: #94a3b8; cursor: pointer; }
                
                .modal-body { padding: 1.5rem; }
                
                .stepper { display: flex; align-items: center; margin-bottom: 1.5rem; justify-content: space-between; font-size: 0.75rem; color: #64748b; }
                .step.active { color: #38bdf8; font-weight: 700; }
                .line { height: 1px; background: #334155; flex: 1; margin: 0 10px; }
                
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
                .form-group label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
                
                .input-field {
                    background: #1e293b; border: 1px solid #334155;
                    padding: 0.75rem; border-radius: 6px;
                    color: white; outline: none; font-size: 0.9rem;
                    width: 100%;
                }
                .input-field:focus { border-color: #38bdf8; }
                
                .email-hint { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
                
                .attachment-toggle {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 0.75rem; background: #1e293b;
                    border: 1px solid #334155; border-radius: 6px;
                    cursor: pointer; margin-bottom: 1rem;
                    color: #cbd5e1; font-size: 0.9rem;
                }
                .attachment-toggle:hover { border-color: #38bdf8; }
                .checkbox-visual {
                    width: 18px; height: 18px; border: 1px solid #475569; border-radius: 4px;
                    display: flex; align-items: center; justify-content: center;
                }
                .checked { width: 10px; height: 10px; background: #38bdf8; border-radius: 2px; }

                .compliance-bar {
                    font-size: 0.8rem; padding: 0.5rem; border-radius: 4px;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .compliance-bar.success { color: #34d399; background: rgba(52, 211, 153, 0.1); }
                .compliance-bar.error { color: #f87171; background: rgba(248, 113, 113, 0.1); }

                .input-group { position: relative; }
                .prefix { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #64748b; }
                .input-group .input-field { padding-left: 25px; }
                .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                
                .margin-display { text-align: center; padding-top: 1rem; margin-top: 1rem; border-top: 1px dashed #334155; }
                .margin-display .label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; }
                .margin-display .value { font-size: 1.25rem; font-weight: 700; margin: 0.25rem 0; }
                .value.good { color: #34d399; }
                .value.low { color: #f43f5e; }
                
                .modal-footer {
                    padding: 1.25rem; border-top: 1px solid #1e293b;
                    display: flex; gap: 1rem; background: #1e293b; border-radius: 0 0 12px 12px;
                }
                .spacer { flex: 1; }
                .btn-secondary { background: transparent; color: #94a3b8; border: none; cursor: pointer; }
                .btn-primary { background: #38bdf8; color: #0f172a; border: none; padding: 0.6rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
                
                .btn-whatsapp { background: #25d366; color: white; border: none; padding: 0.6rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
                .btn-sms { background: #6366f1; color: white; border: none; padding: 0.6rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
                .btn-success { background: #0078d4; color: white; border: none; padding: 0.6rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
                
                .btn-primary:disabled, .btn-whatsapp:disabled, .btn-sms:disabled, .btn-success:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
