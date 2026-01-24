
import React, { useState, useMemo } from 'react';
import { Icons } from '../components/ui/Icons';
import { BusinessService, RoleRate, SystemUser, ProposalItem, Proposal, BusinessModel } from '../types';

// --- MOCK DATA ---

const INITIAL_SERVICES: BusinessService[] = [
    { id: 's1', name: 'UI/UX Design Premium', type: 'fixed', basePrice: 3500, currency: 'USD', isActive: true, targetMargin: 70, description: 'Brand strategy and high-fidelity interface design.' },
    { id: 's2', name: 'Fullstack Dev (React/Node)', type: 'milestones', basePrice: 6000, currency: 'USD', isActive: true, targetMargin: 65, description: 'End-to-end development with 3 milestone review stages.' },
    { id: 's3', name: 'AI Strategic Consulting', type: 'hourly', basePrice: 200, currency: 'USD', isActive: true, targetMargin: 80, description: 'Consultation for integrating LLMs into existing workflows.' },
    { id: 's4', name: 'System Maintenance', type: 'monthly', basePrice: 500, currency: 'USD', isActive: true, targetMargin: 50, description: 'Monthly security updates and bug fixes.' },
];

const INITIAL_ROLE_RATES: RoleRate[] = [
    { id: 'r1', roleName: 'Design Lead', internalCost: 45, suggestedRate: 150 },
    { id: 'r2', roleName: 'Senior Developer', internalCost: 55, suggestedRate: 180 },
    { id: 'r3', roleName: 'Product Manager', internalCost: 40, suggestedRate: 120 },
    { id: 'r4', roleName: 'AI Specialist', internalCost: 70, suggestedRate: 250 },
];

const INITIAL_USERS: SystemUser[] = [
    { id: 'u1', name: 'Eneas', email: 'admin@eneas.io', role: 'Admin', isActive: true, avatar: 'E', assignedProjects: [] },
    { id: 'u2', name: 'Sofia R.', email: 'sofia@studioalpha.design', role: 'Sales & Finance', isActive: true, avatar: 'SR', assignedProjects: ['p1'] },
    { id: 'u3', name: 'Lucas M.', email: 'lucas@techflow.io', role: 'Collaborator', isActive: true, avatar: 'LM', assignedProjects: ['p2'] },
];

// --- SUB-COMPONENTS ---

const ConfigSectionHeader = ({ title, subtitle, action }: { title: string, subtitle: string, action?: React.ReactNode }) => (
    <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{subtitle}</p>
        </div>
        {action}
    </div>
);

const NavTab = ({ label, id, active, onClick, icon }: { label: string, id: string, active: boolean, onClick: () => void, icon: any }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            active 
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-none' 
            : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        }`}
    >
        {React.cloneElement(icon, { size: 18 })}
        <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
);

// 1. SERVICES & PRICING
const ServicesView = () => {
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [rates, setRates] = useState(INITIAL_ROLE_RATES);

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div>
                <ConfigSectionHeader 
                    title="Services Catalog" 
                    subtitle="Definición de oferta comercial y márgenes objetivos."
                    action={<button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold uppercase tracking-widest">+ Nuevo Servicio</button>}
                />
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                            <tr className="text-[10px] font-bold uppercase text-zinc-400">
                                <th className="px-6 py-4">Nombre del Servicio</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Precio Base</th>
                                <th className="px-6 py-4">Margen Obj.</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                            {services.map(s => (
                                <tr key={s.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-zinc-900 dark:text-zinc-100">{s.name}</div>
                                        <div className="text-[10px] text-zinc-500 truncate max-w-[200px]">{s.description}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium capitalize">{s.type}</td>
                                    <td className="px-6 py-4 font-mono font-bold">${s.basePrice}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold">{s.targetMargin}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"><Icons.More size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Costos por Hora (Interno)</h3>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                        {rates.map(r => (
                            <div key={r.id} className="flex items-center justify-between group">
                                <div>
                                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{r.roleName}</div>
                                    <div className="text-[10px] text-zinc-400">Interno: ${r.internalCost}/hr</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs text-zinc-400 uppercase font-bold tracking-tighter">Venta Sug.</div>
                                        <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">${r.suggestedRate}/hr</div>
                                    </div>
                                    <button className="p-1.5 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-zinc-900 transition-all"><Icons.More size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Gastos Operativos Globales</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between h-full">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Total Infraestructura & Herramientas</span>
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">$570/mes</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Imputación Promedio Proyectos</span>
                                <span className="font-bold text-emerald-600">12%</span>
                            </div>
                        </div>
                        <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                Olive OS usa estos valores para recalcular la rentabilidad real de cada proyecto basado en el tiempo dedicado y el uso de recursos compartidos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. PROPOSAL ENGINE
const ProposalsView = () => {
    const [selectedService, setSelectedService] = useState(INITIAL_SERVICES[0].id);
    const [qty, setQty] = useState(1);
    const [draftItems, setDraftItems] = useState<ProposalItem[]>([]);

    const activeService = useMemo(() => INITIAL_SERVICES.find(s => s.id === selectedService)!, [selectedService]);
    
    const totals = useMemo(() => {
        const price = draftItems.reduce((acc, item) => acc + item.price, 0);
        const cost = price * 0.45; // Mock estimation logic
        const profit = price - cost;
        const margin = price === 0 ? 0 : Math.round((profit / price) * 100);
        return { price, cost, profit, margin };
    }, [draftItems]);

    const handleAddItem = () => {
        const newItem: ProposalItem = {
            id: Date.now().toString(),
            serviceId: activeService.id,
            serviceName: activeService.name,
            quantity: qty,
            price: activeService.basePrice * qty
        };
        setDraftItems([...draftItems, newItem]);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <ConfigSectionHeader 
                title="Proposal Engine" 
                subtitle="Generación inteligente de propuestas basada en históricos y márgenes deseados."
            />

            <div className="grid grid-cols-12 gap-8">
                {/* Editor */}
                <div className="col-span-8 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                             <Icons.Plus size={16} className="text-indigo-500"/> Configurar Ítem de Propuesta
                        </h3>
                        <div className="grid grid-cols-3 gap-6 items-end">
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Servicio</label>
                                <select 
                                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none font-medium"
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
                                    {INITIAL_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Cantidad / Unid.</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none font-mono"
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value))}
                                />
                            </div>
                            <button 
                                onClick={handleAddItem}
                                className="w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Agregar a Borrador
                            </button>
                        </div>
                    </div>

                    {/* Draft Preview */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Resumen de Propuesta</h3>
                        {draftItems.length === 0 ? (
                            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                                <Icons.Docs size={40} className="mx-auto text-zinc-200 mb-4"/>
                                <p className="text-sm text-zinc-400">No hay ítems en la propuesta actual.</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                {draftItems.map((item, i) => (
                                    <div key={item.id} className={`p-4 flex justify-between items-center ${i !== draftItems.length - 1 ? 'border-b border-zinc-50 dark:border-zinc-800' : ''}`}>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.serviceName}</div>
                                            <div className="text-xs text-zinc-500">Cantidad: {item.quantity}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">${item.price.toLocaleString()}</div>
                                            <button onClick={() => setDraftItems(prev => prev.filter(p => p.id !== item.id))} className="text-zinc-300 hover:text-rose-500"><Icons.Close size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Panel */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-zinc-900 dark:bg-zinc-100 p-6 rounded-2xl text-white dark:text-zinc-900 shadow-xl overflow-hidden relative group">
                        <Icons.Chart size={80} className="absolute -right-4 -top-4 opacity-5 pointer-events-none"/>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-60">Análisis en Tiempo Real</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs opacity-70">Precio Propuesto</span>
                                <span className="text-xl font-bold">${totals.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs opacity-70">Costo Estimado</span>
                                <span className="text-sm font-medium opacity-90">${totals.cost.toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 dark:border-black/10 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase">Rentabilidad Proyectada</span>
                                <span className={`text-2xl font-black ${totals.margin > 60 ? 'text-emerald-400 dark:text-emerald-600' : 'text-amber-400'}`}>
                                    {totals.margin}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                            <Icons.Sparkles size={16}/>
                            <h4 className="text-[10px] font-bold uppercase tracking-wider">Sugerencia AI</h4>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            Basado en <b>Fintech Dashboard</b>, podrías incrementar un 10% el precio base de este servicio sin afectar la conversión del cliente Bank Corp.
                        </p>
                    </div>

                    <button 
                        disabled={draftItems.length === 0}
                        className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-30"
                    >
                        Exportar a PDF / Borrador
                    </button>
                </div>
            </div>
        </div>
    );
};

// 3. ROLES & PERMISSIONS
const RolesView = () => {
    const [users, setUsers] = useState(INITIAL_USERS);

    return (
        <div className="animate-in fade-in duration-500">
             <ConfigSectionHeader 
                title="Roles & Team Access" 
                subtitle="Administra colaboradores y sus niveles de visibilidad sobre finanzas y CRM."
                action={<button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold uppercase tracking-widest">Invitar Colaborador</button>}
            />

            <div className="grid grid-cols-3 gap-6 mb-12">
                {users.map(u => (
                    <div key={u.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative group overflow-hidden">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 dark:text-zinc-400">
                                {u.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate text-zinc-900 dark:text-zinc-100">{u.name}</h4>
                                <p className="text-[10px] text-zinc-400 truncate uppercase tracking-wider font-bold">{u.role}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                             <div className="flex justify-between text-[11px]">
                                <span className="text-zinc-400">Email</span>
                                <span className="text-zinc-700 dark:text-zinc-300 truncate">{u.email}</span>
                             </div>
                             <div className="flex justify-between text-[11px]">
                                <span className="text-zinc-400">Proyectos</span>
                                <span className="text-zinc-700 dark:text-zinc-300">{u.assignedProjects.length || 'Full Access'}</span>
                             </div>
                        </div>
                        <div className="flex gap-2">
                             <button className="flex-1 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors">Editar Perfil</button>
                             <button className="p-2 text-zinc-300 hover:text-zinc-600 transition-colors"><Icons.More size={16}/></button>
                        </div>
                        <div className={`absolute top-0 right-0 w-1 h-full ${u.isActive ? 'bg-emerald-500' : 'bg-zinc-200'}`}></div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Perfiles de Permisos</h3>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                            <tr className="text-[10px] font-bold uppercase text-zinc-400">
                                <th className="px-6 py-4">Módulo / Vista</th>
                                <th className="px-6 py-4 text-center">Admin</th>
                                <th className="px-6 py-4 text-center">Sales</th>
                                <th className="px-6 py-4 text-center">Finance</th>
                                <th className="px-6 py-4 text-center">Collab</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                            {[
                                { module: 'CRM & Pipeline', roles: ['A', 'S', 'F', 'C'] },
                                { module: 'Métricas de Rentabilidad', roles: ['A', 'F'] },
                                { module: 'Edición de Costos', roles: ['A', 'F'] },
                                { module: 'Generación de Propuestas', roles: ['A', 'S'] },
                                { module: 'Configuración de Sistema', roles: ['A'] },
                            ].map((row, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{row.module}</td>
                                    <td className="px-6 py-4 text-center">{row.roles.includes('A') ? <Icons.Check size={16} className="mx-auto text-emerald-500" /> : <span className="text-zinc-200">/</span>}</td>
                                    <td className="px-6 py-4 text-center">{row.roles.includes('S') ? <Icons.Check size={16} className="mx-auto text-emerald-500" /> : <span className="text-zinc-200">/</span>}</td>
                                    <td className="px-6 py-4 text-center">{row.roles.includes('F') ? <Icons.Check size={16} className="mx-auto text-emerald-500" /> : <span className="text-zinc-200">/</span>}</td>
                                    <td className="px-6 py-4 text-center">{row.roles.includes('C') ? <Icons.Check size={16} className="mx-auto text-emerald-500" /> : <span className="text-zinc-200">/</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export const Configuration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'services' | 'proposals' | 'roles'>('services');

    return (
        <div className="flex gap-8 h-full">
            {/* Lateral Navigation */}
            <div className="w-64 shrink-0 space-y-1">
                <NavTab 
                    id="services" 
                    label="Services & Pricing" 
                    icon={<Icons.Zap/>} 
                    active={activeTab === 'services'} 
                    onClick={() => setActiveTab('services')}
                />
                <NavTab 
                    id="proposals" 
                    label="Proposal Engine" 
                    icon={<Icons.Docs/>} 
                    active={activeTab === 'proposals'} 
                    onClick={() => setActiveTab('proposals')}
                />
                <NavTab 
                    id="roles" 
                    label="Roles & Permissions" 
                    icon={<Icons.Users/>} 
                    active={activeTab === 'roles'} 
                    onClick={() => setActiveTab('roles')}
                />
            </div>

            {/* Main Config Area */}
            <div className="flex-1 overflow-y-auto pr-4 no-scrollbar pb-12">
                {activeTab === 'services' && <ServicesView />}
                {activeTab === 'proposals' && <ProposalsView />}
                {activeTab === 'roles' && <RolesView />}
            </div>
        </div>
    );
};
