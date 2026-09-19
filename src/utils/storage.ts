import { Task, TaskFrequency, TaskStatus, CompletionRecord } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';

const STORAGE_KEY = 'team_task_sop_tracker_v1';

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function resetToSampleTasks(): Task[] {
  saveTasks(INITIAL_TASKS);
  return INITIAL_TASKS;
}

/**
 * Checks if a task is considered completed for its designated recurring period:
 * - Daily: completed within the last 24 hours
 * - Weekly: completed within the last 7 days
 * - Monthly: completed within the last 30 days
 * - One-off: completed if lastCompletedAt is non-null
 */
export function isTaskDoneThisPeriod(task: Task): boolean {
  if (!task.lastCompletedAt) return false;
  const completedTime = new Date(task.lastCompletedAt).getTime();
  if (isNaN(completedTime)) return false;

  const now = Date.now();
  const diffMs = now - completedTime;

  switch (task.frequency) {
    case 'Daily':
      return diffMs <= 24 * 60 * 60 * 1000;
    case 'Weekly':
      return diffMs <= 7 * 24 * 60 * 60 * 1000;
    case 'Monthly':
      return diffMs <= 30 * 24 * 60 * 60 * 1000;
    case 'One-off':
      return true;
    default:
      return false;
  }
}

export function getTaskStatus(task: Task): TaskStatus {
  return isTaskDoneThisPeriod(task) ? 'Done this period' : 'Pending';
}

export function markTaskAsDone(
  tasks: Task[],
  taskId: string,
  completedBy: string = 'Team Member',
  notes?: string
): { updatedTasks: Task[]; updatedTask: Task | null } {
  const now = new Date().toISOString();
  let updatedTask: Task | null = null;

  const updatedTasks = tasks.map((t) => {
    if (t.id === taskId) {
      const record: CompletionRecord = {
        id: 'comp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        completedAt: now,
        completedBy: completedBy.trim() || t.owner || 'Operator',
        notes: notes?.trim() || undefined,
      };

      updatedTask = {
        ...t,
        lastCompletedAt: now,
        history: [record, ...(t.history || [])],
      };
      return updatedTask;
    }
    return t;
  });

  saveTasks(updatedTasks);
  return { updatedTasks, updatedTask };
}

export function markTaskAsPending(tasks: Task[], taskId: string): Task[] {
  const updatedTasks = tasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        lastCompletedAt: null,
      };
    }
    return t;
  });
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function formatDateRelative(isoString: string | null): string {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid date';

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateFull(isoString: string | null): string {
  if (!isoString) return 'Never completed';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getFrequencyBadge(frequency: TaskFrequency) {
  switch (frequency) {
    case 'Daily':
      return {
        label: 'Daily',
        bg: 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
        dot: 'bg-amber-500',
      };
    case 'Weekly':
      return {
        label: 'Weekly',
        bg: 'bg-blue-50 text-blue-800 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
        dot: 'bg-blue-500',
      };
    case 'Monthly':
      return {
        label: 'Monthly',
        bg: 'bg-purple-50 text-purple-800 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
        dot: 'bg-purple-500',
      };
    case 'One-off':
      return {
        label: 'One-off',
        bg: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
        dot: 'bg-stone-500',
      };
  }
}
