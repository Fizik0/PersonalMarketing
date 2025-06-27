import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Briefcase, 
  Award,
  MessageSquareLock,
  Mail,
  Linkedin
} from "lucide-react";

export default function AboutSection() {
  const skills = [
    { name: "Unit Economics", percentage: 95, color: "primary" },
    { name: "OZON Marketplace", percentage: 92, color: "secondary" },
    { name: "Data Analytics", percentage: 88, color: "accent" },
    { name: "P.R.O.F.I.T Methodology", percentage: 96, color: "premium" },
  ];

  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary", 
    accent: "bg-accent",
    premium: "bg-premium",
  };

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                О себе
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Маркетолог с 8+ летним опытом в области vendor management и unit-экономики. 
                Специализируюсь на оптимизации бизнес-процессов маркетплейсов и увеличении прибыльности компаний.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Образование</h3>
                  <p className="text-slate-600">MBA в области Digital Marketing, сертификации Google Analytics, Facebook Blueprint</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Опыт работы</h3>
                  <p className="text-slate-600">8+ лет в маркетинге, 5+ лет работы с маркетплейсами, 150+ успешных проектов</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Достижения</h3>
                  <p className="text-slate-600">Увеличение прибыли клиентов в среднем на 28%, ROAS улучшение до 4.2x</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button className="btn-primary">
                Скачать резюме
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Skills Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Профессиональные навыки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">{skill.name}</span>
                      <span className="text-slate-900 font-medium">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${colorClasses[skill.color as keyof typeof colorClasses]}`}
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MessageSquareLock className="h-5 w-5 text-primary" />
                  <span className="text-slate-600">@alexnovikov_marketing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-slate-600">alex@marketing-pro.ru</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-primary" />
                  <span className="text-slate-600">linkedin.com/in/alexnovikov</span>
                </div>
              </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="bg-gradient-to-r from-primary to-blue-700 text-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Моя философия</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  "Данные - это новая нефть, но только если вы умеете их правильно очищать, 
                  анализировать и превращать в конкретные действия, которые приносят прибыль."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
