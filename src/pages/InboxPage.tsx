import { useTasks } from '@/hooks/useTasks';
import { Inbox } from 'lucide-react';

export default function InboxPage() {
  const { tasks } = useTasks();
  const recentTasks = [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="flex items-center px-6 py-3 border-b border-border bg-background">
        <Inbox size={16} className="mr-2 text-muted-foreground" />
        <h1 className="text-sm font-semibold text-foreground">Inbox</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        {recentTasks.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm mt-20">No recent tasks</div>
        ) : (
          <div className="space-y-1 max-w-2xl">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors group">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: task.status === 'done' ? 'hsl(var(--priority-low))' : 'hsl(var(--muted-foreground))' }} />
                <span className="text-sm text-foreground flex-1 truncate">{task.title}</span>
                <span className="text-[11px] text-muted-foreground">{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
