'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { Project, Status, Priority, CalendarTask } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptProject, adaptTask, fallbackProjects } from '@/lib/admin-adapters';

// --- TYPES & MOCK DATA ---

interface User {
    id: string;
    name: string;
    avatar: string; // Initials
    role: string;
}

const ALL_USERS: User[] = [
    { id: 'ME', name: 'Eneas', avatar: 'ME', role: 'Owner' },
    { id: 'SR', name: 'Sofia R.', avatar: 'SR', role: 'Designer' },
    { id: 'LM', name: 'Lucas M.', avatar: 'LM', role: 'Developer' },
    { id: 'MT', name: 'Miguel T.', avatar: 'MT', role: 'Frontend' },
    { id: 'CX', name: 'Client X', avatar: 'CX', role: 'Stakeholder' },
];

interface ProjectExtended extends Project {
    deadline: string;
    clientName: string;
    clientAvatar: string;
    tags: string[];
    team: string[]; // User IDs
    tasksGroups: {
        name: string;
        tasks: any[];
    }[];
    files: { name: string; type: string; size: string; date: string }[];
    activity: { text: string; date: string; user: string }[];
}

// --- SUB-COMPONENTS ---

const StatusBadge = ({ status }: { status: Status }) => {
    const colors: Record<string, string> = {
        [Status.Active]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        [Status.Pending]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-emerald-500/20',
        [Status.Review]: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
        [Status.Completed]: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
        [Status.Archived]: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider border ${colors[status]}`}>
            {status}
        </span>
    );
};

// --- MODALS & OVERLAYS ---

const ClientViewOverlay = ({ project, onClose }: { project: ProjectExtended, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 overflow-y-auto p-8 animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Client Preview: {project.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"><Icons.Close size={24} /></button>
                </div>
                <div className="space-y-6">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.description}</p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Milestones</h4>
                            <div className="space-y-3">
                                {project.tasksGroups.map((g, i) => (
                                    <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                        <div className="text-sm font-bold">{g.name}</div>
                                        <div className="text-xs text-zinc-500">{g.tasks.filter(t => t.completed).length}/{g.tasks.length} Done</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreateProjectModal = ({ isOpen, onClose, onCreate }: { isOpen: boolean, onClose: () => void, onCreate: (data: any) => void }) => {
    const [title, setTitle] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95">
                <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">New Project</h3>
                <input
                    autoFocus
                    type="text"
                    placeholder="Project Title"
                    className="w-full p-3 mb-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none text-zinc-900 dark:text-zinc-100"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700">Cancel</button>
                    <button onClick={() => onCreate({ title })} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold">Create Project</button>
                </div>
            </div>
        </div>
    );
};

const CreateTaskModal = ({ isOpen, onClose, onCreate, groups, preSelectedGroup }: { isOpen: boolean, onClose: () => void, onCreate: (title: string, groupIdx: number, assignee: string, date: string, payment: number, status: any) => void, groups: any[], preSelectedGroup: number }) => {
    const [title, setTitle] = useState('');
    const [groupIdx, setGroupIdx] = useState(preSelectedGroup);

    useEffect(() => { setGroupIdx(preSelectedGroup); }, [preSelectedGroup, isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95">
                <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">Add Task</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Task Title</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="What needs to be done?"
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none text-zinc-900 dark:text-zinc-100"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Phase / Group</label>
                        <select
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none text-zinc-900 dark:text-zinc-100"
                            value={groupIdx}
                            onChange={e => setGroupIdx(Number(e.target.value))}
                        >
                            {groups.map((g, i) => <option key={i} value={i}>{g.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700">Cancel</button>
                    <button onClick={() => onCreate(title, groupIdx, 'ME', '', 0, 'pending')} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold">Add Task</button>
                </div>
            </div>
        </div>
    );
};

const EditTaskModal = ({ isOpen, onClose, onSave, task, groups }: { isOpen: boolean, onClose: () => void, onSave: any, task: any, groups: any[] }) => {
    const [title, setTitle] = useState('');
    const [groupIdx, setGroupIdx] = useState(0);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            const foundIdx = groups.findIndex(g => g.name === task.tag); // Use tag as phase
            setGroupIdx(foundIdx !== -1 ? foundIdx : 0);
        }
    }, [task, isOpen, groups]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95">
                <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">Edit Task</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Task Title</label>
                        <input
                            autoFocus
                            type="text"
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none text-zinc-900 dark:text-zinc-100"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Phase / Group</label>
                        <select
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none text-zinc-900 dark:text-zinc-100"
                            value={groupIdx}
                            onChange={e => setGroupIdx(Number(e.target.value))}
                        >
                            {groups.map((g, i) => <option key={i} value={i}>{g.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700">Cancel</button>
                    <button onClick={() => onSave(task.id, title, groupIdx, task.assignee, task.dueDate, task.payment || 0, task.paymentStatus || 'pending')} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const AddMemberModal = ({ isOpen, onClose, onAdd, currentTeam }: { isOpen: boolean, onClose: () => void, onAdd: (id: string) => void, currentTeam: string[] }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95">
                <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">Add Team Member</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {ALL_USERS.filter(u => !currentTeam.includes(u.id)).map(user => (
                        <button key={user.id} onClick={() => onAdd(user.id)} className="w-full p-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all flex items-center gap-3 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">{user.avatar}</div>
                            <div>
                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{user.name}</div>
                                <div className="text-[10px] text-zinc-400 uppercase font-bold">{user.role}</div>
                            </div>
                        </button>
                    ))}
                    {ALL_USERS.filter(u => !currentTeam.includes(u.id)).length === 0 && (
                        <p className="text-xs text-zinc-500 text-center py-4 italic">All members are already in the team.</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- NEW TABS: TIMELINE & SETTINGS ---

const ProjectTimeline = ({
    project,
    onEditTask,
    onDeleteTask,
    onAddTask,
    onStartTimer,
    activeTimerId
}: {
    project: ProjectExtended;
    onEditTask: (task: any) => void;
    onDeleteTask: (taskId: string) => void;
    onAddTask: () => void;
    onStartTimer?: (id: string, title: string, type: 'project' | 'task') => void;
    activeTimerId?: string;
}) => {
    // Flatten tasks to sort by date (Dynamically derived from project.tasksGroups)
    const allTasks = project.tasksGroups.flatMap((group, gIdx) =>
        group.tasks.map(t => ({ ...t, phase: group.name, groupIdx: gIdx }))
    ).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

    // Calculate totals
    const totalValue = allTasks.reduce((acc, t) => acc + (t.payment || 0), 0);
    const totalPaid = allTasks.reduce((acc, t) => acc + (t.paymentStatus === 'paid' ? (t.payment || 0) : 0), 0);

    return (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
            <div className="flex justify-between items-end mb-6">
                <div className="flex gap-4 text-sm">
                    <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                        <span className="text-xs uppercase font-bold tracking-wider block text-zinc-400 dark:text-zinc-500">Project Value</span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400">
                        <span className="text-xs uppercase font-bold tracking-wider block text-emerald-500/70">Collected</span>
                        <span className="font-mono font-bold">${totalPaid.toLocaleString()}</span>
                    </div>
                </div>
                <button
                    onClick={onAddTask}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <Icons.Plus size={14} /> Add Milestone
                </button>
            </div>

            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 space-y-8">
                {allTasks.map((task, idx) => (
                    <div key={task.id} className="relative pl-8">
                        {/* Dot */}
                        <div className={`absolute -left-[5px] top-5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${task.completed ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}></div>

                        <div
                            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-zinc-400 dark:hover:border-zinc-500 transition-all relative"
                        >
                            <div className="flex-1" onClick={() => onEditTask(task)}>
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{task.phase}</div>
                                <h4 className={`text-sm font-semibold ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>{task.title}</h4>
                                {task.payment ? (
                                    <div className={`mt-2 inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-mono border ${task.paymentStatus === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800'}`}>
                                        <span>${task.payment.toLocaleString()}</span>
                                        <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                                        <span className="uppercase tracking-wide font-bold">{task.paymentStatus}</span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                {!task.completed && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onStartTimer?.(task.id, task.title, 'task'); }}
                                        className={`p-2 rounded-full transition-all ${activeTimerId === task.id ? 'bg-emerald-500 text-white' : 'text-zinc-300 hover:text-emerald-600'}`}
                                    >
                                        <Icons.Zap size={16} className={activeTimerId === task.id ? 'animate-pulse' : ''} />
                                    </button>
                                )}
                                <div className="text-right">
                                    <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded mb-1">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-xs text-zinc-400">
                                        <span>{task.assignee?.name || 'Unassigned'}</span>
                                        <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[8px] font-bold">
                                            {task.assignee?.avatarInitials || '?'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute right-2 -top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                    className="p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm"
                                    title="Edit"
                                >
                                    <Icons.Bold size={12} className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                    className="p-1.5 bg-zinc-100 dark:bg-zinc-800 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 shadow-sm"
                                    title="Delete"
                                >
                                    <Icons.Trash size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function ProjectsPage() {
    // SUPABASE DATA FETCHING
    const { data: dbProjects, loading: projectsLoading, add: addDBProject, update: updateDBProject } = useSupabase<any>('projects');
    const { data: dbTasks, loading: tasksLoading, add: addDBTask, update: updateDBTask, remove: removeDBTask } = useSupabase<any>('tasks');

    // ADAPT DATA
    const projects = useMemo(() => {
        if (projectsLoading || dbProjects.length === 0) return [];
        return dbProjects.map(adaptProject);
    }, [dbProjects, projectsLoading]);

    // Merge projects with tasks grouped by tag (Phase)
    const projectsExtended: ProjectExtended[] = useMemo(() => {
        return projects.map(p => {
            // Filter tasks for this project
            const pTasks = dbTasks.filter(t => t.project_id === p.id).map(adaptTask);

            // Group tasks by 'tag' (acting as Phase)
            const phases = ['Phase 1: Discovery', 'Phase 2: Design', 'Phase 3: Development'];
            const tasksGroups = phases.map(phaseName => ({
                name: phaseName,
                tasks: pTasks.filter(t => (t.tag || 'Phase 1: Discovery') === phaseName) // Default to Phase 1
            }));
            // Catch-all for other tags could be added here

            return {
                ...p,
                deadline: p.updatedAt, // Placeholder
                clientName: p.client || 'Client',
                clientAvatar: p.client ? p.client.substring(0, 2).toUpperCase() : 'CL',
                tags: [], // Could come from a tags column
                team: [], // Could come from team table
                tasksGroups,
                files: [],
                activity: []
            };
        });
    }, [projects, dbTasks]);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files' | 'settings'>('overview');
    const [isClientPreviewMode, setIsClientPreviewMode] = useState(false);

    // Modal States
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

    // State for task actions
    const [taskModalGroupIdx, setTaskModalGroupIdx] = useState(0);
    const [taskToEdit, setTaskToEdit] = useState<any>(null);
    const [activeTimerId, setActiveTimerId] = useState<string | null>(null);

    useEffect(() => {
        // Auto select first project
        if (projectsExtended.length > 0 && !selectedId) {
            setSelectedId(projectsExtended[0].id);
        }
    }, [projectsExtended, selectedId]);

    const selectedProject = projectsExtended.find(p => p.id === selectedId) || projectsExtended[0] ||
        // Fallback Dummy to prevent crash on empty
        { id: '0', title: 'No Projects', tasksGroups: [], description: '', progress: 0, status: Status.Active, client: 'None', nextSteps: '', clientName: '', clientAvatar: '' } as unknown as ProjectExtended;

    const handleTaskToggle = async (taskId: string) => {
        const task = dbTasks.find(t => t.id === taskId);
        if (task) {
            await updateDBTask(taskId, { completed: !task.completed });
        }
    };

    const handleAddTask = async (title: string, groupIdx: number, assignee: string, date: string, payment: number, paymentStatus: 'pending' | 'paid') => {
        if (!selectedProject) return;
        const phases = ['Phase 1: Discovery', 'Phase 2: Design', 'Phase 3: Development'];
        const phaseName = phases[groupIdx] || phases[0];

        await addDBTask({
            title,
            project_id: selectedProject.id,
            tag: phaseName, // Store phase in tag
            start_date: date ? date : undefined, // Check for empty string
            completed: false,
            priority: Priority.Medium,
            status: 'pending'
        });
        setIsTaskModalOpen(false);
    };

    const handleEditTaskSave = async (id: string, title: string, groupIdx: number, assignee: string, date: string, payment: number, paymentStatus: 'pending' | 'paid') => {
        const phases = ['Phase 1: Discovery', 'Phase 2: Design', 'Phase 3: Development'];
        const phaseName = phases[groupIdx] || phases[0];

        await updateDBTask(id, {
            title,
            tag: phaseName,
            start_date: date
        });
        setIsEditTaskModalOpen(false);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm("Delete this milestone?")) return;
        await removeDBTask(taskId);
    };

    const handleOpenEditModal = (task: any) => {
        setTaskToEdit(task);
        setIsEditTaskModalOpen(true);
    };

    const handleAddMember = async (userId: string) => {
        // TODO: Implement team member logic
        setIsMemberModalOpen(false);
    };

    const handleCreateProject = async (data: Partial<ProjectExtended>) => {
        await addDBProject({
            title: data.title || 'New Project',
            description: data.description || '',
            status: 'Active',
            progress: 0,
            client: 'Client',
            next_steps: 'Kickoff'
        });
        setIsCreateProjectModalOpen(false);
    };

    const onStartTimer = (id: string, title: string, type: 'project' | 'task') => {
        setActiveTimerId(id);
        // Logic for global timer...
    };

    if (projectsLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">

            {isClientPreviewMode && selectedProject && <ClientViewOverlay project={selectedProject} onClose={() => setIsClientPreviewMode(false)} />}
            <CreateProjectModal isOpen={isCreateProjectModalOpen} onClose={() => setIsCreateProjectModalOpen(false)} onCreate={handleCreateProject} />
            <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onCreate={handleAddTask} groups={selectedProject?.tasksGroups || []} preSelectedGroup={taskModalGroupIdx} />
            <EditTaskModal isOpen={isEditTaskModalOpen} onClose={() => setIsEditTaskModalOpen(false)} onSave={handleEditTaskSave} task={taskToEdit} groups={selectedProject?.tasksGroups || []} />
            <AddMemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} onAdd={handleAddMember} currentTeam={selectedProject?.team || []} />

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">

                <div className="w-full lg:w-72 flex flex-col gap-4 overflow-y-auto pr-2 shrink-0">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">All Projects</h2>
                        <button onClick={() => setIsCreateProjectModalOpen(true)} className="text-zinc-400 hover:text-zinc-900"><Icons.Plus size={16} /></button>
                    </div>

                    <div className="space-y-2">
                        {projectsExtended.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedId(p.id)}
                                className={`group p-3 rounded-lg border cursor-pointer transition-all ${selectedId === p.id
                                    ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 shadow-sm'
                                    : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className={`text-sm font-medium truncate ${selectedId === p.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>{p.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start shrink-0">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono text-zinc-400 uppercase">PRJ-{selectedProject.id}</span>
                                <StatusBadge status={selectedProject.status} />
                            </div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{selectedProject.title}</h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onStartTimer(selectedProject.id, selectedProject.title, 'project')}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-all ${activeTimerId === selectedProject.id ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                            >
                                <Icons.Zap size={16} className={activeTimerId === selectedProject.id ? 'animate-pulse' : ''} />
                                {activeTimerId === selectedProject.id ? 'Timer Running' : 'Start Timer'}
                            </button>
                            <button onClick={() => { setTaskModalGroupIdx(0); setIsTaskModalOpen(true); }} className="flex items-center gap-2 px-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:opacity-90">
                                <Icons.Plus size={16} /> Add Task
                            </button>
                        </div>
                    </div>

                    <div className="px-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-8 shrink-0">
                        {['overview', 'tasks', 'timeline', 'files', 'settings'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="col-span-2 space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Description</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{selectedProject.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tasks' && (
                            <div className="space-y-8 max-w-3xl animate-in fade-in">
                                {selectedProject.tasksGroups.map((group, gIdx) => (
                                    <div key={gIdx} className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                                            <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{group.name}</h3>
                                        </div>
                                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                            {group.tasks.map(task => (
                                                <div key={task.id} className="px-5 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                                    <div className="flex items-center gap-3 flex-1" onClick={() => handleTaskToggle(task.id)}>
                                                        <button className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-600 text-transparent'}`}>
                                                            <Icons.Check size={12} strokeWidth={3} />
                                                        </button>
                                                        <span className={`text-sm ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-200'}`}>{task.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {!task.completed && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onStartTimer(task.id, task.title, 'task'); }}
                                                                className={`p-2 rounded-full transition-all ${activeTimerId === task.id ? 'bg-emerald-500 text-white' : 'text-zinc-300 hover:text-emerald-600'}`}
                                                            >
                                                                <Icons.Zap size={14} className={activeTimerId === task.id ? 'animate-pulse' : ''} />
                                                            </button>
                                                        )}
                                                        <Icons.More size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100" />
                                                    </div>
                                                </div>
                                            ))}
                                            <div onClick={() => { setTaskModalGroupIdx(gIdx); setIsTaskModalOpen(true); }} className="px-5 py-2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer flex items-center gap-2">
                                                <Icons.Plus size={14} /> Add Task
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <ProjectTimeline
                                project={selectedProject}
                                onAddTask={() => { setTaskModalGroupIdx(0); setIsTaskModalOpen(true); }}
                                onEditTask={handleOpenEditModal}
                                onDeleteTask={handleDeleteTask}
                                onStartTimer={onStartTimer}
                                activeTimerId={activeTimerId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
