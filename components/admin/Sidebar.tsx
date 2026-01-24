'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from './Icons';
import { AppMode } from '@/types/admin';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase/client';
import { useAdmin } from '@/context/AdminContext';

interface SidebarProps {
    currentMode: AppMode;
    onSwitchMode: (mode: AppMode) => void;
}

const NAV_THEMES: Record<string, string> = {
    home: 'hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    projects: 'hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400',
    clients: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400',
    calendar: 'hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-500/10 dark:hover:text-orange-400',
    activity: 'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400',
    docs: 'hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400',
    settings: 'hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    sales_dashboard: 'hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
    inbox: 'hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-500/10 dark:hover:text-purple-400',
    crm: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400',
    sales_analytics: 'hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-500/10 dark:hover:text-sky-400',
    finance: 'hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-400',
};

const ACTIVE_THEMES: Record<string, string> = {
    home: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm',
    projects: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 shadow-sm',
    clients: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-300 shadow-sm',
    calendar: 'bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-300 shadow-sm',
    activity: 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm',
    docs: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm',
    settings: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm',
    sales_dashboard: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm',
    inbox: 'bg-purple-100 text-purple-900 dark:bg-purple-500/20 dark:text-purple-300 shadow-sm',
    crm: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-300 shadow-sm',
    sales_analytics: 'bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-300 shadow-sm',
    finance: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 shadow-sm',
};

const NavItem: React.FC<{
    id: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    expanded: boolean;
    href: string;
}> = ({ id, icon, label, active, expanded, href }) => {
    const activeColors: Record<string, string> = {
        home: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        projects: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        clients: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        calendar: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
        activity: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
        docs: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
        settings: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        sales_dashboard: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        inbox: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
        crm: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        sales_analytics: 'bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
        finance: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    };

    const currentActiveColor = activeColors[id] || activeColors.home;
    const hoverClass = !active ? (NAV_THEMES[id] || NAV_THEMES.home) : '';

    return (
        <Link
            href={href}
            className={`relative flex items-center h-12 w-full transition-all duration-300 group/item shrink-0 ${expanded ? 'px-4' : 'justify-center'} ${hoverClass}`}
            title={!expanded ? label : undefined}
        >
            <div className={`flex items-center justify-center w-10 min-w-[40px] h-10 rounded-full transition-all duration-300 ${active ? currentActiveColor : 'text-zinc-400 group-hover/item:text-current'}`}>
                {React.cloneElement(icon as any, { size: 20, strokeWidth: active ? 2.5 : 2 })}
            </div>
            <span className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-500 ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {label}
            </span>
            {active && expanded && (
                <div className="absolute right-0 h-8 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-l-full"></div>
            )}
        </Link>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onSwitchMode }) => {
    const { isSidebarExpanded, setIsSidebarExpanded } = useAdmin();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = currentMode === 'os' ? [
        { id: 'home', label: 'Home', icon: <Icons.Home />, href: '/admin/dashboard' },
        { id: 'projects', label: 'Projects', icon: <Icons.Briefcase />, href: '/admin/projects' },
        { id: 'clients', label: 'Team', icon: <Icons.Users />, href: '/admin/clients' },
        { id: 'calendar', label: 'Calendar', icon: <Icons.Calendar />, href: '/admin/calendar' },
        { id: 'activity', label: 'Activity', icon: <Icons.Activity />, href: '/admin/activity' },
        { id: 'docs', label: 'Docs', icon: <Icons.Docs />, href: '/admin/docs' },
    ] : [
        { id: 'sales_dashboard', label: 'Sales Overview', icon: <Icons.Chart />, href: '/admin/sales' },
        { id: 'inbox', label: 'Leads Inbox', icon: <Icons.Mail />, href: '/admin/inbox' },
        { id: 'sales_analytics', label: 'Analytics', icon: <Icons.Activity />, href: '/admin/analytics' },
        { id: 'finance', label: 'Finance & ROI', icon: <Icons.Target />, href: '/admin/finance' },
    ];

    const currentActiveId = navItems.find(item => pathname.startsWith(item.href))?.id || 'home';

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/portal/login');
    };

    return (
        <aside className={`fixed z-50 h-[calc(100vh-32px)] top-4 bottom-4 left-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-[2rem] flex flex-col py-6 transition-all duration-500 ${isSidebarExpanded ? 'w-[240px]' : 'w-[72px]'}`}>

            {/* Logo */}
            <div className="px-3 mb-6 shrink-0 flex justify-center">
                <img
                    src="/livv-logo-light.png"
                    alt="Livv"
                    className="h-8 w-auto invert dark:invert-0 transition-all duration-300"
                />
            </div>

            {/* Mode Switcher */}
            <div className="px-3 mb-8 shrink-0">
                <button
                    onClick={() => onSwitchMode(currentMode === 'os' ? 'sales' : 'os')}
                    className={`w-full h-11 flex items-center p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden`}
                >
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-800 rounded-full shadow-lg transition-all duration-300 ${currentMode === 'os' ? 'left-1' : 'left-[50%]'}`}></div>
                    <div className="relative z-10 flex-1 flex justify-center text-zinc-400 dark:text-zinc-500"><Icons.Home size={16} className={currentMode === 'os' ? 'text-zinc-900 dark:text-white' : ''} /></div>
                    <div className="relative z-10 flex-1 flex justify-center text-zinc-400 dark:text-zinc-500"><Icons.Chart size={16} className={currentMode === 'sales' ? 'text-zinc-900 dark:text-white' : ''} /></div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 w-full flex flex-col gap-1 overflow-y-auto no-scrollbar items-center">
                {navItems.map(item => (
                    <NavItem
                        key={item.id} id={item.id} icon={item.icon} label={item.label}
                        active={currentActiveId === item.id} expanded={isSidebarExpanded}
                        href={item.href}
                    />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="w-full flex flex-col gap-1 shrink-0 mt-4 items-center">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-[calc(100%-24px)] mx-3 px-3 py-2.5 rounded-2xl text-zinc-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">{theme === 'dark' ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}</div>
                    <span className={`ml-3 text-sm font-bold transition-all ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>Theme</span>
                </button>

                {/* User Profile Dropdown */}
                <div className="relative w-full px-3" ref={userMenuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`w-full flex items-center px-2 py-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all ${isSidebarExpanded ? 'justify-start' : 'justify-center border border-zinc-50 dark:border-zinc-800 shadow-sm'}`}
                    >
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-black text-xs shrink-0 shadow-lg">E</div>
                        <div className={`ml-3 text-left transition-all ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Eneas Livv</div>
                            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Administrator</div>
                        </div>
                    </button>

                    {isUserMenuOpen && (
                        <div className={`absolute bottom-full left-3 mb-3 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-2xl z-[60] overflow-hidden animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 flex items-center gap-3 bg-zinc-50/30 dark:bg-zinc-900/50">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-white text-[10px]">OS</div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 truncate">LIVV System</div>
                                    <div className="text-[9px] text-zinc-400 font-bold truncate">admin@eneas.io</div>
                                </div>
                            </div>
                            <div className="p-2 space-y-1">
                                <button onClick={() => router.push('/admin/settings')} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-3 transition-colors">
                                    <Icons.Settings size={14} /> Settings
                                </button>
                                <div className="h-px bg-zinc-50 dark:bg-zinc-800 mx-3 my-1"></div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <Icons.Close size={14} /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="w-full py-4 text-zinc-300 hover:text-zinc-500 transition-colors flex justify-center">
                    {isSidebarExpanded ? <Icons.ChevronLeft size={16} /> : <Icons.ChevronRight size={16} />}
                </button>
            </div>
        </aside>
    );
};

// Memo Sidebar to prevent unnecessary re-renders
export default React.memo(Sidebar);
