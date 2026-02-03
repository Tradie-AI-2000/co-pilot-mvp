"use client";

import { useState } from "react";
import { useData } from "../../context/data-context.js";
import { useRouter } from "next/navigation";
import { X, Send, CheckSquare, Square, Plus, Calendar, Phone, MessageCircle, User, Users, AlertTriangle, HardHat, MapPin, Activity, Save, Edit2, Trash2, Mail, Globe, Building2, Clock, Check, ChevronRight, Briefcase, Shield } from "lucide-react";
import { formatWhatsAppLink, generateSiteManagerWhatsAppMessage, CONSTRUCTION_LIFECYCLE } from "../../services/construction-logic.js";
import FloatCandidateModal from "./float-candidate-modal.js";

export default function EnhancedClientDetailsModal({ client, onClose, onUpdate }) {
    const { projects: availableProjectsMetadata, updateProject, updateClient, candidates, placements } = useData();

    // Derive project IDs from the inverse relationship if not present on client (Persistence Fix)
    const linkedProjectIds = client.projectIds || availableProjectsMetadata
        .filter(p => (p.assignedCompanyIds || []).includes(client.id))
        .map(p => p.id);

    // Initialize state, ensuring we catch existing data regardless of case convention
    const [localClient, setLocalClient] = useState({
        ...client,
        // Ensure both keys exist initially to prevent undefined errors
        lastContact: client.lastContact || client.last_contact,
        last_contact: client.last_contact || client.lastContact,
        siteLogistics: client.siteLogistics || {},
        keyContacts: client.keyContacts || [],
        projectIds: linkedProjectIds,
        tasks: client.tasks || []
    });

    const [activeTab, setActiveTab] = useState("projects");
    const [recruitmentFilter, setRecruitmentFilter] = useState("active");
    const [newNote, setNewNote] = useState("");
    const [newTask, setNewTask] = useState("");
    const [isEditing, setIsEditing] = useState(client.id === 'new');
    const router = useRouter();

    const [isLinking, setIsLinking] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [isFloatModalOpen, setIsFloatModalOpen] = useState(false);
    const [floatContext, setFloatContext] = useState(null);

    if (!client) return null;

    const availableProjects = availableProjectsMetadata.filter(p => !localClient.projectIds?.includes(p.id));

    // Helper: Safely get the date string for the input
    const getLastContactValue = () => {
        // Priority check: try snake_case (DB), then camelCase (App)
        const val = localClient.last_contact || localClient.lastContact;
        if (!val) return "";
        if (val.startsWith('1970')) return ""; // Filter out zero-value dates
        return val.split('T')[0];
    };

    // --- MAIN SAVE HANDLER ---
    const handleSave = () => {
        // Normalizing data before sending to parent/DB
        const commonDate = localClient.last_contact || localClient.lastContact;

        const clientDataToSave = {
            ...localClient,
            // Force both keys to match so Supabase (snake) and App (camel) are happy
            last_contact: commonDate,
            lastContact: commonDate
        };

        if (localClient.id === 'new') {
            const { id, ...newClient } = clientDataToSave;
            onUpdate(newClient);
        } else {
            onUpdate(clientDataToSave);
        }
        setIsEditing(false);
    };

    // --- SILENT UPDATES (Keep Modal Open) ---
    // This wrapper ensures we always sync the date keys even on background updates
    const handleSilentUpdate = (updatedData) => {
        const commonDate = updatedData.last_contact || updatedData.lastContact;
        const sanitizedData = {
            ...updatedData,
            last_contact: commonDate,
            lastContact: commonDate
        };

        setLocalClient(sanitizedData);
        updateClient(sanitizedData);
    };

    // --- Project Linking Logic ---
    const handleLinkProject = () => {
        if (!selectedProjectId) return;

        const updatedClient = {
            ...localClient,
            projectIds: [...(localClient.projectIds || []), selectedProjectId]
        };
        handleSilentUpdate(updatedClient);

        const projectToUpdate = availableProjectsMetadata.find(p => p.id === selectedProjectId);
        if (projectToUpdate) {
            const updatedProject = {
                ...projectToUpdate,
                assignedCompanyIds: [...(projectToUpdate.assignedCompanyIds || []), localClient.id]
            };
            updateProject(updatedProject);
        }
        setIsLinking(false);
        setSelectedProjectId("");
    };

    const handleUnlinkProject = (projectId) => {
        const updatedClient = {
            ...localClient,
            projectIds: localClient.projectIds.filter(id => id !== projectId)
        };
        handleSilentUpdate(updatedClient);

        const projectToUpdate = availableProjectsMetadata.find(p => p.id === projectId);
        if (projectToUpdate) {
            const updatedProject = {
                ...projectToUpdate,
                assignedCompanyIds: (projectToUpdate.assignedCompanyIds || []).filter(id => id !== localClient.id)
            };
            updateProject(updatedProject);
        }
    };

    // --- Contact Logic ---
    const updateContact = (index, field, value) => {
        const updatedContacts = [...localClient.keyContacts];
        updatedContacts[index] = { ...updatedContacts[index], [field]: value };
        setLocalClient({ ...localClient, keyContacts: updatedContacts });
    };
    const handleAddKeyContact = () => {
        const newContact = { name: "", role: "", email: "", phone: "", linkedProjectId: "", influence: "Neutral" };
        setLocalClient({ ...localClient, keyContacts: [...(localClient.keyContacts || []), newContact] });
    };
    const handleDeleteKeyContact = (index) => {
        const updatedContacts = [...localClient.keyContacts];
        updatedContacts.splice(index, 1);
        setLocalClient({ ...localClient, keyContacts: updatedContacts });
    };

    // --- Notes & Tasks ---
    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = { id: Date.now(), text: newNote, date: new Date().toISOString().split('T')[0], author: "You" };
        const updated = { ...localClient, notes: [note, ...(localClient.notes || [])] };
        handleSilentUpdate(updated);
        setNewNote("");
    };
    const handleAddTask = () => {
        if (!newTask.trim()) return;
        const task = { id: Date.now(), text: newTask, completed: false, dueDate: new Date().toISOString().split('T')[0] };
        const updated = { ...localClient, tasks: [task, ...(localClient.tasks || [])] };
        handleSilentUpdate(updated);
        setNewTask("");
    };
    const toggleTask = (taskId) => {
        const updatedTasks = localClient.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const updated = { ...localClient, tasks: updatedTasks };
        handleSilentUpdate(updated);
    };

    // --- Helper Functions ---
    const handleFloatCandidate = (project) => {
        const siteManager = project.siteManager || 'Site Manager';
        const siteManagerPhone = project.siteManagerPhone || project.siteManagerMobile || '';
        setFloatContext({
            clientId: localClient.id,
            clientName: localClient.name,
            projectId: project.id,
            projectName: project.name,
            siteManagerName: siteManager,
            siteManagerPhone: siteManagerPhone,
            currentPhase: project.phaseSettings?.currentPhase || '02_structure'
        });
        setIsFloatModalOpen(true);
    };
    const handleWhatsAppSiteManager = (project) => {
        const siteManager = project.siteManager || 'Site Manager';
        const siteManagerPhone = project.siteManagerPhone || project.siteManagerMobile;
        const currentPhase = project.phaseSettings?.currentPhase || '02_structure';
        if (!siteManagerPhone) { alert('No phone number available for site manager'); return; }
        const message = generateSiteManagerWhatsAppMessage(siteManager, project.name, currentPhase);
        const whatsappUrl = formatWhatsAppLink(siteManagerPhone);
        if (whatsappUrl) window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const getProjectPlacements = (projectId) => {
        return (placements || []).filter(p => {
            if (p.projectId !== projectId) return false;
            if (recruitmentFilter === 'active') return ['deployed', 'on_job'].includes(p.status?.toLowerCase());
            if (recruitmentFilter === 'pipeline') return ['Floated', 'Interviewing', 'Offer', 'Unconfirmed'].includes(p.status);
            if (recruitmentFilter === 'history') return ['Completed', 'Terminated', 'Resigned'].includes(p.status);
            return false;
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className="modal-header">
                    <div>
                        {isEditing ? (
                            <div className="space-y-2">
                                <input className="edit-input font-bold text-2xl w-full" value={localClient.name} onChange={(e) => setLocalClient({ ...localClient, name: e.target.value })} />
                                <div className="flex gap-2">
                                    <select
                                        className="edit-input text-sm"
                                        value={localClient.industry}
                                        onChange={(e) => setLocalClient({ ...localClient, industry: e.target.value })}
                                    >
                                        <option value="">Select Industry...</option>
                                        <option value="Builder">Builder (General)</option>
                                        <option value="Formwork">Formwork & Concrete</option>
                                        <option value="Civil">Civil Infrastructure</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Plumber">Plumbing / HVAC</option>
                                        <option value="Flooring">Flooring & Tiling</option>
                                        <option value="Interior">Interiors (Gib/Paint)</option>
                                        <option value="Glazier">Glazing (Windows/Doors)</option>
                                        <option value="Landscaping">Landscaping</option>
                                        <option value="Demolition">Demolition</option>
                                        <option value="Fire">Passive Fire</option>
                                        <option value="Other">Other / General</option>
                                    </select>
                                    <select
                                        className="edit-input text-sm"
                                        value={localClient.region || "National"}
                                        onChange={(e) => setLocalClient({ ...localClient, region: e.target.value })}
                                    >
                                        <option value="National">National</option>
                                        <option value="Auckland">Auckland</option>
                                        <option value="Waikato">Waikato</option>
                                        <option value="BoP">BoP</option>
                                        <option value="Northland">Northland</option>
                                        <option value="Hawkes Bay">Hawkes Bay</option>
                                        <option value="Wellington">Wellington</option>
                                        <option value="Christchurch">Christchurch</option>
                                        <option value="South Island">South Island</option>
                                    </select>
                                    <select className="bg-slate-900 border border-slate-700 text-white text-sm rounded-md px-2 outline-none" value={localClient.tier || "3"} onChange={(e) => setLocalClient({ ...localClient, tier: e.target.value })}>
                                        <option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-1">{localClient.name}</h2>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-slate-400">{localClient.industry}</span>
                                    <span className="text-slate-400">•</span>
                                    {/* REGION DISPLAY RESTORED */}
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <MapPin size={12} />
                                        <span>{localClient.region || "National"}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">Tier {localClient.tier || "3"}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className={`action-btn ${isEditing ? 'save' : 'edit'}`}>
                            {isEditing ? <Save size={18} /> : <Edit2 size={18} />} {isEditing ? "Save Changes" : "Edit Details"}
                        </button>
                        <button onClick={onClose} className="close-btn"><X size={24} /></button>
                    </div>
                </div>

                <div className="tabs">
                    <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}><HardHat size={16} /> Active Sites</button>
                    <button className={`tab ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}><Users size={16} /> Recruitment</button>
                    <button className={`tab ${activeTab === 'people' ? 'active' : ''}`} onClick={() => setActiveTab('people')}><Users size={16} /> Key People</button>
                    <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}><Building2 size={16} /> Company Info</button>
                    <button className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}><Activity size={16} /> Activity</button>
                </div>

                <div className="tab-content">
                    {/* PROJECTS TAB */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="section-title">Linked Projects</h3>
                                {!isLinking ? (
                                    <button className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1.5 rounded-md transition-colors text-sm font-medium border border-secondary/20" onClick={() => setIsLinking(true)}>
                                        <Plus size={14} /> Link Project
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-right-4 duration-200">
                                        <select className="bg-slate-900 border border-slate-700 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-secondary min-w-[200px]" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} autoFocus>
                                            <option value="">Select a project to link...</option>
                                            {availableProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <div className="flex gap-1">
                                            <button className="flex items-center justify-center bg-green-600 hover:bg-green-500 text-white p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors" onClick={handleLinkProject} disabled={!selectedProjectId} title="Add Link"><Check size={16} /></button>
                                            <button className="flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded-md transition-colors" onClick={() => { setIsLinking(false); setSelectedProjectId(""); }} title="Cancel"><X size={16} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                {[...new Set(localClient.projectIds || [])].map(pid => {
                                    const project = availableProjectsMetadata.find(p => p.id === pid);
                                    if (!project) return null;
                                    const currentPhase = project.phaseSettings?.currentPhase || '02_structure';
                                    const phaseData = CONSTRUCTION_LIFECYCLE[currentPhase];
                                    const nextPhaseId = phaseData?.next_phase;
                                    const nextPhaseData = nextPhaseId ? CONSTRUCTION_LIFECYCLE[nextPhaseId] : null;
                                    const siteManager = project.siteManager || 'TBC';
                                    const siteManagerPhone = project.siteManagerPhone || project.siteManagerMobile;
                                    const activePlacements = candidates.filter(c => c.projectId === pid && c.status?.toLowerCase() === 'on_job').length;

                                    return (
                                        <div key={pid} className="project-card modern-card group relative">
                                            {isEditing && (
                                                <button onClick={(e) => { e.stopPropagation(); handleUnlinkProject(pid); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600" title="Unlink Project"><Trash2 size={14} /></button>
                                            )}
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="font-bold text-white text-lg mb-1">{project.name}</div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin size={12} /><span>{project.location}</span></div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'Active' ? 'bg-green-500/20 text-green-400' : project.status === 'Tendering' ? 'bg-blue-500/20 text-blue-400' : project.status === 'Awarded' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'}`}>{project.status}</span>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3 mb-3 border border-slate-700/50">
                                                <div className="flex items-center justify-between mb-2"><div className="text-xs text-slate-400 uppercase tracking-wide">Current Phase</div><div className="text-sm font-semibold text-secondary">{phaseData?.label || 'Unknown'}</div></div>
                                                {nextPhaseData && (<div className="flex items-center justify-between text-xs"><span className="text-slate-500">Next: {nextPhaseData.label}</span><span className="text-slate-600">→</span></div>)}
                                            </div>
                                            <div className="bg-slate-800/30 rounded-lg p-3 mb-3">
                                                <div className="flex items-center justify-between">
                                                    <div><div className="text-xs text-slate-400 mb-1">Site Manager</div><div className="text-sm font-medium text-white">{siteManager}</div>{siteManagerPhone && (<div className="text-xs text-slate-500 mt-0.5">{siteManagerPhone}</div>)}</div>
                                                    <div className="flex gap-2">
                                                        {siteManagerPhone && (<button onClick={() => handleWhatsAppSiteManager(project)} className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-colors" title="WhatsApp Site Manager"><MessageCircle size={16} /></button>)}
                                                        <button onClick={() => handleFloatCandidate(project)} className="px-3 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-md transition-colors text-xs font-medium flex items-center gap-1"><Users size={14} /> Float Candidate</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 mb-3">
                                                <div className="text-xs"><div className="text-slate-500">Value</div><div className="text-white font-semibold">${project.value}</div></div>
                                                <div className="text-xs"><div className="text-slate-500">Active Workers</div><div className="text-secondary font-semibold">{activePlacements}</div></div>
                                                <div className="text-xs"><div className="text-slate-500">Start Date</div><div className="text-white font-semibold">{project.startDate || 'TBC'}</div></div>
                                            </div>
                                            <div className="flex justify-end items-center pt-3 border-t border-slate-700/50"><button className="text-xs text-secondary hover:underline font-medium" onClick={() => router.push(`/projects?projectId=${project.id}`)}>View Full Details →</button></div>
                                        </div>
                                    );
                                })}
                                {(!localClient.projectIds || localClient.projectIds.length === 0) && (<p className="text-slate-500 italic text-center py-8">No projects linked.</p>)}
                            </div>
                        </div>
                    )}

                    {/* CANDIDATES TAB */}
                    {activeTab === 'candidates' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="section-title">Workforce Management</h3>
                                <div className="toggle-group-small">
                                    <button className={`toggle-btn-small ${recruitmentFilter === 'active' ? 'active' : ''}`} onClick={() => setRecruitmentFilter('active')}>Active</button>
                                    <button className={`toggle-btn-small ${recruitmentFilter === 'pipeline' ? 'active' : ''}`} onClick={() => setRecruitmentFilter('pipeline')}>Pipeline</button>
                                    <button className={`toggle-btn-small ${recruitmentFilter === 'history' ? 'active' : ''}`} onClick={() => setRecruitmentFilter('history')}>History</button>
                                </div>
                            </div>
                            {[...new Set(localClient.projectIds || [])].map(pid => {
                                const project = availableProjectsMetadata.find(p => p.id === pid);
                                if (!project) return null;
                                const projectPlacements = getProjectPlacements(pid);
                                if (projectPlacements.length === 0) return null;

                                return (
                                    <div key={pid} className="project-recruitment-section">
                                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700">
                                            <h4 className="font-bold text-white mb-2">{project.name}</h4>
                                            <div className="text-sm text-slate-400 mb-3">{projectPlacements.length} placements</div>
                                            <div className="space-y-3">
                                                {projectPlacements.map(placement => {
                                                    const candidate = candidates.find(c => String(c.id) === String(placement.candidateId));
                                                    if (!candidate) return null;

                                                    const charge = placement.chargeRate || candidate.chargeRate || 0;
                                                    const pay = placement.payRate || candidate.payRate || 0;
                                                    const margin = charge - (pay * 1.2);

                                                    return (
                                                        <div key={placement.id} className="bg-slate-900/60 rounded-lg border border-slate-700/50 p-3">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <div className="font-bold text-white">{candidate.firstName} {candidate.lastName}</div>
                                                                    <div className="text-xs text-slate-400">{candidate.role}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className={`text-xs px-2 py-0.5 rounded border ${placement.status === 'deployed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                                        {placement.status}
                                                                    </div>
                                                                    {recruitmentFilter === 'active' && (
                                                                        <div className={`text-xs font-bold mt-1 ${margin > 15 ? 'text-green-400' : 'text-amber-400'}`}>${margin.toFixed(2)}/hr</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {!localClient.projectIds?.some(pid => getProjectPlacements(pid).length > 0) && (
                                <p className="text-slate-500 italic text-center py-8">No {recruitmentFilter} placements found.</p>
                            )}
                        </div>
                    )}

                    {/* COMPANY INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center"><h3 className="section-title">Company Details</h3></div>
                            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">Region</label>{isEditing ? (<select className="edit-input" value={localClient.region || "National"} onChange={(e) => setLocalClient({ ...localClient, region: e.target.value })}><option value="National">National</option><option value="Auckland">Auckland</option><option value="Waikato">Waikato</option><option value="BoP">BoP</option><option value="Northland">Northland</option><option value="Hawkes Bay">Hawkes Bay</option><option value="Wellington">Wellington</option><option value="Christchurch">Christchurch</option><option value="South Island">South Island</option></select>) : (<div className="flex items-center gap-2 text-white"><MapPin size={16} className="text-secondary" /><span>{localClient.region || "National"}</span></div>)}</div>
                                        <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">Head Office Address</label>{isEditing ? (<input className="edit-input" value={localClient.address || ""} onChange={(e) => setLocalClient({ ...localClient, address: e.target.value })} placeholder="e.g. 123 Construction Rd, Auckland" />) : (<div className="flex items-center gap-2 text-white"><MapPin size={16} className="text-secondary" /><span>{localClient.address || "No address set"}</span></div>)}</div>
                                        <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">Website</label>{isEditing ? (<input className="edit-input" value={localClient.website || ""} onChange={(e) => setLocalClient({ ...localClient, website: e.target.value })} placeholder="https://example.com" />) : (<div className="flex items-center gap-2 text-white"><Globe size={16} className="text-secondary" />{localClient.website ? (<a href={localClient.website} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-secondary">{localClient.website}</a>) : <span>No website set</span>}</div>)}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">Main Phone</label>{isEditing ? (<input className="edit-input" value={localClient.phone || ""} onChange={(e) => setLocalClient({ ...localClient, phone: e.target.value })} placeholder="e.g. 09 123 4567" />) : (<div className="flex items-center gap-2 text-white"><Phone size={16} className="text-secondary" /><span>{localClient.phone || "No phone set"}</span></div>)}</div>
                                        <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">Main Email</label>{isEditing ? (<input className="edit-input" value={localClient.email || ""} onChange={(e) => setLocalClient({ ...localClient, email: e.target.value })} placeholder="e.g. info@client.co.nz" />) : (<div className="flex items-center gap-2 text-white"><Mail size={16} className="text-secondary" />{localClient.email ? (<a href={`mailto:${localClient.email}`} className="hover:underline hover:text-secondary">{localClient.email}</a>) : <span>No email set</span>}</div>)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-bold text-white mb-4">Internal Team</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Client Owner</label>
                                        {isEditing ? (
                                            <select className="edit-input" value={localClient.clientOwner || ""} onChange={(e) => setLocalClient({ ...localClient, clientOwner: e.target.value })}>
                                                <option value="">Assign Owner...</option><option value="Joe Ward">Joe Ward</option><option value="Blair Stewart">Blair Stewart</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2 text-white"><User size={16} className="text-emerald-400" /><span>{localClient.clientOwner || "Unassigned"}</span></div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Account Manager</label>
                                        {isEditing ? (
                                            <select className="edit-input" value={localClient.accountManager || ""} onChange={(e) => setLocalClient({ ...localClient, accountManager: e.target.value })}>
                                                <option value="">Assign Account Manager...</option><option value="Joe Ward">Joe Ward</option><option value="Blair Stewart">Blair Stewart</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2 text-white"><Briefcase size={16} className="text-sky-400" /><span>{localClient.accountManager || "Unassigned"}</span></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-bold text-white mb-4">Site Logistics & Requirements</h4>
                                <div className="space-y-4">
                                    <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">PPE Requirements</label>{isEditing ? (<textarea className="edit-textarea" value={localClient.siteLogistics?.ppe || ""} onChange={(e) => setLocalClient({ ...localClient, siteLogistics: { ...localClient.siteLogistics, ppe: e.target.value } })} rows={2} />) : (<p className="text-sm text-slate-300">{localClient.siteLogistics?.ppe || "Standard PPE"}</p>)}</div>
                                    <div className="form-group"><label className="text-xs text-slate-400 uppercase font-bold block mb-1">Induction Process</label>{isEditing ? (<textarea className="edit-textarea" value={localClient.siteLogistics?.induction || ""} onChange={(e) => setLocalClient({ ...localClient, siteLogistics: { ...localClient.siteLogistics, induction: e.target.value } })} rows={2} />) : (<p className="text-sm text-slate-300">{localClient.siteLogistics?.induction || "TBC"}</p>)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PEOPLE TAB */}
                    {activeTab === 'people' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center"><h3 className="section-title">Key Decision Makers</h3>{isEditing && (<button onClick={handleAddKeyContact} className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1.5 rounded-md transition-colors text-sm font-medium border border-secondary/20"><Plus size={14} /> Add Person</button>)}</div>
                            <div className="grid grid-cols-1 gap-4">
                                {localClient.keyContacts?.map((contact, idx) => (
                                    <div key={idx} className="contact-card">
                                        <div className="contact-header">
                                            <div className="w-full">
                                                {isEditing ? (
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2 mb-2 flex-1">
                                                            <input className="edit-input font-bold text-lg" value={contact.name} onChange={(e) => updateContact(idx, 'name', e.target.value)} placeholder="Name" />
                                                            <div className="flex gap-2">
                                                                <select className="edit-input text-sm" value={contact.role} onChange={(e) => updateContact(idx, 'role', e.target.value)}><option value="">Select Role...</option><option value="Project Manager">Project Manager</option><option value="Site Manager">Site Manager</option><option value="HR">HR</option><option value="Director/Owner">Director/Owner</option></select>
                                                                <input className="edit-input text-sm" value={contact.email || ""} onChange={(e) => updateContact(idx, 'email', e.target.value)} placeholder="Email" />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <input className="edit-input text-sm" value={contact.phone} onChange={(e) => updateContact(idx, 'phone', e.target.value)} placeholder="Phone" />
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeleteKeyContact(idx)} className="text-slate-500 hover:text-red-400 p-2 ml-2"><Trash2 size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-bold text-white text-lg">{contact.name}</div>
                                                            <div className="text-sm text-slate-400">{contact.role}</div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="text-sky-400 text-sm flex items-center gap-2"><Phone size={14} /> {contact.phone}</div>
                                                            {contact.email && <div className="text-xs text-slate-500 flex items-center gap-2"><Mail size={12} /> {contact.email}</div>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ACTIVITY TAB (DATE PICKER FIX) */}
                    {activeTab === 'activity' && (
                        <div className="space-y-6">

                            {/* DATE PICKER (SILENT SAVE) */}
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/30 mb-6">
                                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                                    <Clock size={16} /> Engagement Status
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-slate-900/50 p-3 rounded border border-slate-700">
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2">
                                            Last Contact Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                                            value={getLastContactValue()}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // Create Update Object with BOTH keys forced to the new value
                                                const updated = {
                                                    ...localClient,
                                                    last_contact: newValue, // DB Sync
                                                    lastContact: newValue   // App Sync
                                                };
                                                // Update local state and fire silent update
                                                setLocalClient(updated);
                                                handleSilentUpdate(updated);
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 italic">
                                            Updating this date helps calculate 'Client Decay' and prevents churn alerts.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="tasks-section"><h3 className="section-title mb-3">Tasks</h3><div className="add-task"><input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task..." onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} /><button onClick={handleAddTask} className="add-btn"><Plus size={20} /></button></div><div className="tasks-list">{localClient.tasks?.map(task => (<div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}><button className="check-btn" onClick={() => toggleTask(task.id)}>{task.completed ? <CheckSquare size={20} /> : <Square size={20} />}</button><span className="task-text">{task.text}</span>{task.dueDate && (<span className="task-date"><Calendar size={12} />{task.dueDate}</span>)}</div>))}{(!localClient.tasks || localClient.tasks.length === 0) && (<div className="empty-state">No tasks pending</div>)}</div></div>
                                <div className="notes-section"><h3 className="section-title mb-3">Notes</h3><div className="add-note"><textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a meeting note..." rows={3} /><button onClick={handleAddNote} className="send-btn"><Send size={16} /> Add Note</button></div><div className="notes-list">{localClient.notes?.map(note => (<div key={note.id} className="note-item"><div className="note-header"><span className="note-author">{note.author}</span><span className="note-date">{note.date}</span></div><p className="note-text">{note.text}</p></div>))}</div></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isFloatModalOpen && floatContext && (
                <FloatCandidateModal
                    isOpen={isFloatModalOpen}
                    onClose={() => setIsFloatModalOpen(false)}
                    prefilledData={floatContext}
                />
            )}

            <style jsx>{`
                /* ... STYLES PRESERVED ... */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
                .modal-content { background: #0f172a; border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 900px; height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; background: #1e293b; }
                .tabs { display: flex; border-bottom: 1px solid var(--border); padding: 0 1.5rem; background: #1e293b; }
                .tab { background: none; border: none; padding: 1rem 1.5rem; color: #94a3b8; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
                .tab.active { color: #38bdf8; border-bottom-color: #38bdf8; }
                .tab-content { padding: 1.5rem; flex: 1; overflow-y: auto; background: #0f172a; }
                .edit-input { background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: 4px; padding: 0.25rem 0.5rem; color: white; width: 100%; }
                .edit-textarea { background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: 4px; padding: 0.5rem; color: white; width: 100%; font-size: 0.875rem; resize: vertical; }
                .section-title { font-size: 0.9rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
                .action-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; transition: all 0.2s; }
                .action-btn.edit { background: rgba(255, 255, 255, 0.1); color: white; }
                .action-btn.save { background: #38bdf8; color: #0f172a; }
                .close-btn { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0.25rem; }
                .modern-card { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; }
                .contact-card { background: #1e293b; border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; }
                
                .add-task { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
                .add-task input { flex: 1; background: #1e293b; border: 1px solid var(--border); border-radius: 4px; padding: 0.75rem; color: white; }
                .add-btn { background: var(--secondary); color: #0f172a; border: none; width: 42px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid var(--border); }
                .check-btn { background: none; border: none; color: #94a3b8; cursor: pointer; }
                .task-item.completed .check-btn { color: var(--secondary); }
                .task-item.completed .task-text { text-decoration: line-through; color: #94a3b8; }
                .task-text { flex: 1; color: white; }
                .add-note textarea { width: 100%; background: #1e293b; border: 1px solid var(--border); border-radius: 4px; padding: 0.75rem; color: white; margin-bottom: 0.5rem; resize: vertical; }
                .send-btn { display: flex; align-items: center; gap: 0.5rem; background: var(--secondary); color: #0f172a; border: none; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600; cursor: pointer; margin-left: auto; }
                .note-item { background: #1e293b; border: 1px solid var(--border); border-radius: 4px; padding: 1rem; margin-bottom: 1rem; }
                .note-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.75rem; color: #94a3b8; }
                .note-author { font-weight: 600; color: var(--secondary); }
                .note-text { color: white; font-size: 0.875rem; white-space: pre-wrap; }
                .empty-state { text-align: center; color: #94a3b8; padding: 2rem; font-style: italic; }
                .toggle-group-small { display: inline-flex; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 99px; padding: 2px; }
                .toggle-btn-small { background: none; border: none; color: var(--text-muted); padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .toggle-btn-small.active { background: var(--surface); color: var(--secondary); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}