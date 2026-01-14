"use client";

import { useState, useEffect, Suspense } from "react";
import { useData } from "../../context/data-context.js";
import { Search, Filter, Plus, Building, MapPin, Calendar, DollarSign, Briefcase, LayoutGrid, List as ListIcon, X, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import AddProjectModal from "../../components/add-project-modal.js";
import DashboardWidgets from "../../components/dashboard-widgets.js";
import GeospatialMap from "../../components/geospatial-map.js";
import ProjectList from "../../components/project-list.js";
import ProjectTimeline from "../../components/project-timeline.js";

function ProjectsContent() {
    const { projects, addProject, updateProject, clients } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // For Read-Only View
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
    const searchParams = useSearchParams();

    // Market Intel State
    const [mapSelectedProject, setMapSelectedProject] = useState(null);
    const [isochroneData, setIsochroneData] = useState(null);
    const [isCommuteLoading, setIsCommuteLoading] = useState(false);
    const [clickedWidget, setClickedWidget] = useState(null);

    useEffect(() => {
        const projectId = searchParams.get("projectId");
        if (projectId) {
            const projectToEdit = projects.find(p => p.id === projectId);
            if (projectToEdit) {
                setEditingProject(projectToEdit);
                setIsModalOpen(true);
            }
        }
    }, [searchParams, projects]);

    const handleAddClick = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    // Clicking a card now opens the specific Intelligence Panel
    const handleCardClick = (project) => {
        setSelectedProject(project);
    };

    // "Edit" from the Intelligence Panel opens the Modal
    const handleEditFromPanel = (project) => {
        setSelectedProject(null); // Close panel
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleSaveProject = (projectData) => {
        if (editingProject) {
            // Update existing project
            updateProject({ ...editingProject, ...projectData });
        } else {
            // Create new project
            // Ensure coordinates or defaults
            const newProj = {
                ...projectData,
                coordinates: projectData.coordinates || { lat: -36.8485, lng: 174.7633 }
            };
            addProject(newProj);
        }
        setIsModalOpen(false);
    };

    // --- Market Intel Logic ---

    const handleMapProjectSelect = (project) => {
        setMapSelectedProject(project);
        fetchIsochrone(project);
    };

    const fetchIsochrone = async (project) => {
        if (!project || (!project.coordinates && !project.lat)) return;

        setIsCommuteLoading(true);
        try {
            const lat = project.coordinates?.lat || project.lat;
            const lng = project.coordinates?.lng || project.lng;
            const res = await fetch(`/api/geo/isochrone?lat=${lat}&lng=${lng}&minutes=20`);
            if (res.ok) {
                const data = await res.json();
                setIsochroneData(data);
            }
        } catch (err) {
            console.error("Failed to fetch isochrone:", err);
        } finally {
            setIsCommuteLoading(false);
        }
    };

    const handleMarkerClick = (marker) => {
        const project = projects.find(p => p.id === marker.id || p.name === marker.name);
        if (project) {
            handleMapProjectSelect(project);
        }
    };

    const handleWidgetClick = (type) => {
        setClickedWidget(type);
    };

    const getWidgetDetails = () => {
        if (!clickedWidget) return { title: "", content: [] };

        switch (clickedWidget) {
            case 'urgent':
                const urgentProjs = projects.filter(p => (p.hiringSignals || []).some(s => s.urgency === 'Critical' || s.urgency === 'High')).map(p => ({
                    ...p,
                    details: p.hiringSignals.filter(s => s.urgency === 'Critical' || s.urgency === 'High')
                }));
                return { title: "Projects with Urgent Hiring Needs", items: urgentProjs };

            case 'phases':
                const transitioning = projects.filter(p => (p.phases || []).some(ph => ph.status === 'Upcoming')).map(p => ({
                    ...p,
                    details: p.phases.filter(ph => ph.status === 'Upcoming')
                }));
                return { title: "Upcoming Phase Transitions", items: transitioning };

            case 'revenue':
                const revRisk = projects.filter(p => (p.hiringSignals || []).some(s => s.revenueAtRisk > 0 || (s.count > 0))).map(p => ({
                    ...p,
                    details: p.hiringSignals.filter(s => s.revenueAtRisk > 0 || s.count > 0)
                }));
                return { title: "Revenue at Risk Breakdown", items: revRisk };

            default: return { title: "", items: [] };
        }
    };

    const widgetData = getWidgetDetails();


    return (
        <div className="projects-container">
            <header className="page-header">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Building className="text-secondary" /> Projects Database
                    </h1>
                    <p className="text-slate-400 mt-1">Market Intelligence & Project Management</p>
                </div>
                <div className="header-actions">
                    <button className="action-btn primary" onClick={handleAddClick}>
                        <Plus size={18} /> Add Project
                    </button>
                    {/* View toggle moved to grid section header if needed, or kept here */}
                </div>
            </header>

            {/* --- Market Intelligence Section --- */}
            <div className="market-intel-section">
                <DashboardWidgets projects={projects} onWidgetClick={handleWidgetClick} />

                <div className="intel-layout">
                    <div className="intel-sidebar">
                        <ProjectList
                            projects={projects}
                            onSelectProject={handleMapProjectSelect}
                            selectedProjectId={mapSelectedProject?.id}
                        />
                    </div>
                    <div className="intel-center">
                        <div className="map-wrapper">
                            <GeospatialMap
                                markers={projects.map(p => ({
                                    id: p.id,
                                    name: p.name,
                                    coordinates: p.coordinates || { lat: p.lat, lng: p.lng },
                                    type: 'project',
                                    color: 'blue',
                                    status: p.status
                                }))}
                                polygonData={isochroneData}
                                onMarkerClick={handleMarkerClick}
                                activeMarkerId={mapSelectedProject?.id}
                            />
                        </div>
                        <div className="timeline-wrapper">
                            {mapSelectedProject ? (
                                <ProjectTimeline project={mapSelectedProject} />
                            ) : (
                                <div className="empty-selection">
                                    <p>Select a project to view timeline</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Projects Database Grid Section --- */}
            <div className="projects-grid-section">
                <div className="grid-header">
                    <h2>Active Projects</h2>
                    <div className="filters">
                        <div className="view-toggle">
                            <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                                <LayoutGrid size={18} />
                            </button>
                            <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                                <ListIcon size={18} />
                            </button>
                        </div>
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Filter projects..." />
                        </div>
                    </div>
                </div>

                {viewMode === "grid" ? (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="project-card glass-panel"
                                onClick={() => {
                                    setEditingProject(project);
                                    setIsModalOpen(true);
                                }}
                            >
                                <div className="card-header">
                                    <h3 className="project-name">{project.name}</h3>
                                    <div className="card-badges">
                                        <span className={`stage-badge ${String(project.stage || 'pipeline').toLowerCase()}`}>
                                            {project.stage || 'Pipeline'}
                                        </span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="meta-row">
                                        <div className="meta-item">
                                            <MapPin size={14} /> {project.location || project.address || 'No Location'}
                                        </div>
                                        <div className="meta-item">
                                            <DollarSign size={14} /> {project.value || 'TBD'}
                                        </div>
                                    </div>

                                    <div className="assigned-companies">
                                        <div className="company-badges">
                                            {Array.isArray(project.assignedCompanyIds) && [...new Set(project.assignedCompanyIds)].map(id => {
                                                const company = clients.find(c => c.id === id);
                                                return company ? (
                                                    <span key={id} className={`company-badge tier-${company.tier}`}>
                                                        {company.name}
                                                    </span>
                                                ) : null;
                                            })}
                                            {(!project.assignedCompanyIds || project.assignedCompanyIds.length === 0) && (
                                                <span className="text-slate-500 text-xs italic">{project.client || "Unassigned"}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="site-manager-row">
                                        <Briefcase size={14} className="text-muted" />
                                        <span className="text-sm text-slate-300">{project.siteManager || "No Site Manager"}</span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="date-info">
                                        <Calendar size={14} /> Start: {project.startDate || 'TBD'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="projects-list-view">
                        <div className="list-head">
                            <div className="col name">Project Name</div>
                            <div className="col contractor">Main Contractor</div>
                            <div className="col value">Value</div>
                            <div className="col stage">Stage</div>
                            <div className="col manager">Site Manager</div>
                        </div>
                        {projects.map(project => {
                            const contractor = clients.find(c => c.id === project.assignedCompanyIds?.[0])?.name || project.client || "-";
                            return (
                                <div key={project.id} className="list-row" onClick={() => {
                                    setEditingProject(project);
                                    setIsModalOpen(true);
                                }}>
                                    <div className="col name font-bold">{project.name}</div>
                                    <div className="col contractor">{contractor}</div>
                                    <div className="col value">{project.value || "-"}</div>
                                    <div className="col stage">
                                        <span className={`stage-badge ${String(project.stage || '').toLowerCase()}`}>{project.stage}</span>
                                    </div>
                                    <div className="col manager">{project.siteManager || "-"}</div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AddProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProject}
                    initialData={editingProject}
                />
            )}

            {clickedWidget && (
                <div className="modal-overlay" onClick={() => setClickedWidget(null)}>
                    <div className="widget-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{widgetData.title}</h2>
                            <button className="close-btn" onClick={() => setClickedWidget(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-list">
                            {widgetData.items.length === 0 ? <p className="empty-text">No items found.</p> : widgetData.items.map((item, idx) => (
                                <div key={idx} className="modal-item" onClick={() => { handleMapProjectSelect(item); setClickedWidget(null); }}>
                                    <div className="item-header">
                                        <h3>{item.name}</h3>
                                        <span className="arrow-icon"><ArrowRight size={16} /></span>
                                    </div>
                                    <div className="item-details">
                                        {item.details.map((d, i) => (
                                            <div key={i} className="detail-tag">
                                                {d.role || d.name}
                                                {d.count ? ` (${d.count})` : ''}
                                                {d.urgency ? ` • ${d.urgency}` : ''}
                                                {d.status ? ` • ${d.status}` : ''}
                                                {d.start ? ` • Starts ${d.start}` : ''}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .projects-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    min-height: 100vh;
                    padding: 1.5rem;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.6rem 1rem;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: var(--transition-fast);
                    font-size: 0.875rem;
                }

                .action-btn.primary {
                    background: var(--secondary);
                    color: #0f172a;
                    border-color: var(--secondary);
                    font-weight: 600;
                }

                /* Market Intel Section */
                .market-intel-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--border);
                }

                .intel-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 1.5rem;
                    align-items: start;
                    height: 600px;
                }

                .intel-sidebar {
                    height: 100%;
                    overflow: hidden;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    background: var(--surface);
                }

                .intel-center {
                    display: grid;
                    grid-template-rows: 1fr auto;
                    gap: 1.5rem;
                    height: 100%;
                }

                .map-wrapper {
                     background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    overflow: hidden;
                    position: relative;
                    height: 100%;
                }

                .timeline-wrapper {
                    height: auto;
                }

                .empty-selection {
                    min-height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                }

                /* Projects Grid Section */
                .projects-grid-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .grid-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .grid-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-main);
                }
                
                .filters {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .search-bar {
                    display: flex;
                    align-items: center;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 0.5rem 1rem;
                    width: 250px;
                    gap: 0.75rem;
                }

                .search-bar input {
                    background: none;
                    border: none;
                    color: var(--text-main);
                    flex: 1;
                    outline: none;
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .project-card {
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    gap: 1rem;
                    transition: transform 0.2s;
                    cursor: pointer;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                }

                .project-card:hover {
                    transform: translateY(-2px);
                    border-color: var(--secondary);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .project-name {
                    font-weight: 600;
                    color: var(--text-main);
                    font-size: 1.1rem;
                }

                .stage-badge {
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-muted);
                }
                .stage-badge.won { background: rgba(16, 185, 129, 0.1); color: #34d399; }
                .stage-badge.tender { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
                .stage-badge.construction { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }

                .meta-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .company-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .company-badge {
                    font-size: 0.75rem;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-main);
                    border: 1px solid transparent;
                }

                .card-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .date-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                /* View Toggle */
                .view-toggle {
                    display: flex;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                }
                .toggle-btn {
                    padding: 0.4rem 0.6rem;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .toggle-btn.active {
                    background: var(--secondary);
                    color: #0f172a;
                }

                /* List View */
                .projects-list-view {
                    display: flex;
                    flex-direction: column;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    overflow-x: auto;
                }
                .list-head, .list-row {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
                    padding: 0.75rem 1rem;
                    align-items: center;
                    gap: 1rem;
                    min-width: 800px; 
                }
                .list-head {
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid var(--border);
                    font-weight: 600;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                }
                .list-row {
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    cursor: pointer;
                    transition: background 0.2s;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                .list-row:last-child { border-bottom: none; }
                .list-row:hover { background: rgba(255,255,255,0.05); }
                
                .col { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .col.name { color: white; font-weight: 500; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }

                .widget-modal {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    width: 100%;
                    max-width: 600px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }

                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                .modal-list {
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .modal-item {
                    background: var(--surface-highlight, rgba(255,255,255,0.02));
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .modal-item:hover {
                    background: var(--surface-hover, rgba(255,255,255,0.05));
                    transform: translateX(4px);
                    border-color: var(--primary);
                }

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .item-header h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .arrow-icon {
                    color: var(--text-muted);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .modal-item:hover .arrow-icon {
                    opacity: 1;
                    color: var(--primary);
                }

                .item-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .detail-tag {
                    font-size: 0.75rem;
                    background: rgba(59, 130, 246, 0.1);
                    color: #93c5fd;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }
                
                .empty-text {
                    text-align: center;
                    color: var(--text-muted);
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-400">Loading projects...</div>}>
            <ProjectsContent />
        </Suspense>
    );
}
