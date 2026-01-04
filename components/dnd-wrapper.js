"use client";

import React, { useState } from 'react';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import { useCrew } from '../context/crew-context.js';
import { useData } from '../context/data-context.js';

/**
 * DndWrapper provides a global DndContext for the application.
 * It handles the common drag-and-drop logic for candidates.
 */
export default function DndWrapper({ children }) {
    const { candidates } = useData();
    const { addCandidateToSquad } = useCrew();
    const [activeCandidate, setActiveCandidate] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        const candidate = candidates?.find(c => c.id === active.id);
        if (candidate) {
            setActiveCandidate(candidate);
        }
    };

    const handleDragEnd = (event) => {
        const { over, active } = event;
        setActiveCandidate(null);

        if (over && (over.id === 'crew-builder-drop-zone' || over.id.startsWith('slot-'))) {
            const candidate = candidates?.find(c => c.id === active.id);
            if (candidate) {
                addCandidateToSquad(candidate);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {children}
            <DragOverlay zIndex={10000}>
                {activeCandidate ? (
                    <div className="marker-pin green dragging-overlay" style={{
                        background: '#10b981',
                        width: '24px',
                        height: '24px',
                        border: '2px solid white',
                        borderRadius: '50%',
                        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                        transform: 'scale(1.2)'
                    }} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
