"use client";

import { useState, useEffect, Suspense } from "react";
import { useData } from "../../context/data-context.js";
import { Search, Filter, Plus, Building, MapPin, Calendar, DollarSign, Briefcase, LayoutGrid, List as ListIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

import AddProjectModal from "../../components/add-project-modal.js";
import ProjectIntelligencePanel from "../../components/project-intelligence-panel.js";

function ProjectsContent() {
    const { projects, addProject, updateProject, clients } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // For Read-Only View
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
    const searchParams = useSearchParams();

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
            addProject(projectData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="projects-container">
            <header className="page-header">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Building className="text-secondary" /> Projects Database
                </h1>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                    <button className="action-btn primary" onClick={handleAddClick}>
                        <Plus size={18} /> Add Project
                    </button>
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input type="text" placeholder="Search projects..." />
                        <button className="filter-btn">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {viewMode === "grid" ? (
                <div className="projects-grid">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className="project-card glass-panel"
                            onClick={() => handleCardClick(project)}
                        >
                            <div className="card-header">
                                <h3 className="project-name">{project.name}</h3>
                                <div className="card-badges">
                                    <span className={`stage-badge ${project.stage?.toLowerCase() || 'pipeline'}`}>
                                        {project.stage || 'Pipeline'}
                                    </span>
                                    {/* Calculated "Next Phase" Badge could go here */}
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
                                    <span className="label">Main Contractor:</span>
                                    <div className="company-badges">
                                        {project.assignedCompanyIds?.map(id => {
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
                            <div key={project.id} className="list-row" onClick={() => handleCardClick(project)}>
                                <div className="col name font-bold">{project.name}</div>
                                <div className="col contractor">{contractor}</div>
                                <div className="col value">{project.value || "-"}</div>
                                <div className="col stage">
                                    <span className={`stage-badge ${project.stage?.toLowerCase()}`}>{project.stage}</span>
                                </div>
                                <div className="col manager">{project.siteManager || "-"}</div>
                            </div>
                        )
                    })}
                </div>
            )}

            {selectedProject && (
                <ProjectIntelligencePanel
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onEdit={handleEditFromPanel}
                />
            )}

            {isModalOpen && (
                <AddProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProject}
                    initialData={editingProject}
                />
            )}

            <style jsx>{`
                .projects-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    height: calc(100vh - 4rem);
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.5rem 1rem;
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

                .search-bar {
                    display: flex;
                    align-items: center;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 0.5rem 1rem;
                    width: 300px;
                    gap: 0.75rem;
                }

                .search-bar input {
                    background: none;
                    border: none;
                    color: var(--text-main);
                    flex: 1;
                    outline: none;
                }

                .search-icon { color: var(--text-muted); }
                .filter-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                    overflow-y: auto;
                    padding-bottom: 2rem;
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

                .assigned-companies {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .assigned-companies.label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
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

                .company-badge.tier-1 { border-color: var(--tier-1-gold); color: var(--tier-1-gold); background: rgba(251, 191, 36, 0.1); }
                .company-badge.tier-2 { border-color: var(--tier-2-silver); color: var(--tier-2-silver); background: rgba(148, 163, 184, 0.1); }
                .company-badge.tier-3 { border-color: var(--tier-3-bronze); color: var(--tier-3-bronze); background: rgba(202, 138, 4, 0.1); }

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
                    margin-right: 0.5rem;
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
                .toggle-btn:hover { background: rgba(255,255,255,0.05); }
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
                    min-width: 800px; /* Ensure table doesn't collapse too much */
                }
                .list-head {
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid var(--border);
                    font-weight: 600;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
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
                .col.value { font-family: monospace; }
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
