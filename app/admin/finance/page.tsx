'use client';

import React, { useState, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { ProjectFinance, Milestone, ClientFinance, FinancialHealth, Status, Project } from '@/types/admin';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptInvoice, adaptExpense } from '@/lib/admin-adapters';

// --- REAL DATA HOOKS ---
export default function FinancePage() {
    const [viewMode, setViewMode] = useState<'panorama' | 'client'>('panorama');

    // Fetch real data from new tables
    const { data: invoicesRaw, loading: loadingInvoices, add: addInvoice } = useSupabase<any>('invoices');
    const { data: expensesRaw, loading: loadingExpenses, add: addExpense } = useSupabase<any>('expenses');
    const { data: projectsData, loading: loadingProjects } = useSupabase<Project>('projects');
    const { data: clientsRaw, loading: loadingClients } = useSupabase<any>('clients');

    // Adapt data
    const invoices = useMemo(() => invoicesRaw?.map(adaptInvoice) || [], [invoicesRaw]);
    const expenses = useMemo(() => expensesRaw?.map(adaptExpense) || [], [expensesRaw]);

    // Calculate real financial metrics
    const financialMetrics = useMemo(() => {
        const totalRevenue = invoices
            .filter((i: any) => i.status === 'paid')
            .reduce((sum: number, i: any) => sum + (i.total || 0), 0);

        const totalExpenses = expenses
            .filter((e: any) => e.status === 'approved')
            .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

        const pendingInvoices = invoices
            .filter((i: any) => i.status === 'sent' || i.status === 'draft')
            .reduce((sum: number, i: any) => sum + (i.total || 0), 0);

        const overdueInvoices = invoices
            .filter((i: any) => i.status === 'overdue')
            .reduce((sum: number, i: any) => sum + (i.total || 0), 0);

        const profit = totalRevenue - totalExpenses;
        const margin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

        return { totalRevenue, totalExpenses, pendingInvoices, overdueInvoices, profit, margin };
    }, [invoices, expenses]);

    // --- HELPER COMPONENTS ---
    const HealthBadge = ({ health }: { health: FinancialHealth }) => {
        const configs = {
            profitable: { label: 'Rentable', class: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' },
            'at-risk': { label: 'En Riesgo', class: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400' },
            loss: { label: 'Pérdida', class: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400' }
        };
        const c = configs[health || 'profitable'];
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${c.class}`}>{c.label}</span>;
    };

    const MetricBlock = ({ label, value, sub, isCurrency = true, highlight = false, className = "" }: { label: string, value: number, sub?: string, isCurrency?: boolean, highlight?: boolean, className?: string }) => (
        <div className={`flex flex-col ${highlight ? 'bg-zinc-900 dark:bg-zinc-100 p-4 rounded-2xl shadow-xl border border-zinc-700/50 dark:border-zinc-200 min-w-[180px]' : ''} ${className}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
            <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {isCurrency ? `$${(value || 0).toLocaleString()}` : `${value || 0}%`}
            </div>
            {sub && <span className={`text-[10px] mt-1 font-medium ${highlight ? 'text-zinc-400/80 dark:text-zinc-500/80' : 'text-zinc-500'}`}>{sub}</span>}
        </div>
    );

    // Aggregate data into ClientFinance structure
    const clients = useMemo(() => {
        const clientsMap: Record<string, ClientFinance> = {};

        projectsData.forEach(p => {
            const clientName = p.client || 'Unknown';
            if (!clientsMap[clientName]) {
                clientsMap[clientName] = {
                    id: clientName.toLowerCase().replace(/\s/g, '-'),
                    name: clientName,
                    status: 'active',
                    avatar: clientName.substring(0, 2).toUpperCase(),
                    historicalBilling: 0,
                    averageProfitability: 0,
                    projects: []
                };
            }

            // Use invoices to calculate billing
            const projectInvoices = invoices.filter((inv: any) => inv.projectId === p.id);
            const projectBilling = projectInvoices
                .filter((inv: any) => inv.status === 'paid')
                .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

            const projFin: ProjectFinance = {
                ...p,
                model: 'fixed',
                health: 'profitable',
                total_agreed: projectBilling,
                total_collected: projectBilling,
                direct_expenses: 0,
                imputed_expenses: 0,
                milestones: []
            };
            clientsMap[clientName].projects.push(projFin);
            clientsMap[clientName].historicalBilling += projectBilling;
        });

        // Calculate average profitability
        Object.values(clientsMap).forEach(c => {
            if (c.projects.length > 0) {
                const totalMargin = c.projects.reduce((acc, p) => {
                    const costs = (p.direct_expenses || 0) + (p.imputed_expenses || 0);
                    const margin = p.total_agreed ? Math.round(((p.total_agreed - costs) / p.total_agreed) * 100) : 0;
                    return acc + margin;
                }, 0);
                c.averageProfitability = Math.round(totalMargin / c.projects.length);
            }
        });

        return Object.values(clientsMap).sort((a, b) => b.historicalBilling - a.historicalBilling);
    }, [invoices, projectsData]);

    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const activeClient = useMemo(() => {
        if (!selectedClientId) return clients[0];
        return clients.find(c => c.id === selectedClientId) || clients[0];
    }, [clients, selectedClientId]);

    const activeProject = useMemo(() => {
        if (!activeClient) return null;
        if (!selectedProjectId) return activeClient.projects[0];
        return activeClient.projects.find(p => p.id === selectedProjectId) || activeClient.projects[0];
    }, [activeClient, selectedProjectId]);

    const stats = useMemo(() => {
        if (!activeProject) return null;
        const totalCosts = (activeProject.direct_expenses || 0) + (activeProject.imputed_expenses || 0);
        const netProfit = (activeProject.total_agreed || 0) - totalCosts;
        const margin = activeProject.total_agreed ? Math.round((netProfit / activeProject.total_agreed) * 100) : 0;
        return { totalCosts, netProfit, margin, pending: (activeProject.total_agreed || 0) - (activeProject.total_collected || 0) };
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
                    totalAgreedActive += p.total_agreed || 0;
                    totalCollectedActive += p.total_collected || 0;
                    (p.milestones || []).forEach(m => {
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
            upcomingMilestones: allMilestones.sort((a, b) => (a.m.expected_date || '').localeCompare(b.m.expected_date || '')),
            globalMargin: 58
        };
    }, [clients]);

    const monthTotal = useMemo(() => {
        let total = 0;
        const currentMonth = new Date().toISOString().substring(0, 7);
        clients.forEach(c => {
            c.projects.forEach(p => {
                (p.milestones || []).forEach(m => {
                    (m.payments || []).forEach(pay => {
                        if (pay.date && pay.date.startsWith(currentMonth)) total += pay.amount || 0;
                    });
                });
            });
        });
        return total;
    }, [clients]);

    if (loadingInvoices || loadingExpenses || loadingProjects) return <div className="flex h-full items-center justify-center font-bold">LIVV FINANCE LOADING...</div>;
    if (clients.length === 0) return <div className="p-10 text-center text-zinc-500">No hay datos financieros disponibles.</div>;

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-500 overflow-hidden font-sans">
            {/* --- LEFT COLUMN: CLIENT LIST --- */}
            <div className="w-72 flex flex-col gap-4 overflow-y-auto pr-2 border-r border-zinc-100 dark:border-zinc-800 shrink-0">
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-2">
                    <button onClick={() => setViewMode('panorama')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${viewMode === 'panorama' ? 'bg-white dark:bg-zinc-700 text-zinc-900 shadow-sm' : 'text-zinc-500'}`}>Panorama</button>
                    <button onClick={() => setViewMode('client')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${viewMode === 'client' ? 'bg-white dark:bg-zinc-700 text-zinc-900 shadow-sm' : 'text-zinc-500'}`}>Clientes</button>
                </div>
                <div className="px-1 mb-2"><h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Accounts</h3></div>
                <div className="space-y-1">
                    {clients.map(c => (
                        <div key={c.id} onClick={() => { setSelectedClientId(c.id); setSelectedProjectId(c.projects[0]?.id || null); setViewMode('client'); }} className={`p-3 rounded-xl border transition-all cursor-pointer group ${selectedClientId === c.id && viewMode === 'client' ? 'bg-white dark:bg-black border-zinc-300 shadow-md' : 'bg-transparent border-transparent hover:bg-zinc-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${selectedClientId === c.id && viewMode === 'client' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>{c.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate text-zinc-900 dark:text-white">{c.name}</h4>
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

            {/* --- CENTER PANEL --- */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
                <div className="shrink-0 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex gap-12 items-center">
                        <MetricBlock label="Facturado (Mes Actual)" value={monthTotal} highlight={true} sub="Ingresos netos del mes" />
                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
                        <MetricBlock label="Active Pipeline" value={panoramaStats.totalAgreedActive} sub="Valor total proyectos en curso" />
                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">AGENCY HEALTH</span>
                            <span className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-full border border-emerald-100">
                                <Icons.Zap size={14} /> Optimización Alta
                            </span>
                        </div>
                    </div>
                </div>

                {viewMode === 'panorama' ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">Revenue Distribution</h3>
                                <div className="space-y-4">
                                    {clients.map(c => (
                                        <div key={c.id} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">{c.avatar}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1 text-xs">
                                                    <span className="font-bold text-zinc-900 dark:text-white">{c.name}</span>
                                                    <span className="font-mono text-zinc-500">${c.historicalBilling.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-zinc-900 dark:bg-white transition-all" style={{ width: `${(c.historicalBilling / panoramaStats.totalHistorical) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-white dark:text-zinc-900 shadow-2xl relative overflow-hidden">
                                <Icons.Sparkles size={80} className="absolute -right-4 -top-4 opacity-10" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Global Margin Target</span>
                                <div className="text-5xl font-black mt-2 mb-4">{panoramaStats.globalMargin}%</div>
                                <p className="text-xs opacity-70 leading-relaxed max-w-[200px]">Operando con eficiencia premium.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-zinc-100 flex items-center justify-between"><h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Cronograma Global de Cobros</h3></div>
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950 text-[9px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100">
                                    <tr><th className="px-6 py-4">Expectativa</th><th className="px-6 py-4">Cuenta / Proyecto</th><th className="px-6 py-4">Concepto</th><th className="px-6 py-4 text-right">Monto</th></tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {panoramaStats.upcomingMilestones.map((item, i) => (
                                        <tr key={i} className="group hover:bg-zinc-50 transition-colors cursor-pointer">
                                            <td className="px-6 py-5"><div className="text-xs font-mono font-bold text-zinc-400">{item.m.expected_date}</div><div className={`text-[10px] font-bold uppercase ${item.m.status === 'delayed' ? 'text-rose-500' : 'text-zinc-400'}`}>{item.m.status}</div></td>
                                            <td className="px-6 py-5"><div className="text-sm font-bold text-zinc-900 dark:text-white">{item.client.name}</div><div className="text-[10px] text-zinc-400 uppercase font-medium">{item.project.title}</div></td>
                                            <td className="px-6 py-5 text-sm text-zinc-600 dark:text-zinc-400">{item.m.name}</td>
                                            <td className="px-6 py-5 text-right font-black text-zinc-900 dark:text-white">${(item.m.total_amount || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeProject ? (
                            <>
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex justify-between items-center">
                                    <div className="flex gap-10 items-center">
                                        <MetricBlock label="Pactado Proyecto" value={activeProject.total_agreed || 0} />
                                        <div className="w-px h-12 bg-zinc-100"></div>
                                        <MetricBlock label="Cobrado a la Fecha" value={activeProject.total_collected || 0} sub={`${Math.round(((activeProject.total_collected || 0) / (activeProject.total_agreed || 1)) * 100)}% total`} />
                                        <div className="w-px h-12 bg-zinc-100"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">HEALTH SCORE</span>
                                            <div className="flex items-center gap-3"><HealthBadge health={activeProject.health} /><span className="text-2xl font-black text-zinc-900 dark:text-white">{stats?.margin}%</span></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"><Icons.Briefcase size={14} className="inline mr-2" /> Ir al Proyecto</button>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center"><h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Milestones & Collections</h3><button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">+ Add Milestone</button></div>
                                    <div className="divide-y divide-zinc-50">
                                        {(activeProject.milestones || []).map((m) => (
                                            <div key={m.id} className="p-6">
                                                <div className="flex items-start justify-between mb-5">
                                                    <div className="flex gap-5">
                                                        <div className={`mt-1 w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-sm ${m.status === 'paid' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-200 text-zinc-300'}`}>{m.status === 'paid' ? <Icons.Check size={20} /> : <Icons.Clock size={20} />}</div>
                                                        <div><h4 className="font-black text-zinc-900 dark:text-white flex items-center gap-3">{m.name}<span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${m.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>{m.status}</span></h4><p className="text-xs text-zinc-500 mt-1">Expected: {m.expected_date} • Goal: <b>${(m.total_amount || 0).toLocaleString()}</b></p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                )}
            </div>

            {/* --- RIGHT PANEL --- */}
            <div className="w-80 space-y-6 shrink-0">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">Desglose de Costos</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm"><span className="text-zinc-500 font-medium">Gastos Directos</span><span className="font-bold text-zinc-900 dark:text-white">${viewMode === 'client' ? (activeProject?.direct_expenses || 0) : '...'}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-zinc-500 font-medium">Gastos Imputados</span><span className="font-bold text-zinc-900 dark:text-white">${viewMode === 'client' ? (activeProject?.imputed_expenses || 0) : '...'}</span></div>
                        <div className="pt-5 mt-2 border-t border-zinc-100 flex justify-between"><span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Costo Total</span><span className="text-lg font-black text-rose-600 tracking-tighter">${viewMode === 'client' ? stats?.totalCosts : '...'}</span></div>
                    </div>
                </div>
                <div className="bg-zinc-900 dark:bg-white p-7 rounded-[2rem] text-white dark:text-zinc-900 shadow-xl overflow-hidden relative">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-5 opacity-60">Gastos Generales</h3>
                    <div className="space-y-4">
                        {expenses.slice(0, 5).map((exp: any) => (
                            <div key={exp.id} className="flex items-center justify-between"><div className="flex flex-col"><span className="text-sm font-bold">{exp.description}</span><span className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded bg-white/10 dark:bg-black/10 w-fit mt-1">{exp.category}</span></div><span className="text-sm font-mono font-black">${exp.amount}</span></div>
                        ))}
                        {expenses.length === 0 && <p className="text-xs opacity-50">No hay gastos registrados.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
