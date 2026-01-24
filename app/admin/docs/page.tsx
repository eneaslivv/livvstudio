'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/admin/Icons';
import { DocFolder, DocFile } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';

// --- MOCK DATA ---

const initialFolders: DocFolder[] = [
    { id: 'root', parentId: null, name: 'Knowledge Base' },
    { id: 'ideas-folder', parentId: 'root', name: '💡 Ideas', appIcons: ['notion'] },
    { id: '1', parentId: 'root', name: 'General Knowledge', appIcons: ['notion'] },
    { id: '2', parentId: 'root', name: 'Internal Processes', appIcons: ['drive'] },
    { id: '3', parentId: 'root', name: 'Brand Assets', appIcons: ['slack'] },
    { id: '4', parentId: 'root', name: 'Legal & Contracts' },
    { id: '1-1', parentId: '1', name: 'Onboarding', appIcons: ['notion', 'drive'] },
    { id: '1-2', parentId: '1', name: 'Integrations', appIcons: ['jira'] },
    { id: '1-3', parentId: '1', name: 'Meeting Notes' },
];

const initialFiles: DocFile[] = [
    { id: 'f1', folderId: '1-1', name: 'Onboarding-Guide.pdf', type: 'pdf', size: '2.4 MB', author: 'Lucía P.', avatar: 'LP', date: '2d ago', content: 'Welcome to the team! This document covers...' },
    { id: 'f2', folderId: '1-2', name: 'Tech-Stack-2024.tsx', type: 'code', size: '14 KB', author: 'Carlos R.', avatar: 'CR', date: '5h ago', content: 'export const config = { ... }' },
    { id: 'f3', folderId: 'root', name: 'Q4-Financials.xlsx', type: 'sheet', size: '1.1 MB', author: 'Eneas', avatar: 'E', date: '1d ago' },
    { id: 'f4', folderId: '3', name: 'Logo_Pack_Final.zip', type: 'zip', size: '15 MB', author: 'Sofia R.', avatar: 'SR', date: '3d ago' },
    { id: 'f5', folderId: '1-3', name: 'Meeting_Notes_Oct.docx', type: 'doc', size: '450 KB', author: 'Miguel T.', avatar: 'MT', date: '1w ago' },
    { id: 'f6', folderId: '1', name: 'Overview_Presentation.pdf', type: 'pdf', size: '4.2 MB', author: 'Eneas', avatar: 'E', date: '1d ago' },
    { id: 'i1', folderId: 'ideas-folder', name: 'Project_Alpha_Brainstorm.docx', type: 'doc', size: '12 KB', author: 'Eneas', avatar: 'E', date: 'Just now', content: '# Project Alpha Ideas\n\n1. Use glassmorphism for the UI.\n2. Implement real-time collaboration using web sockets.\n3. Add AI-driven task prioritization.' },
];

// --- SUB-COMPONENTS ---

const EditorToolbar = () => (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 pr-4 border-r border-zinc-200 dark:border-zinc-800">
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.Bold size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.Italic size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.Underline size={16} /></button>
        </div>
        <div className="flex items-center gap-1 px-4 border-r border-zinc-200 dark:border-zinc-800">
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.AlignLeft size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.List size={16} /></button>
        </div>
        <div className="flex items-center gap-1 pl-4">
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.Link size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-600 dark:text-zinc-400"><Icons.Image size={16} /></button>
            <button className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded transition-colors text-indigo-600 dark:text-indigo-400 ml-2"><Icons.Sparkles size={16} /></button>
        </div>
    </div>
);

const DocumentEditorModal = ({ isOpen, onClose, onSave, type, initialData }: { isOpen: boolean, onClose: () => void, onSave: (title: string, content: string, id?: string) => void, type: 'doc' | 'code', initialData?: DocFile | null }) => {
    const [title, setTitle] = useState(initialData?.name.split('.')[0] || '');
    const [content, setContent] = useState(initialData?.content || '');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.name.split('.')[0]);
            setContent(initialData.content || '');
        } else {
            setTitle('');
            setContent('');
        }
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-900/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-950 w-full h-full md:h-[95vh] md:w-[95vw] md:max-w-7xl flex flex-col md:rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.2)] border border-zinc-200 dark:border-zinc-800">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            <Icons.ChevronLeft size={20} />
                        </div>
                        <div className="flex flex-col flex-1">
                            <input
                                autoFocus
                                type="text"
                                placeholder={type === 'code' ? "Untitled.tsx" : "Untitled Document"}
                                className="text-lg font-bold bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 w-full tracking-tight"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Library / Content</span>
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                <span className="text-[9px] text-zinc-400 font-bold uppercase">Synced</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"><Icons.Link size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"><Icons.More size={18} /></button>
                        <button
                            onClick={() => onSave(title || 'Untitled', content, initialData?.id)}
                            className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/10"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>

                {type === 'doc' && <EditorToolbar />}

                {/* Editor Content Area */}
                <div className="flex-1 bg-[#FAF9F6] dark:bg-zinc-950 p-4 md:p-12 overflow-y-auto custom-scrollbar flex justify-center">
                    <div className="w-full max-w-[850px] min-h-[1100px] bg-white dark:bg-zinc-900 shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-zinc-200 dark:border-zinc-800 p-12 md:p-24 rounded-sm animate-in slide-in-from-bottom-4 duration-500">
                        <textarea
                            className={`w-full h-full resize-none outline-none bg-transparent text-zinc-800 dark:text-zinc-200 leading-[2.1] ${type === 'code' ? 'font-mono text-sm' : 'font-serif text-lg md:text-xl'}`}
                            placeholder={type === 'code' ? "// Start writing code..." : "Tell your story..."}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            spellCheck={type === 'doc'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FolderGraphic = ({ icons, count }: { icons?: string[], count: number }) => (
    <div className="relative w-14 h-11 group-hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-[56px] h-[44px] bg-[#e4e4e7] dark:bg-zinc-700 rounded-md"></div>
        <div className="absolute top-[-4px] left-[6px] w-[44px] h-[36px] bg-white dark:bg-zinc-800 border border-[#e4e4e7] dark:border-zinc-700 shadow-sm rounded-[2px] transform -rotate-3"></div>
        <div className="absolute bottom-0 left-0 w-[56px] h-[36px] bg-[#d4d4d8] dark:bg-zinc-700 rounded-b-md rounded-tr-md shadow-sm z-10 flex items-end justify-end p-1 gap-0.5">
            {icons?.includes('notion') && <div className="w-2.5 h-2.5 bg-black dark:bg-zinc-900 rounded-sm opacity-80"></div>}
        </div>
        {count > 0 && <div className="absolute -top-2 -right-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20">{count}</div>}
    </div>
);

// --- MAIN PAGE ---

export default function DocsPage() {
    // Fetch documents from Supabase
    const { data: documents, loading, add, update: updateDoc } = useSupabase<any>('documents', {
        select: 'id, title, doc_type, content, author_name, created_at'
    });

    const [folders, setFolders] = useState<DocFolder[]>(initialFolders);
    const [files, setFiles] = useState<DocFile[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string>('root');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorType, setEditorType] = useState<'doc' | 'code'>('doc');
    const [editingFile, setEditingFile] = useState<DocFile | null>(null);

    // Sync Supabase documents with local files state
    useEffect(() => {
        if (documents) {
            const mappedFiles: DocFile[] = documents.map((doc: any) => ({
                id: doc.id,
                folderId: 'root', // Default to root for now
                name: doc.title || 'Untitled',
                type: doc.doc_type === 'code' ? 'code' : 'doc',
                size: '1 KB', // Size not stored in DB
                author: doc.author_name || 'Eneas',
                avatar: (doc.author_name || 'Eneas').charAt(0).toUpperCase(),
                date: formatDate(doc.created_at),
                content: doc.content || ''
            }));
            // Merge with initial mock file (keep Q4-Financials.xlsx)
            const mockFile = initialFiles.find(f => f.id === 'f3');
            setFiles(mockFile ? [mockFile, ...mappedFiles] : mappedFiles);
        }
    }, [documents]);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return `${Math.floor(diffDays / 7)}w ago`;
    };

    const currentFolder = folders.find(f => f.id === currentFolderId) || folders[0];
    const subfolders = folders.filter(f => f.parentId === currentFolderId);
    const displayedFiles = files.filter(f => searchQuery ? f.name.toLowerCase().includes(searchQuery.toLowerCase()) : f.folderId === currentFolderId);

    const handleSaveFile = async (title: string, content: string, existingId?: string) => {
        try {
            if (existingId) {
                // Update existing document
                await updateDoc(existingId, {
                    title: title || 'Untitled',
                    content,
                    doc_type: editorType
                });
            } else {
                // Insert new document
                await add({
                    title: title || 'Untitled',
                    doc_type: editorType,
                    content,
                    author_name: 'Eneas'
                });
            }
            setIsEditorOpen(false);
            setEditingFile(null);
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Failed to save document. Please try again.');
        }
    };

    const startEdit = (file: DocFile) => {
        setEditorType(file.type === 'code' ? 'code' : 'doc');
        setEditingFile(file);
        setIsEditorOpen(true);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
            <DocumentEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} onSave={handleSaveFile} type={editorType} initialData={editingFile} />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center text-sm font-medium text-zinc-400">
                    <span onClick={() => setCurrentFolderId('root')} className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">Workspace</span>
                    <Icons.ChevronRight size={14} className="mx-2 opacity-50" />
                    <span className="text-zinc-900 dark:text-zinc-100">{currentFolder?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search library..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-100/50 dark:bg-zinc-900/50 border-none rounded-xl text-sm focus:ring-1 focus:ring-zinc-300 dark:text-zinc-100"
                        />
                    </div>
                    <button
                        onClick={() => { setEditorType('doc'); setEditingFile(null); setIsEditorOpen(true); }}
                        className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-xl shadow-zinc-900/10"
                    >
                        New Doc
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-10 overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 shrink-0 hidden md:block">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Collections</h3>
                    <div className="space-y-1">
                        {folders.filter(f => f.parentId === 'root' || f.id === 'root').map(f => (
                            <button
                                key={f.id}
                                onClick={() => setCurrentFolderId(f.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${currentFolderId === f.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icons.Folder size={14} className={currentFolderId === f.id ? 'fill-current' : ''} />
                                    {f.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                    {subfolders.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Directories</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {subfolders.map(sub => (
                                    <div key={sub.id} onClick={() => setCurrentFolderId(sub.id)} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-3xl p-6 cursor-pointer transition-all flex flex-col items-center text-center shadow-sm">
                                        <div className="mb-4"><FolderGraphic count={files.filter(fi => fi.folderId === sub.id).length} /></div>
                                        <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate w-full px-2">{sub.name}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Files</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {displayedFiles.map(file => (
                                <div
                                    key={file.id}
                                    onClick={() => startEdit(file)}
                                    className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                            {file.type === 'doc' ? <Icons.Docs size={18} /> : file.type === 'code' ? <Icons.FileCode size={18} /> : <Icons.File size={18} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{file.name}</div>
                                            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{file.date} • {file.author}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-mono text-zinc-400">{file.size}</span>
                                        <Icons.More size={16} className="text-zinc-300 hover:text-zinc-900" />
                                    </div>
                                </div>
                            ))}
                            {displayedFiles.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
                                    <p className="text-zinc-400 text-sm font-medium">No documents found in this directory.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
