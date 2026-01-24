'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/admin/Icons';
import { PortfolioItem } from '@/types/livv-os';
import { useSupabase } from '@/hooks/useSupabase';
import Image from 'next/image';

const CreateEditModal = ({
    isOpen,
    onClose,
    onSave,
    initialData
}: {
    isOpen: boolean,
    onClose: () => void,
    onSave: (data: Partial<PortfolioItem>) => void,
    initialData?: Partial<PortfolioItem>
}) => {
    const [formData, setFormData] = useState<Partial<PortfolioItem>>(initialData || {
        title: '',
        subtitle: '',
        category: '',
        services: '',
        year: new Date().getFullYear().toString(),
        image: '',
        featured: false,
        slug: '',
        color: '#000000',
        description: ''
    });

    // Update form data when initialData changes (for edit mode)
    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                subtitle: '',
                category: '',
                services: '',
                year: new Date().getFullYear().toString(),
                image: '',
                featured: false,
                slug: '',
                color: '#000000',
                description: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{initialData ? 'Edit Project' : 'New Portfolio Project'}</h3>
                    <button onClick={onClose}><Icons.Close /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Title</label>
                        <input
                            name="title"
                            type="text"
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.title || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Subtitle</label>
                        <input
                            name="subtitle"
                            type="text"
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.subtitle || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Slug (URL)</label>
                        <input
                            name="slug"
                            type="text"
                            placeholder="e.g. project-name"
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.slug || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Category</label>
                        <input
                            name="category"
                            type="text"
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.category || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Year</label>
                        <input
                            name="year"
                            type="text"
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.year || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Services</label>
                        <input
                            name="services"
                            type="text"
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.services || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Image URL</label>
                        <input
                            name="image"
                            type="text"
                            placeholder="/images/portfolio-1.jpg or https://..."
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.image || ''}
                            onChange={handleChange}
                        />
                        {formData.image && (
                            <div className="mt-2 relative w-full h-32 rounded overflow-hidden border border-zinc-200">
                                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description (Short)</label>
                        <textarea
                            name="description"
                            rows={2}
                            className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                            value={formData.description || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Accent Color</label>
                        <div className="flex gap-2">
                            <input
                                name="color"
                                type="color"
                                className="h-9 w-9 p-1 bg-transparent border border-zinc-200 rounded cursor-pointer"
                                value={formData.color || '#000000'}
                                onChange={handleChange}
                            />
                            <input
                                name="color"
                                type="text"
                                className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                                value={formData.color || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Featured?</label>
                        <input
                            name="featured"
                            type="checkbox"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="h-5 w-5"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-2 mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold">
                        {initialData ? 'Save Changes' : 'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function PortfolioAdminPage() {
    const { data: dbItems, loading, add, update, remove, refresh } = useSupabase<PortfolioItem>('portfolio_items');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | undefined>(undefined);

    const handleCreate = () => {
        setEditingItem(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await remove(id);
            refresh();
        }
    };

    const handleSave = async (data: Partial<PortfolioItem>) => {
        if (editingItem && editingItem.id) {
            await update(editingItem.id, data);
        } else {
            await add(data);
        }
        setIsModalOpen(false);
        refresh();
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Portfolio CMS</h1>
                    <p className="text-zinc-500 text-sm">Manage projects displayed on the Public Work page.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    <Icons.Plus size={18} /> New Project
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
                    {dbItems.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-800">
                                {item.image ? (
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-zinc-300">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="p-2 bg-white/90 text-zinc-800 rounded-full shadow-lg hover:scale-105 transition-transform"><Icons.Bolt size={14} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/90 text-white rounded-full shadow-lg hover:scale-105 transition-transform"><Icons.Trash size={14} /></button>
                                </div>
                                {item.featured && (
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Featured</span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">{item.title}</h3>
                                <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded border border-zinc-200 dark:border-zinc-700">{item.category}</span>
                                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded border border-zinc-200 dark:border-zinc-700">{item.year}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {dbItems.length === 0 && (
                        <div className="col-span-full py-20 text-center text-zinc-400">
                            <p>No projects found. Create one to get started.</p>
                        </div>
                    )}
                </div>
            )}

            <CreateEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
}
