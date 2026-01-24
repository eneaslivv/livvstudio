
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './ui/Icons';
import { PageView, AppMode, Priority, ActiveTimer } from '../types';
import { TopNavbar } from './TopNavbar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageView;
  currentMode: AppMode;
  onNavigate: (page: PageView) => void;
  onSwitchMode: (mode: AppMode) => void;
  activeTimer: ActiveTimer | null;
  onUpdateTimer: (timer: ActiveTimer | null) => void;
}

// Define color themes for each navigation item
const NAV_THEMES: Record<string, string> = {
  home: 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  projects: 'hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400',
  clients: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400',
  calendar: 'hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-500/10 dark:hover:text-orange-400',
  activity: 'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400',
  docs: 'hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400',
  sales_dashboard: 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  sales_leads: 'hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-500/10 dark:hover:text-purple-400',
  sales_analytics: 'hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-500/10 dark:hover:text-sky-400',
  finance: 'hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-400',
  configuration: 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
};

const ACTIVE_THEMES: Record<string, string> = {
  home: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm', 
  projects: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 shadow-sm',
  clients: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-300 shadow-sm',
  calendar: 'bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-300 shadow-sm',
  activity: 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm',
  docs: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm',
  sales_dashboard: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm',
  sales_leads: 'bg-purple-100 text-purple-900 dark:bg-purple-500/20 dark:text-purple-300 shadow-sm',
  sales_analytics: 'bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-300 shadow-sm',
  finance: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 shadow-sm',
  configuration: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm',
};

const NavItem: React.FC<{ 
  id: string;
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
  expanded: boolean;
  onClick: () => void 
}> = ({ id, icon, label, active, expanded, onClick }) => {
  const themeClass = active 
    ? ACTIVE_THEMES[id] || ACTIVE_THEMES.home
    : `text-zinc-500 dark:text-zinc-400 ${NAV_THEMES[id] || NAV_THEMES.home}`;

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center w-[calc(100%-24px)] mx-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group/item shrink-0 ${themeClass}`}
      title={!expanded ? label : undefined}
    >
      <div className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform duration-200 group-hover/item:scale-110">
        {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-2 w-0'}`}>
        {label}
      </span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, currentMode, onNavigate, onSwitchMode, activeTimer, onUpdateTimer }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => localStorage.getItem('sidebarExpanded') === 'true');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', String(isSidebarExpanded));
  }, [isSidebarExpanded]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const navItems = currentMode === 'os' ? [
    { id: 'home', label: 'Home', icon: <Icons.Home /> },
    { id: 'projects', label: 'Projects', icon: <Icons.Briefcase /> },
    { id: 'clients', label: 'Team', icon: <Icons.Users /> },
    { id: 'calendar', label: 'Calendar', icon: <Icons.Calendar /> },
    { id: 'activity', label: 'Activity', icon: <Icons.Activity /> },
    { id: 'docs', label: 'Docs', icon: <Icons.Docs /> },
  ] : [
    { id: 'sales_dashboard', label: 'Sales Overview', icon: <Icons.Chart /> },
    { id: 'sales_leads', label: 'Leads Inbox', icon: <Icons.Mail /> },
    { id: 'sales_analytics', label: 'Analytics', icon: <Icons.Activity /> },
    { id: 'finance', label: 'Finance & ROI', icon: <Icons.Target /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex overflow-hidden">
      <aside className={`fixed z-50 h-[calc(100vh-32px)] top-4 bottom-4 left-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-[2rem] flex flex-col py-6 transition-all duration-500 ${isSidebarExpanded ? 'w-[240px]' : 'w-[72px]'}`}>
        
        {/* Mode Switcher */}
        <div className="px-3 mb-6 shrink-0">
          <button 
            onClick={() => onSwitchMode(currentMode === 'os' ? 'sales' : 'os')}
            className={`w-full h-11 flex items-center p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden`}
          >
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ${currentMode === 'os' ? 'left-1' : 'left-[50%]'}`}></div>
            <div className="relative z-10 flex-1 flex justify-center text-zinc-500 dark:text-zinc-400"><Icons.Home size={16} className={currentMode === 'os' ? 'text-zinc-900 dark:text-zinc-100' : ''}/></div>
            <div className="relative z-10 flex-1 flex justify-center text-zinc-500 dark:text-zinc-400"><Icons.Chart size={16} className={currentMode === 'sales' ? 'text-zinc-900 dark:text-zinc-100' : ''}/></div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full flex flex-col gap-1 overflow-y-auto no-scrollbar items-center">
          {navItems.map(item => (
            <NavItem 
              key={item.id} id={item.id} icon={item.icon} label={item.label} 
              active={currentPage === item.id} expanded={isSidebarExpanded} 
              onClick={() => onNavigate(item.id as PageView)}
            />
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="w-full flex flex-col gap-1 shrink-0 mt-4 items-center">
          <button onClick={toggleTheme} className="w-[calc(100%-24px)] mx-3 px-3 py-2.5 rounded-2xl text-zinc-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors flex items-center">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">{isDarkMode ? <Icons.Sun size={20}/> : <Icons.Moon size={20}/>}</div>
            <span className={`ml-3 text-sm font-medium transition-all ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>Theme</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative w-full px-3" ref={userMenuRef}>
            <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`w-full flex items-center px-3 py-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all ${isSidebarExpanded ? 'justify-start' : 'justify-center'}`}
            >
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=Eneas" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 shrink-0" alt="Eneas" />
              <div className={`ml-3 text-left transition-all ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Eneas</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Administrator</div>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className={`absolute bottom-full left-4 mb-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in slide-in-from-bottom-2 duration-200`}>
                <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 text-xs">E</div>
                    <div>
                        <div className="text-xs font-bold">Eneas OS</div>
                        <div className="text-[9px] text-zinc-400">admin@eneas.io</div>
                    </div>
                </div>
                <div className="p-1.5">
                    <button className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2">
                        <Icons.User size={14}/> Profile Settings
                    </button>
                    <button 
                        onClick={() => { onNavigate('configuration'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                    >
                        <Icons.Settings size={14}/> Configuration
                    </button>
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2"></div>
                    <button className="w-full text-left px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center gap-2">
                        <Icons.Close size={14}/> Sign Out
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

      <main className={`flex-1 h-screen overflow-y-auto relative transition-all duration-500 ${isSidebarExpanded ? 'md:ml-[256px]' : 'md:ml-[88px]'}`}>
        <TopNavbar 
          pageTitle={currentPage} 
          onOpenSearch={() => {}} 
          onOpenTask={() => {}} 
          activeTimer={activeTimer}
          onUpdateTimer={onUpdateTimer}
        />
        <div className="px-4 md:px-8 pb-8 w-full max-w-[1600px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
