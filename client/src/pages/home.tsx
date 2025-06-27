import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  BarChart3, 
  FileText, 
  Image, 
  Settings, 
  Users,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                АН
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">Александр Новиков</h1>
                <p className="text-sm text-slate-600">Панель управления</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Добро пожаловать, {user?.firstName || user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Панель управления</h1>
          <p className="text-slate-600">Управляйте контентом и анализируйте результаты</p>
        </div>

        {user?.role === 'admin' ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Быстрая статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">150+</div>
                    <div className="text-sm text-slate-600">Проекты</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">€2M+</div>
                    <div className="text-sm text-slate-600">Прибыль клиентов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">95%</div>
                    <div className="text-sm text-slate-600">Довольных клиентов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-premium">4.2x</div>
                    <div className="text-sm text-slate-600">Средний ROAS</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Management */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Страницы</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Управление страницами сайта с помощью drag & drop конструктора</p>
                <Link href="/admin/pages">
                  <Button className="w-full btn-primary">
                    Управление страницами
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <span>Блог</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Создание и редактирование статей, кейсов и методологий</p>
                <Link href="/admin/blog">
                  <Button className="w-full btn-secondary">
                    Редактор блога
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="h-5 w-5 text-accent" />
                  <span>Медиа</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Библиотека изображений, документов и других медиафайлов</p>
                <Link href="/admin/media">
                  <Button className="w-full btn-accent">
                    Медиа-библиотека
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Аналитика</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Просмотры страниц за неделю</span>
                    <span className="font-semibold text-primary">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Заявки на консультации</span>
                    <span className="font-semibold text-secondary">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Конверсия лендингов</span>
                    <span className="font-semibold text-accent">12.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Активные A/B тесты</span>
                    <span className="font-semibold text-premium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Недавняя активность</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Новая заявка</div>
                      <div className="text-slate-600">Unit Economics консультация</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Статья опубликована</div>
                      <div className="text-slate-600">P.R.O.F.I.T методология</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Лендинг обновлен</div>
                      <div className="text-slate-600">OZON аудит</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Добро пожаловать!
            </h2>
            <p className="text-slate-600 mb-8">
              Для доступа к административной панели требуются права администратора.
            </p>
            <Link href="/">
              <Button className="btn-primary">
                Вернуться на главную
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
