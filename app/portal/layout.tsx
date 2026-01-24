import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Client Portal | LIVV',
    description: 'Project Status & Management',
};

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#ede5d8]">
            {children}
        </div>
    );
}
