"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { booleanPointInPolygon, point } from '@turf/turf';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
    activeMarkerId,
    renderPopup,
    getMarkerIcon,
    polygonData = null
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
                        renderPopup={renderPopup}
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
                }

                .status-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    margin-top: 4px;
                }
                
                .status-badge.active { background: #dbeafe; color: #1e40af; }
                .status-badge.planning { background: #fef3c7; color: #92400e; }
                .status-badge.tender { background: #f3e8ff; color: #6b21a8; }
                .status-badge.on_job { background: #fee2e2; color: #dc2626; }
                .status-badge.available { background: #d1fae5; color: #047857; }
            `}</style>
        </div>
    );
}

function DraggableMarker({ marker, getCoords, polygonData, onMarkerClick, renderPopup }) {
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
                        <br />
                        <span className={`status-badge ${(marker.status || 'Planning').toLowerCase()}`}>
                            {marker.status || 'Planning'}
                        </span>
                    </div>
                )}
            </Popup>
        </Marker>
    );
}
