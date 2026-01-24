'use client';

import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopNavbar } from '@/components/admin/TopNavbar';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { currentMode, setCurrentMode, activeTimer, stopTimer, isSidebarExpanded } = useAdmin();
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const roleCheckedRef = React.useRef(false); // Cache check status
    const isChecksLoading = React.useRef(false); // Prevent concurrent checks

    React.useEffect(() => {
        if (loading) return;

        // Skip auth check for login page or if already checked
        if (pathname === '/admin/login') return;

        // DEV MODE: Skip auth check for development
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
            roleCheckedRef.current = true;
            return;
        }

        if (!user) {
            window.location.href = '/admin/login';
            return;
        }

        if (roleCheckedRef.current) return; // Skip if already checked

        const checkRole = async () => {
            if (isChecksLoading.current) return;
            isChecksLoading.current = true;

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                router.push('/portal');
            } else {
                roleCheckedRef.current = true; // Mark as verified
            }
            isChecksLoading.current = false;
        };
        checkRole();
    }, [user, loading, router, pathname]); // Added pathname to satisfy linter, but early returns handle optimized flows

    const pageTitle = React.useMemo(() => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length <= 1) return 'Mission Control';
        const last = segments[segments.length - 1];
        return last.charAt(0).toUpperCase() + last.slice(1);
    }, [pathname]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex overflow-hidden">
            <Sidebar
                currentMode={currentMode}
                onSwitchMode={setCurrentMode}
            />

            <main className={`flex-1 h-screen overflow-y-auto relative transition-all duration-500 ${isSidebarExpanded ? 'md:ml-[256px]' : 'md:ml-[88px]'}`}>
                <TopNavbar
                    pageTitle={pageTitle}
                    onOpenSearch={() => { }}
                    onOpenTask={() => { }}
                    activeTimer={activeTimer}
                    onUpdateTimer={stopTimer}
                />
                <div className="px-4 md:px-8 pb-8 w-full max-w-[1600px] mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminProvider>
    );
}
