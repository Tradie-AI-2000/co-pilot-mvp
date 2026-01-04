"use client";

import React from 'react';
import { DataProvider } from "../context/data-context.js";
import { CrewProvider } from "../context/crew-context.js";
import DndWrapper from "./dnd-wrapper.js";

/**
 * ClientProviders wraps the application with all necessary context providers.
 * Must be a client component because it uses context hooks.
 */
export default function ClientProviders({ children }) {
    return (
        <DataProvider>
            <CrewProvider>
                <DndWrapper>
                    {children}
                </DndWrapper>
            </CrewProvider>
        </DataProvider>
    );
}
