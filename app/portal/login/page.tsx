'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    // const supabase = createClient(); // Removed

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("Attempting login with:", email);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error);
                throw error;
            }

            console.log("Login success, checking role...", data);

            // Check user role for redirect
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profile?.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/portal');
            }

        } catch (err: any) {
            console.error("Caught error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#ede5d8] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-zinc-900 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black mb-6 shadow-2xl shadow-zinc-900/20"
                    >
                        L
                    </motion.div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase mb-2">Client Portal</h1>
                    <p className="text-xs font-bold text-zinc-900/40 uppercase tracking-[0.2em] font-mono">
                        Secure Access Terminal
                    </p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl shadow-zinc-900/5 border border-zinc-900/5"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-300"
                                    placeholder="client@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-zinc-300"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    Enter Portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                <p className="text-center mt-8 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    Protected by LIVV Protocol v2.4
                </p>
            </div>
        </div>
    );
}
