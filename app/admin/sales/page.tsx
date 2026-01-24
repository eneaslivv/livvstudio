'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { Lead, WebAnalytics, LeadCategory, LeadTemperature, LeadStatus, PageView } from '@/types/livv-os';
import { Finance } from '@/components/admin/Finance';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptLead } from '@/lib/admin-adapters';

// --- MOCK ANALYTICS DATA ---
const MOCK_ANALYTICS: WebAnalytics = {
    totalVisits: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    conversions: 0,
    topPages: [],
    dailyVisits: Array.from({ length: 14 }).map((_, i) => ({
        date: `Oct ${i + 1}`,
        value: 0,
    })),
};

// --- SUB-COMPONENTS ---

const LeadCard = ({ lead, onDragStart }: { lead: Lead; onDragStart: (e: React.DragEvent, id: string) => void }) => {
    const tempColors = {
        hot: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900',
        warm: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900',
        cold: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-900',
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead.id)}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
                    {lead.origin === 'LIVV-os' ? <Icons.Zap size={10} /> : <Icons.Globe size={10} />} {lead.origin || 'Direct'}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"><Icons.More size={12} className="text-zinc-400" /></button>
                </div>
            </div>

            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">{lead.name}</h4>
            <p className="text-[11px] text-zinc-500 mb-3 truncate">{lead.email}</p>

            {lead.aiAnalysis && (
                <div className="mb-3 p-2 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${tempColors[lead.aiAnalysis.temperature]}`}>
                            {lead.aiAnalysis.temperature}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">{lead.aiAnalysis.category}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-snug line-clamp-2 italic">
                        "{lead.aiAnalysis.summary}"
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase tracking-wider border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
                <span>{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Details →</button>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function SalesPage() {
    const [mode, setMode] = useState<'sales' | 'finance'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('sales_mode') as 'sales' | 'finance') || 'sales';
        }
        return 'sales';
    });

    const { data: dbLeads, update: updateDBLead } = useSupabase<any>('leads');
    const leads = useMemo(() => dbLeads.map(adaptLead), [dbLeads]);

    // Analytics State
    const [analytics] = useState<WebAnalytics>(MOCK_ANALYTICS);

    useEffect(() => {
        localStorage.setItem('sales_mode', mode);
    }, [mode]);

    // Derived State
    const kpis = {
        totalLeads: leads.length,
        conversionRate: '12.5%', // Mock
        pipelineValue: '$45,200',
        activeDeals: leads.filter((l: Lead) => l.status !== 'closed' && l.status !== 'lost').length
    };

    // Kanban Handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('leadId', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
        const id = e.dataTransfer.getData('leadId');
        if (id) {
            await updateDBLead(id, { status });
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6 font-sans">

            {/* Header Switcher */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                    <button
                        onClick={() => setMode('sales')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mode === 'sales' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Icons.Users size={14} /> CRM & Sales
                    </button>
                    <button
                        onClick={() => setMode('finance')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mode === 'finance' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Icons.Chart size={14} /> Finance
                    </button>
                </div>

                {mode === 'sales' && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Live Pipeline
                        </span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {mode === 'sales' ? (
                    <div className="h-full grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Left: Kanban Board */}
                        <div className="col-span-8 flex flex-col gap-6 h-full overflow-hidden">
                            {/* KPI Row */}
                            <div className="grid grid-cols-4 gap-4 shrink-0">
                                {[
                                    { label: 'Total Leads', value: kpis.totalLeads, icon: <Icons.Users size={16} /> },
                                    { label: 'Active Deals', value: kpis.activeDeals, icon: <Icons.Target size={16} /> },
                                    { label: 'Pipeline Val', value: kpis.pipelineValue, icon: <Icons.DollarSign size={16} /> },
                                    { label: 'Conversion', value: kpis.conversionRate, icon: <Icons.Zap size={16} /> },
                                ].map((k, i) => (
                                    <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-24">
                                        <div className="text-zinc-400 mb-1">{k.icon}</div>
                                        <div>
                                            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{k.value}</div>
                                            <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">{k.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Kanban Columns (Fluid Fluidity) */}
                            <div className="flex-1 min-h-0 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {['new', 'contacted', 'following', 'closed'].map((status) => (
                                    <div
                                        key={status}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, status as LeadStatus)}
                                        className="flex flex-col h-full min-w-[260px] max-w-[300px] flex-1 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100/50 dark:border-zinc-800"
                                    >
                                        <div className="p-3 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 sticky top-0 bg-transparent z-10">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{status}</h4>
                                            <span className="bg-zinc-200 dark:bg-zinc-800 text-[9px] font-bold px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                                                {leads.filter((l: Lead) => l.status === status).length}
                                            </span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                            {leads.filter((l: Lead) => l.status === status).map((lead: Lead) => (
                                                <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
                                            ))}
                                            {leads.filter((l: Lead) => l.status === status).length === 0 && (
                                                <div className="h-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
                                                    Empty
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Analytics & Insights */}
                        <div className="col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                            <div className="bg-zinc-900 dark:bg-zinc-100 p-6 rounded-[2rem] text-white dark:text-zinc-900 shadow-xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <Icons.Eye size={18} className="text-zinc-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Web Analytics (Live)</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-black tracking-tighter">{analytics.totalVisits.toLocaleString()}</span>
                                    <span className="text-sm font-bold text-emerald-400">+12%</span>
                                </div>
                                <div className="text-xs font-medium text-zinc-500 mb-8">Total Visits this month</div>

                                <div className="space-y-4">
                                    {analytics.topPages.map((page, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="font-mono text-zinc-400">{page.path}</span>
                                            <span className="font-bold">{page.views.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm flex flex-col">
                                <div className="flex items-center gap-2 mb-6">
                                    <Icons.Sparkles size={18} className="text-indigo-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">AI Lead Scoring</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center text-center p-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                                    <div>
                                        <p className="text-zinc-400 text-xs mb-4">Select a lead to view detailed AI analysis, conversation sentiment, and closing probability.</p>
                                        <button className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors">
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Finance onNavigate={(page) => { if (typeof page === 'string' && page === 'projects') console.log("Navigate projects") }} />
                )}
            </div>
        </div>
    );
}
