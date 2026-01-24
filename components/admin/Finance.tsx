
import React, { useState, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { ProjectFinance, Milestone, ClientFinance, FinancialHealth, Status, PageView, Project } from '@/types/livv-os';

// --- MOCK DATA ---

const MOCK_CLIENTS_FINANCE: ClientFinance[] = [
    {
        id: 'c1', name: 'Bank Corp', status: 'active', avatar: 'BC', historicalBilling: 45000, averageProfitability: 68,
        projects: [
            {
                id: 'p1', title: 'Fintech Dashboard', description: 'UX Overhaul for core banking apps.', progress: 75, status: Status.Active,
                clientId: 'c1', client: 'Bank Corp', nextSteps: 'Testing', updatedAt: 'Now', model: 'milestones', health: 'profitable',
                totalAgreed: 12000, totalCollected: 8500, directExpenses: 1200, imputedExpenses: 450, tasks: [],
                milestones: [
                    { id: 'm1', name: 'Discovery & UX', totalAmount: 4000, status: 'paid', expectedDate: '2023-09-15', actualDate: '2023-09-16', payments: [{ id: 'pp1', amount: 4000, date: '2023-09-16' }] },
                    { id: 'm2', name: 'High-Fi Prototyping', totalAmount: 4500, status: 'partial', expectedDate: '2023-10-10', actualDate: '2023-10-12', payments: [{ id: 'pp2', amount: 3000, date: '2023-10-12' }] },
                    { id: 'm3', name: 'Frontend Handoff', totalAmount: 3500, status: 'pending', expectedDate: '2023-10-25', payments: [] },
                ]
            },
            {
                id: 'p3', title: 'Mobile App POC', description: 'Internal testing app for employees.', progress: 100, status: Status.Completed,
                clientId: 'c1', client: 'Bank Corp', nextSteps: 'None', updatedAt: '1m ago', model: 'fixed', health: 'profitable',
                totalAgreed: 5000, totalCollected: 5000, directExpenses: 500, imputedExpenses: 200, tasks: [],
                milestones: []
            }
        ]
    },
    {
        id: 'c2', name: 'Shopifyy', status: 'active', avatar: 'SH', historicalBilling: 12500, averageProfitability: 42,
        projects: [
            {
                id: 'p2', title: 'E-commerce API', description: 'Backend integration for retail partners.', progress: 30, status: Status.Active,
                clientId: 'c2', client: 'Shopifyy', nextSteps: 'Schema', updatedAt: 'Yesterday', model: 'fixed', health: 'at-risk',
                totalAgreed: 8000, totalCollected: 2000, directExpenses: 4500, imputedExpenses: 450, tasks: [],
                milestones: [
                    { id: 'm4', name: 'Initial Deposit', totalAmount: 2000, status: 'paid', expectedDate: '2023-10-01', payments: [{ id: 'pp3', amount: 2000, date: '2023-10-02' }] },
                    { id: 'm5', name: 'API Release', totalAmount: 6000, status: 'delayed', expectedDate: '2023-10-15', payments: [] },
                ]
            }
        ]
    },
    {
        id: 'c3', name: 'TechFlow', status: 'paused', avatar: 'TF', historicalBilling: 2100, averageProfitability: 15,
        projects: []
    }
];

const MOCK_GLOBAL_EXPENSES = [
    { id: 'ge1', name: 'Figma Pro', amount: 45, category: 'tools' as const, isImputed: true, date: '2023-10-01' },
    { id: 'ge2', name: 'AWS Cloud', amount: 120, category: 'infra' as const, isImputed: true, date: '2023-10-01' },
    { id: 'ge3', name: 'Office Rent', amount: 1500, category: 'infra' as const, isImputed: false, date: '2023-10-01' },
];

// --- COMPONENTS ---

const HealthBadge = ({ health }: { health: FinancialHealth }) => {
    const configs = {
        profitable: { label: 'Rentable', class: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' },
        'at-risk': { label: 'En Riesgo', class: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400' },
        loss: { label: 'Pérdida', class: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400' }
    };
    const c = configs[health];
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${c.class}`}>{c.label}</span>;
};

const MetricBlock = ({ label, value, sub, isCurrency = true, highlight = false, className = "" }: { label: string, value: number, sub?: string, isCurrency?: boolean, highlight?: boolean, className?: string }) => (
    <div className={`flex flex-col ${highlight ? 'bg-zinc-900 dark:bg-zinc-100 p-4 rounded-2xl shadow-xl border border-zinc-700/50 dark:border-zinc-200 min-w-[180px]' : ''} ${className}`}>
        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
        <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {isCurrency ? `$${value.toLocaleString()}` : `${value}%`}
        </div>
        {sub && <span className={`text-[10px] mt-1 font-medium ${highlight ? 'text-zinc-400/80 dark:text-zinc-500/80' : 'text-zinc-500'}`}>{sub}</span>}
    </div>
);

interface FinanceProps {
    onNavigate?: (page: PageView | string) => void;
}

export const Finance: React.FC<FinanceProps> = ({ onNavigate }) => {
    const [viewMode, setViewMode] = useState<'panorama' | 'client'>('panorama');
    const [clients] = useState<ClientFinance[]>(MOCK_CLIENTS_FINANCE);
    const [selectedClientId, setSelectedClientId] = useState(clients[0].id);
    const [selectedProjectId, setSelectedProjectId] = useState(clients[0].projects[0]?.id || '');
    const [expenses] = useState(MOCK_GLOBAL_EXPENSES);

    // Derived State
    const activeClient = useMemo(() => clients.find(c => c.id === selectedClientId)!, [clients, selectedClientId]);
    const activeProject = useMemo(() => {
        const project = activeClient.projects.find(p => p.id === selectedProjectId);
        return project || activeClient.projects[0];
    }, [activeClient, selectedProjectId]);

    const stats = useMemo(() => {
        if (!activeProject) return null;
        const totalCosts = activeProject.directExpenses + activeProject.imputedExpenses;
        const netProfit = activeProject.totalAgreed - totalCosts;
        const margin = Math.round((netProfit / activeProject.totalAgreed) * 100);
        return { totalCosts, netProfit, margin, pending: activeProject.totalAgreed - activeProject.totalCollected };
    }, [activeProject]);

    const panoramaStats = useMemo(() => {
        let totalHistorical = 0;
        let totalAgreedActive = 0;
        let totalCollectedActive = 0;
        let allMilestones: { m: Milestone, client: ClientFinance, project: ProjectFinance }[] = [];

        clients.forEach(c => {
            totalHistorical += c.historicalBilling;
            c.projects.forEach(p => {
                if (p.status !== Status.Archived) {
                    totalAgreedActive += p.totalAgreed;
                    totalCollectedActive += p.totalCollected;
                    p.milestones.forEach(m => {
                        if (m.status !== 'paid') {
                            allMilestones.push({ m, client: c, project: p });
                        }
                    });
                }
            });
        });

        return {
            totalHistorical,
            totalAgreedActive,
            totalCollectedActive,
            upcomingMilestones: allMilestones.sort((a, b) => a.m.expectedDate.localeCompare(b.m.expectedDate)),
            globalMargin: 58 // Mock aggregate
        };
    }, [clients]);

    const monthTotal = useMemo(() => {
        return clients.reduce((acc, client) => {
            return acc + client.projects.reduce((pAcc, proj) => {
                return pAcc + proj.milestones.reduce((mAcc, ms) => {
                    return mAcc + ms.payments.reduce((payAcc, pay) => {
                        return payAcc + (pay.date.startsWith('2023-10') ? pay.amount : 0);
                    }, 0);
                }, 0);
            }, 0);
        }, 0);
    }, [clients]);

    const handleSelectContext = (cId: string, pId?: string) => {
        setSelectedClientId(cId);
        if (pId) setSelectedProjectId(pId);
        setViewMode('client');
    };

    return (
        <div className="flex gap-6 h-full animate-in fade-in duration-500 overflow-hidden font-sans">

            {/* 1. LEFT COLUMN: CLIENT LIST & GLOBAL SELECTOR */}
            <div className="w-72 flex flex-col gap-4 overflow-y-auto pr-2 border-r border-zinc-100 dark:border-zinc-800 shrink-0">
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-2">
                    <button
                        onClick={() => setViewMode('panorama')}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${viewMode === 'panorama' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'}`}
                    >
                        Panorama
                    </button>
                    <button
                        onClick={() => setViewMode('client')}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${viewMode === 'client' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'}`}
                    >
                        Clientes
                    </button>
                </div>

                <div className="px-1 mb-2">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Accounts</h3>
                </div>

                <div className="space-y-1">
                    {clients.map(c => (
                        <div
                            key={c.id}
                            onClick={() => handleSelectContext(c.id, c.projects[0]?.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group ${selectedClientId === c.id && viewMode === 'client' ? 'bg-white dark:bg-black border-zinc-300 dark:border-zinc-700 shadow-md ring-1 ring-zinc-50 dark:ring-zinc-800' : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${selectedClientId === c.id && viewMode === 'client' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                    {c.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate text-zinc-900 dark:text-zinc-100">{c.name}</h4>
                                    <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 mt-0.5">
                                        <span>MARGEN: {c.averageProfitability}%</span>
                                        <span className="font-mono text-zinc-500">${(c.historicalBilling / 1000).toFixed(1)}k</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. CENTER PANEL: MAIN DASHBOARD */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">

                {/* GLOBAL DASHBOARD HEADER */}
                <div className="shrink-0 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/20 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex gap-12 items-center">
                        <MetricBlock label="Total Facturado (Octubre)" value={monthTotal} highlight={true} sub="Total ingresos netos del mes" />
                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
                        <MetricBlock label="Active Pipeline" value={panoramaStats.totalAgreedActive} sub="Valor total de proyectos en curso" />
                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">AGENCY HEALTH</span>
                            <span className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/20">
                                <Icons.Zap size={14} /> Optimización Alta
                            </span>
                        </div>
                    </div>
                </div>

                {viewMode === 'panorama' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Panorama Cards */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Icons.Chart size={14} /> Revenue Distribution
                                </div>
                                <div className="space-y-4">
                                    {clients.map(c => (
                                        <div key={c.id} onClick={() => handleSelectContext(c.id)} className="flex items-center gap-4 cursor-pointer group">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">{c.avatar}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1 text-xs">
                                                    <span className="font-bold">{c.name}</span>
                                                    <span className="font-mono text-zinc-500">${c.historicalBilling.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all group-hover:scale-x-105" style={{ width: `${(c.historicalBilling / panoramaStats.totalHistorical) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900 dark:bg-zinc-100 p-8 rounded-3xl text-white dark:text-zinc-900 shadow-2xl relative overflow-hidden">
                                <Icons.Sparkles size={80} className="absolute -right-4 -top-4 opacity-10" />
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Global Margin Target</span>
                                <div className="text-5xl font-black mt-2 mb-4">{panoramaStats.globalMargin}%</div>
                                <p className="text-xs opacity-70 leading-relaxed max-w-[200px]">Estás operando un 12% por encima del benchmark de agencias de tu sector.</p>
                                <button className="mt-8 px-6 py-2 bg-white/10 dark:bg-zinc-900/10 border border-white/20 dark:border-zinc-900/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all">Download Q3 Report</button>
                            </div>
                        </div>

                        {/* Upcoming Milestones Table */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Cronograma Global de Cobros</h3>
                                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">{panoramaStats.upcomingMilestones.length} Pendientes</span>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950 text-[9px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4">Expectativa</th>
                                        <th className="px-6 py-4">Cuenta / Proyecto</th>
                                        <th className="px-6 py-4">Concepto</th>
                                        <th className="px-6 py-4 text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-5 dark:divide-zinc-800">
                                    {panoramaStats.upcomingMilestones.map((item, i) => (
                                        <tr key={i} onClick={() => handleSelectContext(item.client.id, item.project.id)} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors cursor-pointer">
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-mono font-bold text-zinc-400">{item.m.expectedDate}</div>
                                                <div className={`text-[10px] font-bold uppercase ${item.m.status === 'delayed' ? 'text-rose-500' : 'text-zinc-400'}`}>{item.m.status}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.client.name}</div>
                                                <div className="text-[10px] text-zinc-400 uppercase font-medium">{item.project.title}</div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-zinc-600 dark:text-zinc-400">{item.m.name}</td>
                                            <td className="px-6 py-5 text-right font-black text-zinc-900 dark:text-zinc-100">${item.m.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {activeProject ? (
                            <>
                                {/* Client Detail Header */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex justify-between items-center">
                                    <div className="flex gap-10 items-center">
                                        <MetricBlock label="Pactado Proyecto" value={activeProject.totalAgreed} />
                                        <div className="w-px h-12 bg-zinc-100 dark:bg-zinc-800"></div>
                                        <MetricBlock label="Cobrado a la Fecha" value={activeProject.totalCollected} sub={`${Math.round((activeProject.totalCollected / activeProject.totalAgreed) * 100)}% total`} />
                                        <div className="w-px h-12 bg-zinc-100 dark:bg-zinc-800"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">HEALTH SCORE</span>
                                            <div className="flex items-center gap-3">
                                                <HealthBadge health={activeProject.health} />
                                                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats?.margin}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => onNavigate?.('projects')}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg"
                                        >
                                            <Icons.Briefcase size={14} /> Ir al Proyecto
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-all">
                                            <Icons.Docs size={14} /> Ver Contrato
                                        </button>
                                    </div>
                                </div>

                                {/* Milestones Details */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex justify-between items-center">
                                        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Milestones & Collections Details</h3>
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">+ Add Milestone</button>
                                    </div>
                                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                        {activeProject.milestones.length > 0 ? activeProject.milestones.map((m) => (
                                            <div key={m.id} className="p-6 group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all">
                                                <div className="flex items-start justify-between mb-5">
                                                    <div className="flex gap-5">
                                                        <div className={`mt-1 w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-sm ${m.status === 'paid' ? 'bg-emerald-500 border-emerald-500 text-white' : m.status === 'delayed' ? 'border-rose-300 text-rose-500 bg-rose-50' : m.status === 'partial' ? 'border-indigo-500 text-indigo-500 bg-indigo-50' : 'border-zinc-200 text-zinc-300'}`}>
                                                            {m.status === 'paid' ? <Icons.Check size={20} strokeWidth={3} /> : <Icons.Clock size={20} strokeWidth={3} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                                                                {m.name}
                                                                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${m.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : m.status === 'delayed' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                    {m.status}
                                                                </span>
                                                            </h4>
                                                            <p className="text-xs text-zinc-500 mt-1">Expected: {m.expectedDate} • Total Goal: <b>${m.totalAmount.toLocaleString()}</b></p>
                                                        </div>
                                                    </div>
                                                    <button className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all">
                                                        Registrar Pago
                                                    </button>
                                                </div>
                                                <div className="pl-14 space-y-4 relative">
                                                    <div className="absolute left-[34px] top-0 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                                                    {m.payments.map(p => (
                                                        <div key={p.id} className="flex items-center gap-4 text-[11px] relative">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 z-10 border-2 border-white dark:border-zinc-900 shadow-sm"></div>
                                                            <span className="text-zinc-400 font-mono font-bold uppercase">{p.date}:</span>
                                                            <span className="text-zinc-900 dark:text-zinc-100 font-black text-[13px]">${p.amount.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center text-zinc-400">
                                                No hay hitos definidos para este proyecto.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-300 mb-4 border border-zinc-100 dark:border-zinc-800">
                                    <Icons.Briefcase size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No hay proyectos activos</h3>
                                <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">
                                    Este cliente no tiene proyectos vinculados actualmente. Comienza uno nuevo desde la sección de Proyectos.
                                </p>
                                <button
                                    onClick={() => onNavigate?.('projects')}
                                    className="mt-6 px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold"
                                >
                                    Crear Proyecto
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3. RIGHT PANEL: SUMMARY & GLOBAL EXPENSES */}
            <div className="w-80 space-y-6 shrink-0">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">Desglose de Costos</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 font-medium">Gastos Directos</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">${viewMode === 'client' ? (activeProject?.directExpenses || 0) : 'Agregado Global'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 font-medium">Gastos Imputados</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">${viewMode === 'client' ? (activeProject?.imputedExpenses || 0) : 'Calculado (12%)'}</span>
                        </div>
                        <div className="pt-5 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                            <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Costo Total</span>
                            <span className="text-lg font-black text-rose-600 dark:text-rose-400 tracking-tighter">
                                ${viewMode === 'client' ? (stats?.totalCosts || 0) : 'Variable'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 dark:bg-zinc-100 p-7 rounded-[2rem] text-white dark:text-zinc-900 shadow-xl overflow-hidden relative group">
                    <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Icons.Zap size={120} />
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-5 opacity-60">Gastos Generales (Mensual)</h3>
                    <div className="space-y-4 relative z-10">
                        {expenses.map(exp => (
                            <div key={exp.id} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tracking-tight">{exp.name}</span>
                                    <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded w-fit mt-1 border ${exp.isImputed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                                        {exp.isImputed ? 'Imputado' : 'Fijo'}
                                    </span>
                                </div>
                                <span className="text-sm font-mono font-black tracking-tighter">${exp.amount}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all shadow-lg">
                        Manage Expenses
                    </button>
                </div>

                <div className="p-7 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400">
                        <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Icons.Chart size={18} /></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">ROI Insights</h4>
                    </div>
                    <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed font-bold">
                        {viewMode === 'client' && activeProject ? (
                            <>El proyecto <span className="underline decoration-emerald-300">{activeProject.title}</span> tiene un margen superior al promedio por un <span className="text-emerald-600 dark:text-emerald-400 font-black">15%</span>.</>
                        ) : (
                            <>El margen global se mantiene sólido en <span className="text-emerald-600 dark:text-emerald-400 font-black">{panoramaStats.globalMargin}%</span>. Sugerencia: Cerrar Q4 con foco en proyectos de alto margen.</>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
