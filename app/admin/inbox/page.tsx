'use client';

import React, { useState, useMemo } from 'react';
import { Icons } from '@/components/admin/Icons';
import { InboxMessage } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';
import { adaptLeadToMessage } from '@/lib/admin-adapters';

export default function InboxPage() {
    // Fetch leads instead of messages, as leads are the contact form submissions
    const { data: dbLeads, update: updateLead, add: addLead } = useSupabase<any>('leads');
    const messages = useMemo(() => dbLeads.map(adaptLeadToMessage), [dbLeads]);
    const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);

    // Compose State
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeTo, setComposeTo] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');

    const handleSelectMessage = async (msg: InboxMessage) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            // Update the lead status to 'contacted' or just keep it as is but mark locally? 
            // For now, let's assume 'read' maps to status != 'new'
            await updateLead(msg.id, { status: 'contacted' });
        }
    };

    const handleSendMessage = async () => {
        if (!composeTo || !composeSubject || !composeBody) return;

        // For now, sending a message just creates a new lead/entry or we might need a separate messages table later.
        // But requested feature is to see leads here.
        // We'll mock the send for now or create a lead with status 'outbound'
        const newMessage = {
            name: 'Outbound',
            email: composeTo,
            message: composeBody,
            source: 'Admin Compose',
            status: 'contacted'
        };

        await addLead(newMessage);

        // Reset and close
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        setIsComposeOpen(false);
    };

    return (
        <div className="relative flex h-[calc(100vh-100px)] overflow-hidden gap-8">
            {/* Compose Modal */}
            {isComposeOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/20 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">New Message</h3>
                            <button onClick={() => setIsComposeOpen(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-red-500">
                                <Icons.Close size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input
                                type="text"
                                placeholder="To:"
                                value={composeTo}
                                onChange={(e) => setComposeTo(e.target.value)}
                                className="w-full bg-transparent text-sm font-medium border-b border-zinc-100 dark:border-zinc-800 py-2 outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition-colors text-zinc-900 dark:text-zinc-100"
                            />
                            <input
                                type="text"
                                placeholder="Subject"
                                value={composeSubject}
                                onChange={(e) => setComposeSubject(e.target.value)}
                                className="w-full bg-transparent text-lg font-bold border-b border-zinc-100 dark:border-zinc-800 py-2 outline-none focus:border-zinc-300 dark:focus:border-zinc-600 transition-colors text-zinc-900 dark:text-zinc-100"
                            />
                            <textarea
                                placeholder="Write your message..."
                                value={composeBody}
                                onChange={(e) => setComposeBody(e.target.value)}
                                className="w-full h-64 bg-transparent text-sm leading-relaxed outline-none resize-none text-zinc-800 dark:text-zinc-200"
                            />
                        </div>
                        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                            <button onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 uppercase tracking-wider transition-colors">Discard</button>
                            <button onClick={handleSendMessage} disabled={!composeTo || !composeBody} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2">
                                <Icons.Send size={14} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message List */}
            <div className="w-1/3 min-w-[320px] flex flex-col bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Inbox</h2>
                        <button onClick={() => setIsComposeOpen(true)} className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-zinc-500/20">
                            <Icons.Plus size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm border-none outline-none focus:ring-1 focus:ring-zinc-300 dark:text-zinc-100"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {messages.length === 0 ? (
                        <div className="p-8 text-center text-zinc-400 text-sm">No messages</div>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => handleSelectMessage(msg)}
                                className={`p-5 border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'bg-zinc-50 dark:bg-zinc-800/80' : ''} ${!msg.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                                            {msg.sender.avatar}
                                        </div>
                                        <span className={`text-sm ${!msg.read ? 'font-black text-zinc-900 dark:text-zinc-100' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>{msg.sender.name}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{msg.date}</span>
                                </div>
                                <h4 className={`text-sm mb-1 ${!msg.read ? 'font-bold text-zinc-900 dark:text-zinc-100' : 'font-medium text-zinc-600 dark:text-zinc-400'}`}>{msg.subject}</h4>
                                <p className="text-xs text-zinc-400 line-clamp-2">{msg.preview}</p>
                                <div className="mt-3 flex gap-2">
                                    {msg.tags.map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wide">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Message Detail */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col items-center justify-center text-zinc-400">
                {selectedMessage ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{selectedMessage.subject}</h2>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"><Icons.More size={18} /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300">
                                    {selectedMessage.sender.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{selectedMessage.sender.name}</div>
                                    <div className="text-xs text-zinc-500">{selectedMessage.sender.email}</div>
                                </div>
                                <div className="ml-auto text-xs text-zinc-400">{selectedMessage.date}</div>
                            </div>
                        </div>
                        <div className="flex-1 p-8 text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed overflow-y-auto">
                            <p>From: {selectedMessage.sender.name} ({selectedMessage.sender.email})</p>
                            <br />
                            <p>{selectedMessage.preview}</p>
                            <br />
                        </div>
                        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 shrink-0">
                            <button className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2">
                                <Icons.Mail size={14} /> Reply
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <Icons.Mail size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium">Select a lead to read</p>
                    </div>
                )}
            </div>
        </div>
    );
}
