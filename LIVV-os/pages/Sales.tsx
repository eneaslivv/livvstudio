
import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '../components/ui/Icons';
import { Lead, WebAnalytics, LeadCategory, LeadTemperature, LeadStatus, PageView } from '../types';
import { Finance } from './Finance';

// --- PROPS ---
interface SalesProps {
    view: 'crm' | 'inbox' | 'analytics';
    onNavigate?: (page: PageView) => void;
}

// --- MOCK DATA ---
const MOCK_LEADS_DATA: Lead[] = [
    {
        id: '1', name: 'Martín Gomez', email: 'martin.g@startup.io', message: 'Hi, looking for SaaS rebranding.',
        origin: 'Web Form', status: 'new', createdAt: '2h ago', lastInteraction: 'None',
        aiAnalysis: { category: 'branding', temperature: 'hot', summary: 'High intent SaaS launch imminent.', recommendation: 'Send "SaaS Branding Kit" PDF.' },
        history: []
    },
    {
        id: '2', name: 'Sarah Lee', email: 'sarah@boutique.co', message: 'Shopify dev needed.',
        origin: 'Instagram', status: 'contacted', createdAt: '1d ago', lastInteraction: 'Sent Pricing',
        aiAnalysis: { category: 'ecommerce', temperature: 'warm', summary: 'Specific need for Shopify Dev.', recommendation: 'Share E-com portfolio.' },
        history: []
    },
    {
        id: '3', name: 'TechFlow Inc', email: 'partners@techflow.com', message: 'Partnership inquiry.',
        origin: 'Web Form', status: 'following', createdAt: '3d ago', lastInteraction: 'Meeting scheduled',
        aiAnalysis: { category: 'other', temperature: 'cold', summary: 'Vague inquiry. B2B potential.', recommendation: 'Qualify via email.' },
        history: []
    }
];

const MOCK_ANALYTICS: WebAnalytics = {
    totalVisits: 12450, uniqueVisitors: 8900, bounceRate: 42, conversions: 185,
    topPages: [{ path: '/', views: 5200 }, { path: '/projects', views: 3100 }, { path: '/blog/ui-trends', views: 1800 }, { path: '/contact', views: 950 }],
    dailyVisits: [{ date: 'Mon', value: 120 }, { date: 'Tue', value: 145 }, { date: 'Wed', value: 132 }, { date: 'Thu', value: 190 }, { date: 'Fri', value: 160 }, { date: 'Sat', value: 90 }, { date: 'Sun', value: 110 }]
};

// --- SUB-COMPONENTS ---
const AI_Badge = ({ category, temp }: { category?: LeadCategory, temp?: LeadTemperature }) => {
    if (!category) return null;
    const colors = { branding: 'bg-purple-100 text-purple-700', 'web-design': 'bg-blue-100 text-blue-700', ecommerce: 'bg-emerald-100 text-emerald-700', saas: 'bg-indigo-100 text-indigo-700', creators: 'bg-pink-100 text-pink-700', other: 'bg-zinc-100 text-zinc-600' };
    return <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${colors[category] || colors.other}`}>{category.replace('-', ' ')}</span>;
};

const SalesKanban = ({ leads, setLeads }: { leads: Lead[], setLeads: any }) => {
    const columns: LeadStatus[] = ['new', 'contacted', 'following', 'closed', 'lost'];
    return (
        <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 h-full min-w-[1000px]">
                {columns.map(status => (
                    <div key={status} className="flex-1 flex flex-col min-w-[250px] h-full">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">{status}</span>
                            <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">{leads.filter(l => l.status === status).length}</span>
                        </div>
                        <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl p-2 border border-dashed border-zinc-200 dark:border-zinc-800 space-y-3 overflow-y-auto">
                            {leads.filter(l => l.status === status).map(lead => (
                                <div key={lead.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] text-zinc-400 font-mono">{lead.createdAt}</span>
                                        <AI_Badge category={lead.aiAnalysis?.category} />
                                    </div>
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">{lead.name}</h4>
                                    <div className="text-[11px] text-zinc-500 line-clamp-2">{lead.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ANALYTICS DASHBOARD ---
const AnalyticsDashboard = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    
    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className="h-full overflow-y-auto pr-2 no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Visits', value: '12.4k', trend: '+12%', icon: <Icons.Users size={18}/>, color: 'bg-blue-500' },
                    { label: 'Avg. Bounce Rate', value: '42.1%', trend: '-4%', icon: <Icons.Zap size={18}/>, color: 'bg-purple-500' },
                    { label: 'Form Submissions', value: '185', trend: '+28%', icon: <Icons.Mail size={18}/>, color: 'bg-emerald-500' },
                    { label: 'Conversion Rate', value: '1.48%', trend: '+0.2%', icon: <Icons.Target size={18}/>, color: 'bg-amber-500' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl text-white ${kpi.color} shadow-lg shadow-zinc-200/50 dark:shadow-none`}>
                                {kpi.icon}
                            </div>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {kpi.trend}
                            </span>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{kpi.label}</div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{kpi.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Traffic Sources & Funnel */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Visual Funnel */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                                <Icons.Chart size={16} className="text-indigo-500"/> Conversion Funnel (30d)
                            </h3>
                            <button onClick={handleSync} className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
                                <Icons.History size={10} className={isSyncing ? 'animate-spin' : ''}/> Sync GA4
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { label: 'Website Visits', value: 12450, color: 'bg-zinc-900 dark:bg-white', width: '100%' },
                                { label: 'Qualified Interest', value: 2100, color: 'bg-zinc-700 dark:bg-zinc-200', width: '35%' },
                                { label: 'Inbound Leads', value: 185, color: 'bg-indigo-600', width: '12%' },
                                { label: 'Closed Projects', value: 12, color: 'bg-emerald-500', width: '4%' },
                            ].map((step, i) => (
                                <div key={i} className="group flex items-center gap-6">
                                    <div className="w-32 shrink-0">
                                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{step.label}</div>
                                        <div className="text-[10px] text-zinc-400 font-mono">{step.value.toLocaleString()}</div>
                                    </div>
                                    <div className="flex-1 h-8 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
                                        <div 
                                            className={`h-full ${step.color} transition-all duration-1000 ease-out flex items-center justify-end pr-4`} 
                                            style={{ width: step.width }}
                                        >
                                            <span className="text-[9px] font-black text-white dark:text-black mix-blend-difference">{step.width}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Pages List */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">High-Performing Content</h3>
                            {/* Fixed Icon Name: Changed from Icons.ArrowUpRight to Icons.External */}
                            <Icons.External size={14} className="text-zinc-300"/>
                        </div>
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                            {MOCK_ANALYTICS.topPages.map((page, i) => (
                                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-mono text-zinc-400">0{i+1}</div>
                                        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{page.path}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{(page.views/1000).toFixed(1)}k</div>
                                            <div className="text-[9px] text-zinc-400 uppercase">Views</div>
                                        </div>
                                        <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${(page.views / MOCK_ANALYTICS.totalVisits) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Integration & Real-time Info */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Sync Status Card */}
                    <div className="bg-zinc-900 dark:bg-zinc-100 p-7 rounded-[2rem] text-white dark:text-zinc-900 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform">
                            <Icons.Shield size={120}/>
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Connected Services</h3>
                        <div className="space-y-5 relative z-10">
                            {[
                                { name: 'Google Analytics 4', status: 'connected', time: '5m ago' },
                                { name: 'Meta Conversion API', status: 'error', time: '1d ago' },
                                { name: 'Linear Webhooks', status: 'connected', time: 'Just now' },
                                { name: 'Stripe Events', status: 'idle', time: 'Never' },
                            ].map((sync, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold tracking-tight">{sync.name}</span>
                                        <span className="text-[9px] opacity-40 uppercase font-bold">{sync.time}</span>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${sync.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : sync.status === 'error' ? 'bg-rose-500' : 'bg-zinc-600'}`}></div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all shadow-lg">
                            Configure Endpoints
                        </button>
                    </div>

                    {/* AI Prediction Insight */}
                    <div className="p-7 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-[2rem] shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                            <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Icons.Sparkles size={18}/></div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Growth Engine</h4>
                        </div>
                        <p className="text-[13px] text-indigo-900 dark:text-indigo-300 leading-relaxed font-bold italic mb-4">
                            "Basado en el volumen de tráfico actual hacia la página '/contact', se proyectan 45 nuevos leads para finales de mes si mantienes el CTR del 12.5%."
                        </p>
                        <div className="flex gap-2">
                            <span className="text-[9px] font-black uppercase bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded text-indigo-700 dark:text-indigo-400">Optimization Goal: +15%</span>
                        </div>
                    </div>

                    {/* Quick Settings */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Metric Tracking</h3>
                        <div className="space-y-4">
                            {['Enable Heatmaps', 'Anonymize IP', 'Real-time Alerts'].map((label, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                                    <div className="w-8 h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full relative cursor-pointer border border-zinc-200 dark:border-zinc-700">
                                        <div className={`absolute top-0.5 ${i === 2 ? 'left-0.5' : 'right-0.5'} w-3 h-3 ${i === 2 ? 'bg-zinc-300' : 'bg-indigo-600'} rounded-full transition-all`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE CONTAINER ---
export const Sales: React.FC<SalesProps> = ({ view, onNavigate }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS_DATA);
  const [mode, setMode] = useState<'sales' | 'finance'>(() => {
      const saved = localStorage.getItem('sales_mode');
      return (saved as 'sales' | 'finance') || 'sales';
  });

  useEffect(() => {
      localStorage.setItem('sales_mode', mode);
  }, [mode]);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6 font-sans">
        
        {/* Header Section */}
        <div className="flex justify-between items-end shrink-0">
            <div>
                <div className="flex items-center gap-4 mb-1">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {mode === 'sales' ? (view === 'crm' ? 'CRM Pipeline' : view === 'inbox' ? 'Leads Inbox' : 'Analytics') : 'Finance & Profitability'}
                    </h1>
                    
                    {/* PERSISTENT MODE SWITCHER */}
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full border border-zinc-200 dark:border-zinc-700 ml-2">
                        <button 
                            onClick={() => setMode('sales')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${mode === 'sales' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            Sales
                        </button>
                        <button 
                            onClick={() => setMode('finance')}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${mode === 'finance' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            Finance
                        </button>
                    </div>
                </div>
                <p className="text-zinc-500 text-sm">
                    {mode === 'sales' ? 'Manage incoming leads and track your sales funnel.' : 'Real-time financial health, milestones, and client profitability.'}
                </p>
            </div>
            
            {mode === 'sales' && (
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:bg-zinc-50 transition-colors">Export CSV</button>
                    <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">+ Manual Lead</button>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            {mode === 'finance' ? (
                <Finance onNavigate={onNavigate} />
            ) : (
                <>
                    {view === 'crm' && <SalesKanban leads={leads} setLeads={setLeads} />}
                    {view === 'inbox' && <div className="text-zinc-400 p-10 text-center border border-dashed border-zinc-200 rounded-2xl">Inbox View - Select Finance to see ROI details.</div>}
                    {view === 'analytics' && <AnalyticsDashboard />}
                </>
            )}
        </div>
    </div>
  );
};
