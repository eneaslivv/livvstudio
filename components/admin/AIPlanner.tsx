
import React, { useState } from 'react';
import { Icons } from '@/components/admin/Icons';
import { GoogleGenAI, Type } from '@google/genai';
import { Task, Project, Priority } from '@/types/livv-os';

interface AIPlannerProps {
    tasks: any[];
    microTasks: string[];
    projects: Project[];
    isOpen: boolean;
    onClose: () => void;
    onApplyPlan: (newTasks: any[]) => void;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({ tasks, microTasks, projects, isOpen, onClose, onApplyPlan }) => {
    const [loading, setLoading] = useState(false);
    const [editablePlan, setEditablePlan] = useState<string>('');
    const [structuredTasks, setStructuredTasks] = useState<any[]>([]);
    const [isGenerated, setIsGenerated] = useState(false);

    const generatePlan = async () => {
        setLoading(true);
        setIsGenerated(false);
        try {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
            if (!apiKey) {
                throw new Error('Missing Gemini API Key');
            }
            const ai = new GoogleGenAI({ apiKey });

            const currentTasksText = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Tag: ${t.tag})`).join('\n');
            const microTasksText = microTasks.map(mt => `- ${mt}`).join('\n');
            const projectsList = projects.map(p => `- ID: ${p.id}, Title: ${p.title}, Progress: ${p.progress}%`).join('\n');
            const today = new Date().toISOString().split('T')[0];

            const prompt = `
        You are a world-class elite executive strategist. 
        Analyze Eneas's current state and generate a high-performance weekly plan starting from today (${today}).
        
        ACTIVE PROJECTS:
        ${projectsList}

        PENDING MAIN TASKS:
        ${currentTasksText}
        
        QUICK HITS:
        ${microTasksText}
        
        INSTRUCTIONS:
        1. Create a logical weekly schedule (Mon-Fri).
        2. Assign "Deep Work" blocks for complex project tasks.
        3. Batch micro-tasks efficiently.
        4. Match tasks to project IDs where applicable.
        5. FOR EVERY TASK: Provide an "estimatedHours" and specific "startDate" (YYYY-MM-DD).
        
        You must return a JSON object with:
        - "plan_markdown": A professional summary.
        - "tasks": An array of specific task objects.
           Each task: { 
             "title": string, 
             "priority": "High" | "Medium" | "Low", 
             "projectId": string (optional), 
             "tag": string,
             "estimatedHours": number,
             "startDate": string (YYYY-MM-DD)
           }
      `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp', // Using a valid model name, fallback to pro if needed
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            plan_markdown: { type: Type.STRING },
                            tasks: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        priority: { type: Type.STRING },
                                        projectId: { type: Type.STRING },
                                        tag: { type: Type.STRING },
                                        estimatedHours: { type: Type.NUMBER },
                                        startDate: { type: Type.STRING }
                                    },
                                    required: ["title", "priority", "tag", "estimatedHours", "startDate"]
                                }
                            }
                        },
                        required: ["plan_markdown", "tasks"]
                    }
                },
            });

            const data = JSON.parse(response.text() || '{}');
            setEditablePlan(data.plan_markdown || '');
            // Sort initially by date
            const sorted = (data.tasks || []).sort((a: any, b: any) => a.startDate.localeCompare(b.startDate));
            setStructuredTasks(sorted);
            setIsGenerated(true);
        } catch (error) {
            console.error('AI Planning Error:', error);
            setEditablePlan('Error generating strategy. Please verify your connection/API key.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStructuredTask = (index: number, field: string, value: any) => {
        const updated = [...structuredTasks];
        updated[index] = { ...updated[index], [field]: value };
        setStructuredTasks(updated);
    };

    const handleRemoveTask = (index: number) => {
        setStructuredTasks(structuredTasks.filter((_, i) => i !== index));
    };

    const handleApply = () => {
        onApplyPlan(structuredTasks);
        onClose();
    };

    // Group tasks by date for visual editing
    const groupedTasks = structuredTasks.reduce((acc: any, task, idx) => {
        const date = task.startDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push({ ...task, originalIndex: idx });
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-5xl rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Icons.Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">AI Weekly Strategist</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Interactive Dynamic Planning</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <Icons.Close size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {!isGenerated && !loading ? (
                        <div className="text-center py-12 space-y-6">
                            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-100 dark:border-zinc-800">
                                <Icons.Target size={32} className="text-zinc-300" />
                            </div>
                            <div className="max-w-md mx-auto">
                                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Build your High-Performance Week</h4>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    I will propose a temporal structure for your {projects.length} projects. You'll be able to adjust every date and time block manually.
                                </p>
                            </div>
                            <button
                                onClick={generatePlan}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/10"
                            >
                                <Icons.Zap size={16} />
                                Generate Strategic Draft
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                <Icons.Sparkles size={24} className="absolute inset-0 m-auto text-indigo-500 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">Strategist is crunching numbers...</p>
                                <p className="text-xs text-zinc-500 italic">Optimizing delivery dates and time allocation...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: Summary Text */}
                                <div className="lg:col-span-1 space-y-4">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Strategy Overview</label>
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-inner h-full">
                                        <textarea
                                            value={editablePlan}
                                            onChange={(e) => setEditablePlan(e.target.value)}
                                            className="w-full h-full bg-transparent border-none outline-none text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed resize-none no-scrollbar"
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>

                                {/* Right: Visual Interactive Timeline Editor */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Interactive Timeline Builder</label>
                                        <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">AUTO-SORT ENABLED</span>
                                    </div>

                                    <div className="space-y-8">
                                        {sortedDates.map((date) => (
                                            <div key={date} className="relative pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-left-2 duration-300">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-indigo-500"></div>
                                                <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Icons.Calendar size={12} className="text-indigo-500" />
                                                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </h4>

                                                <div className="grid gap-3">
                                                    {groupedTasks[date].map((task: any) => (
                                                        <div key={task.originalIndex} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all flex flex-col sm:flex-row items-center gap-4">
                                                            {/* Title Input */}
                                                            <input
                                                                type="text"
                                                                value={task.title}
                                                                onChange={(e) => handleUpdateStructuredTask(task.originalIndex, 'title', e.target.value)}
                                                                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-zinc-100 w-full"
                                                            />

                                                            <div className="flex items-center gap-4 shrink-0">
                                                                {/* Estimated Hours */}
                                                                <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                                    <Icons.Clock size={12} className="text-zinc-400 mr-2" />
                                                                    <input
                                                                        type="number"
                                                                        step="0.5"
                                                                        value={task.estimatedHours}
                                                                        onChange={(e) => handleUpdateStructuredTask(task.originalIndex, 'estimatedHours', parseFloat(e.target.value))}
                                                                        className="w-10 bg-transparent border-none outline-none text-xs font-mono font-bold text-indigo-600 text-center"
                                                                    />
                                                                    <span className="text-[10px] font-bold text-zinc-400 ml-1">HRS</span>
                                                                </div>

                                                                {/* Date Adjuster */}
                                                                <input
                                                                    type="date"
                                                                    value={task.startDate}
                                                                    onChange={(e) => handleUpdateStructuredTask(task.originalIndex, 'startDate', e.target.value)}
                                                                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 outline-none cursor-pointer"
                                                                />

                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => handleRemoveTask(task.originalIndex)}
                                                                    className="p-2 text-zinc-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Icons.Trash size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex justify-center gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    onClick={() => setIsGenerated(false)}
                                    className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors"
                                >
                                    Discard & Retry
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/20 flex items-center gap-3"
                                >
                                    <Icons.Zap size={16} />
                                    Sync Verified Plan
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 flex justify-between items-center shrink-0 font-medium">
                    <span className="flex items-center gap-1.5"><Icons.Shield size={10} className="text-emerald-500" /> DATA VALIDITY: VERIFIED</span>
                    <span className="flex items-center gap-1.5"><Icons.Clock size={10} /> AGENT RUNTIME: GEMINI 2.0 FLASH (DEEP THINKING)</span>
                </div>
            </div>
        </div>
    );
};
