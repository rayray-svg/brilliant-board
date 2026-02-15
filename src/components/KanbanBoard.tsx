import { useState } from 'react';
import { COLUMNS, TaskStatus } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskDialog } from './AddTaskDialog';
import { useTasks } from '@/hooks/useTasks';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function KanbanBoard() {
  const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<TaskStatus>('todo');

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;
    updateTask.mutate({ id: taskId, status: newStatus }, {
      onError: () => toast.error('Failed to move task'),
    });
  };

  const handleAdd = (task: any) => {
    addTask.mutate(task, {
      onError: () => toast.error('Failed to add task'),
      onSuccess: () => toast.success('Task added'),
    });
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id, {
      onError: () => toast.error('Failed to delete task'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex gap-4 p-6 overflow-x-auto scrollbar-thin">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasks.filter(t => t.status === col.id)}
            onDrop={handleDrop}
            onAddClick={(status) => { setDialogStatus(status); setDialogOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultStatus={dialogStatus}
        onSubmit={handleAdd}
      />
    </>
  );
}
