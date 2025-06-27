import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BarChart3, 
  FileText, 
  Image, 
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings
} from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: analytics, error: analyticsError } = useQuery({
    queryKey: ['/api/admin/analytics'],
    enabled: user?.role === 'admin',
  });

  useEffect(() => {
    if (analyticsError && isUnauthorizedError(analyticsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [analyticsError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
            <p className="text-slate-600 mb-6">You need admin privileges to access this area.</p>
            <Link href="/">
              <Button className="btn-primary">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                АН
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">Content Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">View Site</Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your content and track performance</p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">2,847</div>
                  <div className="text-sm text-slate-600">Page Views</div>
                  <div className="text-xs text-green-600">↑ 12% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">23</div>
                  <div class="text-sm text-slate-600">Consultations</div>
                  <div className="text-xs text-green-600">↑ 8% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">12.4%</div>
                  <div className="text-sm text-slate-600">Conversion</div>
                  <div className="text-xs text-green-600">↑ 2.1% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-premium mb-1">4.2x</div>
                  <div className="text-sm text-slate-600">Avg ROAS</div>
                  <div className="text-xs text-green-600">↑ 0.3x this week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Management Tools */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Pages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Manage landing pages and service pages with drag & drop builder</p>
              <Link href="/admin/pages">
                <Button className="w-full btn-primary">
                  Page Builder
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-secondary" />
                <span>Blog</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Create and manage blog posts, case studies, and methodologies</p>
              <Link href="/admin/blog">
                <Button className="w-full btn-secondary">
                  Blog Editor
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5 text-accent" />
                <span>Media</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Upload and organize images, documents, and other media files</p>
              <Link href="/admin/media">
                <Button className="w-full btn-accent">
                  Media Library
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-slate-600" />
                <span>Forms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Create custom forms for consultations and lead capture</p>
              <Button className="w-full" variant="outline">
                Form Builder
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">New consultation request</div>
                    <div className="text-sm text-slate-600">Unit Economics consultation from TechCorp</div>
                    <div className="text-xs text-slate-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">Blog post published</div>
                    <div className="text-sm text-slate-600">P.R.O.F.I.T methodology guide</div>
                    <div className="text-xs text-slate-500">1 day ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">Landing page updated</div>
                    <div className="text-sm text-slate-600">OZON audit service page</div>
                    <div className="text-xs text-slate-500">2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Traffic Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-slate-100 rounded-lg flex items-end p-4 space-x-2">
                <div className="flex-1 bg-primary rounded-t" style={{height: '60%'}}></div>
                <div className="flex-1 bg-primary/70 rounded-t" style={{height: '40%'}}></div>
                <div className="flex-1 bg-primary rounded-t" style={{height: '80%'}}></div>
                <div className="flex-1 bg-primary/70 rounded-t" style={{height: '45%'}}></div>
                <div className="flex-1 bg-primary rounded-t" style={{height: '90%'}}></div>
                <div className="flex-1 bg-primary/70 rounded-t" style={{height: '55%'}}></div>
                <div className="flex-1 bg-primary rounded-t" style={{height: '100%'}}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
