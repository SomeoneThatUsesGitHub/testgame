import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MapExplorer from "./components/MapExplorer";
import { CountrySelectionProvider } from "./hooks/use-country-selection";
import FixedCountryPanel from "./components/FixedCountryPanel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MapExplorer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CountrySelectionProvider>
        <Router />
        {/* The fixed panel is completely independent of other components and state */}
        <FixedCountryPanel />
        <Toaster />
      </CountrySelectionProvider>
    </QueryClientProvider>
  );
}

export default App;
