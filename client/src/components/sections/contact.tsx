import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  MessageSquareLock,
  Mail,
  Linkedin,
  Calculator as CalculatorIcon
} from "lucide-react";
import Calculator from "@/components/ui/calculator";

const consultationSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  company: z.string().optional(),
  service: z.string().min(1, "Выберите услугу"),
  message: z.string().optional(),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

export default function ContactSection() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [revenue, setRevenue] = useState("50000");
  const [margin, setMargin] = useState("15");
  const { toast } = useToast();

  const form = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationForm) => {
      await apiRequest('POST', '/api/consultations', data);
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена",
        description: "Свяжусь с вами в течение 24 часов",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationForm) => {
    consultationMutation.mutate(data);
  };

  const calculateImprovement = () => {
    const revenueNum = parseFloat(revenue) || 50000;
    const marginNum = parseFloat(margin) || 15;
    const improvement = revenueNum * (marginNum / 100) * 0.25; // 25% improvement
    return Math.round(improvement).toLocaleString();
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Свяжитесь со мной
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Готов обсудить ваш проект и помочь увеличить прибыльность вашего бизнеса
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Бесплатная консультация
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя</FormLabel>
                          <FormControl>
                            <Input placeholder="Ваше имя" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Компания</FormLabel>
                        <FormControl>
                          <Input placeholder="Название компании" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Услуга</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите услугу" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unit-economics">Unit Economics консультация</SelectItem>
                            <SelectItem value="ozon-audit">OZON аудит</SelectItem>
                            <SelectItem value="full-strategy">Полная стратегия роста</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Сообщение</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Расскажите о вашем проекте..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={consultationMutation.isPending}
                  >
                    {consultationMutation.isPending ? "Отправка..." : "Отправить заявку"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Contact Info & Calculator */}
          <div className="space-y-8">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquareLock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">MessageSquareLock</div>
                    <div className="text-slate-600">@alexnovikov_marketing</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Email</div>
                    <div className="text-slate-600">alex@marketing-pro.ru</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Linkedin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">LinkedIn</div>
                    <div className="text-slate-600">linkedin.com/in/alexnovikov</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Calculator */}
            <Card className="bg-gradient-to-br from-primary to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Калькулятор прибыльности
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-blue-100 mb-2">
                    Месячный оборот (€)
                  </label>
                  <Input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-blue-200"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-100 mb-2">
                    Текущая маржа (%)
                  </label>
                  <Input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-blue-200"
                    placeholder="15"
                  />
                </div>
                <div className="bg-white/20 rounded-lg p-4 mt-6">
                  <div className="text-sm text-blue-100 mb-2">
                    Потенциальное увеличение прибыли:
                  </div>
                  <div className="text-3xl font-bold text-accent">
                    +€{calculateImprovement()}
                  </div>
                  <div className="text-sm text-blue-200">
                    в месяц при оптимизации на 25%
                  </div>
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setIsCalculatorOpen(true)}
                >
                  <CalculatorIcon className="h-4 w-4 mr-2" />
                  Открыть полный калькулятор
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      <Calculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </section>
  );
}
