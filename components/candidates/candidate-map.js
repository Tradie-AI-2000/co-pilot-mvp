"use client";

import GeospatialMap from "../maps/geospatial-map.js";
import { User, Calendar, MapPin, Phone, Briefcase, Mail } from "lucide-react";

export default function CandidateMap({ candidates = [], projects = [], onCandidateClick, polygonData = null }) {
    // Transform candidates to markers
    const markers = candidates
        .filter(c => c.lat && c.lng) // Only map candidates with location
        .map(c => {
            // Determine Color
            let color = "blue"; // Default
            const today = new Date();

            if (c.status?.toLowerCase() === "on_job") {
                color = "#f87171"; // Red
            } else if (c.status?.toLowerCase() === "available") {
                color = "#1fb6ff"; // Blue/Secondary
            } else if (c.finishDate) {
                const finish = new Date(c.finishDate);
                const diffTime = Math.abs(finish - today);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 14) color = "orange"; // Finishing soon
                else if (diffDays <= 60) color = "blue"; // Short term
                else color = "green"; // Long term
            } else {
                color = "green"; // Assume long term if no finish date and not available
            }

            return {
                id: c.id,
                name: `${c.firstName} ${c.lastName}`,
                coordinates: { lat: c.lat, lng: c.lng },
                color: color,
                // Pass original candidate data for popup
                candidate: c
            };
        });

    const renderPopup = (marker) => {
        const c = marker.candidate;
        // Find project name if linked
        const project = projects.find(p => p.id === c.projectId);
        const projectName = project ? project.name : (c.status?.toLowerCase() === 'on_job' ? c.currentEmployer : null);

        return (
            <div className="candidate-popup">
                <div className="popup-header">
                    <div className="popup-avatar">
                        {c.firstName[0]}{c.lastName[0]}
                    </div>
                    <div>
                        <strong>{c.firstName} {c.lastName}</strong>
                        <div className="text-xs text-muted">{c.role}</div>
                    </div>
                </div>

                <div className="popup-details">
                    <div className="popup-row">
                        <MapPin size={12} /> {c.suburb}
                    </div>
                    {projectName && (
                        <div className="popup-row">
                            <Briefcase size={12} /> {projectName}
                        </div>
                    )}
                    {c.status?.toLowerCase() === "on_job" && (
                        <div className="popup-row">
                            <Calendar size={12} /> Finishes: {c.finishDate || "Unknown"}
                        </div>
                    )}
                    <div className="popup-row">
                        <Phone size={12} /> {c.mobile}
                    </div>
                    <div className="popup-row">
                        <Mail size={12} />
                        <a href={`mailto:${c.email}`} className="email-link">{c.email}</a>
                    </div>
                </div>

                <button
                    className="popup-btn"
                    onClick={() => onCandidateClick && onCandidateClick(c)}
                >
                    View Profile
                </button>

                <style jsx>{`
                    .candidate-popup {
                        min-width: 220px;
                        font-family: var(--font-sans);
                    }
                    .popup-header {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 0.75rem;
                        padding-bottom: 0.75rem;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .popup-avatar {
                        width: 32px;
                        height: 32px;
                        background: #3b82f6;
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                        font-weight: bold;
                    }
                    .popup-details {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                        margin-bottom: 0.75rem;
                    }
                    .popup-row {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.75rem;
                        color: #64748b;
                    }
                    .email-link {
                        color: #3b82f6;
                        text-decoration: none;
                    }
                    .email-link:hover {
                        text-decoration: underline;
                    }
                    .popup-btn {
                        width: 100%;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 0.4rem;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        cursor: pointer;
                    }
                    .popup-btn:hover {
                        background: #2563eb;
                    }
                `}</style>
            </div>
        );
    };

    return (
        <div className="candidate-map-container">
            <GeospatialMap
                markers={markers}
                polygonData={polygonData}
                renderPopup={renderPopup}
            />
            <style jsx>{`
                .candidate-map-container {
                    height: 600px; /* Fixed height for map view */
                    width: 100%;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    border: 1px solid var(--border);
                }
            `}</style>
        </div>
    );
}
