import { MessageSquareLock, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                АН
              </div>
              <div>
                <h3 className="font-semibold">Александр Новиков</h3>
                <p className="text-sm text-slate-400">Маркетолог & Консультант</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Эксперт по unit-экономике маркетплейсов и оптимизации бизнес-процессов.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Unit Economics консультации</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">OZON аудит</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Стратегия роста</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">P.R.O.F.I.T методология</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Контент</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Блог</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Кейсы</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Методологии</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Инструменты</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MessageSquareLock className="h-4 w-4 text-primary" />
                <span className="text-slate-400">@alexnovikov_marketing</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-slate-400">alex@marketing-pro.ru</span>
              </div>
              <div className="flex items-center space-x-3">
                <Linkedin className="h-4 w-4 text-primary" />
                <span className="text-slate-400">linkedin.com/in/alexnovikov</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © 2024 Александр Новиков. Все права защищены.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
