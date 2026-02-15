import { AppSidebar } from '@/components/AppSidebar';
import { AiChatPanel } from '@/components/AiChatPanel';

interface AppLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      {children}
      <AiChatPanel />
    </div>
  );
}
