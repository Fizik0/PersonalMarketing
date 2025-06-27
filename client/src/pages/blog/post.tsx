import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  publishedAt: string;
  readingTime: number;
  metaTitle?: string;
  metaDescription?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: [`/api/posts/slug/${slug}`],
    enabled: !!slug,
  });

  const shareUrl = `${window.location.origin}/blog/${slug}`;

  const handleShare = (platform: string) => {
    const title = post?.title || "";
    const url = shareUrl;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({
        title: "Скопировано",
        description: "Ссылка скопирована в буфер обмена",
      });
      return;
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-4"></div>
            <div className="h-64 bg-slate-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Статья не найдена</h1>
          <p className="text-slate-600 mb-8">Возможно, статья была удалена или перемещена</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к блогу
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к блогу
            </Button>
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <Badge variant="outline">
                  {post.category.name}
                </Badge>
              )}
              <div className="flex items-center text-sm text-slate-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Clock className="h-4 w-4 mr-1" />
                {post.readingTime} мин чтения
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Share Buttons */}
            <div className="flex items-center space-x-2 mb-8 pb-8 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-700 mr-2">Поделиться:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('copy')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div 
              className="prose prose-slate max-w-none prose-lg
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:text-slate-600 prose-ol:text-slate-600
                prose-li:mb-2 prose-li:leading-relaxed
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary
                prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:text-slate-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Author Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              АН
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Александр Новиков
              </h3>
              <p className="text-slate-600 mb-4">
                Эксперт по unit-экономике маркетплейсов с 8+ летним опытом. 
                Специализируюсь на оптимизации бизнес-процессов и увеличении прибыльности компаний 
                через data-driven подход.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline">
                  Все статьи автора
                </Button>
                <Button size="sm" className="btn-primary">
                  Консультация
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 mt-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Нужна помощь с оптимизацией?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Получите персональную консультацию по unit-экономике и увеличьте прибыльность 
            вашего бизнеса на маркетплейсах
          </p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Записаться на консультацию
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
