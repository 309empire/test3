import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import Dashboard from "./pages/dashboard";
import PublicProfile from "./pages/public-profile";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-orange-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <AuthPage />}
      </Route>
      <Route path="/dashboard">
        {!user ? <Redirect to="/" /> : <Dashboard />}
      </Route>
      <Route path="/profile">
        {!user ? <Redirect to="/" /> : <Dashboard activeTab="profile" />}
      </Route>
      <Route path="/options">
        {!user ? <Redirect to="/" /> : <Dashboard activeTab="options" />}
      </Route>
      <Route path="/miscellaneous">
        {!user ? <Redirect to="/" /> : <Dashboard activeTab="miscellaneous" />}
      </Route>
      <Route path="/extras">
        {!user ? <Redirect to="/" /> : <Dashboard activeTab="extras" />}
      </Route>
      <Route path="/:username" component={PublicProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
