'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { ActiveTimer } from '@/types/admin';

interface TopNavbarProps {
    pageTitle: string;
    onOpenSearch: () => void;
    onOpenTask: () => void;
    activeTimer: ActiveTimer | null;
    onUpdateTimer: (timer: ActiveTimer | null) => void;
}

const MOCK_NOTIFICATIONS = [
    { id: 1, text: "Sofia R. commented on Fintech Dashboard", time: "2m ago", unread: true },
    { id: 2, text: "New lead assigned: TechFlow Inc", time: "1h ago", unread: true },
    { id: 3, text: "Weekly Report is ready for review", time: "3h ago", unread: false },
    { id: 4, text: "Lucas completed 'API Schema'", time: "Yesterday", unread: false },
];

export const TopNavbar: React.FC<TopNavbarProps> = ({ pageTitle, onOpenSearch, onOpenTask, activeTimer, onUpdateTimer }) => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [timeStr, setTimeStr] = useState('00:00:00');
    const notifRef = useRef<HTMLDivElement>(null);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTimer) {
            interval = setInterval(() => {
                const seconds = activeTimer.seconds;
                const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
                const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                const s = (seconds % 60).toString().padStart(2, '0');
                setTimeStr(`${h}:${m}:${s}`);
            }, 1000);
        } else {
            setTimeStr('00:00:00');
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    const stopTimer = () => {
        onUpdateTimer(null);
    };

    // Close notifications on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

    return (
        <header className="sticky top-0 z-40 w-full pl-4 md:pl-0 pr-4 pt-4 pb-2 pointer-events-none">
            <div className="flex items-center justify-between h-16 px-0 transition-all duration-300">

                {/* Left: Search Bar */}
                <div className="flex-1 flex items-center max-w-xl pointer-events-auto md:ml-0">
                    <div
                        onClick={onOpenSearch}
                        className="group relative w-full max-w-[200px] lg:max-w-sm flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl cursor-text transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white/80 dark:hover:bg-zinc-900/80"
                    >
                        <Icons.Search size={14} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Search...</span>
                    </div>
                </div>

                {/* Center: PAGE TITLE (Absolute Center for Fidelity) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
                    {activeTimer ? (
                        <div className="flex items-center gap-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full shadow-2xl border border-zinc-700/50 dark:border-zinc-200 animate-in zoom-in-95 duration-300 group pointer-events-auto">
                            <div className="flex items-center gap-2 border-r border-white/10 dark:border-zinc-300 pr-4">
                                <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`}></div>
                                <span className="text-xs font-bold w-32 truncate uppercase tracking-tighter">{activeTimer.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-black text-sm tracking-tighter w-20 text-center">{timeStr}</span>
                                <button onClick={stopTimer} className="p-1.5 hover:bg-rose-500 text-zinc-400 hover:text-white rounded-full transition-all">
                                    <Icons.Close size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:block text-sm font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.4em] select-none">
                            {pageTitle}
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex-1 flex items-center justify-end gap-3 pointer-events-auto">

                    {/* Create Task Button */}
                    <button
                        onClick={onOpenTask}
                        className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-full text-xs font-black uppercase tracking-wider transition-all backdrop-blur-md shadow-sm hover:shadow border border-rose-100/50 dark:border-rose-900/50"
                    >
                        <div className="p-0.5 bg-rose-200 dark:bg-rose-800 rounded-full"><Icons.Plus size={12} /></div>
                        <span className="pr-1">New Task</span>
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="relative p-2.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all shadow-sm"
                        >
                            <Icons.Mail size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-black rounded-full"></span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute right-0 top-full mt-3 w-80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="px-6 py-4 border-b border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Broadcasts</span>
                                    <button className="text-[10px] uppercase font-black text-indigo-500">Read All</button>
                                </div>
                                <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                                    {MOCK_NOTIFICATIONS.map(notif => (
                                        <div key={notif.id} className={`px-6 py-4 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer flex gap-4 ${notif.unread ? 'bg-indigo-50/20 dark:bg-indigo-500/5' : ''}`}>
                                            <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${notif.unread ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-zinc-200 dark:bg-zinc-700'}`}></div>
                                            <div>
                                                <p className={`text-xs leading-relaxed ${notif.unread ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                                    {notif.text}
                                                </p>
                                                <span className="text-[9px] text-zinc-400 uppercase font-black mt-1.5 block">{notif.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center border-t border-zinc-50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <button className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">View Archive</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Create Task (Only icon) */}
                    <button
                        onClick={onOpenTask}
                        className="md:hidden p-3 bg-rose-500 text-white rounded-full shadow-lg"
                    >
                        <Icons.Plus size={20} />
                    </button>

                </div>
            </div>
        </header>
    );
};
