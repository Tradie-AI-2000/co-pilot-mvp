"use client";

import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import('./real-map.js'), {
    ssr: false,
    loading: () => (
        <div className="map-loading">
            <div className="spinner"></div>
            <span>Loading Map Intelligence...</span>
            <style jsx>{`
                .map-loading {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a;
                    color: var(--text-muted);
                    gap: 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }
                .spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary);
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
});

export default function GeospatialMap(props) {
    return <RealMap {...props} />;
}
