// Loading skeleton component for better UX
import React from 'react';

export const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
    </div>
);

export const SkeletonList = ({ count = 5 }: { count?: number }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <SkeletonCard />
            </div>
        ))}
    </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"></div>
        ))}
    </div>
);
