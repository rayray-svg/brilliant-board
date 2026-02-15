import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Tag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';

const priorityStyles: Record<string, string> = {
  urgent: 'bg-priority-urgent/15 text-priority-urgent border-priority-urgent/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
};

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Task> & { id: string }) => void;
  onDelete: (id: string) => void;
}

export function TaskDetailDialog({ task, open, onOpenChange, onUpdate, onDelete }: TaskDetailDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [tags, setTags] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority);
      setStatus(task.status);
      setTags(task.tags.join(', '));
      setAssignee(task.assignee ?? '');
      setDueDate(task.due_date ?? '');
      setEditing(false);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    onUpdate({
      id: task.id,
      title: title.trim(),
      description: description || null,
      priority,
      status,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      assignee: assignee || null,
      due_date: dueDate || null,
    });
    setEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-foreground text-base">Task Details</DialogTitle>
            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 font-medium capitalize border', priorityStyles[task.priority])}>
              {task.priority}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {editing ? (
            <div className="space-y-3">
              <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background font-medium" />
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a description..." rows={3} className="bg-background resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-background" />
              <Input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="bg-background" />
              <Input placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} className="bg-background" />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
              )}
              {!task.description && (
                <p className="text-sm text-muted-foreground/50 italic">No description</p>
              )}

              <div className="space-y-2.5 pt-2 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground w-20 flex items-center gap-1.5"><Clock size={13} /> Status</span>
                  <Badge variant="secondary" className="capitalize text-xs">{task.status.replace('_', ' ')}</Badge>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground w-20 flex items-center gap-1.5"><Calendar size={13} /> Due</span>
                    <span className="text-foreground">{new Date(task.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {task.assignee && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground w-20 flex items-center gap-1.5"><User size={13} /> Assignee</span>
                    <span className="text-foreground">{task.assignee}</span>
                  </div>
                )}
                {task.tags.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground w-20 flex items-center gap-1.5"><Tag size={13} /> Tags</span>
                    <div className="flex gap-1 flex-wrap">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground w-20">Created</span>
                  <span className="text-muted-foreground text-xs">{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditing(true)} className="flex-1">Edit</Button>
                <Button
                  variant="outline"
                  onClick={() => { onDelete(task.id); onOpenChange(false); }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
