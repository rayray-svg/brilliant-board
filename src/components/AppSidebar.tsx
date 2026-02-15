import { LayoutDashboard, Inbox, ListChecks, Calendar, Layers, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Inbox, label: 'Inbox', path: '/inbox' },
  { icon: ListChecks, label: 'My Issues', path: '/issues' },
  { icon: LayoutDashboard, label: 'Board', path: '/' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Layers, label: 'Backlog', path: '/backlog' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-[220px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Layers size={14} className="text-sidebar-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">TaskFlow</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-sidebar-accent text-sidebar-foreground text-xs">
          <span className="text-muted-foreground">Search...</span>
          <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded text-muted-foreground font-mono">/</kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
              )}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <button className="flex items-center gap-2 text-xs text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
          <Settings size={14} />
          Settings
        </button>
      </div>
    </aside>
  );
}
