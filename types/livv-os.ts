
// Data Models

export enum Status {
    Active = 'Active',
    Pending = 'Pending',
    Review = 'Review',
    Completed = 'Completed',
    Archived = 'Archived'
}

export enum Priority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low'
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority?: Priority;
    projectId?: string; // Link to project
    dueDate?: string; // ISO String
}

// --- TIME TRACKER TYPES ---
export interface ActiveTimer {
    id: string;
    title: string;
    type: 'project' | 'task';
    startTime: number; // Date.now()
    elapsedSeconds: number;
    isRunning: boolean;
}

// --- CALENDAR TYPES ---

export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userInitials: string;
    text: string;
    createdAt: string;
}

export interface CalendarTask {
    id: string;
    title: string;
    completed: boolean;
    projectId?: string;
    startDate?: string;
    endDate?: string;
    priority?: Priority;
    startTime?: string;
    description?: string;
    subtasks?: Subtask[];
    assignee?: Collaborator;
    comments?: Comment[];
}

// --- END CALENDAR TYPES ---

export interface Project {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: Status;
    client?: string;
    clientId?: string;
    tasks: Task[];
    nextSteps: string;
    updatedAt: string;
    color?: string; // UI Color
}

// --- FINANCE & PROFITABILITY TYPES ---

export type BusinessModel = 'fixed' | 'monthly' | 'milestones' | 'variable' | 'hourly';
export type FinancialHealth = 'profitable' | 'at-risk' | 'loss';

export interface PartialPayment {
    id: string;
    amount: number;
    date: string;
    note?: string;
}

export interface Milestone {
    id: string;
    name: string;
    totalAmount: number;
    status: 'pending' | 'partial' | 'paid' | 'delayed';
    expectedDate: string;
    actualDate?: string;
    payments: PartialPayment[];
}

export interface ProjectFinance extends Project {
    model: BusinessModel;
    health: FinancialHealth;
    totalAgreed: number;
    totalCollected: number;
    directExpenses: number;
    imputedExpenses: number;
    hoursWorked?: number;
    milestones: Milestone[];
}

export interface ClientFinance {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'closed';
    avatar: string;
    historicalBilling: number;
    averageProfitability: number;
    projects: ProjectFinance[];
}

export interface GlobalExpense {
    id: string;
    name: string;
    amount: number;
    category: 'tools' | 'services' | 'salary' | 'infra';
    isImputed: boolean;
    date: string;
}

// --- CONFIGURATION & PROPOSALS ---

export interface BusinessService {
    id: string;
    name: string;
    type: BusinessModel;
    basePrice: number;
    currency: string;
    targetMargin?: number;
    isActive: boolean;
    description?: string;
}

export interface RoleRate {
    id: string;
    roleName: string;
    internalCost: number;
    suggestedRate: number;
}

export interface ProposalItem {
    id: string;
    serviceId: string;
    serviceName: string;
    quantity: number;
    price: number;
}

export interface Proposal {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    items: ProposalItem[];
    createdAt: string;
    totalPrice: number;
    estimatedCost: number;
    profitability: number; // Percent
}

// --- PERMISSIONS & USERS ---

export interface AppPermissions {
    crm: { view: boolean; edit: boolean };
    finance: { viewMetrics: boolean; editCosts: boolean; viewProfitability: boolean };
    proposals: { create: boolean; edit: boolean };
    config: 'full' | 'partial' | 'none';
}

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    avatar: string;
    assignedProjects: string[]; // Project IDs
}

// --- END CONFIGURATION TYPES ---

// --- DOCS TYPES ---
export interface DocFolder {
    id: string;
    parentId: string | null;
    name: string;
    appIcons?: string[];
}

export type DocType = 'doc' | 'code' | 'sheet' | 'image' | 'pdf' | 'zip';

export interface DocFile {
    id: string;
    folderId: string;
    name: string;
    type: DocType;
    size: string;
    author: string;
    avatar: string;
    date: string;
    content?: string;
}
// --- END DOCS TYPES ---

export interface Collaborator {
    id: string;
    name: string;
    role: string;
    avatarInitials: string;
    status: 'online' | 'offline' | 'busy';
    pendingTasks: number;
}

// --- ACTIVITY TYPES ---

export type ActivityType = 'task_completed' | 'comment' | 'file_uploaded' | 'status_change' | 'project_created';

export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    action: string;
    target: string;
    projectId?: string;
    projectTitle?: string;
    type: ActivityType;
    timestamp: string;
    details?: string;
    meta?: any;
}

// --- SALES & LEADS TYPES ---

export type LeadStatus = 'new' | 'contacted' | 'following' | 'closed' | 'lost';
export type LeadTemperature = 'cold' | 'warm' | 'hot';
export type LeadCategory = 'branding' | 'web-design' | 'ecommerce' | 'saas' | 'creators' | 'other';

export interface Lead {
    id: string;
    name: string;
    email: string;
    message: string;
    origin: string;
    status: LeadStatus;
    createdAt: string;
    lastInteraction: string;
    aiAnalysis?: {
        category: LeadCategory;
        temperature: LeadTemperature;
        summary: string;
        recommendation: string;
    };
    history: any[];
}

export interface WebAnalytics {
    totalVisits: number;
    uniqueVisitors: number;
    bounceRate: number;
    conversions: number;
    topPages: { path: string; views: number }[];
    dailyVisits: { date: string; value: number }[];
}

export type AppMode = 'os' | 'sales';
export type PageView = 'home' | 'projects' | 'clients' | 'calendar' | 'ideas' | 'docs' | 'activity' | 'sales_dashboard' | 'sales_leads' | 'sales_analytics' | 'finance' | 'configuration' | 'inbox'; // Added inbox

// --- IDEAS & INBOX ---
export interface Idea {
    id: string;
    text: string;
    createdAt: string;
    tags?: string[];
}

export interface InboxMessage {
    id: string;
    sender: { name: string; email: string; avatar: string };
    subject: string;
    preview: string;
    date: string;
    read: boolean;
    tags: string[];
}

// --- PORTFOLIO CMS TYPES ---
export interface PortfolioItem {
    id: string;
    title: string;
    subtitle?: string;
    category?: string;
    services?: string;
    year?: string;
    image?: string;
    featured: boolean;
    slug?: string;
    color?: string;
    description?: string;
    created_at?: string;
}
