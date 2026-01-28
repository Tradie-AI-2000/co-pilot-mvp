"use client";

import { useState, useEffect } from 'react';
import { useData } from "../context/data-context.js";
import StatCard from "../components/stat-card.js";
import FocusFeedCard from "../components/focus-feed-card.js";
import ProjectIntelligencePanel from "../components/project-intelligence-panel.js";
import AddProjectModal from "../components/add-project-modal.js";
import { useCrew } from "../context/crew-context.js";
import WhatsAppBlaster from "../components/whatsapp-blaster.js";
import BenchLiabilityWidget from "../components/bench-liability-widget.js";
import RedeploymentRadar from "../components/redeployment-radar.js";

// 👇 OLD COMPONENT (REMOVED)
// import ClientSidePanel from "../components/client-side-panel.js";

// 👇 NEW COMPONENT (ADDED)
import ClientDetailsModal from "../components/client-details-modal.js";

import ActivePlacementsModal from "../components/active-placements-modal.js";
import ActionDrawer from "../components/action-drawer.js";
import ActiveBenchModal from "../components/active-bench-modal.js";
import CandidateModal from "../components/candidate-modal.js";
import DealFlowSummary from "../components/deal-flow-summary.js";
import DealFlowModal from "../components/deal-flow-modal.js";
import ClientDemandWidget from "../components/client-demand-widget.js";

export default function PredictiveCommandCenter() {
  return (
    <DashboardContent />
  );
}

function DashboardContent() {
  // 👇 ADDED 'updateClient' to destructuring
  const { candidates, projects, clients, selectedProject, setSelectedProject, updateProject, addProject, updateCandidate, updateClient, moneyMoves, weeklyRevenue, revenueAtRisk, benchLiability, isSyncing } = useData();
  const [watchlist, setWatchlist] = useState([]);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewActivePlacements, setViewActivePlacements] = useState(false);
  const [viewBenchList, setViewBenchList] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedNudge, setSelectedNudge] = useState(null);

  // New: Deal Flow State
  const [dealFlowTab, setDealFlowTab] = useState(null); // 'floats' or 'placements', null = closed

  useEffect(() => {
    setWatchlist(projects.filter(p => p.status === 'Active' || p.status === 'Planning' || p.status === 'Construction').slice(0, 5));
  }, [projects]);

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

  const handleSaveCandidate = (updatedCandidate) => {
    updateCandidate(updatedCandidate);
    setSelectedCandidate(null);
  };

  // 👇 NEW: Handle Saving Client Changes
  const handleSaveClient = (updatedClient) => {
    if (updateClient) {
      updateClient(updatedClient);
    } else {
      console.warn("updateClient function missing from context");
    }
    // Don't close immediately so you can see the update
    // setSelectedClient(null); 
  };

  const handleFocusCardClick = (item) => {
    setSelectedNudge(item);
  };

  // --- LIVE METRICS ---
  const activePlacements = candidates.filter(c => c.status === "on_job");

  const totalOpenRoles = moneyMoves.filter(m => m.type === 'lead' || m.type === 'signal').length;
  const fillRate = totalOpenRoles + activePlacements.length > 0
    ? Math.round((activePlacements.length / (activePlacements.length + totalOpenRoles)) * 100)
    : 100;

  const stats = [
    {
      title: "Est. Weekly Billings",
      value: `$${(weeklyRevenue / 1000).toFixed(1)}k`,
      subtext: "Live Estimate",
      progress: Math.min(100, (weeklyRevenue / 50000) * 100),
      status: "success",
      trend: "up",
      onClick: () => console.log("Open Financials View"),
      cursor: "pointer"
    },
    {
      title: "Revenue at Risk",
      value: `$${(revenueAtRisk / 1000).toFixed(1)}k`,
      subtext: "Unfilled Roles",
      progress: Math.min(100, (revenueAtRisk / 10000) * 100),
      status: "danger",
      trend: "down",
      onClick: () => console.log("Open Risk View"),
      cursor: "pointer"
    },
    {
      title: "Active Placements",
      value: activePlacements.length.toString(),
      subtext: "On Site Now",
      progress: 100,
      status: "neutral",
      trend: "up",
      onClick: () => setViewActivePlacements(true),
      cursor: "pointer"
    },
    { title: "Fill Rate", value: `${fillRate}%`, subtext: "Demand vs Supply", progress: fillRate, status: fillRate > 80 ? "success" : "warning", trend: fillRate > 80 ? "up" : "down" }
  ];

  const { deployedData, setDeployedData } = useCrew();

  if (isSyncing && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-400 gap-4">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
        <div className="text-xl font-bold tracking-widest uppercase">Establishing Uplink...</div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        {/* Zone 1: The Scoreboard */}
        <section className="scoreboard">
          {stats.slice(0, 1).map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
          <BenchLiabilityWidget
            candidates={candidates}
            liability={benchLiability}
            onViewBench={() => setViewBenchList(true)}
          />
          {stats.slice(1).map((stat, index) => (
            <StatCard key={index + 1} {...stat} />
          ))}
        </section>

        {/* Zone 1.5: Risk Control Center */}
        <section className="risk-control">
          <RedeploymentRadar candidates={candidates} />
        </section>

        <div className="main-grid">
          {/* Zone 2: Mission Control */}
          <section className="mission-control">
            <div className="section-header">
              <h2>Mission Control</h2>
            </div>

            <div className="control-panel">
              {/* Section A: Deal Flow */}
              <div className="panel-column">
                <h3 className="column-title">Deal Flow</h3>
                <DealFlowSummary
                  floats={candidates.filter(c => c.status === "Floated" || c.status === "Interviewing")}
                  placements={candidates.filter(c => c.status === "on_job")}
                  onOpenDetail={setDealFlowTab}
                />
              </div>

              {/* Section B: Client Demand */}
              <div className="panel-column">
                <h3 className="column-title">Client Demand</h3>
                <ClientDemandWidget
                  projects={projects}
                  onOpenProject={handleEditFromPanel}
                />
              </div>
            </div>
          </section>

          {/* Zone 3: Context & Territory */}
          <section className="context-sidebar">
            <div className="sidebar-widget nudge-widget">
              <div className="widget-header">
                <h3 className="widget-title">Nudge Engine</h3>
              </div>
              <div className="urgent-list custom-scrollbar">
                {moneyMoves.map((action) => {
                  const cardType = action.type;

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
                  <div className="text-muted text-sm italic p-4 text-center">All clear. Zero gravity achieved.</div>
                )}
              </div>
            </div>
          </section>
        </div>

        {selectedProject && (
          <ProjectIntelligencePanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onEdit={handleEditFromPanel}
          />
        )}

        {/* 👇 THE FIX: Swapped ClientSidePanel for ClientDetailsModal */}
        {selectedClient && (
          <ClientDetailsModal
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onUpdate={handleSaveClient}
          />
        )}

        {viewActivePlacements && (
          <ActivePlacementsModal onClose={() => setViewActivePlacements(false)} />
        )}

        {viewBenchList && (
          <ActiveBenchModal
            candidates={candidates.filter(c => c.status === "available")}
            onClose={() => setViewBenchList(false)}
            onViewCandidate={setSelectedCandidate}
          />
        )}

        {dealFlowTab && (
          <DealFlowModal
            isOpen={!!dealFlowTab}
            onClose={() => setDealFlowTab(null)}
            candidates={candidates}
            initialTab={dealFlowTab}
          />
        )}

        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            projects={projects}
            clients={clients}
            squads={[]}
            onClose={() => setSelectedCandidate(null)}
            onSave={handleSaveCandidate}
          />
        )}

        <ActionDrawer
          isOpen={!!selectedNudge}
          nudge={selectedNudge}
          onClose={() => setSelectedNudge(null)}
        />

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
          min-height: 100vh;
          height: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          overflow-y: auto; 
          background: var(--background);
        }

        .scoreboard {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          flex-shrink: 0;
        }

        .risk-control {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            flex-shrink: 0;
            max-height: 300px;
            height: 300px;     
        }
        
        .risk-control > :global(*) {
            overflow-y: auto;       
            height: 100%;           
            max-height: 100%;       
        }
        
        .risk-control > :global(*)::-webkit-scrollbar {
            width: 4px;
        }
        .risk-control > :global(*)::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 65fr 35fr;
          gap: 1rem;
          flex: 1; 
          min-height: 650px; 
        }

        .mission-control {
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden; 
          min-height: 400px;
          height: auto;
          flex: 1; 
        }

        .section-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.4);
          flex-shrink: 0;
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
          min-height: 0;
          overflow: hidden;
        }

        .panel-column {
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 0;
            overflow: hidden;
        }

        .column-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 1rem;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .urgent-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
          flex: 1; 
          padding-right: 0.5rem;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
        }

        .context-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 0;
          height: 100%;
        }

        .sidebar-widget {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .nudge-widget {
          flex: 1; 
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem;
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
      `}</style>
    </>
  );
}