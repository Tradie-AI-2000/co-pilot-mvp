"use client";

import { useState } from "react";
import { useData } from "../../context/data-context.js"; // Import context
import DashboardWidgets from "../../components/dashboard-widgets.js";
import GeospatialMap from "../../components/geospatial-map.js";
import ProjectList from "../../components/project-list.js";
import ProjectTimeline from "../../components/project-timeline.js";
import AddProjectModal from "../../components/add-project-modal.js";
// Removed mock import
import { Plus } from "lucide-react";


export default function MarketPage() {
  const { projects, addProject } = useData(); // Use context
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isochroneData, setIsochroneData] = useState(null);
  const [isCommuteLoading, setIsCommuteLoading] = useState(false);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
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
    // Find the full project data based on the marker id
    const project = projects.find(p => p.id === marker.id || p.name === marker.name);
    if (project) {
      handleProjectSelect(project);
    }
  };

  const handleAddProject = (newProjectData) => {
    // We pass the raw data (packages, triggers) to addProject
    // and let DataContext handle the intelligence generation (subContractors, signals, etc.)

    const newProject = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      coordinates: { lat: -36.8485, lng: 174.7633 }, // TODO: Replace with geocoding from address
      stage: newProjectData.status, // Map status to stage for filtering
    };
    addProject(newProject); // Use context action which now generates intelligence
    setSelectedProject(newProject); // Note: this selectedProject won't have the generated data immediately if we just set it here. 
    // Ideally we should select it from the updated projects list, but for now this is fine as the list will update and re-render.
  };

  return (
    <>
      <div className="market-page">
        <div className="page-header">
          <div>
            <h1>Market Intelligence</h1>
            <p>Real-time construction project tracking and hiring signals</p>
          </div>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            New Project
          </button>
        </div>

        <div className="dashboard-section">
          <DashboardWidgets projects={projects} />
        </div>

        <div className="main-content">
          <div className="sidebar">
            <ProjectList
              projects={projects}
              onSelectProject={handleProjectSelect}
              selectedProjectId={selectedProject?.id}
            />
          </div>

          <div className="center-panel">
            <div className="map-container">
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
                activeMarkerId={selectedProject?.id}
              />
            </div>
            <div className="timeline-container-wrapper">
              {selectedProject ? (
                <ProjectTimeline project={selectedProject} />
              ) : (
                <div className="empty-selection">
                  <p>Select a project to view details and timeline</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AddProjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProject}
        />

        <style jsx>{`
                .market-page {
                    min-height: 100vh; /* Ensure page is at least viewport height */
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    gap: 1.5rem;
                    background: var(--background);
                    color: var(--text-main);
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                    background: linear-gradient(to right, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .page-header p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                }

                .btn-primary {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 0.6rem 1rem;
                    border-radius: var(--radius-sm);
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: opacity 0.2s;
                }

                .btn-primary:hover {
                    opacity: 0.9;
                }

                .dashboard-section {
                    flex-shrink: 0;
                }

                .main-content {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 1.5rem;
                    align-items: start; /* Align items to the top */
                }

                .sidebar {
                    position: sticky;
                    top: 1.5rem; /* Match page padding */
                    height: calc(100vh - 3rem); /* Full viewport height minus top/bottom padding */
                }

                .center-panel {
                    display: grid;
                    grid-template-rows: 56vh auto; /* Map gets 70% of viewport, timeline is auto */
                    gap: 1.5rem;
                }

                .map-container {
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    overflow: hidden;
                    position: relative;
                    height: 100%; /* Fill the grid row */
                }

                .timeline-container-wrapper {
                    /* No longer needs fixed height, will grow with content */
                }

                .empty-selection {
                    min-height: 400px; /* Give it a decent minimum height */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                }
            `}</style>
      </div>
    </>
  );
}
