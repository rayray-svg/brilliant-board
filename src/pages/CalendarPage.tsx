import { useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityStyles: Record<string, string> = {
  urgent: 'bg-priority-urgent/15 text-priority-urgent border-priority-urgent/30',
  high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
};

export default function CalendarPage() {
  const { tasks } = useTasks();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach(t => {
      if (t.due_date) {
        const key = t.due_date;
        if (!map[key]) map[key] = [];
        map[key].push(t);
      }
    });
    return map;
  }, [tasks]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="flex items-center px-6 py-3 border-b border-border bg-background">
        <CalendarIcon size={16} className="mr-2 text-muted-foreground" />
        <h1 className="text-sm font-semibold text-foreground">Calendar</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">{monthName}</h2>
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-muted/50 px-2 py-2 text-[11px] font-medium text-muted-foreground text-center">{d}</div>
          ))}
          {days.map((day, i) => {
            const dateKey = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const dayTasks = dateKey ? tasksByDate[dateKey] ?? [] : [];
            const isToday = day === today.getDate();
            return (
              <div key={i} className={cn('bg-card min-h-[100px] p-1.5', !day && 'bg-muted/30')}>
                {day && (
                  <>
                    <span className={cn(
                      'text-xs font-medium inline-flex w-6 h-6 items-center justify-center rounded-full',
                      isToday ? 'bg-chat-accent text-chat-accent-foreground' : 'text-foreground'
                    )}>
                      {day}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayTasks.slice(0, 3).map(t => (
                        <div key={t.id} className="text-[10px] px-1 py-0.5 rounded bg-accent/80 text-foreground truncate">{t.title}</div>
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[10px] text-muted-foreground px-1">+{dayTasks.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
