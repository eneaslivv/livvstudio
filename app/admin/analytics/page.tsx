'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/admin/Icons';
import { useSupabase } from '@/hooks/useSupabase';
import { Lead } from '@/types/livv-os';

export default function AnalyticsPage() {
    const [isSyncing, setIsSyncing] = useState(false);

    // Fetch real leads data from Supabase
    const { data: leads } = useSupabase<Lead>('leads');
    const inboundLeadsCount = leads.length; // Total leads as form submissions
    const openLeadsCount = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500 overflow-y-auto pr-2 no-scrollbar">
            <div className="flex justify-between items-end shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Sales Analytics</h1>
                    <p className="text-zinc-500 text-sm">Monitor your website performance and conversion metrics. <span className="opacity-60 italic">(Traffic data is simulated. Leads are real-time.)</span></p>
                </div>
                <button onClick={handleSync} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-lg text-sm font-bold hover:shadow-md transition-all">
                    <Icons.History size={16} className={isSyncing ? 'animate-spin' : ''} />
                    Sync Data
                </button>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                {[
                    { label: 'Total Visits', value: '0', trend: '0%', icon: <Icons.Users size={18} />, color: 'bg-zinc-200 dark:bg-zinc-800' },
                    { label: 'Avg. Bounce Rate', value: '0%', trend: '0%', icon: <Icons.Zap size={18} />, color: 'bg-zinc-200 dark:bg-zinc-800' },
                    { label: 'Form Submissions', value: inboundLeadsCount.toString(), trend: 'Live', icon: <Icons.Mail size={18} />, color: 'bg-emerald-500' },
                    { label: 'Conversion Rate', value: '0%', trend: '0%', icon: <Icons.Target size={18} />, color: 'bg-zinc-200 dark:bg-zinc-800' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm group hover:border-zinc-400 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl text-white ${kpi.color} shadow-lg shadow-zinc-200/50 dark:shadow-none`}>{kpi.icon}</div>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${kpi.trend === 'Live' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>{kpi.trend}</span>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{kpi.label}</div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{kpi.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6 pb-10">
                {/* Traffic Sources & Funnel Placeholder */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-12 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center h-[300px]">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full mb-6">
                            <Icons.Chart size={32} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Connect Analytics</h3>
                        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
                            Traffic data, conversion funnels, and high-performing content metrics require an active Vercel Analytics or Google Analytics integration.
                        </p>
                        <button className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                            Configure Integration
                        </button>
                    </div>
                </div>

                {/* Integration & Insights */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-zinc-900 dark:bg-white p-7 rounded-[2rem] text-white dark:text-zinc-900 shadow-xl relative overflow-hidden group">
                        <Icons.Shield size={120} className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Connected Services</h3>
                        <div className="space-y-5 relative z-10">
                            {[
                                { name: 'Google Analytics 4', status: 'disconnected', time: 'Not Connected' },
                                { name: 'Meta Conversion API', status: 'disconnected', time: 'Not Connected' },
                                { name: 'Supabase Database', status: 'connected', time: 'Active' },
                            ].map((sync, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex flex-col"><span className="text-xs font-bold tracking-tight">{sync.name}</span><span className="text-[9px] opacity-40 uppercase font-bold">{sync.time}</span></div>
                                    <div className={`w-2 h-2 rounded-full ${sync.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-7 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-[2rem] shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                            <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Icons.Sparkles size={18} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Growth Engine</h4>
                        </div>
                        <p className="text-[13px] text-indigo-900 dark:text-indigo-300 leading-relaxed font-bold italic">
                            "Connect traffic sources to enable AI-driven insights and lead forecasting."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
