
import { Project, CalendarTask, Priority, Status, Collaborator } from '@/types/livv-os';

// Default project fallback
export const fallbackProjects: Project[] = [
    {
        id: '1',
        title: 'Initializing Database...',
        description: 'Please wait while we fetch your projects.',
        progress: 0,
        status: Status.Active,
        nextSteps: 'Connecting...',
        tasks: [],
        updatedAt: new Date().toISOString(),
        client: 'System'
    }
];

export const adaptTask = (dbTask: any): CalendarTask => {
    // Check if dbTask is already in the correct format (sometimes happens with optimistically updated state)
    if (dbTask.projectId && !dbTask.project_id) return dbTask;

    return {
        id: dbTask.id,
        title: dbTask.title || 'Untitled Task',
        completed: dbTask.completed || false,
        projectId: dbTask.project_id,
        startDate: dbTask.start_date,
        endDate: dbTask.end_date,
        priority: (dbTask.priority as Priority) || Priority.Medium,
        startTime: dbTask.start_time,
        description: dbTask.description || '',
        subtasks: dbTask.subtasks || [],
        assignee: dbTask.assignee ? (typeof dbTask.assignee === 'string' ? { id: 'user', name: dbTask.assignee, role: 'Member', avatarInitials: dbTask.assignee.substring(0, 2).toUpperCase(), status: 'online', pendingTasks: 0 } : dbTask.assignee) : undefined,
        comments: dbTask.comments || []
    };
};

export const adaptProject = (dbProject: any): Project => {
    // Check for already adapted
    if (dbProject.nextSteps && !dbProject.next_steps) return dbProject;

    return {
        id: dbProject.id,
        title: dbProject.title || 'Untitled Project',
        description: dbProject.description || '',
        progress: dbProject.progress || 0,
        status: (dbProject.status as Status) || Status.Active,
        client: dbProject.client || 'Client',
        clientId: dbProject.client_id,
        tasks: dbProject.tasks ? dbProject.tasks.map(adaptTask) : [],
        nextSteps: dbProject.next_steps || 'No next steps',
        updatedAt: dbProject.updated_at || new Date().toISOString(),
        color: dbProject.color || 'bg-zinc-400'
    };
};

export const adaptLead = (dbLead: any): any => {
    return {
        id: dbLead.id,
        name: dbLead.name || 'Unknown Lead',
        email: dbLead.email || '',
        message: dbLead.message || '',
        origin: dbLead.source || dbLead.origin || 'Direct', // Updated to use 'source'
        status: dbLead.status || 'new',
        createdAt: dbLead.created_at || new Date().toISOString(),
        lastInteraction: dbLead.last_interaction || new Date().toISOString(),
        aiAnalysis: dbLead.ai_analysis || undefined, // Assumes jsonb or parsed
        history: dbLead.history || []
    };
};

export const adaptActivity = (dbActivity: any): any => {
    return {
        id: dbActivity.id,
        userId: dbActivity.user_id,
        userName: dbActivity.user_name || 'Unknown User',
        userAvatar: dbActivity.user_avatar || 'U',
        type: dbActivity.type,
        action: dbActivity.action,
        target: dbActivity.target || '',
        projectId: dbActivity.project_id,
        projectTitle: dbActivity.project_title,
        timestamp: dbActivity.created_at ? new Date(dbActivity.created_at).toLocaleString() : 'Just now',
        details: dbActivity.details,
        meta: dbActivity.meta
    };
};

export const adaptClient = (dbClient: any): any => {
    return {
        id: dbClient.id,
        name: dbClient.name || 'Unknown Client',
        role: dbClient.role || 'Client', // Mock if missing
        company: dbClient.company || dbClient.origin || 'Unknown Company',
        email: dbClient.email || '',
        avatar: dbClient.name ? dbClient.name.substring(0, 2).toUpperCase() : 'C',
        location: dbClient.location || 'Remote',
        status: 'active', // Derived
        tags: ['Client'],
        sharedProjects: [], // Need separate fetch or join
        lastInteraction: dbClient.last_interaction ? new Date(dbClient.last_interaction).toLocaleString() : 'Never',
        notes: '', // Mock for now
        tasks: [], // Mock
        history: [], // Mock
        messages: [] // Mock
    };
};

export const adaptDocument = (dbDoc: any): any => {
    // Determine if folder or file
    if (dbDoc.type === 'folder') {
        return {
            id: dbDoc.id,
            parentId: dbDoc.parent_id,
            name: dbDoc.name,
            appIcons: dbDoc.tags || [] // Reuse tags for icons
        };
    } else {
        return {
            id: dbDoc.id,
            folderId: dbDoc.parent_id,
            name: dbDoc.name,
            type: dbDoc.tags?.[0] || 'doc', // Store file type in tags[0] or default
            size: '0 KB', // Not stored in schema? Mock for now
            author: 'Eneas', // Mock or fetch author
            avatar: 'E',
            date: dbDoc.updated_at ? new Date(dbDoc.updated_at).toLocaleDateString() : 'Just now',
            content: dbDoc.content
        };
    }
};

export const adaptBusinessService = (dbService: any): any => {
    return {
        id: dbService.id,
        name: dbService.name,
        type: dbService.type,
        basePrice: dbService.base_price,
        currency: dbService.currency,
        targetMargin: dbService.target_margin,
        isActive: dbService.is_active,
        description: dbService.description
    };
};

export const adaptRoleRate = (dbRate: any): any => {
    return {
        id: dbRate.id,
        roleName: dbRate.role_name,
        internalCost: dbRate.internal_cost,
        suggestedRate: dbRate.suggested_rate
    };
};

export const adaptIdea = (dbIdea: any): any => {
    return {
        id: dbIdea.id,
        text: dbIdea.text,
        tags: dbIdea.tags || [],
        createdAt: dbIdea.created_at ? new Date(dbIdea.created_at).toLocaleDateString() : 'Just now'
    };
};

export const adaptMessage = (dbMessage: any): any => {
    return {
        id: dbMessage.id,
        sender: {
            name: dbMessage.sender_name,
            email: dbMessage.sender_email,
            avatar: dbMessage.sender_avatar || dbMessage.sender_name.substring(0, 2).toUpperCase()
        },
        subject: dbMessage.subject,
        preview: dbMessage.preview || '',
        date: dbMessage.created_at ? new Date(dbMessage.created_at).toLocaleDateString() : 'Just now',
        read: dbMessage.read || false,
        tags: dbMessage.tags || []
    };
};

export const adaptLeadToMessage = (dbLead: any): any => {
    return {
        id: dbLead.id,
        sender: {
            name: dbLead.name || 'Unknown',
            email: dbLead.email || 'No email',
            avatar: (dbLead.name || 'U').substring(0, 2).toUpperCase()
        },
        subject: `New Lead from ${dbLead.source || 'Website'}`,
        preview: dbLead.message || 'No message content.',
        date: dbLead.created_at ? new Date(dbLead.created_at).toLocaleDateString() : 'Just now',
        read: dbLead.status !== 'new', // If status is not new, assume read/processed
        tags: ['Lead', dbLead.status]
    };
};

export const adaptDashboardTask = (dbTask: any): any => {
    return {
        id: dbTask.id,
        title: dbTask.title || 'Untitled',
        completed: dbTask.completed || false,
        tag: dbTask.tag || 'General',
        priority: dbTask.priority || 'Medium',
        estimatedHours: dbTask.estimated_hours || 0,
        startDate: dbTask.start_date
    };
};

// --- FINANCE ADAPTERS (NEW) ---

export const adaptInvoice = (dbInvoice: any): any => {
    return {
        id: dbInvoice.id,
        invoiceNumber: dbInvoice.invoice_number,
        clientId: dbInvoice.client_id,
        projectId: dbInvoice.project_id,
        issueDate: dbInvoice.issue_date,
        dueDate: dbInvoice.due_date,
        status: dbInvoice.status || 'draft',
        subtotal: parseFloat(dbInvoice.subtotal) || 0,
        tax: parseFloat(dbInvoice.tax) || 0,
        total: parseFloat(dbInvoice.total) || 0,
        paidAmount: parseFloat(dbInvoice.paid_amount) || 0,
        paidDate: dbInvoice.paid_date,
        notes: dbInvoice.notes,
        createdAt: dbInvoice.created_at,
        updatedAt: dbInvoice.updated_at
    };
};

export const adaptInvoiceItem = (dbItem: any): any => {
    return {
        id: dbItem.id,
        invoiceId: dbItem.invoice_id,
        description: dbItem.description,
        quantity: parseFloat(dbItem.quantity) || 1,
        unitPrice: parseFloat(dbItem.unit_price) || 0,
        amount: parseFloat(dbItem.amount) || 0,
        createdAt: dbItem.created_at
    };
};

export const adaptExpense = (dbExpense: any): any => {
    return {
        id: dbExpense.id,
        description: dbExpense.description,
        amount: parseFloat(dbExpense.amount) || 0,
        category: dbExpense.category || 'other',
        expenseDate: dbExpense.expense_date,
        projectId: dbExpense.project_id,
        vendor: dbExpense.vendor,
        receiptUrl: dbExpense.receipt_url,
        isBillable: dbExpense.is_billable || false,
        status: dbExpense.status || 'pending',
        createdBy: dbExpense.created_by,
        createdAt: dbExpense.created_at,
        updatedAt: dbExpense.updated_at
    };
};

export const adaptCredential = (dbCred: any): any => {
    return {
        id: dbCred.id,
        projectId: dbCred.project_id,
        serviceName: dbCred.service_name,
        username: dbCred.username,
        url: dbCred.url,
        notes: dbCred.notes,
        createdAt: dbCred.created_at,
        updatedAt: dbCred.updated_at
    };
};

export const adaptAnalyticsMetric = (dbMetric: any): any => {
    return {
        id: dbMetric.id,
        metricType: dbMetric.metric_type,
        metricValue: dbMetric.metric_value,
        date: dbMetric.date,
        createdAt: dbMetric.created_at
    };
};

