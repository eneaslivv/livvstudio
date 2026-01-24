'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppMode, ActiveTimer } from '@/types/admin';

interface AdminContextType {
    currentMode: AppMode;
    setCurrentMode: (mode: AppMode) => void;
    activeTimer: ActiveTimer | null;
    startTimer: (id: string, title: string, type: 'project' | 'task') => void;
    stopTimer: () => void;
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: (expanded: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [currentMode, setCurrentMode] = useState<AppMode>('os');
    const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebarExpanded');
        if (saved !== null) {
            setIsSidebarExpanded(saved === 'true');
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarExpanded', String(isSidebarExpanded));
    }, [isSidebarExpanded]);

    // Sync timer with local storage or backend if needed
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTimer) {
            interval = setInterval(() => {
                setActiveTimer(prev => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    const startTimer = (id: string, title: string, type: 'project' | 'task') => {
        setActiveTimer({ id, title, type, seconds: 0 });
    };

    const stopTimer = () => {
        setActiveTimer(null);
    };

    return (
        <AdminContext.Provider value={{
            currentMode,
            setCurrentMode,
            activeTimer,
            startTimer,
            stopTimer,
            isSidebarExpanded,
            setIsSidebarExpanded
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) throw new Error('useAdmin must be used within an AdminProvider');
    return context;
}
