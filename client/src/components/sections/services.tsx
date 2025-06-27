import { Button } from "@/components/ui/button";
import { Calculator, Search, Rocket, CheckCircle } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Calculator,
      title: "Консультации по Unit-экономике",
      description: "Детальный анализ и оптимизация юнит-экономики каждого SKU. Увеличение прибыльности на 15-40% через P.R.O.F.I.T методологию.",
      features: [
        "Расчет истинной себестоимости",
        "Оптимизация ценообразования", 
        "Калькулятор прибыльности"
      ],
      price: "от €299",
      priceNote: "за консультацию",
      gradient: "from-primary to-blue-700",
      buttonText: "Заказать",
      href: "/services/unit-economics"
    },
    {
      icon: Search,
      title: "Аудит маркетплейса OZON",
      description: "Комплексный аудит вашего присутствия на OZON с детальными рекомендациями по оптимизации и увеличению продаж.",
      features: [
        "Анализ ранжирования",
        "Оптимизация карточек",
        "Стратегия рекламы"
      ],
      price: "от €499",
      priceNote: "за аудит",
      gradient: "from-secondary to-green-700",
      buttonText: "Заказать",
      href: "/services/ozon-audit"
    },
    {
      icon: Rocket,
      title: "Полная стратегия роста",
      description: "Комплексная стратегия развития бизнеса: от анализа до внедрения с персональным сопровождением на 3 месяца.",
      features: [
        "Полный аудит + стратегия",
        "Персональное сопровождение",
        "Еженедельные отчеты"
      ],
      price: "от €1499",
      priceNote: "за 3 месяца",
      gradient: "from-premium to-purple-700",
      buttonText: "Заказать",
      href: "#contact"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.location.href = sectionId;
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Услуги и консультации
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Комплексные решения для оптимизации вашего бизнеса на маркетплейсах
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div 
                key={index}
                className={`bg-gradient-to-br ${service.gradient} rounded-2xl p-8 text-white group hover:scale-105 transition-transform duration-300`}
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">
                  {service.title}
                </h3>
                
                <p className="text-white/90 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{service.price}</div>
                    <div className="text-sm text-white/70">{service.priceNote}</div>
                  </div>
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 font-semibold"
                    onClick={() => scrollToSection(service.href)}
                  >
                    {service.buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="mt-16 text-center">
          <div className="bg-slate-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Нужно что-то еще?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Также предлагаю индивидуальные консультации по Wildberries, Яндекс.Маркету, 
              настройке аналитики и автоматизации процессов
            </p>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => scrollToSection('#contact')}
            >
              Обсудить индивидуальный проект
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
