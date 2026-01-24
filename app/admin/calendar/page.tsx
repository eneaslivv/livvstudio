'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { CalendarTask, Project, Priority, Status, Collaborator, Subtask, Comment } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptTask, adaptProject } from '@/lib/admin-adapters';

// --- MOCK USERS ---
const MOCK_USERS: Collaborator[] = [
    { id: 'me', name: 'Eneas', role: 'Owner', avatarInitials: 'ME', status: 'online', pendingTasks: 0 },
    { id: 'sr', name: 'Sofia R.', role: 'Designer', avatarInitials: 'SR', status: 'online', pendingTasks: 3 },
    { id: 'lm', name: 'Lucas M.', role: 'Developer', avatarInitials: 'LM', status: 'busy', pendingTasks: 5 },
    { id: 'mt', name: 'Miguel T.', role: 'Frontend', avatarInitials: 'MT', status: 'offline', pendingTasks: 1 },
];

// --- DATE HELPERS ---
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const TODAY_MOCK = new Date().toISOString().split('T')[0];

const toDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const generateMonthDays = (year = CURRENT_YEAR, month = CURRENT_MONTH) => {
    const date = new Date(year, month, 1);
    const days = [];

    // Padding for days before start of month (assuming Sunday start)
    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null);
    }

    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    // Padding end of month
    while (days.length % 7 !== 0) {
        days.push(null);
    }

    return days;
};

const generateCurrentWeekDays = () => {
    const today = new Date(); // Use actual today for now, or stick to mock date? Using actual today
    const day = today.getDay(); // 0-6
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    // Assuming Mon start? Or Sun start? 
    // generateCurrentWeekDays in LIVV-os2 used hardcoded startDay=23. 
    // Let's make it dynamic based on current week.

    const monday = new Date(today.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    return days;
};

// --- STATS COMPONENT ---
const CalendarStats = ({ tasks }: { tasks: CalendarTask[] }) => {
    const stats = useMemo(() => {
        let active = 0;
        let delayed = 0;
        let pending = 0;
        let completed = 0;

        // Goals Logic (Weekly context)
        // Simplified week logic
        const now = new Date();
        const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
        const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        const weekStart = toDateKey(firstDay);
        const weekEnd = toDateKey(lastDay);

        let weeklyTotal = 0;
        let weeklyCompleted = 0;

        tasks.forEach(t => {
            if (t.completed) {
                completed++;
                if (t.endDate && t.endDate >= weekStart && t.endDate <= weekEnd) {
                    weeklyTotal++;
                    weeklyCompleted++;
                }
            } else {
                if (t.endDate && t.endDate < TODAY_MOCK) {
                    delayed++;
                } else if (t.startDate && t.startDate > TODAY_MOCK) {
                    pending++;
                } else {
                    active++;
                }

                if (t.endDate && t.endDate >= weekStart && t.endDate <= weekEnd) {
                    weeklyTotal++;
                }
            }
        });

        return { active, delayed, pending, completed, weeklyTotal, weeklyCompleted };
    }, [tasks]);

    const weeklyProgress = stats.weeklyTotal === 0 ? 0 : Math.round((stats.weeklyCompleted / stats.weeklyTotal) * 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Quick Stats Cards */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Now</div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.active}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Icons.Activity size={18} />
                </div>
            </div>

            <div className="p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 shadow-sm flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Delayed</div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.delayed}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-red-900/20 flex items-center justify-center text-red-500">
                    <Icons.Alert size={18} />
                </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Upcoming</div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.pending}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Icons.Calendar size={18} />
                </div>
            </div>

            {/* Goal Progress Card */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950 text-white shadow-sm flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <Icons.Target size={12} /> Weekly Goal
                        </div>
                        <div className="text-sm font-medium mt-0.5 text-zinc-200">{stats.weeklyCompleted} / {stats.weeklyTotal} Tasks</div>
                    </div>
                    <span className="text-xl font-bold">{weeklyProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${weeklyProgress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---
const CalendarTaskCard: React.FC<{
    task: CalendarTask;
    projects: Record<string, Project>;
    onClick: () => void;
    view?: 'week' | 'month';
    onDragStart: (e: React.DragEvent, task: CalendarTask) => void;
}> = ({ task, projects, onClick, view = 'week', onDragStart }) => {
    const project = task.projectId ? projects[task.projectId] : null;

    if (view === 'month') {
        return (
            <div
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className={`
                    group flex items-center gap-1.5 px-1.5 py-0.5 mb-1 rounded-[3px] text-[10px] font-medium cursor-pointer transition-all border border-transparent
                    ${task.completed ? 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 decoration-zinc-400' : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm'}
                `}
            >
                {project && <div className={`w-1 h-1 rounded-full ${project.color || 'bg-zinc-400'}`}></div>}
                <span className={`truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
            </div>
        );
    }

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onClick={onClick}
            className={`
                group relative p-2.5 rounded-lg border mb-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:-translate-y-0.5
                ${task.completed
                    ? 'opacity-60 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
                    : 'border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600'}
            `}
        >
            {project && <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${project.color || 'bg-zinc-400'}`}></div>}
            <div className="pl-2.5">
                <div className="flex justify-between items-start mb-0.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[80%]">{project?.title || 'No Project'}</span>
                    {task.priority === Priority.High && <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>}
                </div>
                <h4 className={`text-xs font-semibold leading-snug ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>{task.title}</h4>
                <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                        {task.startTime && <><Icons.Clock size={10} /> {task.startTime}</>}
                    </span>
                    {task.assignee && (
                        <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
                            {task.assignee.avatarInitials}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- SIDE PANEL ---
const TaskSidePanel = ({ task, projects, onClose, onUpdate, onDelete }: {
    task: CalendarTask,
    projects: Record<string, Project>,
    onClose: () => void,
    onUpdate: (id: string, updates: Partial<CalendarTask>) => void,
    onDelete: (id: string) => void
}) => {
    const project = task.projectId ? projects[task.projectId] : undefined;

    // Internal States for interactivity
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
    const [newSubtask, setNewSubtask] = useState('');
    const [comment, setComment] = useState('');
    const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

    useEffect(() => {
        setSubtasks(task.subtasks || []);
    }, [task.subtasks]);

    const handleToggleSubtask = (subId: string) => {
        const updated = subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
        setSubtasks(updated);
        onUpdate(task.id, { subtasks: updated });
    };

    const handleAddSubtask = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSubtask.trim()) {
            const newStep: Subtask = { id: `st-${Date.now()}`, text: newSubtask, completed: false };
            const updated = [...subtasks, newStep];
            setSubtasks(updated);
            onUpdate(task.id, { subtasks: updated });
            setNewSubtask('');
        }
    };

    const handleDeleteSubtask = (subId: string) => {
        const updated = subtasks.filter(s => s.id !== subId);
        setSubtasks(updated);
        onUpdate(task.id, { subtasks: updated });
    };

    const handleAssign = (user: Collaborator) => {
        onUpdate(task.id, { assignee: user });
        setIsAssigneeOpen(false);
    };

    const handleAddComment = () => {
        if (!comment.trim()) return;
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            userId: 'me',
            userName: 'Eneas',
            userInitials: 'ME',
            text: comment,
            createdAt: 'Just now'
        };
        const updatedComments = [...(task.comments || []), newComment];
        onUpdate(task.id, { comments: updatedComments });
        setComment('');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header Actions */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-2 text-xs">
                        {project ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-white ${project.color || 'bg-zinc-500'}`}>
                                {project.title}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-zinc-500 font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <Icons.Layers size={12} /> Inbox
                            </span>
                        )}
                        <span className="text-zinc-300 dark:text-zinc-600">/</span>
                        <span className="text-zinc-500 font-mono">TASK-{task.id.substring(0, 6)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-zinc-400 hover:text-red-600 transition-colors">
                            <Icons.Trash size={16} />
                        </button>
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <Icons.Close size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-8">
                        {/* Title Section */}
                        <div className="flex gap-4 items-start">
                            <button
                                onClick={() => onUpdate(task.id, { completed: !task.completed })}
                                className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                            >
                                {task.completed && <Icons.Check size={14} strokeWidth={3} />}
                            </button>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => onUpdate(task.id, { title: e.target.value })}
                                    className={`w-full bg-transparent text-2xl font-bold border-none outline-none p-0 ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}
                                />
                            </div>
                        </div>

                        {/* Assignee, Date, Priority Grid */}
                        <div className="grid grid-cols-[120px_1fr] gap-y-3 items-center text-sm relative">
                            {/* Assignee */}
                            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Icons.User size={14} /> Assignee</div>
                            <div className="relative">
                                <div onClick={() => setIsAssigneeOpen(!isAssigneeOpen)} className="flex items-center gap-2 group cursor-pointer w-fit p-1 -ml-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    <div className="w-5 h-5 rounded-full bg-zinc-800 dark:bg-zinc-700 text-white flex items-center justify-center text-[9px] font-bold">
                                        {task.assignee ? task.assignee.avatarInitials : <Icons.User size={10} />}
                                    </div>
                                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{task.assignee ? task.assignee.name : 'Unassigned'}</span>
                                </div>
                                {isAssigneeOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50">Select Member</div>
                                        {MOCK_USERS.map(user => (
                                            <button key={user.id} onClick={() => handleAssign(user)} className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-[9px] font-bold">{user.avatarInitials}</div>
                                                {user.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Icons.Calendar size={14} /> Due Date</div>
                            <div className="flex items-center gap-2">
                                <input type="date" value={task.startDate || ''} onChange={(e) => onUpdate(task.id, { startDate: e.target.value })} className="bg-transparent text-zinc-900 dark:text-zinc-100 border-b border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 focus:outline-none text-xs font-mono" />
                                <span className="text-zinc-400">→</span>
                                <input type="date" value={task.endDate || ''} onChange={(e) => onUpdate(task.id, { endDate: e.target.value })} className="bg-transparent text-zinc-900 dark:text-zinc-100 border-b border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 focus:outline-none text-xs font-mono" />
                            </div>

                            {/* Priority */}
                            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Icons.Flag size={14} /> Priority</div>
                            <div className="flex gap-1">
                                {[Priority.Low, Priority.Medium, Priority.High].map(p => (
                                    <button key={p} onClick={() => onUpdate(task.id, { priority: p })} className={`px-2 py-0.5 rounded text-xs border transition-colors ${task.priority === p ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-medium' : 'text-zinc-500 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>{p}</button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full"></div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Description</h4>
                            <textarea
                                className="w-full bg-transparent border-none p-0 resize-none outline-none text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed min-h-[100px]"
                                placeholder="Add more details about this task..."
                                value={task.description || ''}
                                onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                            />
                        </div>

                        {/* Subtasks */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Subtasks</h4>
                                <span className="text-xs text-zinc-400">{subtasks.filter(s => s.completed).length}/{subtasks.length}</span>
                            </div>
                            <div className="space-y-2">
                                {subtasks.map(sub => (
                                    <div key={sub.id} className="flex items-center gap-3 group">
                                        <div onClick={() => handleToggleSubtask(sub.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${sub.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400'}`}>
                                            {sub.completed && <Icons.Check size={10} strokeWidth={4} />}
                                        </div>
                                        <span className={`text-sm flex-1 ${sub.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}>{sub.text}</span>
                                        <button onClick={() => handleDeleteSubtask(sub.id)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Icons.Close size={14} /></button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 pt-1">
                                    <Icons.Plus size={14} className="text-zinc-400" />
                                    <input type="text" placeholder="Add step..." value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={handleAddSubtask} className="bg-transparent text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 flex-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- VIEWS ---
interface ViewProps {
    tasks: CalendarTask[];
    projects: Record<string, Project>;
    onSelectTask: (t: CalendarTask) => void;
    onGridDrop: (taskId: string, newDate: string) => void;
}

const WeekView = ({ tasks, projects, onSelectTask, onGridDrop }: ViewProps) => {
    const days = generateCurrentWeekDays();

    return (
        <div className="flex-1 grid grid-cols-7 h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
            {days.map((date, idx) => {
                const dateStr = toDateKey(date);
                const dayTasks = tasks.filter(t => t.startDate === dateStr || (t.startDate! <= dateStr && t.endDate! >= dateStr));
                const isToday = toDateKey(new Date()) === dateStr;

                return (
                    <div
                        key={idx}
                        className="flex flex-col h-full min-w-0"
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                        onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('taskId'); if (id) onGridDrop(id, dateStr); }}
                    >
                        <div className={`p-3 text-center border-b border-zinc-100 dark:border-zinc-800 ${isToday ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}>
                            <div className={`text-[10px] font-bold uppercase mb-0.5 ${isToday ? 'text-indigo-600' : 'text-zinc-400'}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-xl font-semibold leading-none ${isToday ? 'text-indigo-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                {date.getDate()}
                            </div>
                        </div>
                        <div className="flex-1 p-2 overflow-y-auto bg-zinc-50/20 dark:bg-black/20 custom-scrollbar hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                            {dayTasks.map(task => (
                                <CalendarTaskCard
                                    key={task.id}
                                    task={task}
                                    projects={projects}
                                    onClick={() => onSelectTask(task)}
                                    view="week"
                                    onDragStart={(e) => { e.dataTransfer.setData('taskId', task.id); }}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- MAIN PAGE ---
export default function CalendarPage() {
    const [tasks, setTasks] = useState<CalendarTask[]>([]);
    const [projects, setProjects] = useState<Record<string, Project>>({});
    const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
    const [view, setView] = useState<'week' | 'month' | 'timeline'>('week'); // Default to week

    const { data: dbTasks, loading: loadingTasks, update: updateTask, remove: removeTask, add: addTask } = useSupabase<any>('tasks');
    const { data: dbProjects, loading: loadingProjects } = useSupabase<any>('projects');
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(TODAY_MOCK);
    const [newTaskProject, setNewTaskProject] = useState<string>('');

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;

        const newTask = {
            title: newTaskTitle,
            start_date: newTaskDate,
            end_date: newTaskDate,
            completed: false,
            priority: Priority.Medium,
            project_id: newTaskProject || null,
        };

        await addTask(newTask);
        setNewTaskTitle('');
        setNewTaskDate(TODAY_MOCK);
        setNewTaskProject('');
        setIsNewTaskOpen(false);
    };

    // Load and adapt data
    useEffect(() => {
        if (dbTasks.length > 0) {
            setTasks(dbTasks.map(adaptTask));
        }
        if (dbProjects.length > 0) {
            const projMap: Record<string, Project> = {};
            dbProjects.forEach(p => {
                const adapted = adaptProject(p);
                projMap[adapted.id] = adapted;
            });
            setProjects(projMap);
        }
    }, [dbTasks, dbProjects]);

    const handleUpdateTask = (id: string, updates: Partial<CalendarTask>) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        // DB update (Mapping back to DB fields if necessary, currently adaptTask maps from DB, we need reverse logic or just pass simple fields)
        // Since useSupabase update takes Partial<T>, and our adapter logic is read-only, we might need a reverse adapter if field names differ.
        // DB fields: start_date, end_date, etc.
        const dbUpdates: any = {};
        if (updates.startDate) dbUpdates.start_date = updates.startDate;
        if (updates.endDate) dbUpdates.end_date = updates.endDate;
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        if (updates.priority) dbUpdates.priority = updates.priority;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.subtasks) dbUpdates.subtasks = updates.subtasks;
        if (updates.comments) dbUpdates.comments = updates.comments;
        if (updates.assignee) dbUpdates.assignee = updates.assignee; // Assuming JSONB or simple storage

        updateTask(id, dbUpdates);
    };

    const handleDrop = (taskId: string, newDate: string) => {
        handleUpdateTask(taskId, { startDate: newDate, endDate: newDate });
    };

    const handleDeleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        removeTask(id);
        setSelectedTask(null);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-[1600px] mx-auto font-sans">
            {selectedTask && (
                <TaskSidePanel
                    task={selectedTask}
                    projects={projects}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                />
            )}

            {/* New Task Modal */}
            {isNewTaskOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm" onClick={() => setIsNewTaskOpen(false)}></div>
                    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">New Task</h3>
                            <button onClick={() => setIsNewTaskOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                <Icons.Close size={18} className="text-zinc-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Task Title</label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 text-zinc-900 dark:text-zinc-100"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={newTaskDate}
                                        onChange={(e) => setNewTaskDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 text-zinc-900 dark:text-zinc-100 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Project</label>
                                    <select
                                        value={newTaskProject}
                                        onChange={(e) => setNewTaskProject(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 text-zinc-900 dark:text-zinc-100 text-sm"
                                    >
                                        <option value="">No Project</option>
                                        {Object.values(projects).map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsNewTaskOpen(false)}
                                className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                disabled={!newTaskTitle.trim()}
                                className="flex-1 px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Schedule</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsNewTaskOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                        <Icons.Plus size={14} />
                        New Task
                    </button>
                    <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                        {(['week', 'month'] as const).map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-md capitalize transition-all ${view === v ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <CalendarStats tasks={tasks} />

            {loadingTasks || loadingProjects ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400">Loading Calendar...</div>
            ) : (
                <WeekView tasks={tasks} projects={projects} onSelectTask={setSelectedTask} onGridDrop={handleDrop} />
            )}
        </div>
    );
}
