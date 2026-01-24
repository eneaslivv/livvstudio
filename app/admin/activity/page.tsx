'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { ActivityLog, ActivityType, PageView } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptActivity } from '@/lib/admin-adapters';

// --- MOCK DATA ---
const INITIAL_ACTIVITIES: ActivityLog[] = [
    {
        id: '1', userId: 'u1', userName: 'Sofia R.', userAvatar: 'SR',
        type: 'task_completed', action: 'completed task', target: 'Hero Section Responsiveness',
        projectId: 'p1', projectTitle: 'Fintech Dashboard', timestamp: '10 mins ago'
    },
    {
        id: '2', userId: 'u2', userName: 'Lucas M.', userAvatar: 'LM',
        type: 'comment', action: 'commented on', target: 'API Schema V2',
        projectId: 'p2', projectTitle: 'E-commerce API', timestamp: '1 hour ago',
        details: "I think we should switch to GraphQL for the product endpoints to reduce payload size on mobile."
    },
    {
        id: '3', userId: 'u1', userName: 'Sofia R.', userAvatar: 'SR',
        type: 'file_uploaded', action: 'uploaded 3 files to', target: 'Design Assets',
        projectId: 'p1', projectTitle: 'Fintech Dashboard', timestamp: '3 hours ago',
        meta: { fileType: 'figma' }
    },
    {
        id: '4', userId: 'u3', userName: 'Eneas', userAvatar: 'E',
        type: 'status_change', action: 'changed status of', target: 'Payment Integration',
        projectId: 'p2', projectTitle: 'E-commerce API', timestamp: 'Yesterday',
        meta: { prevStatus: 'In Progress', newStatus: 'Review' }
    },
    {
        id: '5', userId: 'u3', userName: 'Eneas', userAvatar: 'E',
        type: 'project_created', action: 'created project', target: 'Personal Brand Refresh',
        projectId: 'p3', projectTitle: 'Personal Brand', timestamp: '2 days ago'
    },
];

// --- REAL-TIME SIMULATION DATA ---
const MOCK_USERS = [
    { id: 'u2', name: 'Lucas M.', avatar: 'LM' },
    { id: 'u1', name: 'Sofia R.', avatar: 'SR' },
    { id: 'u4', name: 'Miguel T.', avatar: 'MT' },
    { id: 'u5', name: 'Client X', avatar: 'CX' },
];

const MOCK_ACTIONS = [
    { type: 'comment', action: 'commented on', targets: ['API Schema', 'Homepage Hero', 'User Settings', 'Login Flow'] },
    { type: 'task_completed', action: 'completed task', targets: ['Fix navigation bug', 'Update color palette', 'Write documentation', 'Optimize images'] },
    { type: 'file_uploaded', action: 'uploaded file', targets: ['Assets.zip', 'Report.pdf', 'Screen_Recording.mp4'] },
    { type: 'status_change', action: 'moved task to Done', targets: ['Login Flow', 'Signup Form', 'Profile Page'] }
];

const generateMockActivity = (): ActivityLog => {
    const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    const act = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];
    const target = act.targets[Math.floor(Math.random() * act.targets.length)];

    return {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: act.type as ActivityType,
        action: act.action,
        target: target,
        projectId: 'p1',
        projectTitle: 'Fintech Dashboard',
        timestamp: 'Just now',
        details: act.type === 'comment' ? 'This looks great, but let\'s double check the responsiveness on mobile.' : undefined
    };
};

// --- COMPONENTS ---

const ActivityModal = ({
    activity,
    onClose,
    onReply,
    onNavigate
}: {
    activity: ActivityLog,
    onClose: () => void,
    onReply: (text: string) => void,
    onNavigate: (page: PageView | string) => void
}) => {
    const [replyText, setReplyText] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSend = () => {
        if (!replyText.trim()) return;
        onReply(replyText);
        setReplyText('');
        onClose();
    };

    const handleOpenContext = () => {
        if (activity.type === 'file_uploaded') {
            onNavigate('docs');
        } else if (activity.projectId) {
            onNavigate('projects');
        } else {
            onNavigate('home');
        }
        onClose();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://eneas.os/activity/${activity.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-zinc-900 shadow-2xl z-50 border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Icons.Activity size={16} className="text-zinc-400" /> Activity Details
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"><Icons.Close size={20} /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {activity.userAvatar}
                    </div>
                    <div>
                        <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{activity.userName}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{activity.timestamp}</div>
                    </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/50 p-6 mb-8">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                        <span className="uppercase tracking-wider text-[10px] font-bold bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                            {activity.type.replace('_', ' ')}
                        </span>
                        <span>in</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{activity.projectTitle || 'General'}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                        {activity.action} <span className="text-indigo-600 dark:text-indigo-400">{activity.target}</span>
                    </h2>

                    {activity.details && (
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 leading-relaxed italic relative">
                            <div className="absolute top-4 left-0 w-1 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-r"></div>
                            "{activity.details}"
                        </div>
                    )}

                    {activity.type === 'file_uploaded' && (
                        <div className="flex items-center gap-3 mt-4 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded"><Icons.FileImage size={20} /></div>
                            <div className="text-sm">
                                <div className="font-medium text-zinc-900 dark:text-zinc-100">New_Assets_v2.zip</div>
                                <div className="text-xs text-zinc-400">12.5 MB • Figma</div>
                            </div>
                        </div>
                    )}

                    {activity.type === 'status_change' && activity.meta && (
                        <div className="flex items-center gap-3 mt-4 text-sm">
                            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded strike-through">{activity.meta.prevStatus}</span>
                            <Icons.ChevronRight size={14} className="text-zinc-400" />
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded font-medium">{activity.meta.newStatus}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleOpenContext}
                        className="flex-1 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Open Context
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 flex items-center justify-center min-w-[50px]"
                        title="Copy Link"
                    >
                        {copied ? <Icons.Check size={18} className="text-emerald-500" /> : <Icons.Link size={18} />}
                    </button>
                </div>
            </div>

            {/* Comment Footer */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <div className="relative">
                    <input
                        autoFocus
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Reply or add a note..."
                        className="w-full pl-4 pr-10 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600 shadow-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button
                        onClick={handleSend}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-colors ${replyText.trim() ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded' : 'text-zinc-400 cursor-not-allowed'}`}
                    >
                        <Icons.Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ActivityPage() {
    const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
    const [activeTab, setActiveTab] = useState('All Activity');
    const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
    const [newPost, setNewPost] = useState('');
    const [isLive, setIsLive] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'this_week' | 'all'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Post attachments state
    const [attachments, setAttachments] = useState<{ type: string, count: number }[]>([]);

    // Integration with Supabase (or fallback to Simulation)
    const { data: dbActivities, loading } = useSupabase<any>('activity_logs');

    // Memoized adaptation to avoid re-calculating on every render
    const realActivities = useMemo(() => {
        if (dbActivities.length > 0) {
            return dbActivities.map(adaptActivity);
        }
        return [];
    }, [dbActivities]);

    // Combine Real + Mock (for now we use Mock + Simulation if DB is empty, or mix? LIVV-os2 used pure Mock)
    // Logic: If DB has data, use it. Else use INITIAL. 
    // However, the simulation effect below ADDS to 'activities' state.
    // We should initialize 'activities' with real data if available.

    useEffect(() => {
        if (realActivities.length > 0) {
            setActivities(realActivities);
        }
    }, [realActivities]);


    // --- WEBSOCKET SIMULATION ---
    useEffect(() => {
        // Simulate connection establishment
        const timeout = setTimeout(() => setIsLive(true), 1500);

        // Simulate incoming events
        const interval = setInterval(() => {
            // 30% chance to receive a new activity every 8 seconds (slowed down slightly)
            if (Math.random() > 0.7) {
                const newActivity = generateMockActivity();
                setActivities(prev => [newActivity, ...prev]);
            }
        }, 8000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const getIconForType = (type: ActivityType) => {
        switch (type) {
            case 'task_completed': return <Icons.Check size={14} className="text-emerald-600 dark:text-emerald-400" />;
            case 'comment': return <Icons.Message size={14} className="text-blue-500 dark:text-blue-400" />;
            case 'file_uploaded': return <Icons.File size={14} className="text-purple-500 dark:text-purple-400" />;
            case 'status_change': return <Icons.GitCommit size={14} className="text-amber-500 dark:text-amber-400" />;
            case 'project_created': return <Icons.Plus size={14} className="text-zinc-900 dark:text-zinc-100" />;
            default: return <Icons.Circle size={14} />;
        }
    };

    const handlePost = () => {
        if (!newPost.trim() && attachments.length === 0) return;

        let actionText = 'posted an update';
        let type: ActivityType = 'comment';
        let meta = undefined;

        if (attachments.length > 0) {
            actionText = `uploaded ${attachments.length} file${attachments.length > 1 ? 's' : ''}`;
            type = 'file_uploaded';
            meta = { fileType: 'mixed' };
        }

        const newActivity: ActivityLog = {
            id: Date.now().toString(),
            userId: 'me',
            userName: 'Eneas',
            userAvatar: 'ME',
            type: type,
            action: actionText,
            target: '',
            details: newPost,
            timestamp: 'Just now',
            meta
        };

        setActivities([newActivity, ...activities]);
        setNewPost('');
        setAttachments([]);
    };

    const handleReply = (text: string) => {
        const newActivity: ActivityLog = {
            id: Date.now().toString(),
            userId: 'me',
            userName: 'Eneas',
            userAvatar: 'ME',
            type: 'comment',
            action: 'replied to activity',
            target: selectedActivity?.target || 'Update',
            details: text,
            timestamp: 'Just now'
        };
        setActivities([newActivity, ...activities]);
    };

    const toggleAttachment = (type: string) => {
        setAttachments(prev => {
            const existing = prev.find(a => a.type === type);
            if (existing) {
                return prev.filter(a => a.type !== type);
            } else {
                return [...prev, { type, count: 1 }];
            }
        });
    };

    // --- FILTER LOGIC ---
    const filteredActivities = useMemo(() => {
        return activities.filter(act => {
            // Tab Filter
            if (activeTab === 'My Updates' && act.userId !== 'me') return false;
            if (activeTab === 'Comments' && act.type !== 'comment') return false;
            if (activeTab === 'Files' && act.type !== 'file_uploaded') return false;

            // Time Filter (Simple string match for 'week' logic)
            if (timeFilter === 'this_week') {
                if (act.timestamp.includes('month') || act.timestamp.includes('year')) return false;
            }

            // Search Filter (optional optimization)
            return true;
        });
    }, [activities, activeTab, timeFilter]);

    const todayActivities = filteredActivities.filter(a => !a.timestamp.toLowerCase().includes('yesterday') && !a.timestamp.toLowerCase().includes('days ago'));
    const previousActivities = filteredActivities.filter(a => a.timestamp.toLowerCase().includes('yesterday') || a.timestamp.toLowerCase().includes('days ago'));

    // --- STATS LOGIC ---
    const completedCount = activities.filter(a => a.type === 'task_completed').length;
    const discussionCount = activities.filter(a => a.type === 'comment').length;
    const velocityChange = '+24%'; // Mock, but could be dynamic

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {selectedActivity && (
                <>
                    <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 animate-in fade-in" onClick={() => setSelectedActivity(null)}></div>
                    <ActivityModal
                        activity={selectedActivity}
                        onClose={() => setSelectedActivity(null)}
                        onReply={handleReply}
                        onNavigate={(page) => console.log('Navigate', page)}
                    />
                </>
            )}

            {/* Header & Stats */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Activity Feed</h1>
                        {isLive && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Live
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2 relative">
                        <button
                            onClick={() => setTimeFilter(prev => prev === 'all' ? 'this_week' : 'all')}
                            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-medium transition-colors ${timeFilter === 'this_week' ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                        >
                            <Icons.Calendar size={14} /> {timeFilter === 'this_week' ? 'This Week' : 'All Time'}
                        </button>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-medium transition-colors ${isFilterOpen ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                        >
                            <Icons.Filter size={14} /> Filter
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-1">
                                <div className="text-[10px] uppercase font-bold text-zinc-400 px-2 py-1 mb-1">Show Types</div>
                                {['Comments', 'Tasks', 'Files', 'System'].map(t => (
                                    <label key={t} className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-3 h-3" />
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{t}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Weekly Highlights (Dynamic) */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-zinc-900 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Icons.Check size={14} /> Completed
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{completedCount} Tasks</div>
                        <div className="text-xs text-zinc-400 mt-1">Top performer: Sofia R.</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Icons.Zap size={14} /> Velocity
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{velocityChange}</div>
                        <div className="text-xs text-zinc-400 mt-1">Vs last week</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900 border border-purple-100 dark:border-purple-900/30 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Icons.Message size={14} /> Discussions
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{discussionCount} Threads</div>
                        <div className="text-xs text-zinc-400 mt-1">Most active: API V2</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 pb-1 gap-6 text-sm mb-6">
                    {['All Activity', 'My Updates', 'Comments', 'Files'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 relative transition-colors ${activeTab === tab ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                {/* Post Composer */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-8 shadow-sm">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-xs font-bold text-white dark:text-zinc-900 shadow-sm shrink-0">
                            ME
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What's on your mind? Share an update..."
                                className="w-full text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 resize-none outline-none min-h-[50px] bg-transparent"
                                rows={2}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        handlePost();
                                    }
                                }}
                            />

                            {/* Attachment Preview */}
                            {attachments.length > 0 && (
                                <div className="flex gap-2 mt-2 mb-1">
                                    {attachments.map((att, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs text-zinc-600 dark:text-zinc-300">
                                            <Icons.Paperclip size={12} /> {att.type}
                                            <button onClick={() => toggleAttachment(att.type)} className="hover:text-red-500"><Icons.Close size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex gap-2 text-zinc-400">
                                    <button
                                        onClick={() => toggleAttachment('file')}
                                        title="Attach File"
                                        className={`p-2 rounded-full transition-colors ${attachments.find(a => a.type === 'file') ? 'bg-zinc-100 text-indigo-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                    >
                                        <Icons.Paperclip size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors"><Icons.Briefcase size={16} /></button>
                                    <button
                                        onClick={() => toggleAttachment('image')}
                                        title="Add Image"
                                        className={`p-2 rounded-full transition-colors ${attachments.find(a => a.type === 'image') ? 'bg-zinc-100 text-purple-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                    >
                                        <Icons.FileImage size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={!newPost.trim() && attachments.length === 0}
                                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Post Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Feed */}
            <div className="relative pl-4 space-y-8 pb-10">
                {/* Vertical Line */}
                <div className="absolute top-0 bottom-0 left-[27px] w-px bg-zinc-200 dark:bg-zinc-800"></div>

                {/* Today Group */}
                {todayActivities.length > 0 && (
                    <div className="relative">
                        <div className="sticky top-0 bg-white dark:bg-black z-10 py-2 mb-4 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 ml-[25px]"></div>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Today</span>
                        </div>

                        <div className="space-y-6 animate-in fade-in duration-500">
                            {todayActivities.map((activity, index) => (
                                <div
                                    key={activity.id}
                                    onClick={() => setSelectedActivity(activity)}
                                    className={`group relative pl-14 cursor-pointer ${index === 0 && activity.timestamp === 'Just now' ? 'animate-in slide-in-from-top-4 duration-500' : ''}`}
                                >
                                    {/* Avatar Node */}
                                    <div className="absolute left-0 top-1 w-14 flex justify-center bg-white dark:bg-black py-1">
                                        <div className="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 shadow-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors z-10">
                                            {activity.userAvatar}
                                        </div>
                                        {/* Mini Type Badge */}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center z-20 shadow-sm">
                                            {getIconForType(activity.type)}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-transparent p-3 -ml-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-100">
                                                <span className="font-medium">{activity.userName}</span>
                                                <span className="text-zinc-500 px-1">{activity.action}</span>
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{activity.target}</span>
                                            </div>
                                            <div className="text-[10px] text-zinc-400 whitespace-nowrap">{activity.timestamp}</div>
                                        </div>

                                        {activity.projectTitle && (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                    <Icons.Briefcase size={10} /> {activity.projectTitle}
                                                </span>
                                            </div>
                                        )}

                                        {activity.details && (
                                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-2 rounded-md italic">
                                                "{activity.details}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Previous Group */}
                {previousActivities.length > 0 && (
                    <div className="relative pt-8">
                        <div className="sticky top-0 bg-white dark:bg-black z-10 py-2 mb-4 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 ml-[25px]"></div>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Yesterday & Earlier</span>
                        </div>

                        <div className="space-y-6">
                            {previousActivities.map(activity => (
                                <div
                                    key={activity.id}
                                    onClick={() => setSelectedActivity(activity)}
                                    className="group relative pl-14 cursor-pointer"
                                >
                                    <div className="absolute left-0 top-1 w-14 flex justify-center bg-white dark:bg-black py-1">
                                        <div className="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 shadow-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors z-10">
                                            {activity.userAvatar}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center z-20 shadow-sm">
                                            {getIconForType(activity.type)}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-transparent p-3 -ml-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-100">
                                                <span className="font-medium">{activity.userName}</span>
                                                <span className="text-zinc-500 px-1">{activity.action}</span>
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{activity.target}</span>
                                            </div>
                                            <div className="text-[10px] text-zinc-400 whitespace-nowrap">{activity.timestamp}</div>
                                        </div>

                                        {activity.projectTitle && (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                    <Icons.Briefcase size={10} /> {activity.projectTitle}
                                                </span>
                                            </div>
                                        )}

                                        {activity.meta?.prevStatus && (
                                            <div className="flex items-center gap-2 mt-2 text-xs">
                                                <span className="text-zinc-400 line-through">{activity.meta.prevStatus}</span>
                                                <Icons.ChevronRight size={12} className="text-zinc-300 dark:text-zinc-600" />
                                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{activity.meta.newStatus}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
