import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  Search,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  Star,
  Award
} from "lucide-react";

export default function OzonAuditService() {
  const auditAreas = [
    {
      icon: Search,
      title: "Анализ ранжирования",
      description: "Детальный анализ позиций в поиске и факторов влияющих на видимость",
      items: ["Позиции по ключевым запросам", "Анализ конкурентов", "SEO карточек товаров"]
    },
    {
      icon: TrendingUp,
      title: "Оптимизация карточек",
      description: "Полная оптимизация контента для максимальной конверсии",
      items: ["Rich-контент", "Фото и видео", "Описания и характеристики"]
    },
    {
      icon: BarChart3,
      title: "Рекламные кампании",
      description: "Аудит и оптимизация рекламы для увеличения ROAS",
      items: ["Структура кампаний", "Ставки и бюджеты", "Минус-слова"]
    },
    {
      icon: Target,
      title: "Unit-экономика",
      description: "Расчет реальной прибыльности с учетом всех комиссий OZON",
      items: ["Истинная себестоимость", "Скрытые комиссии", "Маржинальность"]
    }
  ];

  const problems = [
    "Низкие позиции в поиске OZON",
    "Падение конверсии карточек товаров", 
    "Высокие расходы на рекламу при низком ROAS",
    "Скрытые комиссии съедают прибыль",
    "Штрафы и блокировки от алгоритмов",
    "Неэффективная структура рекламных кампаний"
  ];

  const results = [
    {
      metric: "Увеличение органических продаж",
      value: "+156%",
      description: "В среднем за 3 месяца после оптимизации"
    },
    {
      metric: "Рост ROAS рекламы",
      value: "+89%", 
      description: "Оптимизация кампаний и структуры ставок"
    },
    {
      metric: "Повышение конверсии",
      value: "+43%",
      description: "За счет улучшения карточек товаров"
    },
    {
      metric: "Снижение ACoS",
      value: "-34%",
      description: "Более эффективное распределение бюджета"
    }
  ];

  const testimonials = [
    {
      company: "Electronics Plus",
      industry: "Электроника",
      text: "За 2 месяца после аудита увеличили продажи на 180%. Александр выявил критические ошибки в настройке рекламы, которые съедали весь бюджет.",
      result: "+180% продаж"
    },
    {
      company: "Beauty Store",
      industry: "Косметика", 
      text: "Отличный специалист! Помог оптимизировать 200+ карточек товаров. Конверсия выросла в 2 раза, а органический трафик увеличился на 150%.",
      result: "+150% трафика"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Аудит маркетплейса
                  <span className="text-accent"> OZON</span>
                </h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Комплексный аудит вашего присутствия на OZON с детальными рекомендациями 
                  по оптимизации и увеличению продаж на 50-200%.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold"
                >
                  Заказать аудит
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-3 font-semibold"
                >
                  Примеры работ
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">€499</div>
                  <div className="text-sm text-green-200">Стартовая цена</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">5-7</div>
                  <div className="text-sm text-green-200">Дней на аудит</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">50+</div>
                  <div className="text-sm text-green-200">Точек оптимизации</div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-white">
                  <h3 className="font-semibold">OZON Performance Dashboard</h3>
                  <Search className="h-6 w-6 text-accent" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-200">Позиции в ТОП-10</span>
                      <span className="text-accent font-bold">34%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '34%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-200">Конверсия карточек</span>
                      <span className="text-accent font-bold">2.8%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '56%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-200">ROAS рекламы</span>
                      <span className="text-accent font-bold">3.4x</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: '68%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Решаем главные проблемы на OZON
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Типичные ошибки, которые мешают продавать эффективно
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-700 leading-relaxed">{problem}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Что включает аудит
              </h3>
              <div className="space-y-4">
                {auditAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div key={index} className="border-l-4 border-secondary pl-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-5 w-5 text-secondary" />
                        <h4 className="font-semibold text-slate-900">{area.title}</h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{area.description}</p>
                      <ul className="text-xs text-slate-500 space-y-1">
                        {area.items.map((item, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-secondary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Результаты клиентов
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Средние показатели роста после внедрения рекомендаций
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {results.map((result, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-8">
                  <div className="text-4xl font-bold text-secondary mb-2">
                    {result.value}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    {result.metric}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {result.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Как проходит аудит
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Пошаговый процесс анализа и оптимизации
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Сбор данных", desc: "Анализ текущих показателей аккаунта" },
              { step: "02", title: "Аудит карточек", desc: "Проверка контента и SEO оптимизации" },
              { step: "03", title: "Анализ рекламы", desc: "Оценка эффективности кампаний" },
              { step: "04", title: "Конкуренты", desc: "Сравнительный анализ с лидерами" },
              { step: "05", title: "Отчет", desc: "Детальные рекомендации по улучшению" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Что говорят о качестве наших аудитов
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {testimonial.company}
                      </CardTitle>
                      <p className="text-sm text-slate-600">{testimonial.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-secondary">
                        {testimonial.result}
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Тарифы аудита
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Выберите подходящий объем анализа
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold mb-2">Экспресс</CardTitle>
                <div className="text-3xl font-bold text-secondary">€499</div>
                <p className="text-slate-600">Базовый анализ</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Аудит топ-20 товаров</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Анализ рекламных кампаний</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Базовые рекомендации</span>
                </div>
                <Button className="w-full mt-6">Заказать</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary bg-secondary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold mb-2">Полный</CardTitle>
                <div className="text-3xl font-bold text-secondary">€999</div>
                <p className="text-slate-600">Рекомендуемый</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Полный аудит всех товаров</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Детальный анализ конкурентов</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">План оптимизации на 3 месяца</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Видео-разбор результатов</span>
                </div>
                <Button className="w-full mt-6 btn-secondary">Заказать</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold mb-2">Премиум</CardTitle>
                <div className="text-3xl font-bold text-secondary">€1499</div>
                <p className="text-slate-600">С сопровождением</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Полный аудит + внедрение</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Сопровождение 1 месяц</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Еженедельные созвоны</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Гарантия результата</span>
                </div>
                <Button className="w-full mt-6">Заказать</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Готовы увеличить продажи на OZON?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Получите профессиональный аудит и увеличьте продажи на 50-200% за 3 месяца
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold"
            >
              Заказать аудит сейчас
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-3 font-semibold"
            >
              Бесплатная консультация
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
