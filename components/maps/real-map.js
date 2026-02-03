"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { booleanPointInPolygon, point } from '@turf/turf';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink } from 'lucide-react';

// Fix for default marker icons in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

function MapController({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function RealMap({
    markers = [],
    onMarkerClick,
    onEditProject, // NEW
    activeMarkerId,
    renderPopup,
    getMarkerIcon,
    polygonData = null,
    candidates = []
}) {
    // Default center (Auckland)
    const defaultCenter = [-36.8485, 174.7633];

    // Safe coordinate accessor
    const getCoords = (m) => {
        if (m.coordinates && m.coordinates.lat != null && m.coordinates.lng != null) {
            return [Number(m.coordinates.lat), Number(m.coordinates.lng)];
        }
        if (m.lat != null && m.lng != null) {
            return [Number(m.lat), Number(m.lng)];
        }
        return [-36.8485, 174.7633]; // Fallback to Auckland
    };

    // Find active marker to center map
    const activeMarker = markers.find(m => m.id === activeMarkerId);
    const center = activeMarker ? getCoords(activeMarker) : defaultCenter;

    return (
        <div className="map-wrapper">
            <MapContainer
                center={defaultCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={center} />

                {polygonData && (
                    <GeoJSON
                        key={JSON.stringify(polygonData)}
                        data={polygonData}
                        style={{
                            color: '#10b981', // Emerald 500
                            weight: 2,
                            opacity: 0.6,
                            fillColor: '#10b981',
                            fillOpacity: 0.15
                        }}
                    />
                )}

                {markers.filter(m => m && m.id).map((marker) => (
                    <DraggableMarker
                        key={marker.id}
                        marker={marker}
                        getCoords={getCoords}
                        polygonData={polygonData}
                        onMarkerClick={onMarkerClick}
                        onEditProject={onEditProject} // NEW
                        renderPopup={renderPopup}
                        candidates={candidates}
                    />
                ))}
            </MapContainer>

            <style jsx global>{`
                .map-wrapper {
                    height: 100%;
                    width: 100%;
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    border: 1px solid var(--border);
                    z-index: 1;
                }
                
                .leaflet-container {
                    height: 100%;
                    width: 100%;
                    background: #0f172a;
                }

                .custom-popup {
                    font-family: var(--font-sans);
                    min-width: 200px;
                }

                .status-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    margin-top: 4px;
                    text-transform: uppercase;
                }
                
                .status-badge.active { background: #dbeafe; color: #1e40af; }
                .status-badge.planning { background: #fef3c7; color: #92400e; }
                .status-badge.tender { background: #f3e8ff; color: #6b21a8; }
                .status-badge.on_job { background: #fee2e2; color: #dc2626; }
                .status-badge.available { background: #d1fae5; color: #047857; }
                .status-badge.construction { background: #e0f2fe; color: #0369a1; }

                /* Candidate List in Popup */
                .popup-candidates {
                    margin-top: 10px;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 8px;
                }
                .popup-candidates h4 {
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    margin: 0 0 6px 0;
                    text-transform: uppercase;
                }
                .p-candidate-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 6px;
                    background: #f8fafc;
                    border-radius: 4px;
                    margin-bottom: 4px;
                    border: 1px solid #f1f5f9;
                }
                .p-avatar {
                    width: 20px;
                    height: 20px;
                    background: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    font-size: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                .p-info {
                    flex: 1;
                    line-height: 1.1;
                }
                .p-name {
                    font-size: 11px;
                    font-weight: 600;
                    color: #334155;
                    display: block;
                }
                .p-role {
                    font-size: 9px;
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}

function DraggableMarker({ marker, getCoords, polygonData, onMarkerClick, onEditProject, renderPopup, candidates = [] }) {
    const position = getCoords(marker);
    let isInside = false;
    let color = marker.color || 'blue';

    if (polygonData && marker.type !== 'project' && position[0] != null && position[1] != null) {
        const pt = point([position[1], position[0]]); // Turf expects [lng, lat]
        isInside = polygonData.features ?
            polygonData.features.some(feature => booleanPointInPolygon(pt, feature)) :
            booleanPointInPolygon(pt, polygonData);
        color = isInside ? 'green' : 'gold';
        if (marker.status?.toLowerCase() === 'on_job' || marker.status?.toLowerCase() === 'unavailable') {
            color = 'red';
        }
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: marker.id,
        disabled: marker.type === 'project',
        data: marker
    });

    const markerRef = React.useRef(null);

    // Sync DnD ref with Leaflet DOM
    React.useEffect(() => {
        if (markerRef.current) {
            const iconElement = markerRef.current.getElement();
            if (iconElement) {
                setNodeRef(iconElement);
            }
        }
    }, [setNodeRef]);

    // Apply listeners to the icon element for drag initiation
    React.useEffect(() => {
        if (markerRef.current) {
            const iconElement = markerRef.current.getElement();
            if (iconElement && listeners) {
                Object.keys(listeners).forEach(key => {
                    const eventName = key.toLowerCase().replace('on', '');
                    iconElement.addEventListener(eventName, listeners[key]);
                });
                return () => {
                    Object.keys(listeners).forEach(key => {
                        const eventName = key.toLowerCase().replace('on', '');
                        iconElement.removeEventListener(eventName, listeners[key]);
                    });
                };
            }
        }
    }, [listeners]);

    // Use a custom div icon to allow styling and draggability
    const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="marker-pin ${color} ${isDragging ? 'dragging' : ''}" style="
                background: ${color === 'green' ? '#10b981' : color === 'gold' ? '#fbbf24' : color === 'red' ? '#ef4444' : '#3b82f6'};
                width: 20px;
                height: 20px;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                cursor: grab;
            "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const assignedCandidates = React.useMemo(() => {
        if (marker.type !== 'project') return [];
        return candidates.filter(c => c.projectId === marker.id && c.status === 'on_job');
    }, [candidates, marker.id, marker.type]);

    return (
        <Marker
            ref={markerRef}
            position={position}
            icon={icon}
            eventHandlers={{
                click: (e) => {
                    if (isDragging) return;
                    onMarkerClick && onMarkerClick(marker);
                },
            }}
        >
            <Popup>
                {renderPopup ? renderPopup(marker, { isInside }) : (
                    <div className="custom-popup">
                        <div className="flex justify-between items-start mb-1">
                            <strong>{marker.name}</strong>
                            {marker.type === 'candidate' && polygonData && (
                                <span className={`text-[10px] font-bold px-1 rounded ${isInside ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {isInside ? 'LOCAL' : 'MARGIN RISK'}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">{marker.client || (marker.type === 'candidate' ? marker.status : '')}</span>
                        <div className="flex gap-2 items-center">
                            <span className={`status-badge ${(marker.status || 'Planning').toLowerCase()}`}>
                                {marker.status || 'Planning'}
                            </span>
                            {marker.type === 'project' && assignedCandidates.length > 0 && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                    {assignedCandidates.length} Active
                                </span>
                            )}
                        </div>

                        {/* Project Candidates List */}
                        {marker.type === 'project' && assignedCandidates.length > 0 && (
                            <div className="popup-candidates">
                                <h4>Deployed Crew</h4>
                                {assignedCandidates.map(c => (
                                    <div key={c.id} className="p-candidate-row">
                                        <div className="p-avatar">
                                            {c.firstName?.[0]}{c.lastName?.[0]}
                                        </div>
                                        <div className="p-info">
                                            <span className="p-name">{c.firstName} {c.lastName}</span>
                                            <span className="p-role">{c.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Project Action Button */}
                        {marker.type === 'project' && (
                            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onEditProject) onEditProject(marker);
                                    }}
                                    style={{
                                        width: '100%',
                                        background: '#0f172a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '6px',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Open Project Console <ExternalLink size={10} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Popup>
        </Marker>
    );
}
