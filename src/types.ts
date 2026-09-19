export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'One-off';

export type TaskStatus = 'Pending' | 'Done this period';

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type?: 'doc' | 'sheet' | 'notion' | 'tool' | 'link';
}

export interface CompletionRecord {
  id: string;
  completedAt: string; // ISO string
  completedBy: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  frequency: TaskFrequency;
  owner: string;
  ownerRole?: string;
  category: string;
  estDurationMinutes?: number;
  steps: string[];
  links: ResourceLink[];
  lastCompletedAt: string | null; // ISO string or null
  history: CompletionRecord[];
  createdAt: string;
  archived?: boolean;
}

export type ViewRoute = 
  | { name: 'dashboard' }
  | { name: 'tasks'; filterStatus?: 'all' | 'pending' | 'done'; filterFrequency?: string; filterCategory?: string }
  | { name: 'task-detail'; taskId: string }
  | { name: 'task-new' };
