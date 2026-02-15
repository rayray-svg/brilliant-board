import { AppSidebar } from '@/components/AppSidebar';
import { KanbanBoard } from '@/components/KanbanBoard';
import { AiChatPanel } from '@/components/AiChatPanel';
import { Filter, Share2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground">Board</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
              <Filter size={13} />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
              <Share2 size={13} />
              Share
            </button>
          </div>
        </header>

        <KanbanBoard />
      </div>
      <AiChatPanel />
    </div>
  );
};

export default Index;
