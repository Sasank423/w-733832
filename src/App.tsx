
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import MemeCreationStudio from "./pages/MemeCreationStudio";
import UserDashboard from "./pages/UserDashboard";
import MemePage from "./pages/MemePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<MemeCreationStudio />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/meme/:id" element={<MemePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
