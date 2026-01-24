
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/ui/Icons';

// --- TYPES ---

interface HistoryItem {
  id: string;
  type: 'meeting' | 'note' | 'system';
  title: string;
  subtitle: string;
  date: string;
  icon?: React.ReactNode;
}

interface ChatMessage {
    id: string;
    sender: 'me' | 'client';
    text: string;
    timestamp: string;
}

interface ClientTask {
  id: string;
  text: string;
  completed: boolean;
}

interface Client {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  avatar: string;
  location: string;
  status: 'active' | 'pending' | 'archived';
  tags: string[];
  sharedProjects: string[]; 
  lastInteraction: string;
  notes: string;
  tasks: ClientTask[];
  history: HistoryItem[];
  messages: ChatMessage[]; // New Chat History
}

// --- MOCK DATA ---

const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', name: 'Sofia Rodriguez', role: 'Lead Designer', company: 'Studio Alpha', email: 'sofia@studioalpha.design', 
    avatar: 'SR', location: 'Madrid, ES', status: 'active', tags: ['Design', 'Vendor'],
    sharedProjects: ['Fintech Dashboard', 'Personal Brand'], lastInteraction: '2 hours ago',
    notes: 'Sofia is currently leading the UI refactor. Check in on Friday regarding the icon set. She prefers async communication via email for non-urgent matters.',
    tasks: [
        { id: 't1', text: 'Review Figma prototype comments', completed: false },
        { id: 't2', text: 'Send updated contract for Q4', completed: true },
    ],
    history: [
        { id: 'h1', type: 'meeting', title: 'Meeting with Engineering Team', subtitle: '45 mins • Zoom', date: 'Yesterday' },
        { id: 'h2', type: 'system', title: 'Sent invoice #4002', subtitle: 'Viewed by client', date: 'Oct 20' }
    ],
    messages: [
        { id: 'm1', sender: 'client', text: 'Hi Eneas! Just sent over the new icon set.', timestamp: 'Yesterday 10:00 AM' },
        { id: 'm2', sender: 'me', text: 'Thanks Sofia, I will take a look this afternoon.', timestamp: 'Yesterday 10:15 AM' },
        { id: 'm3', sender: 'client', text: 'Great, let me know if you need any SVGs exported differently.', timestamp: 'Yesterday 10:20 AM' }
    ]
  },
  { 
    id: '2', name: 'Lucas M.', role: 'Product Manager', company: 'TechFlow', email: 'lucas@techflow.io', 
    avatar: 'LM', location: 'San Francisco, US', status: 'active', tags: ['Client', 'Retainer'],
    sharedProjects: ['E-commerce API'], lastInteraction: 'Yesterday',
    notes: 'Key stakeholder for the API project. Needs weekly updates on Friday mornings.',
    tasks: [
        { id: 't3', text: 'Prepare weekly report', completed: false },
    ],
    history: [],
    messages: [
        { id: 'm1', sender: 'me', text: 'Lucas, regarding the API schema, are we sticking to GraphQL?', timestamp: 'Mon 9:00 AM' },
        { id: 'm2', sender: 'client', text: 'Yes, absolutely. REST is out for this project.', timestamp: 'Mon 9:30 AM' }
    ]
  },
  { 
    id: '3', name: 'Sarah Jenkins', role: 'Marketing Director', company: 'Global Corp', email: 's.jenkins@global.com', 
    avatar: 'SJ', location: 'London, UK', status: 'pending', tags: ['Lead'],
    sharedProjects: [], lastInteraction: '3 days ago',
    notes: 'Potential lead for the Q1 Marketing site redesign. Sent proposal on Oct 20.',
    tasks: [],
    history: [],
    messages: []
  },
];

// --- MODALS ---

const AddClientModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (c: Client) => void }) => {
    const [formData, setFormData] = useState({ name: '', role: '', company: '', email: '' });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if(!formData.name || !formData.company) return;
        const newClient: Client = {
            id: Date.now().toString(),
            ...formData,
            avatar: formData.name.substring(0,2).toUpperCase(),
            location: 'Remote',
            status: 'active',
            tags: ['New'],
            sharedProjects: [],
            lastInteraction: 'Just now',
            notes: 'Added manually.',
            tasks: [],
            history: [{ id: `h${Date.now()}`, type: 'system', title: 'Contact Created', subtitle: 'Manual Entry', date: 'Just now' }],
            messages: []
        };
        onAdd(newClient);
        setFormData({ name: '', role: '', company: '', email: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Add New Contact</h3>
                <div className="space-y-3">
                    <input autoFocus type="text" placeholder="Full Name" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="text" placeholder="Role (e.g. CEO)" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    <input type="text" placeholder="Company" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                    <input type="email" placeholder="Email" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md text-sm font-medium">Add Contact</button>
                </div>
            </div>
        </div>
    );
};

const ScheduleModal = ({ isOpen, onClose, onSchedule }: { isOpen: boolean, onClose: () => void, onSchedule: (title: string, time: string) => void }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Schedule Meeting</h3>
                <div className="space-y-3">
                    <input type="text" placeholder="Meeting Title" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={title} onChange={e => setTitle(e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={date} onChange={e => setDate(e.target.value)} />
                        <input type="time" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm outline-none text-zinc-900 dark:text-zinc-100" value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">Cancel</button>
                    <button onClick={() => { onSchedule(title, `${date} at ${time}`); setTitle(''); }} disabled={!title || !date} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md text-sm font-medium">Schedule</button>
                </div>
            </div>
        </div>
    );
};

// --- CHAT COMPONENT ---

const ChatInterface = ({ client, onSendMessage }: { client: Client, onSendMessage: (msg: string) => void }) => {
    const [msgInput, setMsgInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [client.messages]);

    const handleSend = () => {
        if(!msgInput.trim()) return;
        onSendMessage(msgInput);
        setMsgInput('');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/20">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {client.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                        <Icons.Message size={48} className="mb-4 opacity-20"/>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                )}
                
                {/* Date Divider (Mock) */}
                {client.messages.length > 0 && (
                    <div className="flex justify-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">Today</span>
                    </div>
                )}

                {client.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                            <div 
                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.sender === 'me' 
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-tr-none' 
                                    : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-500 transition-all">
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                        <Icons.Paperclip size={18}/>
                    </button>
                    <textarea 
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={`Message ${client.name}...`}
                        className="flex-1 bg-transparent border-none resize-none outline-none text-sm text-zinc-900 dark:text-zinc-100 max-h-32 py-2"
                        rows={1}
                        style={{ minHeight: '40px' }}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!msgInput.trim()}
                        className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Icons.Send size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'messages'>('overview');
  
  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // --- ACTIONS ---

  const handleAddClient = (newClient: Client) => {
      setClients([...clients, newClient]);
      setSelectedClientId(newClient.id);
      setIsAddModalOpen(false);
  };

  const handleSendMessage = (msg: string) => {
      const newMessage: ChatMessage = {
          id: `m${Date.now()}`,
          sender: 'me',
          text: msg,
          timestamp: 'Just now'
      };
      
      setClients(prev => prev.map(c => 
          c.id === selectedClientId 
          ? { ...c, messages: [...c.messages, newMessage], lastInteraction: 'Just now' } 
          : c
      ));
  };

  const handleScheduleMeeting = (title: string, timeStr: string) => {
      const newHistory: HistoryItem = {
          id: `h${Date.now()}`,
          type: 'meeting',
          title: title,
          subtitle: timeStr,
          date: 'Scheduled'
      };
      setClients(prev => prev.map(c => 
          c.id === selectedClientId 
          ? { ...c, history: [newHistory, ...c.history] } 
          : c
      ));
      setIsMeetModalOpen(false);
  };

  const handleUpdateNotes = (newNotes: string) => {
      setClients(prev => prev.map(c => c.id === selectedClientId ? { ...c, notes: newNotes } : c));
  };

  const handleAddTask = () => {
      if(!newTaskInput.trim()) return;
      const newTask: ClientTask = { id: `t${Date.now()}`, text: newTaskInput, completed: false };
      setClients(prev => prev.map(c => c.id === selectedClientId ? { ...c, tasks: [newTask, ...c.tasks] } : c));
      setNewTaskInput('');
  };

  const handleToggleTask = (taskId: string) => {
      setClients(prev => prev.map(c => 
          c.id === selectedClientId 
          ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } 
          : c
      ));
  };

  const handleDeleteTask = (taskId: string) => {
      setClients(prev => prev.map(c => 
          c.id === selectedClientId 
          ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } 
          : c
      ));
  };

  // Filter Logic
  const filteredClients = clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derived Progress
  const totalTasks = selectedClient.tasks.length;
  const completedTasks = selectedClient.tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex h-[calc(100vh-100px)] border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      
      {/* Modals */}
      <AddClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddClient} />
      <ScheduleModal isOpen={isMeetModalOpen} onClose={() => setIsMeetModalOpen(false)} onSchedule={handleScheduleMeeting} />

      {/* Sidebar List */}
      <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/30">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">People & Teams</h2>
          <div className="relative">
             <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
             <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:text-zinc-100 dark:focus:ring-zinc-600"
             />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredClients.map(client => (
             <div 
               key={client.id}
               onClick={() => setSelectedClientId(client.id)}
               className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                 selectedClientId === client.id 
                 ? 'bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm' 
                 : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-transparent'
               }`}
             >
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${selectedClientId === client.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                 {client.avatar}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-medium truncate ${selectedClientId === client.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-400'}`}>{client.name}</h4>
                    {client.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                 </div>
                 <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">{client.role} • {client.company}</p>
               </div>
             </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
           <button onClick={() => setIsAddModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Icons.Plus size={16} /> Add Contact
           </button>
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
         {/* Profile Header */}
         <div className="px-8 pt-8 pb-0 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-xl font-bold text-zinc-500 dark:text-zinc-400 shadow-inner">
                     {selectedClient.avatar}
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{selectedClient.name}</h1>
                     <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">{selectedClient.role} at <span className="text-zinc-900 dark:text-zinc-200 font-medium">{selectedClient.company}</span></p>
                     
                     <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5"><Icons.Mail size={12} className="text-zinc-400"/> {selectedClient.email}</div>
                        <div className="flex items-center gap-1.5"><Icons.MapPin size={12} className="text-zinc-400"/> {selectedClient.location}</div>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                     <Icons.Message size={14} /> Send Message
                  </button>
                  <button onClick={() => setIsMeetModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                     <Icons.Calendar size={14} /> Meet
                  </button>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mt-4">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 text-sm font-medium transition-all relative ${activeTab === 'overview' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                    Overview
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-t-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('messages')}
                    className={`pb-3 text-sm font-medium transition-all relative ${activeTab === 'messages' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                    Messages
                    {activeTab === 'messages' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-t-full"></div>}
                </button>
            </div>
         </div>

         {/* Context Body - Switches based on Active Tab */}
         <div className="flex-1 overflow-hidden">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="h-full overflow-y-auto p-8 grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Left Col: Notes, Projects & History */}
                    <div className="col-span-2 space-y-8">
                    
                        {/* Notes Section - Editable */}
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-5 border border-amber-100/60 dark:border-amber-900/30 group focus-within:ring-1 focus-within:ring-amber-200 dark:focus-within:ring-amber-800 transition-all">
                            <h3 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Icons.Pin size={12} /> Pinned Note
                            </h3>
                            <textarea 
                                className="w-full bg-transparent text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed outline-none resize-none min-h-[60px]"
                                value={selectedClient.notes}
                                onChange={(e) => handleUpdateNotes(e.target.value)}
                                placeholder="Add notes about this client..."
                            />
                        </div>

                        {/* Projects */}
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                <Icons.Briefcase size={16} className="text-zinc-400"/> Shared Projects
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedClient.sharedProjects.length > 0 ? selectedClient.sharedProjects.map(proj => (
                                    <div key={proj} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Icons.Layers size={16}/></div>
                                        <Icons.External size={14} className="text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
                                    </div>
                                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{proj}</h4>
                                    <p className="text-xs text-zinc-500 mt-1">Status: Active</p>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-400">
                                    No active projects linked.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dynamic History */}
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                <Icons.Clock size={16} className="text-zinc-400"/> Recent History
                            </h3>
                            <div className="space-y-6 relative pl-2 border-l border-zinc-200 dark:border-zinc-800 ml-2">
                                {selectedClient.history.length > 0 ? selectedClient.history.map(item => (
                                    <div key={item.id} className="relative pl-6">
                                        <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-zinc-900 ${
                                            item.type === 'meeting' ? 'bg-orange-400' : 
                                            item.type === 'system' ? 'bg-zinc-300 dark:bg-zinc-600' : 'bg-blue-400'
                                        }`}></div>
                                        <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{item.title}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{item.date} • {item.subtitle}</p>
                                    </div>
                                )) : (
                                    <div className="pl-6 text-sm text-zinc-400 italic">No history yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Tasks */}
                    <div className="col-span-1 border-l border-zinc-100 dark:border-zinc-800 pl-8 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tasks & Action Items</h3>
                                <span className="text-[10px] text-zinc-400">{completedTasks}/{totalTasks}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            {totalTasks > 0 && (
                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4 overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {selectedClient.tasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-3 group">
                                        <button 
                                            onClick={() => handleToggleTask(task.id)}
                                            className={`mt-0.5 text-zinc-300 hover:text-emerald-500 transition-colors ${task.completed ? 'text-emerald-500' : ''}`}
                                        >
                                            {task.completed ? <Icons.Check size={16} /> : <Icons.Uncheck size={16}/>}
                                        </button>
                                        <div className="flex-1">
                                            <span className={`text-sm leading-snug transition-all ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}`}>
                                                {task.text}
                                            </span>
                                        </div>
                                        <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all">
                                            <Icons.Trash size={14}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Add Task Input */}
                            <div className="mt-4 flex items-center gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Add new task..." 
                                    value={newTaskInput}
                                    onChange={e => setNewTaskInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                                    className="flex-1 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm py-1 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                                />
                                <button onClick={handleAddTask} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                                    <Icons.Plus size={16}/>
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Attachments</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                                    <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400"><Icons.File size={14}/></div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">Contract_v2.pdf</div>
                                        <div className="text-[10px] text-zinc-400">2.4 MB</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors text-xs gap-2">
                                    <Icons.Upload size={14}/> Upload File
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ChatInterface client={selectedClient} onSendMessage={handleSendMessage} />
                </div>
            )}

         </div>
      </div>
    </div>
  );
};
