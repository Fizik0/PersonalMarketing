import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Save,
  ArrowLeft,
  Layout,
  Type,
  Image,
  MousePointer,
  BarChart3,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import PageBuilder from "@/components/cms/page-builder";

interface Page {
  id: string;
  title: string;
  slug: string;
  template: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PageBuilderAdmin() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [newPageData, setNewPageData] = useState({
    title: "",
    slug: "",
    template: "landing",
  });
  const { toast } = useToast();

  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ['/api/admin/pages'],
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('POST', '/api/admin/pages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setIsNewPageDialogOpen(false);
      setNewPageData({ title: "", slug: "", template: "landing" });
      toast({
        title: "Success",
        description: "Page created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePage = () => {
    if (!newPageData.title || !newPageData.slug) {
      toast({
        title: "Error",
        description: "Title and slug are required",
        variant: "destructive",
      });
      return;
    }

    createPageMutation.mutate({
      ...newPageData,
      content: {
        sections: [],
        metadata: {
          seo: {
            title: newPageData.title,
            description: "",
          },
        },
      },
    });
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setIsEditorOpen(true);
  };

  const handleDeletePage = (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deletePageMutation.mutate(id);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (isEditorOpen && selectedPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditorOpen(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Pages
                </Button>
                <div>
                  <h1 className="font-semibold text-slate-900">Editing: {selectedPage.title}</h1>
                  <p className="text-sm text-slate-600">/{selectedPage.slug}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </header>

        <PageBuilder page={selectedPage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Layout className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-semibold text-slate-900">Page Builder</h1>
                <p className="text-sm text-slate-600">Manage your website pages</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="btn-primary"
                onClick={() => setIsNewPageDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {pages?.map((page) => (
              <Card key={page.id} className="card-hover">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold mb-2">
                        {page.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={page.isPublished ? "default" : "secondary"}>
                          {page.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {page.template}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">/{page.slug}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Updated: {new Date(page.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPage(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePage(page.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Templates */}
            <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Plus className="h-8 w-8 text-slate-400 mb-4" />
                <h3 className="font-semibold text-slate-700 mb-2">Create New Page</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Start with a template or build from scratch
                </p>
                <Button 
                  className="btn-primary"
                  onClick={() => setIsNewPageDialogOpen(true)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* New Page Dialog */}
      <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Page Title
              </label>
              <Input
                value={newPageData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setNewPageData({
                    ...newPageData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                placeholder="Enter page title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL Slug
              </label>
              <Input
                value={newPageData.slug}
                onChange={(e) => setNewPageData({
                  ...newPageData,
                  slug: e.target.value,
                })}
                placeholder="url-slug"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Template
              </label>
              <Select
                value={newPageData.template}
                onValueChange={(value) => setNewPageData({
                  ...newPageData,
                  template: value,
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="service">Service Page</SelectItem>
                  <SelectItem value="portfolio">Portfolio Page</SelectItem>
                  <SelectItem value="about">About Page</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsNewPageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="btn-primary"
                onClick={handleCreatePage}
                disabled={createPageMutation.isPending}
              >
                {createPageMutation.isPending ? "Creating..." : "Create Page"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
