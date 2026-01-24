
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './ui/Icons';
import { ActiveTimer } from '../types';

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
      let interval: any;
      if (activeTimer?.isRunning) {
          interval = setInterval(() => {
              const seconds = Math.floor((Date.now() - activeTimer.startTime) / 1000) + activeTimer.elapsedSeconds;
              const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
              const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
              const s = (seconds % 60).toString().padStart(2, '0');
              setTimeStr(`${h}:${m}:${s}`);
          }, 1000);
      } else if (!activeTimer) {
          setTimeStr('00:00:00');
      }
      return () => clearInterval(interval);
  }, [activeTimer]);

  const togglePause = () => {
      if (!activeTimer) return;
      if (activeTimer.isRunning) {
          const newElapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000) + activeTimer.elapsedSeconds;
          onUpdateTimer({ ...activeTimer, isRunning: false, elapsedSeconds: newElapsed });
      } else {
          onUpdateTimer({ ...activeTimer, isRunning: true, startTime: Date.now() });
      }
  };

  const stopTimer = () => {
      onUpdateTimer(null);
  };

  const handleEditTitle = (newTitle: string) => {
      if (activeTimer) {
          onUpdateTimer({ ...activeTimer, title: newTitle });
      }
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
        <div className="flex-1 flex items-center max-w-xl pointer-events-auto md:ml-6">
            <div 
                onClick={onOpenSearch}
                className="group relative w-full max-w-[200px] lg:max-w-sm flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl cursor-text transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white/80 dark:hover:bg-zinc-900/80"
            >
                <Icons.Search size={14} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Search...</span>
            </div>
        </div>

        {/* Center: ACTIVE TIMER WIDGET */}
        <div className="flex-[2] flex justify-center pointer-events-auto">
            {activeTimer ? (
                <div className="flex items-center gap-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full shadow-2xl border border-zinc-700/50 dark:border-zinc-200 animate-in zoom-in-95 duration-300 group">
                    <div className="flex items-center gap-2 border-r border-white/10 dark:border-zinc-300 pr-4">
                        <div className={`w-2 h-2 rounded-full ${activeTimer.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></div>
                        <input 
                            type="text" 
                            value={activeTimer.title}
                            onChange={(e) => handleEditTitle(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold w-32 truncate placeholder:text-zinc-500"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="font-mono font-black text-sm tracking-tighter w-20 text-center">{timeStr}</span>
                        
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={togglePause}
                                className="p-1.5 hover:bg-white/10 dark:hover:bg-zinc-200 rounded-full transition-colors"
                            >
                                {activeTimer.isRunning ? <Icons.Clock size={16} /> : <Icons.Zap size={16} />}
                            </button>
                            <button 
                                onClick={stopTimer}
                                className="p-1.5 hover:bg-rose-500 text-zinc-400 hover:text-white rounded-full transition-all"
                            >
                                <Icons.Close size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden lg:block text-sm font-bold text-zinc-400/50 uppercase tracking-widest pointer-events-none select-none">
                    {pageTitle === 'home' ? 'Dashboard' : pageTitle.replace('_', ' ')}
                </div>
            )}
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-3 pointer-events-auto">
            
            {/* Create Task Button */}
            <button 
                onClick={onOpenTask}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-md shadow-sm hover:shadow border border-rose-100/50 dark:border-rose-900/50"
            >
                <div className="p-0.5 bg-rose-200 dark:bg-rose-800 rounded-full"><Icons.Plus size={12}/></div>
                <span className="pr-1">New Task</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all shadow-sm hover:shadow-md"
                >
                    <Icons.Message size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
                    )}
                </button>

                {/* Dropdown */}
                {isNotifOpen && (
                    <div className="absolute right-0 top-full mt-3 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
                            <button className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">Mark all read</button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {MOCK_NOTIFICATIONS.map(notif => (
                                <div key={notif.id} className={`px-4 py-3 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.unread ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                                    <div>
                                        <p className={`text-sm leading-snug ${notif.unread ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                            {notif.text}
                                        </p>
                                        <span className="text-[10px] text-zinc-400 mt-1 block">{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 text-center border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">View Activity Feed</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Create Task (Only icon) */}
            <button 
                onClick={onOpenTask}
                className="md:hidden p-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all hover:scale-105 active:scale-95"
            >
                <Icons.Plus size={20}/>
            </button>

        </div>
      </div>
    </header>
  );
};
