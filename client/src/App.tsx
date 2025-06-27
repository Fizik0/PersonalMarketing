import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AdminDashboard from "@/pages/admin/dashboard";
import PageBuilder from "@/pages/admin/page-builder";
import BlogEditor from "@/pages/admin/blog-editor";
import MediaLibrary from "@/pages/admin/media-library";
import BlogIndex from "@/pages/blog/index";
import BlogPost from "@/pages/blog/post";
import UnitEconomicsService from "@/pages/services/unit-economics";
import OzonAuditService from "@/pages/services/ozon-audit";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/blog" component={BlogIndex} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/services/unit-economics" component={UnitEconomicsService} />
          <Route path="/services/ozon-audit" component={OzonAuditService} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/blog" component={BlogIndex} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/services/unit-economics" component={UnitEconomicsService} />
          <Route path="/services/ozon-audit" component={OzonAuditService} />
          
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/pages" component={PageBuilder} />
              <Route path="/admin/blog" component={BlogEditor} />
              <Route path="/admin/media" component={MediaLibrary} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
