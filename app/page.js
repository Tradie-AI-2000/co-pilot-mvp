"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ProjectWatchlistCard from "@/components/ProjectWatchlistCard";
import FocusFeedCard from "@/components/FocusFeedCard";
import GeospatialMap from "@/components/GeospatialMap";
import ActivityFeedWidget from "@/components/ActivityFeedWidget";
import ProjectDetailPanel from "@/components/ProjectDetailPanel";
import { enhancedClients } from "@/services/enhancedMockData";
import { getWatchlistProjects } from "@/services/projectService";

export default function PredictiveCommandCenter() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setWatchlist(getWatchlistProjects());
  }, []);

  // Mock Data for Scoreboard
  const stats = [
    { title: "MTD Billings", value: "$85k", subtext: "vs $70k Target", progress: 85, status: "success", trend: "up" },
    { title: "Activity Pulse", value: "124", subtext: "Calls/Mtgs", progress: 92, status: "purple", trend: "up" },
    { title: "Active Placements", value: "42", subtext: "+3 this week", progress: 100, status: "neutral", trend: "up" },
    { title: "Compliance", value: "98%", subtext: "1 Risk Detected", progress: 98, status: "warning", trend: "down" },
    { title: "Hot Jobs", value: "8", subtext: "Urgent Priority", progress: 60, status: "danger", trend: "up" }
  ];

  // Mock Data for Urgent Actions
  const urgentActions = [
    { id: 0, type: "transition", title: "Phase Transition Imminent", subtitle: "Te Hono Avondale: Foundations > Structure", meta: "Opportunity: Formwork Carpenters" },
    { id: 1, type: "risk", title: "Hawkins Construction", subtitle: "Contract Expired 3 days ago", meta: "Risk: High" },
    { id: 2, type: "urgent", title: "Site Manager Needed", subtitle: "Fletcher - CBD Project", meta: "Start: Monday" },
    { id: 3, type: "risk", title: "Mike Ross (Downer)", subtitle: "No contact > 30 days", meta: "Relationship Risk" }
  ];

  const handleMapMarkerClick = (marker) => {
    const mockClient = enhancedClients[0];
    setSelectedProject({
      ...mockClient,
      name: marker.title,
      tradeStack: {
        current: [
          { role: "Labourers", count: 3 },
          { role: "Site Traffic", count: 2 }
        ],
        next: [
          { role: "Carpenters", count: 6 },
          { role: "Glaziers", count: 2 }
        ]
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Zone 1: The Scoreboard */}
      <section className="scoreboard">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      <div className="main-grid">
        {/* Zone 2: Mission Control */}
        <section className="mission-control">
          <div className="section-header">
            <h2>Mission Control</h2>
          </div>

          <div className="control-panel">
            {/* Section A: Project Watchlist */}
            <div className="panel-column">
              <h3 className="column-title">Project Watchlist</h3>
              <div className="watchlist-list">
                {watchlist.map(project => (
                  <ProjectWatchlistCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* Section B: Urgent Actions */}
            <div className="panel-column">
              <h3 className="column-title">Urgent Actions</h3>
              <div className="urgent-list">
                {urgentActions.map(action => (
                  <FocusFeedCard
                    key={action.id}
                    {...action}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zone 3: Context & Territory */}
        <section className="context-sidebar">
          <div className="sidebar-widget map-widget">
            <h3 className="widget-title">Territory Map</h3>
            <div className="map-wrapper">
              <GeospatialMap onMarkerClick={handleMapMarkerClick} />
            </div>
          </div>

          <div className="sidebar-widget feed-widget">
            <ActivityFeedWidget />
          </div>
        </section>
      </div>

      {selectedProject && (
        <ProjectDetailPanel
          client={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={(updated) => console.log("Updated:", updated)}
        />
      )}

      <style jsx>{`
        .dashboard-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          overflow: hidden;
        }

        /* Zone 1: Scoreboard */
        .scoreboard {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          flex-shrink: 0;
        }

        /* Main Grid Layout */
        .main-grid {
          display: grid;
          grid-template-columns: 65fr 35fr; /* 65% - 35% Split */
          gap: 1rem;
          flex: 1;
          min-height: 0; /* Prevent overflow */
        }

        /* Zone 2: Mission Control */
        .mission-control {
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .section-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.4);
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
          overflow-y: auto;
        }

        .column-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .watchlist-list, .urgent-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Zone 3: Context Sidebar */
        .context-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
