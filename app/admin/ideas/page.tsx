'use client';

import React, { useState, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { Idea } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptIdea } from '@/lib/admin-adapters';

export default function IdeasPage() {
    const { data: dbIdeas, add: addIdea, remove: removeIdea, loading } = useSupabase<any>('ideas');
    const ideas = useMemo(() => dbIdeas.map(adaptIdea), [dbIdeas]);
    const [newIdea, setNewIdea] = useState('');

    const handleAddIdea = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newIdea.trim()) {
            await addIdea({
                text: newIdea.trim(),
                tags: ['New']
            });
            setNewIdea('');
        }
    };

    const handleRemoveIdea = async (id: string) => {
        await removeIdea(id);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Ideas & Quick Capture</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Brainstorming buffer for fleeting thoughts.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Input */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-start gap-4">
                            <Icons.Lightbulb size={24} className="text-amber-500 mt-2" />
                            <div className="flex-1">
                                <textarea
                                    value={newIdea}
                                    onChange={(e) => setNewIdea(e.target.value)}
                                    onKeyDown={handleAddIdea}
                                    placeholder="Capture a new idea..."
                                    className="w-full bg-transparent border-none outline-none text-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 resize-none min-h-[80px]"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Press Enter to save</span>
                                    <button
                                        onClick={() => handleAddIdea({ key: 'Enter' } as any)}
                                        disabled={!newIdea.trim()}
                                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
                                    >
                                        Save Idea
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ideas.map(idea => (
                            <div key={idea.id} className="group bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-sm">
                                <p className="text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed mb-4 min-h-[60px]">
                                    {idea.text}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {idea.tags?.map((tag: string) => (
                                            <span key={tag} className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 rounded-lg uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] text-zinc-300 font-bold">{idea.createdAt}</span>
                                        <button onClick={() => handleRemoveIdea(idea.id)} className="p-2 text-zinc-300 hover:text-rose-500 transition-colors">
                                            <Icons.Close size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
