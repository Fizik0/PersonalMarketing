import { BarChart3, Calculator, Cog, Brain } from "lucide-react";

export default function ExpertiseSection() {
  const expertiseAreas = [
    {
      icon: BarChart3,
      title: "OZON Эксперт",
      description: "Полный цикл работы с маркетплейсом: от запуска до масштабирования",
      color: "primary",
    },
    {
      icon: Calculator,
      title: "Unit Economics",
      description: "Детальный анализ и оптимизация юнит-экономики каждого SKU",
      color: "secondary",
    },
    {
      icon: Cog,
      title: "P.R.O.F.I.T",
      description: "Авторская методология для survival и growth стратегий",
      color: "accent",
    },
    {
      icon: Brain,
      title: "Data-Driven",
      description: "Превращение данных в инсайты и конкретные действия",
      color: "premium",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Экспертиза в цифрах
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Специализируюсь на оптимизации unit-экономики маркетплейсов и увеличении прибыльности 
            через data-driven подход и P.R.O.F.I.T методологию
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {expertiseAreas.map((area, index) => {
            const Icon = area.icon;
            const colorClasses = {
              primary: "group-hover:bg-primary group-hover:text-white bg-primary text-white group-hover:bg-white group-hover:text-primary",
              secondary: "group-hover:bg-secondary group-hover:text-white bg-secondary text-white group-hover:bg-white group-hover:text-secondary",
              accent: "group-hover:bg-accent group-hover:text-white bg-accent text-white group-hover:bg-white group-hover:text-accent",
              premium: "group-hover:bg-premium group-hover:text-white bg-premium text-white group-hover:bg-white group-hover:text-premium",
            };
            
            const hoverClasses = {
              primary: "hover:bg-primary hover:text-white",
              secondary: "hover:bg-secondary hover:text-white",
              accent: "hover:bg-accent hover:text-white",
              premium: "hover:bg-premium hover:text-white",
            };
            
            return (
              <div 
                key={index}
                className={`bg-slate-50 rounded-xl p-6 text-center group transition-all duration-300 ${hoverClasses[area.color as keyof typeof hoverClasses]}`}
              >
                <div className={`w-16 h-16 ${colorClasses[area.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
                <p className="text-sm text-slate-600 group-hover:text-blue-100">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
