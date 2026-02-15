import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TaskStatus, TaskPriority } from '@/lib/types';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus: TaskStatus;
  onSubmit: (task: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    tags: string[];
    assignee: string;
    due_date: string;
  }) => void;
}

export function AddTaskDialog({ open, onOpenChange, defaultStatus, onSubmit }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tags, setTags] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description,
      status: defaultStatus,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      assignee,
      due_date: dueDate || '',
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTags('');
    setAssignee('');
    setDueDate('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} required className="bg-background" />
          <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="bg-background resize-none" />
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
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-background" />
          </div>
          <Input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="bg-background" />
          <Input placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} className="bg-background" />
          <Button type="submit" className="w-full">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
