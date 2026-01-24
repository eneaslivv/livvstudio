
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
    project_id?: string; // Link to project
    due_date?: string; // ISO String
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
    project_id?: string;
    start_date?: string;
    end_date?: string;
    priority?: Priority;
    start_time?: string;
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
    client_id?: string;
    tasks?: Task[];
    tasks_groups?: any[]; // For JSONB storage
    next_steps: string;
    updated_at: string;
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
    total_amount: number;
    status: 'pending' | 'partial' | 'paid' | 'delayed';
    expected_date: string;
    actual_date?: string;
    payments: PartialPayment[];
}

export interface ProjectFinance extends Project {
    model: BusinessModel;
    health: FinancialHealth;
    total_agreed: number;
    total_collected: number;
    direct_expenses: number;
    imputed_expenses: number;
    hours_worked?: number;
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
    base_price: number;
    currency: string;
    target_margin?: number;
    is_active: boolean;
    description?: string;
}

export interface RoleRate {
    id: string;
    role_name: string;
    internal_cost: number;
    suggested_rate: number;
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
    client_id: string;
    client_name: string;
    title: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    items: ProposalItem[];
    created_at: string;
    total_price: number;
    estimated_cost: number;
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
    user_id: string;
    user_name: string;
    user_avatar: string;
    action: string;
    target: string;
    project_id?: string;
    project_title?: string;
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
    created_at: string;
    last_interaction: string;
    ai_analysis?: {
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
export type PageView = 'home' | 'projects' | 'clients' | 'calendar' | 'ideas' | 'docs' | 'activity' | 'sales_dashboard' | 'sales_leads' | 'sales_analytics' | 'finance' | 'configuration';

// --- CLIENT & CONTACT TYPES ---

export interface ClientTask {
    id: string;
    text: string;
    completed: boolean;
}

export interface HistoryItem {
    id: string;
    type: 'meeting' | 'note' | 'system';
    title: string;
    subtitle: string;
    date: string;
    icon?: string;
}

export interface ChatMessage {
    id: string;
    sender: 'me' | 'client';
    text: string;
    timestamp: string;
}

export interface Client {
    id: string;
    name: string;
    role: string;
    company: string;
    email: string;
    avatar: string;
    location: string;
    status: 'active' | 'pending' | 'archived';
    tags: string[];
    shared_projects: string[];
    last_interaction: string;
    notes: string;
    tasks: ClientTask[];
    history: HistoryItem[];
    messages: ChatMessage[];
}

export interface AdminDocument {
    id: string;
    parent_id: string | null;
    type: 'folder' | 'file';
    name: string;
    content?: string;
    tags?: string[];
    author_id?: string;
    created_at?: string;
    updated_at?: string;
}

// --- FINANCE TYPES (NEW) ---

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type ExpenseCategory = 'software' | 'hardware' | 'marketing' | 'office' | 'travel' | 'salary' | 'other';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface Invoice {
    id: string;
    invoice_number: string;
    client_id: string | null;
    project_id: string | null;
    issue_date: string;
    due_date: string;
    status: InvoiceStatus;
    subtotal: number;
    tax: number;
    total: number;
    paid_amount: number;
    paid_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    created_at: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    expense_date: string;
    project_id: string | null;
    vendor: string | null;
    receipt_url: string | null;
    is_billable: boolean;
    status: ExpenseStatus;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

// --- CREDENTIALS TYPES (NEW) ---

export interface ProjectCredential {
    id: string;
    project_id: string;
    service_name: string;
    username: string | null;
    url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// --- ANALYTICS METRICS (NEW) ---

export interface AnalyticsMetric {
    id: string;
    metric_type: string;
    metric_value: Record<string, any>;
    date: string;
    created_at: string;
}

