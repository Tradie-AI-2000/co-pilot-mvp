"use client";

import { useState, useEffect } from 'react';
import { useData } from "../context/data-context.js";
import StatCard from "../components/stat-card.js";
import FocusFeedCard from "../components/focus-feed-card.js";
import GeospatialMap from "../components/geospatial-map.js";
import ActivityFeedWidget from "../components/activity-feed-widget.js";
import ProjectIntelligencePanel from "../components/project-intelligence-panel.js";
import AddProjectModal from "../components/add-project-modal.js";
import { useCrew } from "../context/crew-context.js";
import CrewBuilderPanel from "../components/crew-builder-panel.js";
import WhatsAppBlaster from "../components/whatsapp-blaster.js";
import BenchLiabilityWidget from "../components/bench-liability-widget.js";
import RedeploymentRadar from "../components/redeployment-radar.js";
import ClientSidePanel from "../components/client-side-panel.js";
import PlacementsPipeline from "../components/placements-pipeline.js";
import ActivePlacementsModal from "../components/active-placements-modal.js";

export default function PredictiveCommandCenter() {
  return (
    <DashboardContent />
  );
}

function DashboardContent() {
  const { candidates, projects, clients, selectedProject, setSelectedProject, updateProject, addProject, moneyMoves } = useData();
  const [watchlist, setWatchlist] = useState([]);
  const [isochroneData, setIsochroneData] = useState(null);
  const [isCommuteLoading, setIsCommuteLoading] = useState(false);
  const [commuteMinutes, setCommuteMinutes] = useState(20);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewActivePlacements, setViewActivePlacements] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    setWatchlist(projects.filter(p => p.status === 'Active' || p.status === 'Planning').slice(0, 5));
  }, [projects]);

  // --- Isochrone Logic ---
  const fetchIsochrone = async (project, mins = commuteMinutes) => {
    if (!project || !project.coordinates) return;

    setIsCommuteLoading(true);
    try {
      const { lat, lng } = project.coordinates;
      const res = await fetch(`/api/geo/isochrone?lat=${lat}&lng=${lng}&minutes=${mins}`);
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

  useEffect(() => {
    if (selectedProject) {
      fetchIsochrone(selectedProject, commuteMinutes);
    } else {
      setIsochroneData(null);
    }
  }, [selectedProject, commuteMinutes]);

  const handleEditFromPanel = (project) => {
    setSelectedProject(null);
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      updateProject({ ...editingProject, ...projectData });
    } else {
      addProject(projectData);
    }
    setIsModalOpen(false);
  };

  const handleFocusCardClick = (item) => {
    if (item.projectId) {
      const project = projects.find(p => p.id === item.projectId);
      if (project) setSelectedProject(project);
    } else if (item.clientId) {
      const client = clients.find(c => c.id === item.clientId);
      if (client) setSelectedClient(client);
    }
  };

  // --- LIVE METRICS ---
  const activePlacements = candidates.filter(c => c.status === "On Job").length;
  const weeklyBillings = activePlacements * 600;

  const revenueAtRisk = moneyMoves.reduce((acc, item) => {
    if (item.urgency === 'Critical' || item.urgency === 'High') return acc + 600;
    return acc;
  }, 0);

  const hotJobs = projects.filter(p => p.status === "Active").length;
  const totalOpenRoles = moneyMoves.filter(m => m.type === 'signal').length;
  const fillRate = totalOpenRoles + activePlacements > 0
    ? Math.round((activePlacements / (activePlacements + totalOpenRoles)) * 100)
    : 100;

  const stats = [
    { title: "Est. Weekly Billings", value: `$${(weeklyBillings / 1000).toFixed(1)}k`, subtext: "Live Estimate", progress: Math.min(100, (weeklyBillings / 50000) * 100), status: "success", trend: "up" },
    { title: "Revenue at Risk", value: `$${(revenueAtRisk / 1000).toFixed(1)}k`, subtext: "Unfilled Roles", progress: Math.min(100, (revenueAtRisk / 10000) * 100), status: "danger", trend: "down" },
    { 
        title: "Active Placements", 
        value: activePlacements.toString(), 
        subtext: "On Site Now", 
        progress: 100, 
        status: "neutral", 
        trend: "up",
        onClick: () => setViewActivePlacements(true),
        cursor: "pointer"
    },
    { title: "Fill Rate", value: `${fillRate}%`, subtext: "Demand vs Supply", progress: fillRate, status: fillRate > 80 ? "success" : "warning", trend: fillRate > 80 ? "up" : "down" },
    { title: "Hot Jobs", value: hotJobs.toString(), subtext: "Active Sites", progress: 60, status: "purple", trend: "up" }
  ];

  const handleMapMarkerClick = (marker) => {
    if (marker.type === 'project') {
      const project = projects.find(p => p.id === marker.id || p.name === marker.title);
      setSelectedProject(project);
    } else if (marker.type === 'candidate') {
      console.log("Candidate click:", marker);
    }
  };

  const mapMarkers = [
    ...projects.map(p => ({
      id: p.id,
      title: p.name,
      name: p.name,
      coordinates: p.coordinates || { lat: p.lat, lng: p.lng },
      type: 'project',
      color: 'blue',
      status: p.status
    })),
    ...candidates.map(c => ({
      id: c.id,
      title: `${c.firstName} ${c.lastName}`,
      name: `${c.firstName} ${c.lastName}`,
      coordinates: { lat: c.lat, lng: c.lng },
      type: 'candidate',
      status: c.status
    }))
  ];
  const { deployedData, setDeployedData } = useCrew();

  return (
    <>
      <div className="dashboard-container">
        {/* Zone 1: The Scoreboard */}
        <section className="scoreboard">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </section>

        {/* Zone 1.5: Risk Control Center */}
        <section className="risk-control">
          <BenchLiabilityWidget candidates={candidates} />
          <RedeploymentRadar candidates={candidates} />
        </section>

        <div className="main-grid">
          {/* Zone 2: Mission Control */}
          <section className="mission-control">
            <div className="section-header">
              <h2>Mission Control</h2>
            </div>

            <div className="control-panel">
              {/* Section A: Placements Pipeline */}
              <div className="panel-column">
                <PlacementsPipeline />
              </div>

              {/* Section B: Urgent Actions */}
              <div className="panel-column">
                <h3 className="column-title">Urgent Actions</h3>
                <div className="urgent-list">
                  {moneyMoves.map((action) => {
                    let cardType = action.type;
                    if (action.type === 'signal') {
                      if (action.urgency === 'Critical') cardType = 'risk';
                      else if (action.urgency === 'High') cardType = 'urgent';
                      else cardType = 'lead';
                    }

                    return (
                      <FocusFeedCard
                        key={action.id}
                        type={cardType}
                        title={action.title}
                        subtitle={action.description}
                        meta={action.projectName || (action.candidateId ? "Candidate Alert" : "Client Alert")}
                        onAction={() => handleFocusCardClick(action)}
                      />
                    );
                  })}
                  {moneyMoves.length === 0 && (
                    <div className="text-muted text-sm italic p-4">No urgent actions required. Good job!</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Zone 3: Context & Territory */}
          <section className="context-sidebar">
            <div className="sidebar-widget map-widget">
              <div className="widget-header">
                <h3 className="widget-title">Territory Map</h3>
                {selectedProject && (
                  <div className="commute-toggle">
                    <span className="text-xs text-muted mr-2">Commute:</span>
                    {[15, 30, 45].map(m => (
                      <button
                        key={m}
                        className={`mins-btn ${commuteMinutes === m ? 'active' : ''}`}
                        onClick={() => setCommuteMinutes(m)}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="map-wrapper">
                <GeospatialMap
                  markers={mapMarkers}
                  polygonData={isochroneData}
                  onMarkerClick={handleMapMarkerClick}
                  activeMarkerId={selectedProject?.id}
                />
              </div>
            </div>

            <div className="sidebar-widget feed-widget">
              <ActivityFeedWidget />
            </div>
          </section>
        </div>

        <CrewBuilderPanel />

        {selectedProject && (
          <ProjectIntelligencePanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onEdit={handleEditFromPanel}
          />
        )}

        {selectedClient && (
          <ClientSidePanel
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}

        {viewActivePlacements && (
            <ActivePlacementsModal onClose={() => setViewActivePlacements(false)} />
        )}

        {isModalOpen && (
          <AddProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProject}
            initialData={editingProject}
          />
        )}

        {deployedData && (
          <WhatsAppBlaster
            squad={deployedData.squad}
            project={deployedData.project}
            onClose={() => setDeployedData(null)}
          />
        )}

      </div>

      <style jsx>{`
        .dashboard-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          overflow: hidden; /* Prevent body scroll */
          background: var(--background);
        }

        /* Zone 1: Scoreboard */
        .scoreboard {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          flex-shrink: 0;
        }

        /* Zone 1.5: Risk Control */
        .risk-control {
            display: grid;
            grid-template-columns: 1fr 2fr; /* New layout preserved */
            gap: 1rem;
            flex-shrink: 0;
            max-height: 250px;
        }

        /* Main Grid Layout */
        .main-grid {
          display: grid;
          grid-template-columns: 65fr 35fr;
          gap: 1rem;
          flex: 1; 
          min-height: 0; /* CRITICAL FIX: Allows children to calculate scroll height */
        }

        /* Zone 2: Mission Control */
        .mission-control {
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden; /* Keeps content inside rounded corners */
          height: 100%; /* FIX: Force fill of grid cell */
        }

        .section-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.4);
          flex-shrink: 0; /* Header never shrinks */
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .control-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
          flex: 1;
          min-height: 0; /* FIX: Prevents grid blowout */
          overflow: hidden; /* FIX: Don't scroll the whole panel */
        }

        .panel-column {
            display: flex;
            flex-direction: column;
            height: 100%; /* FIX: Fill the grid height */
            min-height: 0; /* FIX: Allow flex shrinking */
            overflow: hidden; /* Container doesn't scroll, inner list does */
        }

        .column-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 1rem;
          text-transform: uppercase;
          flex-shrink: 0; /* Keep title visible */
        }

        .urgent-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto; /* FIX: Scroll HERE only */
          flex: 1; /* Take remaining height */
          padding-right: 0.5rem;
        }
        
        /* Custom Scrollbar */
        .urgent-list::-webkit-scrollbar {
            width: 4px;
        }
        .urgent-list::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
        }

        /* Zone 3: Context Sidebar */
        .context-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 0; /* FIX: Allow shrinking */
          height: 100%;
        }

        .sidebar-widget {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .map-widget {
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem;
        }

        .map-wrapper {
          flex: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .widget-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .commute-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mins-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
        }

        .mins-btn.active {
          background: var(--secondary);
          color: #0f172a;
          border-color: var(--secondary);
          font-weight: 600;
        }
      `}</style>
    </>
  );
}