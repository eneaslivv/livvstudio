import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';

interface UseSupabaseOptions {
    select?: string;
    limit?: number;
    enabled?: boolean; // New: Allow disabling the hook
}

// Global Cache to ensure instant navigation (Stale-While-Revalidate)
const CACHE: Record<string, any[]> = {};

export const useSupabase = <T>(tableName: string, options: UseSupabaseOptions = {}) => {
    const { select = '*', limit, enabled = true } = options;

    // Generate a unique cache key
    const cacheKey = `${tableName}:${select}:${limit}`;

    // Initialize with cache if available
    const [data, setData] = useState<T[]>(CACHE[cacheKey] || []);
    const [loading, setLoading] = useState(!CACHE[cacheKey]); // Only load if no cache
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        // Don't set loading to true if we have data (background update)
        if (!data.length && !CACHE[cacheKey]) setLoading(true);

        try {
            let query = supabase
                .from(tableName)
                .select(select)
                .order('created_at', { ascending: false });

            if (limit) {
                query = query.limit(limit);
            }

            const { data: result, error: err } = await query;

            if (err) {
                setError(err.message);
            } else if (result) {
                // Update Cache and State
                CACHE[cacheKey] = result;
                setData(result as T[]);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [tableName, select, limit, enabled, cacheKey]); // Removed 'data.length' from dependency to avoid loop

    useEffect(() => {
        fetchData();

        if (!enabled) return;

        // Real-time component
        const channel = supabase
            .channel(`public:${tableName}:${cacheKey}`) // Unique channel name
            .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tableName, fetchData, enabled, cacheKey]);

    const add = useCallback(async (item: any) => {
        const { error: err } = await supabase.from(tableName).insert(item);
        if (err) console.error(`Error adding to ${tableName}:`, err);
        // Optimistic updates could go here
    }, [tableName]);

    const update = useCallback(async (id: string, updates: any) => {
        const { error: err } = await supabase.from(tableName).update(updates).eq('id', id);
        if (err) console.error(`Error updating ${tableName}:`, err);
    }, [tableName]);

    const remove = useCallback(async (id: string) => {
        const { error: err } = await supabase.from(tableName).delete().eq('id', id);
        if (err) console.error(`Error deleting from ${tableName}:`, err);
    }, [tableName]);

    return useMemo(() => ({
        data,
        loading,
        error,
        add,
        update,
        remove,
        refresh: fetchData
    }), [data, loading, error, add, update, remove, fetchData]);
};
