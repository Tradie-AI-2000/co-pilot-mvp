"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';

const CrewContext = createContext();

export function CrewProvider({ children }) {
    const [draftSquad, setDraftSquad] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const addCandidateToSquad = (candidate) => {
        setDraftSquad((prev) => {
            if (prev.find((c) => c.id === candidate.id)) return prev;
            return [...prev, candidate];
        });
    };

    const removeCandidateFromSquad = (candidateId) => {
        setDraftSquad((prev) => prev.filter((c) => c.id !== candidateId));
    };

    const clearSquad = () => setDraftSquad([]);

    // Derived Metrics
    const metrics = useMemo(() => {
        const headcount = draftSquad.length;
        const totalCost = draftSquad.reduce((sum, c) => {
            // Extract numeric value from chargeOutRate (e.g. "$65/hr" -> 65)
            const rate = parseFloat(String(c.chargeOutRate || 0).replace(/[^0-9.]/g, '')) || 0;
            return sum + rate;
        }, 0);

        return {
            headcount,
            totalCost: `$${totalCost.toFixed(2)}/hr`
        };
    }, [draftSquad]);

    const [isDeploying, setIsDeploying] = useState(false);
    const [deployedData, setDeployedData] = useState(null);

    const validateCompliance = () => {
        const nonCompliant = draftSquad.filter(c => !c.tickets?.includes('Site Safe'));
        return {
            isValid: nonCompliant.length === 0,
            nonCompliant
        };
    };

    const deploySquad = async (project, groupName) => {
        const compliance = validateCompliance();
        if (!compliance.isValid) {
            throw new Error(`Compliance Blocked: ${compliance.nonCompliant.length} members missing Site Safe.`);
        }

        if (!project || !groupName || draftSquad.length === 0) {
            console.error('Invalid deployment parameters');
            return;
        }

        setIsDeploying(true);
        try {
            const response = await fetch('/api/crews/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project.id,
                    groupName,
                    candidateIds: draftSquad.map((c) => c.id)
                })
            });

            const data = await response.json();

            if (data.success) {
                setDeployedData({
                    groupId: data.groupId,
                    squad: [...draftSquad],
                    project: project
                });
                clearSquad();
                return data.groupId;
            } else {
                throw new Error(data.error || 'Failed to deploy');
            }
        } catch (error) {
            console.error('Deployment error:', error);
            throw error;
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <CrewContext.Provider value={{
            draftSquad,
            isPanelOpen,
            setIsPanelOpen,
            addCandidateToSquad,
            removeCandidateFromSquad,
            clearSquad,
            deploySquad,
            validateCompliance,
            isDeploying,
            deployedData,
            setDeployedData,
            metrics
        }}>
            {children}
        </CrewContext.Provider>
    );
}

export function useCrew() {
    const context = useContext(CrewContext);
    if (!context) {
        throw new Error('useCrew must be used within a CrewProvider');
    }
    return context;
}
