'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/admin/Icons';
import { Lead, LeadCategory, LeadTemperature, LeadStatus } from '@/types/admin';
import { useSupabase } from '@/hooks/useSupabase';

// --- SUB-COMPONENTS ---
const AI_Badge = ({ category }: { category?: LeadCategory }) => {
    if (!category) return null;
    const colors: Record<string, string> = {
        branding: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
        'web-design': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        ecommerce: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
        saas: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
        creators: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
        other: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-transparent ${colors[category] || colors.other}`}>{category.replace('-', ' ')}</span>;
};

export default function CRMPage() {
    const { data: leads, loading, update: updateLead } = useSupabase<Lead>('leads');
    const columns: LeadStatus[] = ['new', 'contacted', 'following', 'closed', 'lost'];

    const handleMoveLead = async (leadId: string, newStatus: LeadStatus) => {
        await updateLead(leadId, { status: newStatus });
    };

    if (loading) return <div className="flex h-full items-center justify-center font-bold">LIVV CRM LOADING...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">CRM Pipeline</h1>
                    <p className="text-zinc-500 text-sm">Track and manage your incoming leads across the sales funnel.</p>
                </div>
                <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">+ Add Lead</button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-4 h-full min-w-[1200px]">
                    {columns.map(status => (
                        <div key={status} className="flex-1 flex flex-col min-w-[280px] h-full bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl p-3 border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{status}</span>
                                    <span className="text-[10px] text-zinc-400 font-bold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700">
                                        {leads.filter(l => l.status === status).length}
                                    </span>
                                </div>
                                <Icons.Plus size={14} className="text-zinc-300 hover:text-zinc-500 cursor-pointer" />
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pb-10">
                                {leads.filter(l => l.status === status).map(lead => (
                                    <div
                                        key={lead.id}
                                        className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-grab active:cursor-grabbing group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                                {lead.origin || 'Web'}
                                            </span>
                                            <AI_Badge category={lead.ai_analysis?.category} />
                                        </div>
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">{lead.name}</h4>
                                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-4">{lead.message}</p>

                                        <div className="flex items-center justify-between pt-3 border-t border-zinc-50 dark:border-zinc-800">
                                            <div className="flex -space-x-1.5">
                                                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icons.Mail size={12} className="text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                                                <Icons.External size={12} className="text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {leads.filter(l => l.status === status).length === 0 && (
                                    <div className="h-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
                                        No Leads
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
