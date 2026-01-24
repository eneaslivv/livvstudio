'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, LayoutDashboard, Wallet, Users } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check if admin
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError || !profile) {
                console.error("Profile fetch error:", profileError);
                throw new Error("Profile not found. Please run Migration 005 (Backfill Users) in Supabase.");
            }

            // If profile exists but role isn't admin, deny
            if (profile.role !== 'admin') {
                await supabase.auth.signOut();
                setError('Unauthorized access. Admin privileges required.');
                return;
            }

            router.push('/admin/dashboard');

        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#FDFCF8] font-sans text-zinc-900">
            {/* Left Panel - Visual/Marketing */}
            <div className="hidden lg:flex relative w-[45%] bg-[#121212] text-white flex-col justify-between p-16 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent z-0 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] z-0"></div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="mb-12">
                        <img
                            src="/assets/logo-new.png"
                            alt="Livv Studio"
                            className="h-9 w-auto brightness-0 invert opacity-90 object-contain"
                        />
                    </div>
                </div>

                <div className="relative z-10 space-y-12 max-w-md">
                    <div>
                        <h1 className="text-5xl font-light tracking-[-0.04em] mb-6 text-white leading-tight font-[family-name:var(--font-mondwest)]">
                            Mission Control Center
                        </h1>
                        <p className="text-zinc-400 font-light leading-relaxed text-lg tracking-wide">
                            Orchestrate projects, track finances, and manage client infrastructure from a central command node.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4 group">
                            <div className="mt-1 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all shrink-0">
                                <LayoutDashboard size={14} />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-zinc-200 mb-1">Project Command</h3>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">Real-time KPI tracking and lifecycle management.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="mt-1 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all shrink-0">
                                <Wallet size={14} />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-zinc-200 mb-1">Financial Oversight</h3>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">Wait-list monitoring and operational expenses.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="mt-1 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all shrink-0">
                                <Users size={14} />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-zinc-200 mb-1">Client Infrastructure</h3>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">Secure vaults, legal assets, and portal configuration.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                    <span>v2.4.0</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span>Systems Operational</span>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#FDFCF8] text-zinc-900">
                <div className="w-full max-w-[360px]">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-light tracking-[-0.03em] mb-3 text-zinc-900 font-[family-name:var(--font-mondwest)]">Welcome back</h2>
                        <p className="text-zinc-500 text-sm font-light">Please enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-zinc-200 rounded-xl py-3.5 px-4 pl-11 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-300 hover:border-zinc-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                                    placeholder="admin@livv.studio"
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-800 transition-colors pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                                <span className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors">Forgot password?</span>
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-zinc-200 rounded-xl py-3.5 px-4 pl-11 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-300 hover:border-zinc-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-800 transition-colors pointer-events-none" size={16} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="text-red-600 text-[11px] font-medium bg-red-50/50 p-3 rounded-lg border border-red-100 flex items-center gap-2"
                                >
                                    <div className="w-1 h-1 bg-red-500 rounded-full shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-[#1A1A1A] text-white py-3.5 rounded-full font-medium text-sm tracking-wide hover:bg-black hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin text-white/70" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={14} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center border-t border-zinc-100 pt-8">
                        <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                            Restricted Access • Invite Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
