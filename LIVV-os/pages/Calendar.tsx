
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Icons } from '../components/ui/Icons';
import { CalendarTask, Project, Priority, Status, Collaborator, Subtask, Comment } from '../types';

// --- MOCK USERS ---
const MOCK_USERS: Collaborator[] = [
    { id: 'me', name: 'Eneas', role: 'Owner', avatarInitials: 'ME', status: 'online', pendingTasks: 0 },
    { id: 'sr', name: 'Sofia R.', role: 'Designer', avatarInitials: 'SR', status: 'online', pendingTasks: 3 },
    { id: 'lm', name: 'Lucas M.', role: 'Developer', avatarInitials: 'LM', status: 'busy', pendingTasks: 5 },
    { id: 'mt', name: 'Miguel T.', role: 'Frontend', avatarInitials: 'MT', status: 'offline', pendingTasks: 1 },
];

const mockProjects: Record<string, Project> = {
  'p1': { id: 'p1', title: 'Fintech Dashboard', description: 'UX Overhaul', progress: 75, status: Status.Active, tasks: [], nextSteps: 'Testing', updatedAt: 'Now', color: 'bg-emerald-500' },
  'p2': { id: 'p2', title: 'E-commerce API', description: 'Backend integration', progress: 30, status: Status.Pending, tasks: [], nextSteps: 'Schema', updatedAt: 'Yesterday', color: 'bg-blue-500' },
  'p3': { id: 'p3', title: 'Personal Brand', description: 'Website refresh', progress: 90, status: Status.Review, tasks: [], nextSteps: 'Publish', updatedAt: '2d ago', color: 'bg-purple-500' },
  'p4': { id: 'p4', title: 'Internal Wiki', description: 'Docs update', progress: 10, status: Status.Active, tasks: [], nextSteps: 'Content', updatedAt: '1w ago', color: 'bg-amber-500' },
};

const initialTasks: CalendarTask[] = [
  { 
      id: 't1', title: 'Discovery & Research', completed: false, projectId: 'p1', startDate: '2023-10-23', endDate: '2023-10-25', priority: Priority.High, description: 'Analyze competitor flows and gather initial requirements from stakeholders.',
      subtasks: [
          { id: 'st1', text: 'Analyze competitor flows', completed: true },
          { id: 'st2', text: 'Stakeholder interviews', completed: false }
      ],
      assignee: MOCK_USERS[0]
  },
  { id: 't2', title: 'Database Schema', completed: true, projectId: 'p2', startDate: '2023-10-23', endDate: '2023-10-24', priority: Priority.High, description: 'Define initial PostgreSQL schema for products and users.', assignee: MOCK_USERS[2] },
  { id: 't3', title: 'Visual Design Phase', completed: false, projectId: 'p1', startDate: '2023-10-26', endDate: '2023-10-30', priority: Priority.Medium, description: 'Create high-fidelity mockups in Figma.', assignee: MOCK_USERS[1] },
  { id: 't4', title: 'Client Feedback Call', completed: false, projectId: 'p1', startDate: '2023-10-27', endDate: '2023-10-27', priority: Priority.High, startTime: '14:00', description: 'Weekly sync with the client to review progress.', assignee: MOCK_USERS[0] },
  { id: 't5', title: 'Content Writing', completed: false, projectId: 'p3', startDate: '2023-10-24', endDate: '2023-10-28', priority: Priority.Low, description: 'Draft copy for the "About Me" and "Services" pages.', assignee: MOCK_USERS[0] },
  { id: 't6', title: 'API Integration', completed: false, projectId: 'p2', startDate: '2023-10-26', endDate: '2023-10-29', priority: Priority.High, description: 'Connect frontend to the new GraphQL endpoints.', assignee: MOCK_USERS[2] },
  { id: 't7', title: 'Legacy Data Migration', completed: false, projectId: 'p2', startDate: '2023-10-20', endDate: '2023-10-22', priority: Priority.High, description: 'Migrate old user data. (Delayed Task Mock)', assignee: MOCK_USERS[2] },
];

// --- DATE HELPERS ---

// Hardcoded context for Oct 2023 to match mock data
const CURRENT_YEAR = 2023;
const CURRENT_MONTH = 9; // October (0-indexed)
const TODAY_MOCK = '2023-10-24'; // Fixed 'Today' for logic calculations

const toDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const generateMonthDays = () => {
    const date = new Date(CURRENT_YEAR, CURRENT_MONTH, 1);
    const days = [];
    
    // Padding for days before start of month (assuming Sunday start)
    const firstDayIndex = date.getDay(); 
    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null);
    }
    
    while (date.getMonth() === CURRENT_MONTH) {
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
    // Week starting Mon Oct 23rd, 2023
    const startDay = 23;
    const days = [];
    for(let i = 0; i < 7; i++) {
        days.push(new Date(CURRENT_YEAR, CURRENT_MONTH, startDay + i));
    }
    return days;
};

const generateTimelineDates = () => {
    const dates = [];
    for(let i = 0; i < 14; i++) {
        const day = 23 + i;
        const d = new Date(CURRENT_YEAR, CURRENT_MONTH, day); 
        const dateStr = toDateKey(d);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        dates.push({ day: dayName, date: d.getDate().toString(), fullDate: dateStr, index: i });
    }
    return dates;
};

const timelineDates = generateTimelineDates();


// --- STATS COMPONENT ---

const CalendarStats = ({ tasks }: { tasks: CalendarTask[] }) => {
    const stats = useMemo(() => {
        let active = 0;
        let delayed = 0;
        let pending = 0;
        let completed = 0;
        
        // Goals Logic (Weekly context: Oct 23 - Oct 29)
        const weekStart = '2023-10-23';
        const weekEnd = '2023-10-29';
        let weeklyTotal = 0;
        let weeklyCompleted = 0;

        tasks.forEach(t => {
            if (t.completed) {
                completed++;
                // Check if it was part of this week's goal
                if (t.endDate && t.endDate >= weekStart && t.endDate <= weekEnd) {
                    weeklyTotal++;
                    weeklyCompleted++;
                }
            } else {
                // Not completed logic
                if (t.endDate && t.endDate < TODAY_MOCK) {
                    delayed++;
                } else if (t.startDate && t.startDate > TODAY_MOCK) {
                    pending++;
                } else {
                    active++;
                }

                // Add to weekly total goal if due this week
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
                            <Icons.Target size={12}/> Weekly Goal
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
    onClick: () => void;
    view?: 'week' | 'month';
    onDragStart: (e: React.DragEvent, task: CalendarTask) => void;
}> = ({ task, onClick, view = 'week', onDragStart }) => {
    const project = task.projectId ? mockProjects[task.projectId] : null;

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
                {project && <div className={`w-1 h-1 rounded-full ${project.color}`}></div>}
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
             {project && <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${project.color}`}></div>}
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

// --- SOPHISTICATED SIDE PANEL ---

const TaskSidePanel = ({ task, onClose, onUpdate, onDelete }: { 
    task: CalendarTask, 
    onClose: () => void,
    onUpdate: (id: string, updates: Partial<CalendarTask>) => void,
    onDelete: (id: string) => void
}) => {
    const project = task.projectId ? mockProjects[task.projectId] : undefined;
    
    // Internal States for interactivity
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
    const [newSubtask, setNewSubtask] = useState('');
    const [comment, setComment] = useState('');
    const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

    // Sync local subtasks with prop when it changes
    useEffect(() => {
        setSubtasks(task.subtasks || []);
    }, [task.subtasks]);

    // Subtask Logic
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

    // Assignee Logic
    const handleAssign = (user: Collaborator) => {
        onUpdate(task.id, { assignee: user });
        setIsAssigneeOpen(false);
    };

    // Comment Logic
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
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Side Panel */}
            <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300 flex flex-col">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-2 text-xs">
                        {project ? (
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-white ${project.color}`}>
                                {project.title}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-zinc-500 font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <Icons.Layers size={12} /> Inbox
                            </span>
                        )}
                        <span className="text-zinc-300 dark:text-zinc-600">/</span>
                        <span className="text-zinc-500 font-mono">TASK-{task.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <Icons.Link size={16} />
                        </button>
                        <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-zinc-400 hover:text-red-600 transition-colors">
                            <Icons.Trash size={16} />
                        </button>
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <Icons.Close size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-8">
                        
                        {/* Title Section */}
                        <div className="flex gap-4 items-start">
                             <button 
                                onClick={() => onUpdate(task.id, { completed: !task.completed })}
                                className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                                    task.completed 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                }`}
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

                        {/* Properties Grid (Notion/Linear Style) */}
                        <div className="grid grid-cols-[120px_1fr] gap-y-3 items-center text-sm relative">
                            
                            {/* Assignee */}
                            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Icons.User size={14}/> Assignee
                            </div>
                            <div className="relative">
                                <div 
                                    onClick={() => setIsAssigneeOpen(!isAssigneeOpen)}
                                    className="flex items-center gap-2 group cursor-pointer w-fit p-1 -ml-1 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="w-5 h-5 rounded-full bg-zinc-800 dark:bg-zinc-700 text-white flex items-center justify-center text-[9px] font-bold">
                                        {task.assignee ? task.assignee.avatarInitials : <Icons.User size={10} />}
                                    </div>
                                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                                        {task.assignee ? task.assignee.name : 'Unassigned'}
                                    </span>
                                </div>
                                {isAssigneeOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50">Select Member</div>
                                        {MOCK_USERS.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleAssign(user)}
                                                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-[9px] font-bold">
                                                    {user.avatarInitials}
                                                </div>
                                                {user.name}
                                                {task.assignee?.id === user.id && <Icons.Check size={14} className="ml-auto text-emerald-500" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Icons.Calendar size={14}/> Due Date
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="date" 
                                    value={task.startDate}
                                    onChange={(e) => onUpdate(task.id, { startDate: e.target.value })}
                                    className="bg-transparent text-zinc-900 dark:text-zinc-100 border-b border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 focus:outline-none text-xs font-mono"
                                />
                                <span className="text-zinc-400">→</span>
                                <input 
                                    type="date" 
                                    value={task.endDate}
                                    onChange={(e) => onUpdate(task.id, { endDate: e.target.value })}
                                    className="bg-transparent text-zinc-900 dark:text-zinc-100 border-b border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 focus:outline-none text-xs font-mono"
                                />
                            </div>

                            {/* Priority */}
                            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Icons.Flag size={14}/> Priority
                            </div>
                            <div className="flex gap-1">
                                {[Priority.Low, Priority.Medium, Priority.High].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => onUpdate(task.id, { priority: p })}
                                        className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                                            task.priority === p 
                                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-medium' 
                                            : 'text-zinc-500 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        {p}
                                    </button>
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
                                value={task.description}
                                onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                             />
                        </div>

                        {/* Subtasks (Checklist) */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                             <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Subtasks</h4>
                                <span className="text-xs text-zinc-400">{subtasks.filter(s => s.completed).length}/{subtasks.length}</span>
                             </div>
                             <div className="space-y-2">
                                 {subtasks.map(sub => (
                                     <div key={sub.id} className="flex items-center gap-3 group">
                                         <div 
                                            onClick={() => handleToggleSubtask(sub.id)}
                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${sub.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400'}`}
                                         >
                                             {sub.completed && <Icons.Check size={10} strokeWidth={4} />}
                                         </div>
                                         <span className={`text-sm flex-1 ${sub.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}>{sub.text}</span>
                                         <button onClick={() => handleDeleteSubtask(sub.id)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                             <Icons.Close size={14} />
                                         </button>
                                     </div>
                                 ))}
                                 
                                 {/* Add new subtask input */}
                                 <div className="flex items-center gap-3 pt-1">
                                     <Icons.Plus size={14} className="text-zinc-400" /> 
                                     <input 
                                        type="text" 
                                        placeholder="Add step..." 
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        onKeyDown={handleAddSubtask}
                                        className="bg-transparent text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 flex-1"
                                     />
                                 </div>
                             </div>
                        </div>
                        
                        {/* Activity / Comments */}
                        <div>
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Activity</h4>
                            <div className="space-y-4">
                                {task.comments?.map(c => (
                                    <div key={c.id} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                                            {c.userInitials}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.userName} <span className="text-zinc-400 font-normal ml-1">{c.createdAt}</span></div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{c.text}</p>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* New Comment Input */}
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 dark:bg-zinc-700 text-white flex items-center justify-center text-[9px] font-bold">ME</div>
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Add a comment..."
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter') handleAddComment();
                                                }}
                                                className="w-full pl-3 pr-10 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600 text-zinc-900 dark:text-zinc-100"
                                            />
                                            <button 
                                                onClick={handleAddComment}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                            >
                                                <Icons.Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                
                {/* Footer Metadata */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-400 flex justify-between items-center shrink-0">
                    <span>Created on Oct 20, 2023</span>
                    <span>Last updated just now</span>
                </div>
            </div>
        </div>
    );
};

// --- VIEWS ---

interface ViewProps {
    tasks: CalendarTask[];
    onSelectTask: (t: CalendarTask) => void;
    onGridDrop: (taskId: string, newDate: string) => void;
}

const WeekView = ({ tasks, onSelectTask, onGridDrop }: ViewProps) => {
    const days = generateCurrentWeekDays();
    
    const handleDragStart = (e: React.DragEvent, task: CalendarTask) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, dateStr: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onGridDrop(taskId, dateStr);
        }
    };

    return (
        <div className="flex-1 grid grid-cols-7 h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
            {days.map((date, idx) => {
                const dateStr = toDateKey(date);
                const dayTasks = tasks.filter(t => t.startDate === dateStr || (t.startDate! <= dateStr && t.endDate! >= dateStr));
                const isToday = date.getDate() === 24; 

                return (
                    <div 
                        key={idx} 
                        className="flex flex-col h-full min-w-0"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, dateStr)}
                    >
                        <div className={`p-3 text-center border-b border-zinc-100 dark:border-zinc-800 ${isToday ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}>
                            <div className={`text-[10px] font-bold uppercase mb-0.5 ${isToday ? 'text-indigo-600' : 'text-zinc-400'}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-xl font-semibold leading-none ${isToday ? 'text-indigo-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                {date.getDate()}
                            </div>
                        </div>
                        <div className="flex-1 p-2 overflow-y-auto bg-zinc-50/20 dark:bg-black/20 custom-scrollbar transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                            {dayTasks.map(task => (
                                <CalendarTaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onClick={() => onSelectTask(task)} 
                                    view="week" 
                                    onDragStart={handleDragStart}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MonthView = ({ tasks, onSelectTask, onGridDrop }: ViewProps) => {
    const days = generateMonthDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleDragStart = (e: React.DragEvent, task: CalendarTask) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, dateStr: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onGridDrop(taskId, dateStr);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                {weekDays.map(d => (
                    <div key={d} className="py-2 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>
            
            {/* Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-zinc-100 dark:divide-zinc-800">
                {days.map((date, idx) => {
                    if (!date) return <div key={idx} className="bg-zinc-50/30 dark:bg-zinc-900/30"></div>;

                    const dateStr = toDateKey(date);
                    const dayTasks = tasks.filter(t => 
                        t.startDate === dateStr || 
                        (t.startDate! <= dateStr && t.endDate! >= dateStr)
                    );
                    const isToday = date.getDate() === 24;

                    return (
                        <div 
                            key={idx} 
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, dateStr)}
                            className={`relative p-1 min-h-[80px] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group ${isToday ? 'bg-zinc-50/80 dark:bg-zinc-800/20' : ''}`}
                        >
                            <span className={`absolute top-2 right-2 text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'}`}>
                                {date.getDate()}
                            </span>
                            <div className="mt-7 px-1 space-y-0.5">
                                {dayTasks.slice(0, 3).map(task => (
                                    <CalendarTaskCard 
                                        key={task.id} 
                                        task={task} 
                                        onClick={() => onSelectTask(task)} 
                                        view="month" 
                                        onDragStart={handleDragStart}
                                    />
                                ))}
                                {dayTasks.length > 3 && (
                                    <div className="text-[9px] text-zinc-400 pl-1 font-medium hover:text-indigo-500 cursor-pointer">
                                        + {dayTasks.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- TIMELINE COMPONENT LOGIC ---

interface DragState {
    isDragging: boolean;
    taskId: string | null;
    type: 'move' | 'resize-left' | 'resize-right' | null;
    startX: number;
    initialStartIdx: number;
    initialEndIdx: number;
}

const TimelineTaskBar: React.FC<{
  task: CalendarTask;
  startDayIndex: number;
  span: number;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, type: 'move' | 'resize-left' | 'resize-right') => void;
  onClick: () => void;
}> = ({ task, startDayIndex, span, isDragging, onMouseDown, onClick }) => {
  const project = task.projectId ? mockProjects[task.projectId] : null;

  return (
    <div
      className={`absolute top-1.5 bottom-1.5 rounded-md border flex flex-col justify-center px-3 overflow-visible select-none
        transition-all duration-300 cubic-bezier(0.25, 0.8, 0.25, 1) bg-white dark:bg-zinc-800
        ${isDragging 
          ? 'z-50 shadow-2xl scale-[1.02] border-zinc-300 dark:border-zinc-600 ring-4 ring-zinc-500/5 cursor-grabbing' 
          : 'z-10 shadow-sm border-zinc-200 dark:border-zinc-700 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 cursor-grab'
        }
      `}
      style={{
        left: `calc(${startDayIndex * 100}% + 2px)`,
        width: `calc(${span * 100}% - 4px)`,
      }}
    >
      {/* Interaction Handlers */}
      <div 
        className="absolute inset-0" 
        onMouseDown={(e) => onMouseDown(e, 'move')}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      ></div>

      {/* Resize Handle Left */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-3 cursor-w-resize flex items-center justify-center group/handle z-20 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-l-md"
        onMouseDown={(e) => onMouseDown(e, 'resize-left')}
      >
        <div className="w-1 h-3 bg-zinc-300 dark:bg-zinc-600 rounded-full opacity-0 group-hover/handle:opacity-100 transition-opacity"></div>
      </div>

      {/* Resize Handle Right */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize flex items-center justify-center group/handle z-20 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-r-md"
        onMouseDown={(e) => onMouseDown(e, 'resize-right')}
      >
        <div className="w-1 h-3 bg-zinc-300 dark:bg-zinc-600 rounded-full opacity-0 group-hover/handle:opacity-100 transition-opacity"></div>
      </div>

      {/* Content */}
      <div className="pointer-events-none relative z-10 group">
          {project && (
             <div className={`absolute -top-1.5 left-0 right-0 h-[3px] rounded-t-md opacity-80 ${project.color}`}></div>
          )}
          <div className="flex items-center justify-between w-full">
             <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate pr-2 leading-tight">
                {task.title}
             </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate font-mono bg-zinc-50 dark:bg-zinc-900/50 px-1 rounded">
                 {task.startDate?.slice(5)} - {task.endDate?.slice(5)}
             </span>
          </div>
      </div>
    </div>
  );
};

export const Calendar: React.FC = () => {
  const [view, setView] = useState<'week' | 'month' | 'timeline'>('week');
  const [tasks, setTasks] = useState<CalendarTask[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  const dragState = useRef<DragState>({
      isDragging: false,
      taskId: null,
      type: null,
      startX: 0,
      initialStartIdx: 0,
      initialEndIdx: 0
  });

  const timelineProjects = Array.from(new Set(tasks.map(t => t.projectId).filter(Boolean))) as string[];

  // --- CRUD HELPERS ---

  const handleUpdateTask = (id: string, updates: Partial<CalendarTask>) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      if (selectedTask && selectedTask.id === id) {
          setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
      }
  };

  const handleDeleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
  };

  // --- GRID DRAG AND DROP (Week/Month) ---

  const handleGridDrop = (taskId: string, newStartDateStr: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.startDate) return;

      const oldStart = new Date(task.startDate);
      const newStart = new Date(newStartDateStr);
      
      // Calculate difference in days
      const diffTime = Math.abs(newStart.getTime() - oldStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) * (newStart < oldStart ? -1 : 1);

      // Calculate new End Date to preserve duration
      let newEndDateStr = newStartDateStr;
      if (task.endDate) {
          const oldEnd = new Date(task.endDate);
          oldEnd.setDate(oldEnd.getDate() + diffDays);
          newEndDateStr = toDateKey(oldEnd);
      }

      handleUpdateTask(taskId, {
          startDate: newStartDateStr,
          endDate: newEndDateStr
      });
  };

  // --- TIMELINE DRAG HELPERS ---

  const getDayDiff = (start: string, end: string) => {
      const s = timelineDates.findIndex(d => d.fullDate === start);
      const e = timelineDates.findIndex(d => d.fullDate === end);
      if (s === -1 || e === -1) return 1;
      return Math.max(1, e - s + 1);
  };
  
  const getStartIndex = (dateStr: string) => {
      return timelineDates.findIndex(d => d.fullDate === dateStr);
  };

  const handleDragStart = (e: React.MouseEvent, task: CalendarTask, type: 'move' | 'resize-left' | 'resize-right') => {
      e.stopPropagation();
      e.preventDefault();
      
      const startIdx = getStartIndex(task.startDate!);
      const endIdx = getStartIndex(task.endDate!);

      setDraggingId(task.id);

      dragState.current = {
          isDragging: true,
          taskId: task.id,
          type,
          startX: e.clientX,
          initialStartIdx: startIdx,
          initialEndIdx: endIdx
      };
  };

  const handleDragMove = (e: React.MouseEvent) => {
      if (!dragState.current.isDragging || !timelineRef.current) return;
      
      if (rafRef.current) return;

      const eventClientX = e.clientX;

      rafRef.current = requestAnimationFrame(() => {
          const { taskId, type, startX, initialStartIdx, initialEndIdx } = dragState.current;
          
          if (!timelineRef.current) {
              rafRef.current = null;
              return;
          }

          const timelineWidth = timelineRef.current.clientWidth;
          const colWidth = timelineWidth / timelineDates.length; 
          
          const pixelDelta = eventClientX - startX;
          const colDelta = Math.round(pixelDelta / colWidth);

          setTasks(prev => prev.map(t => {
              if (t.id !== taskId) return t;

              let newStartIdx = initialStartIdx;
              let newEndIdx = initialEndIdx;

              if (type === 'move') {
                  newStartIdx = initialStartIdx + colDelta;
                  newEndIdx = initialEndIdx + colDelta;
              } else if (type === 'resize-left') {
                  newStartIdx = initialStartIdx + colDelta;
              } else if (type === 'resize-right') {
                  newEndIdx = initialEndIdx + colDelta;
              }

              if (newStartIdx < 0) newStartIdx = 0;
              if (newEndIdx >= timelineDates.length) newEndIdx = timelineDates.length - 1;
              if (newStartIdx > newEndIdx) {
                  if (type === 'resize-left') newStartIdx = newEndIdx;
                  else if (type === 'resize-right') newEndIdx = newStartIdx;
              }

              const newStart = timelineDates[newStartIdx].fullDate;
              const newEnd = timelineDates[newEndIdx].fullDate;

              if (t.startDate === newStart && t.endDate === newEnd) return t;

              return {
                  ...t,
                  startDate: newStart,
                  endDate: newEnd
              };
          }));
          
          rafRef.current = null;
      });
  };

  const handleDragEnd = () => {
      dragState.current = { ...dragState.current, isDragging: false, taskId: null };
      setDraggingId(null);
      if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
      }
  };

  useEffect(() => {
      const onMove = (e: MouseEvent) => handleDragMove(e as unknown as React.MouseEvent);
      const onUp = () => handleDragEnd();
      
      if (view === 'timeline') {
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
      }
      return () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
      };
  }, [view]);


  return (
    <div className="h-full flex flex-col relative font-sans text-zinc-900 dark:text-zinc-100 select-none">
      
      {/* SIDE PANEL REPLACEMENT FOR MODAL */}
      {selectedTask && (
        <TaskSidePanel 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
        />
      )}

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6 shrink-0">
         <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
               {(['week', 'month', 'timeline'] as const).map((v) => (
                   <button 
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 py-1 rounded-md text-xs font-medium transition-all shadow-sm capitalize ${view === v ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white ring-1 ring-zinc-200 dark:ring-zinc-700' : 'text-zinc-500 dark:text-zinc-400 bg-transparent hover:text-zinc-700 dark:hover:text-zinc-200 shadow-none'}`}
                   >
                    {v}
                   </button>
               ))}
            </div>
         </div>
      </div>

      {/* --- STATS PANEL --- */}
      <CalendarStats tasks={tasks} />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {view === 'week' && (
            <WeekView tasks={tasks} onSelectTask={setSelectedTask} onGridDrop={handleGridDrop} />
        )}

        {view === 'month' && (
            <MonthView tasks={tasks} onSelectTask={setSelectedTask} onGridDrop={handleGridDrop} />
        )}

        {view === 'timeline' && (
            <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in fade-in duration-300">
               {/* Header Row (Dates) */}
               <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                  <div className="w-56 shrink-0 p-4 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 flex items-center">
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Project / Task</span>
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                     {timelineDates.map((day, idx) => (
                         <div key={idx} className={`flex-1 min-w-[100px] p-2 border-r border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center ${idx === 2 ? 'bg-zinc-50/80 dark:bg-zinc-900' : 'bg-white dark:bg-zinc-950'}`}>
                             <span className={`text-[10px] font-bold uppercase ${idx === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`}>{day.day}</span>
                             <span className={`text-xs font-medium ${idx === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{day.date}</span>
                         </div>
                     ))}
                  </div>
               </div>

               {/* Body (Rows) */}
               <div className="flex-1 overflow-y-auto custom-scrollbar" ref={timelineRef}>
                  {timelineProjects.map(projId => {
                     const project = mockProjects[projId];
                     const projTasks = tasks.filter(t => t.projectId === projId);

                     return (
                         <div key={projId} className="flex border-b border-zinc-100 dark:border-zinc-800 group">
                             {/* Project Info Column */}
                             <div className="w-56 shrink-0 p-4 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50/30 dark:group-hover:bg-zinc-800/30 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                   <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                                   <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{project.title}</h4>
                                </div>
                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex justify-between text-[10px] text-zinc-400">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-zinc-300 dark:bg-zinc-600 rounded-full" style={{width: `${project.progress}%`}}></div>
                                    </div>
                                </div>
                             </div>

                             {/* Timeline Grid for this Project */}
                             <div className="flex-1 relative flex bg-white/50 dark:bg-zinc-950/50 min-h-[100px]">
                                 {/* Grid Background Lines */}
                                 {timelineDates.map((_, idx) => (
                                     <div key={idx} className="flex-1 border-r border-dashed border-zinc-100 dark:border-zinc-800/50 h-full min-w-[100px] hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"></div>
                                 ))}
                                 
                                 {/* Current Day Indicator Line (Mocking Index 2) */}
                                 <div className="absolute top-0 bottom-0 w-px bg-indigo-500 z-0 pointer-events-none opacity-20" style={{ left: `calc(14.28% + 50px)` }}></div>

                                 {/* Render Tasks as Spanning Bars */}
                                 <div className="absolute inset-0 top-3 bottom-3">
                                     {projTasks.map(task => {
                                         const startIdx = getStartIndex(task.startDate || '');
                                         const span = getDayDiff(task.startDate || '', task.endDate || '');
                                         
                                         if (startIdx === -1) return null;

                                         return (
                                            <TimelineTaskBar 
                                              key={task.id} 
                                              task={task} 
                                              startDayIndex={startIdx / timelineDates.length} 
                                              span={span / timelineDates.length}
                                              isDragging={draggingId === task.id}
                                              onMouseDown={(e, type) => handleDragStart(e, task, type)}
                                              onClick={() => setSelectedTask(task)}
                                            />
                                         );
                                     })}
                                 </div>
                             </div>
                         </div>
                     )
                  })}
               </div>
            </div>
        )}
      </div>
    </div>
  );
};
