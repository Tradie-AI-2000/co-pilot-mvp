import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatCard from '../../components/stat-card.js';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ArrowUpRight: () => React.createElement('span', { 'data-testid': 'arrow-up' }),
    ArrowDownRight: () => React.createElement('span', { 'data-testid': 'arrow-down' })
}));

describe('StatCard', () => {
    it('renders title and value correctly', () => {
        render(<StatCard title="Total Revenue" value="$50,000" />);
        expect(screen.getByText('Total Revenue')).toBeDefined();
        expect(screen.getByText('$50,000')).toBeDefined();
    });

    it('renders trend icon for "up"', () => {
        render(<StatCard title="Growth" value="10%" trend="up" subtext="vs last month" />);
        expect(screen.getByTestId('arrow-up')).toBeDefined();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<StatCard title="Click Me" value="100" onClick={handleClick} />);
        
        // Find the card wrapper (it has the class stat-card)
        // Since we can't easily query by class in testing-library without adding test id, 
        // we'll add a data-testid to the component or find by role if appropriate.
        // Here we just find by text and traverse up.
        const card = screen.getByText('Click Me').closest('.stat-card');
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders progress chart when progress is provided', () => {
        render(<StatCard title="Progress" value="50%" progress={75} />);
        expect(screen.getByText('75%')).toBeDefined();
    });
});