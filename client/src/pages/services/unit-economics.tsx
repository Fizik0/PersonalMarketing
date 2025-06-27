import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Calculator from "@/components/ui/calculator";
import { 
  Calculator as CalculatorIcon,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  ArrowRight
} from "lucide-react";

export default function UnitEconomicsService() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const benefits = [
    "Расчет истинной себестоимости каждого SKU",
    "Оптимизация ценообразования для максимальной прибыли",
    "Выявление убыточных товаров и категорий",
    "Прогнозирование прибыльности новых продуктов",
    "Стратегия увеличения маржинальности на 15-40%",
    "Персональный калькулятор для вашего бизнеса"
  ];

  const process = [
    {
      step: "01",
      title: "Анализ текущего состояния",
      description: "Детальный аудит вашей unit-экономики и выявление проблемных зон"
    },
    {
      step: "02", 
      title: "Расчет истинных метрик",
      description: "Калькуляция реальной себестоимости с учетом всех скрытых издержек"
    },
    {
      step: "03",
      title: "Стратегия оптимизации",
      description: "Разработка плана по увеличению прибыльности и снижению затрат"
    },
    {
      step: "04",
      title: "Внедрение и контроль",
      description: "Поэтапное внедрение изменений с отслеживанием результатов"
    }
  ];

  const caseStudies = [
    {
      company: "TechCorp",
      industry: "Электроника",
      result: "+28% к прибыли",
      description: "Оптимизация pricing стратегии для 150+ SKU"
    },
    {
      company: "FashionBrand",
      industry: "Одежда",
      result: "+35% к марже",
      description: "Выявление и исключение убыточных позиций"
    },
    {
      company: "HomeGoods",
      industry: "Товары для дома",
      result: "+42% к ROAS",
      description: "Реструктуризация продуктового портфеля"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Консультации по
                  <span className="text-accent"> Unit-экономике</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Детальный анализ и оптимизация юнит-экономики каждого SKU. 
                  Увеличение прибыльности на 15-40% через P.R.O.F.I.T методологию.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold"
                  onClick={() => setIsCalculatorOpen(true)}
                >
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  Рассчитать прибыль
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 font-semibold"
                >
                  Заказать консультацию
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">€299</div>
                  <div className="text-sm text-blue-200">Стартовая цена</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">24ч</div>
                  <div className="text-sm text-blue-200">Готовность отчета</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">100%</div>
                  <div className="text-sm text-blue-200">Гарантия качества</div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-white">
                  <h3 className="font-semibold">Unit Economics Calculator</h3>
                  <CalculatorIcon className="h-6 w-6 text-accent" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-sm text-blue-200">Прибыль/SKU</div>
                    <div className="text-2xl font-bold text-accent">€45</div>
                    <div className="text-xs text-green-300">↑ 23%</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-sm text-blue-200">Маржа</div>
                    <div className="text-2xl font-bold text-accent">28%</div>
                    <div className="text-xs text-green-300">↑ 12%</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-sm text-blue-200">ROAS</div>
                    <div className="text-2xl font-bold text-accent">4.2x</div>
                    <div className="text-xs text-green-300">↑ 31%</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-sm text-blue-200">ROI</div>
                    <div className="text-2xl font-bold text-accent">156%</div>
                    <div className="text-xs text-green-300">↑ 18%</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setIsCalculatorOpen(true)}
                >
                  Открыть калькулятор
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Что вы получите
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Комплексный анализ и практические рекомендации для увеличения прибыльности
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <span className="text-slate-700 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                P.R.O.F.I.T Методология
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    P
                  </div>
                  <span className="font-medium">Profitability Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    R
                  </div>
                  <span className="font-medium">Resource Optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    O
                  </div>
                  <span className="font-medium">Operations Excellence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-premium rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    F
                  </div>
                  <span className="font-medium">Financial Intelligence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    I
                  </div>
                  <span className="font-medium">Intelligence Automation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                  <span className="font-medium">Transformation Strategy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Процесс работы
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Структурированный подход к оптимизации unit-экономики
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Результаты клиентов
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Реальные кейсы оптимизации unit-экономики
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((case_study, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold mb-1">
                        {case_study.company}
                      </CardTitle>
                      <p className="text-sm text-slate-600">{case_study.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">
                        {case_study.result}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{case_study.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Тарифы и услуги
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Выберите подходящий формат консультации
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold mb-2">Экспресс-анализ</CardTitle>
                <div className="text-3xl font-bold text-primary">€299</div>
                <p className="text-slate-600">Базовый аудит</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Анализ топ-10 SKU</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Базовый расчет unit-экономики</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Краткий отчет с рекомендациями</span>
                </div>
                <Button className="w-full mt-6">Заказать</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold mb-2">Полный аудит</CardTitle>
                <div className="text-3xl font-bold text-primary">€699</div>
                <p className="text-slate-600">Рекомендуемый</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Анализ всего ассортимента</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">P.R.O.F.I.T методология</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Детальный план оптимизации</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Персональный калькулятор</span>
                </div>
                <Button className="w-full mt-6 btn-primary">Заказать</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold mb-2">Сопровождение</CardTitle>
                <div className="text-3xl font-bold text-primary">€1299</div>
                <p className="text-slate-600">3 месяца</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Полный аудит + внедрение</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Еженедельные консультации</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Контроль результатов</span>
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
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Готовы увеличить прибыльность?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Начните с бесплатного калькулятора или запишитесь на персональную консультацию
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold"
              onClick={() => setIsCalculatorOpen(true)}
            >
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Попробовать калькулятор
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 font-semibold"
            >
              Записаться на консультацию
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Calculator Modal */}
      <Calculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
}
