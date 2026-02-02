import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => {
            const { initial, animate, transition, ...rest } = props;
            return <div {...rest}>{children}</div>;
        },
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Zustand stores
vi.mock('./stores/settings', () => ({
    useSettingsStore: () => ({
        isDarkMode: false,
        toggleDarkMode: vi.fn(),
        toggleHelp: vi.fn(),
        applyTheme: vi.fn(),
    }),
}));

describe('MemeLab Meme Generator', () => {
    it('renders without crashing', () => {
        const { container } = render(<App />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders header with correct elements', () => {
        render(<App />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getAllByText(/Meme/i)).toBeTruthy();
        expect(screen.getAllByText(/Lab/i)).toBeTruthy();
    });

    it('renders hero section with title', () => {
        render(<App />);
        expect(screen.getByText(/Create Memes that Go Viral/i)).toBeInTheDocument();
        expect(screen.getByText(/Professional Meme Maker/i)).toBeInTheDocument();
    });

    it('renders action buttons', () => {
        render(<App />);
        expect(screen.getByRole('button', { name: /Open help panel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument();
    });

    it('has proper ARIA labels for accessibility', () => {
        render(<App />);
        expect(screen.getByRole('application', { name: /MemeLab Meme Generator/i })).toBeInTheDocument();
        expect(screen.getByRole('main', { name: /Meme generator workspace/i })).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders footer with links', () => {
        render(<App />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByText(/MemeLab v1.0.0/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Privacy/i)).toBeTruthy();
        expect(screen.getAllByText(/API/i)).toBeTruthy();
        expect(screen.getAllByText(/Templates/i)).toBeTruthy();
    });

    it('renders copyright information', () => {
        render(<App />);
        expect(screen.getByText(/2026 MK-STUDIOS/i)).toBeInTheDocument();
    });
});
