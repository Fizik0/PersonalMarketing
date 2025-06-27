import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Tag,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogIndex() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const postsPerPage = 9;

  const { data: postsData, isLoading } = useQuery<{ posts: Post[]; total: number }>({
    queryKey: ['/api/posts/published', { 
      page: currentPage, 
      limit: postsPerPage,
      category: selectedCategory,
    }],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const totalPages = postsData ? Math.ceil(postsData.total / postsPerPage) : 0;

  const filteredPosts = postsData?.posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? "" : categorySlug);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Блог и кейсы
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Практические инсайты по unit-экономике, OZON оптимизации и маркетинговым стратегиям
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск статей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("")}
              >
                Все
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  onClick={() => handleCategoryFilter(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              {searchTerm ? "Статьи не найдены" : "Пока нет статей"}
            </h3>
            <p className="text-slate-500">
              {searchTerm 
                ? "Попробуйте изменить поисковый запрос" 
                : "Скоро здесь появятся интересные материалы"
              }
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="card-hover h-full">
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {post.category && (
                        <Badge variant="outline" className="text-xs">
                          {post.category.name}
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readingTime} мин
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </div>
                      <span className="text-primary font-medium">Читать →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
