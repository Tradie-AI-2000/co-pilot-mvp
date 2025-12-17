"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function RealMap({ markers = [], onMarkerClick, activeMarkerId, renderPopup, getMarkerIcon }) {
    // Default center (Auckland)
    const defaultCenter = [-36.8485, 174.7633];

    // Safe coordinate accessor
    const getCoords = (m) => {
        if (m.coordinates && typeof m.coordinates.lat !== 'undefined') return [m.coordinates.lat, m.coordinates.lng];
        if (typeof m.lat !== 'undefined') return [m.lat, m.lng];
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

                {markers.map((marker) => {
                    let icon = defaultIcon;
                    if (marker.color) {
                        icon = new L.Icon({
                            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${marker.color}.png`,
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                    }
                    if (getMarkerIcon) {
                        icon = getMarkerIcon(marker);
                    }

                    const position = getCoords(marker);
                    return (
                        <Marker
                            key={marker.id}
                            position={position}
                            icon={icon}
                            eventHandlers={{
                                click: () => onMarkerClick && onMarkerClick(marker),
                            }}
                        >
                            <Popup>
                                {renderPopup ? renderPopup(marker) : (
                                    <div className="custom-popup">
                                        <strong>{marker.name}</strong>
                                        <br />
                                        <span className="text-xs text-gray-500">{marker.client}</span>
                                        <br />
                                        <span className={`status-badge ${(marker.status || 'Planning').toLowerCase()}`}>
                                            {marker.status || 'Planning'}
                                        </span>
                                    </div>
                                )}
                            </Popup>
                        </Marker>
                    );
                })}
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
            `}</style>
        </div>
    );
}
