import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: string;
  readingTime: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function BlogPreviewSection() {
  const { data: postsData, isLoading } = useQuery<{ posts: Post[]; total: number }>({
    queryKey: ['/api/posts/published', { page: 1, limit: 3 }],
  });

  // Fallback featured posts if no posts available
  const fallbackPosts = [
    {
      id: "1",
      title: "P.R.O.F.I.T методология: Как увеличить прибыль на 40%",
      slug: "profit-methodology-increase-profit",
      excerpt: "Детальный разбор авторской методологии P.R.O.F.I.T с примерами применения и конкретными результатами клиентов...",
      featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      publishedAt: "2024-12-15",
      readingTime: 5,
      category: { id: "1", name: "Unit Economics", slug: "unit-economics" }
    },
    {
      id: "2", 
      title: "Скрытые алгоритмы OZON: Как увеличить ранжирование",
      slug: "ozon-algorithms-ranking",
      excerpt: "Инсайды от практика о том, как реально работают алгоритмы ранжирования OZON и какие факторы влияют на позиции в поиске...",
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      publishedAt: "2024-12-12",
      readingTime: 8,
      category: { id: "2", name: "OZON", slug: "ozon" }
    },
    {
      id: "3",
      title: "Кейс: Как мы увеличили ROAS с 2.1 до 4.8 за 3 месяца",
      slug: "case-study-roas-improvement",
      excerpt: "Детальный разбор реального проекта с пошаговым описанием процесса оптимизации и конкретными цифрами результатов...",
      featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      publishedAt: "2024-12-10",
      readingTime: 12,
      category: { id: "3", name: "Кейс", slug: "case-study" }
    }
  ];

  const posts = postsData?.posts || fallbackPosts;

  return (
    <section id="blog" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Блог и кейсы
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Практические инсайты и детальные разборы реальных проектов
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="card-hover overflow-hidden h-full group">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.featuredImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {post.category && (
                        <Badge variant="outline" className="text-xs">
                          {post.category.name}
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readingTime} мин чтения
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </div>
                      <span className="text-primary font-medium group-hover:text-primary/80 transition-colors">
                        Читать →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="btn-primary">
              Все статьи
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
