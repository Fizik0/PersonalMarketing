import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Eye,
  Calendar,
  Tag,
  FileText
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  categoryId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  readingTime: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface RichTextEditorProps {
  post: Post;
}

export default function RichTextEditor({ post }: RichTextEditorProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage || '',
    categoryId: post.categoryId || '',
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    isPublished: post.isPublished,
    tags: [] as string[],
  });
  
  const [activeTab, setActiveTab] = useState('content');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const { toast } = useToast();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('PUT', `/api/admin/posts/${post.id}`, {
        ...data,
        readingTime: calculateReadingTime(data.content),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      toast({
        title: "Сохранено",
        description: "Статья успешно обновлена",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishPostMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('PUT', `/api/admin/posts/${post.id}`, {
        isPublished: !formData.isPublished,
        publishedAt: !formData.isPublished ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }));
      toast({
        title: formData.isPublished ? "Снято с публикации" : "Опубликовано",
        description: formData.isPublished ? "Статья скрыта от читателей" : "Статья доступна читателям",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    setWordCount(words);
    setReadingTime(calculateReadingTime(formData.content));
  }, [formData.content]);

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = () => {
    updatePostMutation.mutate(formData);
  };

  const handlePublish = () => {
    publishPostMutation.mutate();
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `**${selectedText}**`;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        break;
      case 'heading1':
        replacement = `# ${selectedText}`;
        break;
      case 'heading2':
        replacement = `## ${selectedText}`;
        break;
      case 'heading3':
        replacement = `### ${selectedText}`;
        break;
      case 'link':
        replacement = `[${selectedText}](URL)`;
        break;
      case 'list':
        replacement = `- ${selectedText}`;
        break;
      case 'quote':
        replacement = `> ${selectedText}`;
        break;
      case 'code':
        replacement = `\`${selectedText}\``;
        break;
      default:
        return;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      replacement + 
      formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-500">
              {wordCount} слов • {readingTime} мин чтения
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Предпросмотр
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={updatePostMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updatePostMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={publishPostMutation.isPending}
              className={formData.isPublished ? "bg-red-600 hover:bg-red-700" : "btn-primary"}
            >
              {publishPostMutation.isPending 
                ? "Обновление..." 
                : formData.isPublished 
                  ? "Снять с публикации" 
                  : "Опубликовать"
              }
            </Button>
          </div>
        </div>

        <TabsContent value="content" className="space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title,
                        slug: generateSlug(title),
                      }));
                    }}
                    placeholder="Заголовок статьи"
                    className="text-lg font-semibold"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">URL</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Краткое описание статьи для анонса"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Содержание</span>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('bold')}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('italic')}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('heading1')}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('heading2')}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('heading3')}
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('link')}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('quote')}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('code')}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="content-editor"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Начните писать вашу статью..."
                rows={20}
                className="font-mono text-sm"
              />
              <div className="mt-4 text-xs text-slate-500">
                Поддерживается Markdown форматирование
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки публикации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="featured-image">Главное изображение</Label>
                <Input
                  id="featured-image"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="URL изображения"
                />
              </div>

              <div>
                <Label>Теги</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={formData.tags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.includes(tag.id)
                            ? prev.tags.filter(t => t !== tag.id)
                            : [...prev.tags, tag.id]
                        }));
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                />
                <Label htmlFor="published">Опубликовано</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">SEO заголовок</Label>
                <Input
                  id="meta-title"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO заголовок (оставьте пустым для автоматического)"
                />
                <div className="text-xs text-slate-500 mt-1">
                  {(formData.metaTitle || formData.title).length} / 60 символов
                </div>
              </div>
              
              <div>
                <Label htmlFor="meta-description">SEO описание</Label>
                <Textarea
                  id="meta-description"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO описание (оставьте пустым для автоматического)"
                  rows={3}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {(formData.metaDescription || formData.excerpt).length} / 160 символов
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Предпросмотр в поиске</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-slate-50">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {formData.metaTitle || formData.title}
                </div>
                <div className="text-green-700 text-sm">
                  https://yoursite.com/blog/{formData.slug}
                </div>
                <div className="text-slate-600 text-sm mt-1">
                  {formData.metaDescription || formData.excerpt}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
