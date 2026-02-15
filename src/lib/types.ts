export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  assignee?: string | null;
  due_date?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'Todo', color: 'hsl(var(--muted-foreground))' },
  { id: 'in_progress', title: 'In Progress', color: 'hsl(var(--chat-accent))' },
  { id: 'in_review', title: 'In Review', color: 'hsl(var(--priority-high))' },
  { id: 'done', title: 'Done', color: 'hsl(var(--priority-low))' },
];

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
