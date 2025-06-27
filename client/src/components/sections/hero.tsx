import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator, BarChart3, Target } from "lucide-react";
import AnalyticsDashboard from "@/components/ui/analytics-dashboard";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary to-blue-800 text-white overflow-hidden hero-pattern">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
                Превращаю данные в
                <span className="text-accent"> прибыль</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Эксперт по unit-экономике маркетплейсов и оптимизации бизнес-процессов. 
                Помогаю компаниям увеличить прибыльность на 15-40% через data-driven подход.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 font-semibold"
                onClick={() => scrollToSection('contact')}
              >
                Бесплатная консультация
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 font-semibold"
                onClick={() => scrollToSection('blog')}
              >
                Мои кейсы
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">150+</div>
                <div className="text-sm text-blue-200">Успешных проектов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">€2M+</div>
                <div className="text-sm text-blue-200">Увеличение прибыли</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">95%</div>
                <div className="text-sm text-blue-200">Довольных клиентов</div>
              </div>
            </div>
          </div>
          
          <div className="lg:pl-12">
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
