import { useTasks } from '@/hooks/useTasks';
import { ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityStyles: Record<string, string> = {
  urgent: 'bg-priority-urgent/15 text-priority-urgent border-priority-urgent/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
};

export default function MyIssuesPage() {
  const { tasks } = useTasks();
  const activeTasks = tasks.filter(t => t.status !== 'done');

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="flex items-center px-6 py-3 border-b border-border bg-background">
        <ListChecks size={16} className="mr-2 text-muted-foreground" />
        <h1 className="text-sm font-semibold text-foreground">My Issues</h1>
        <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{activeTasks.length}</span>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-1">
          {activeTasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors">
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 font-medium capitalize border shrink-0', priorityStyles[task.priority])}>
                {task.priority}
              </Badge>
              <span className="text-sm text-foreground flex-1 truncate">{task.title}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{task.status.replace('_', ' ')}</Badge>
            </div>
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center text-muted-foreground text-sm mt-20">All caught up! 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
