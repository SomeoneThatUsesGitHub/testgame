import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MapExplorer from "./components/MapExplorer";
import { CountrySelectionProvider } from "./hooks/use-country-selection";
import SimpleFixedCountryPanel from "./components/SimpleFixedCountryPanel";
import AdminFixedCountryPanel from "./components/AdminFixedCountryPanel";
import AdminPanel from "./components/admin/AdminPanel";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MapExplorer} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // State to control admin mode - would normally be auth-based
  const [isAdminMode, setIsAdminMode] = useState(true); // For demo, default to admin mode
  
  return (
    <QueryClientProvider client={queryClient}>
      <CountrySelectionProvider>
        <Router />
        {/* Render either admin panel or regular panel based on mode */}
        {isAdminMode ? (
          <AdminFixedCountryPanel />
        ) : (
          <SimpleFixedCountryPanel />
        )}
        <Toaster />
      </CountrySelectionProvider>
    </QueryClientProvider>
  );
}

export default App;
