'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    MessageSquare,
    Eye,
    UserCog
} from 'lucide-react';
import { DashboardData } from '@/types/portal';

// Components
import TimelinePulse from '@/components/portal/TimelinePulse';
import LiveRoadmap from '@/components/portal/LiveRoadmap';
import InvestmentTracker from '@/components/portal/InvestmentTracker';
import Vault from '@/components/portal/Vault';
import LegalAssets from '@/components/portal/LegalAssets';
import SystemLogs from '@/components/portal/SystemLogs';
import Onboarding from '@/components/portal/Onboarding';
import ChatSupport from '@/components/portal/ChatSupport';
import PreferencesPanel from '@/components/portal/PreferencesPanel';
import CreatorPanel from '@/components/portal/CreatorPanel';

const INITIAL_DATA: DashboardData = {
    progress: 0,
    startDate: "TBD",
    etaDate: "TBD",
    onTrack: true,
    budget: {
        total: 0,
        paid: 0,
    },
    milestones: [],
    logs: [
        { id: '1', timestamp: 'System', message: 'Waiting for project data...' }
    ]
};

export default function PortalPage() {
    const [data, setData] = useState<DashboardData>(INITIAL_DATA);
    const [projectTitle, setProjectTitle] = useState("MISSION CONTROL");
    const [projectSubtitle, setProjectSubtitle] = useState("AETHELGARD CLOUD / LIVV-OS");
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [clientLogo, setClientLogo] = useState<string | null>(null);
    const [mode, setMode] = useState<'client' | 'creator'>('client');
    const [projectId, setProjectId] = useState<string | null>(null);

    // Feature states
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    // const supabase = createClient(); // Removed

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setLoading(false);
                    // ideally redirect to login here
                    window.location.href = '/portal/login';
                    return;
                }

                // Check Role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role === 'admin') {
                    // Redirect Admins to their dashboard
                    window.location.href = '/admin/dashboard';
                    return;
                }

                // Fetch the most recent project (Prototype logic)
                const { data: project, error: projectError } = await supabase
                    .from('projects')
                    .select('*, milestones(*), project_credentials(*)')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (projectError) {
                    console.error('Error fetching project:', projectError);
                    setLoading(false);
                    return;
                }

                if (project) {
                    setProjectId(project.id);
                    setProjectTitle(project.title || "MISSION CONTROL");
                    setProjectSubtitle(project.description || "LIVV-OS PROJECT");
                    // setClientLogo(project.logo_url) -- If we add this column later

                    setData({
                        progress: project.progress || 0,
                        startDate: project.start_date || "TBD",
                        etaDate: project.eta_date || "TBD",
                        onTrack: true,
                        budget: {
                            total: project.budget_total || 0,
                            paid: project.budget_paid || 0,
                        },
                        milestones: project.milestones || [],
                        logs: INITIAL_DATA.logs
                    });
                }
            } catch (error) {
                console.error('Error in data fetch:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [supabase]);

    const handleUpdateData = async (newData: Partial<DashboardData>) => {
        // Optimistic update
        setData(prev => ({ ...prev, ...newData }));

        if (!projectId) return;

        try {
            // Prepare updates for main project table
            const projectUpdates: any = {};
            if (newData.progress !== undefined) projectUpdates.progress = newData.progress;
            if (newData.budget) {
                projectUpdates.budget_total = newData.budget.total;
                projectUpdates.budget_paid = newData.budget.paid;
            }

            if (Object.keys(projectUpdates).length > 0) {
                await supabase.from('projects').update(projectUpdates).eq('id', projectId);
            }

            // Handle Milestones updates (Specific logic for Creator Panel edits)
            if (newData.milestones) {
                for (const m of newData.milestones) {
                    // Check if it's a new milestone (simple check) or existing
                    // For this prototype, we just upsert everything
                    const { error } = await supabase.from('milestones').upsert({
                        id: m.id,
                        project_id: projectId,
                        title: m.title,
                        description: m.description,
                        status: m.status
                    });
                    if (error) console.error("Milestone update fail:", error);
                }
            }

        } catch (err) {
            console.error("Failed to persist updates:", err);
        }
    };

    const handleUpdateTitle = async (newTitle: string) => {
        setProjectTitle(newTitle);
        if (projectId) {
            await supabase.from('projects').update({ title: newTitle }).eq('id', projectId);
        }
    }

    const handleUpdateSubtitle = async (newSubtitle: string) => {
        setProjectSubtitle(newSubtitle);
        if (projectId) {
            await supabase.from('projects').update({ description: newSubtitle }).eq('id', projectId);
        }
    }

    const handleOnboardingComplete = (logo?: string) => {
        if (logo) setClientLogo(logo);
        setIsOnboarded(true);
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-[#ede5d8] flex flex-col items-center justify-center">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                        className="w-20 h-20 border border-brand-dark/10 rounded-full flex items-center justify-center"
                    >
                        <div className="w-10 h-10 border-2 border-orange-500 rounded-lg animate-pulse" />
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                >
                    <h2 className="font-mono text-[10px] text-zinc-900/40 uppercase tracking-[0.5em] mb-2 font-bold">Synchronizing Client Access</h2>
                    <p className="text-orange-600 text-[8px] uppercase tracking-widest font-black italic">LIVV PROTOCOL v2.4</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ede5d8] selection:bg-orange-500/20">
            {/* Creator Floating Toggle */}
            <div className="fixed bottom-8 left-8 z-[100]">
                <button
                    onClick={() => setMode(mode === 'client' ? 'creator' : 'client')}
                    className="flex items-center gap-3 px-6 py-4 bg-zinc-900 text-white rounded-full shadow-2xl hover:bg-orange-500 transition-all group"
                >
                    {mode === 'client' ? <UserCog size={18} /> : <Eye size={18} />}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {mode === 'client' ? 'Enter Creator Mode' : 'Exit Creator Mode'}
                    </span>
                </button>
            </div>

            <div className="max-w-[1500px] mx-auto p-4 md:p-12 lg:p-16">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 border-b border-zinc-900/5 pb-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-zinc-900/20 relative z-10 border-2 border-[#ede5d8]">L</div>
                                {clientLogo && (
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center overflow-hidden border-2 border-[#ede5d8] shadow-xl z-20"
                                    >
                                        <img src={clientLogo} alt="Client Logo" className="w-full h-full object-cover" />
                                    </motion.div>
                                )}
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">{projectTitle}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-zinc-900/40 text-[10px] uppercase tracking-[0.4em] font-mono font-bold">
                                {projectSubtitle}
                            </p>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-zinc-900/5 rounded-full">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-60">Status: Optimal</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {mode === 'creator' && (
                            <button
                                onClick={() => setIsCreatorOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl hover:shadow-xl hover:shadow-orange-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <Settings size={14} />
                                <span>Configure Client View</span>
                            </button>
                        )}
                        <button
                            onClick={() => setIsConfigOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-900/10 rounded-2xl hover:bg-zinc-100 transition-all text-[10px] font-bold uppercase tracking-widest text-zinc-900"
                        >
                            <Settings size={14} className="opacity-50" />
                            <span>Preferences</span>
                        </button>
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-2xl hover:shadow-xl hover:shadow-orange-500/20 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <MessageSquare size={14} />
                            <span>Priority Support</span>
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {!isOnboarded ? (
                        <Onboarding onComplete={handleOnboardingComplete} />
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.12 }
                                }
                            }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-8"
                        >
                            <div className="md:col-span-8 lg:col-span-8">
                                <TimelinePulse data={data} />
                            </div>
                            <div className="md:col-span-4 lg:col-span-4">
                                <LiveRoadmap milestones={data.milestones} />
                            </div>
                            <div className="md:col-span-6 lg:col-span-4">
                                <InvestmentTracker budget={data.budget} />
                            </div>
                            <div className="md:col-span-6 lg:col-span-4">
                                <Vault />
                            </div>
                            <div className="md:col-span-12 lg:col-span-4">
                                <LegalAssets />
                            </div>
                            <div className="md:col-span-12">
                                <SystemLogs logs={data.logs} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className="mt-24 flex flex-col items-center gap-6">
                    <div className="h-[1px] w-24 bg-zinc-900/10" />
                    <div className="text-center pb-16">
                        <p className="text-zinc-900/30 text-[9px] uppercase tracking-[0.6em] font-black mb-3">
                            LIVV ENGINEERING SOLUTIONS &copy; 2024
                        </p>
                        <div className="flex items-center gap-4 justify-center opacity-20">
                            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                        </div>
                    </div>
                </footer>
            </div>

            <AnimatePresence>
                {isChatOpen && (
                    <ChatSupport onClose={() => setIsChatOpen(false)} />
                )}
                {isConfigOpen && (
                    <PreferencesPanel onClose={() => setIsConfigOpen(false)} />
                )}
                {isCreatorOpen && mode === 'creator' && (
                    <CreatorPanel
                        data={data}
                        title={projectTitle}
                        subtitle={projectSubtitle}
                        onUpdateTitle={handleUpdateTitle}
                        onUpdateSubtitle={handleUpdateSubtitle}
                        onUpdateData={handleUpdateData}
                        onUpdateLogo={setClientLogo}
                        onClose={() => setIsCreatorOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
