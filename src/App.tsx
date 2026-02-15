import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InboxPage from "./pages/InboxPage";
import MyIssuesPage from "./pages/MyIssuesPage";
import CalendarPage from "./pages/CalendarPage";
import BacklogPage from "./pages/BacklogPage";
import { AppLayout } from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inbox" element={<AppLayout><InboxPage /></AppLayout>} />
          <Route path="/issues" element={<AppLayout><MyIssuesPage /></AppLayout>} />
          <Route path="/calendar" element={<AppLayout><CalendarPage /></AppLayout>} />
          <Route path="/backlog" element={<AppLayout><BacklogPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
