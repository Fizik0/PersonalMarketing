import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FileText,
  Calendar,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import RichTextEditor from "@/components/cms/rich-text-editor";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogEditor() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: "",
    slug: "",
    excerpt: "",
  });
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/admin/posts'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('POST', '/api/admin/posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      setIsNewPostDialogOpen(false);
      setNewPostData({ title: "", slug: "", excerpt: "" });
      toast({
        title: "Success",
        description: "Post created successfully",
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

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
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

  const handleCreatePost = () => {
    if (!newPostData.title || !newPostData.slug) {
      toast({
        title: "Error",
        description: "Title and slug are required",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      ...newPostData,
      content: "Start writing your post here...",
      readingTime: 1,
    });
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(id);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isEditorOpen && selectedPost) {
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
                  Back to Posts
                </Button>
                <div>
                  <h1 className="font-semibold text-slate-900">Editing: {selectedPost.title}</h1>
                  <p className="text-sm text-slate-600">/blog/{selectedPost.slug}</p>
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RichTextEditor post={selectedPost} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-semibold text-slate-900">Blog Editor</h1>
                <p className="text-sm text-slate-600">Manage your blog content</p>
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
                onClick={() => setIsNewPostDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
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
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <span>Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories?.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                  <Button size="sm" variant="outline" className="h-6">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {posts?.map((post) => (
                <Card key={post.id} className="card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={post.isPublished ? "default" : "secondary"}>
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                          {post.category && (
                            <Badge variant="outline" className="text-xs">
                              {post.category.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">/blog/{post.slug}</p>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Create New Post Card */}
              <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Plus className="h-8 w-8 text-slate-400 mb-4" />
                  <h3 className="font-semibold text-slate-700 mb-2">Create New Post</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Share your expertise and insights
                  </p>
                  <Button 
                    className="btn-primary"
                    onClick={() => setIsNewPostDialogOpen(true)}
                  >
                    Start Writing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* New Post Dialog */}
      <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Post Title
              </label>
              <Input
                value={newPostData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setNewPostData({
                    ...newPostData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                placeholder="Enter post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL Slug
              </label>
              <Input
                value={newPostData.slug}
                onChange={(e) => setNewPostData({
                  ...newPostData,
                  slug: e.target.value,
                })}
                placeholder="url-slug"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Excerpt
              </label>
              <Input
                value={newPostData.excerpt}
                onChange={(e) => setNewPostData({
                  ...newPostData,
                  excerpt: e.target.value,
                })}
                placeholder="Brief description of the post"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsNewPostDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="btn-primary"
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
