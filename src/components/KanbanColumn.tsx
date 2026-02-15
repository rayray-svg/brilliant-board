import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, Column, TaskStatus } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDrop: (taskId: string, status: TaskStatus) => void;
  onAddClick: (status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onDrop, onAddClick, onDelete, onTaskClick }: KanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(
        'flex flex-col min-w-[300px] w-[300px] rounded-xl transition-colors duration-200',
        dragOver ? 'bg-accent/60' : 'bg-column',
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) onDrop(taskId, column.id);
      }}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-sm font-semibold text-foreground">{column.title}</span>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">{tasks.length}</span>
        </div>
        <button onClick={() => onAddClick(column.id)} className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto scrollbar-thin max-h-[calc(100vh-180px)]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} onClick={onTaskClick} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">Drop to change status</div>
        )}
      </div>
    </div>
  );
}
