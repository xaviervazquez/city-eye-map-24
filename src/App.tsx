import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WarehouseDetail from "./pages/WarehouseDetail";
import DataExplorer from "./components/DataExplorer";
import DataMapper from "./components/DataMapper";
import PublicDataResearch from "./components/PublicDataResearch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/warehouse/:id" element={<WarehouseDetail />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/data-mapper" element={<DataMapper />} />
          <Route path="/public-data-research" element={<PublicDataResearch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
