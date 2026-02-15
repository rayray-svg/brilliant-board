import { Task } from '@/lib/types';
import { Calendar, GripVertical, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityStyles: Record<string, string> = {
  urgent: 'bg-priority-urgent/15 text-priority-urgent border-priority-urgent/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onClick }: TaskCardProps) {
  return (
    <div
      draggable
      onClick={() => onClick(task)}
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.currentTarget.classList.add('opacity-40', 'scale-95');
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('opacity-40', 'scale-95');
      }}
      className={cn(
        'group bg-card rounded-lg p-3.5 cursor-pointer active:cursor-grabbing',
        'border border-border/60 transition-all duration-200',
        'hover:shadow-[var(--card-shadow-hover)] shadow-[var(--card-shadow)]',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-card-foreground leading-snug">{task.title}</h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={13} />
          </button>
          <GripVertical size={14} className="text-muted-foreground/50" />
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-1.5 mt-2">
        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 font-medium capitalize border', priorityStyles[task.priority])}>
          {task.priority}
        </Badge>

        {task.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal bg-secondary text-secondary-foreground">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {task.assignee && (
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold uppercase">
            {task.assignee.slice(0, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
