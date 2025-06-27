import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator as CalculatorIcon, 
  Download, 
  Share2,
  TrendingUp,
  DollarSign,
  Percent,
  Target
} from "lucide-react";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UnitEconomics {
  revenue: number;
  cogs: number; // Cost of Goods Sold
  ozonCommission: number;
  fulfillment: number;
  advertising: number;
  returns: number;
  storage: number;
  payment: number;
  packaging: number;
  other: number;
}

export default function Calculator({ isOpen, onClose }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [currency, setCurrency] = useState('EUR');
  const [category, setCategory] = useState('electronics');
  
  const [basicData, setBasicData] = useState({
    monthlyRevenue: 50000,
    currentMargin: 15,
    averageOrderValue: 75,
    conversionRate: 2.5,
  });

  const [unitEconomics, setUnitEconomics] = useState<UnitEconomics>({
    revenue: 100,
    cogs: 45,
    ozonCommission: 12,
    fulfillment: 8,
    advertising: 15,
    returns: 5,
    storage: 2,
    payment: 2,
    packaging: 3,
    other: 2,
  });

  // Category-specific commission rates for OZON
  const categoryCommissions = {
    electronics: { min: 8, max: 15 },
    clothing: { min: 12, max: 25 },
    books: { min: 5, max: 8 },
    cosmetics: { min: 15, max: 30 },
    home: { min: 10, max: 20 },
    sports: { min: 12, max: 18 },
  };

  const calculateBasicMetrics = () => {
    const { monthlyRevenue, currentMargin, averageOrderValue, conversionRate } = basicData;
    
    const currentProfit = monthlyRevenue * (currentMargin / 100);
    const potentialImprovement = currentProfit * 0.25; // 25% improvement
    const optimizedMargin = currentMargin * 1.25;
    const breakEvenPrice = averageOrderValue / (1 - (currentMargin / 100));
    
    return {
      currentProfit: Math.round(currentProfit),
      potentialImprovement: Math.round(potentialImprovement),
      optimizedMargin: Math.round(optimizedMargin * 10) / 10,
      breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
      annualPotential: Math.round(potentialImprovement * 12),
    };
  };

  const calculateUnitEconomics = () => {
    const totalCosts = 
      unitEconomics.cogs +
      unitEconomics.ozonCommission +
      unitEconomics.fulfillment +
      unitEconomics.advertising +
      unitEconomics.returns +
      unitEconomics.storage +
      unitEconomics.payment +
      unitEconomics.packaging +
      unitEconomics.other;

    const profit = unitEconomics.revenue - totalCosts;
    const margin = (profit / unitEconomics.revenue) * 100;
    const roi = (profit / totalCosts) * 100;
    
    // Optimization suggestions
    const optimizedCosts = {
      ozonCommission: unitEconomics.ozonCommission * 0.9, // 10% reduction through optimization
      advertising: unitEconomics.advertising * 0.8, // 20% reduction through better targeting
      returns: unitEconomics.returns * 0.7, // 30% reduction through better descriptions
      fulfillment: unitEconomics.fulfillment * 0.95, // 5% reduction through efficiency
    };

    const optimizedTotalCosts = 
      unitEconomics.cogs +
      optimizedCosts.ozonCommission +
      optimizedCosts.fulfillment +
      optimizedCosts.advertising +
      optimizedCosts.returns +
      unitEconomics.storage +
      unitEconomics.payment +
      unitEconomics.packaging +
      unitEconomics.other;

    const optimizedProfit = unitEconomics.revenue - optimizedTotalCosts;
    const optimizedMargin = (optimizedProfit / unitEconomics.revenue) * 100;

    return {
      currentProfit: Math.round(profit * 100) / 100,
      currentMargin: Math.round(margin * 10) / 10,
      currentROI: Math.round(roi * 10) / 10,
      optimizedProfit: Math.round(optimizedProfit * 100) / 100,
      optimizedMargin: Math.round(optimizedMargin * 10) / 10,
      improvement: Math.round((optimizedProfit - profit) * 100) / 100,
      improvementPercent: Math.round(((optimizedProfit - profit) / profit) * 100),
    };
  };

  const handleExport = () => {
    const basicMetrics = calculateBasicMetrics();
    const unitMetrics = calculateUnitEconomics();
    
    const reportData = {
      timestamp: new Date().toISOString(),
      currency,
      category,
      basicData,
      unitEconomics,
      calculations: {
        basic: basicMetrics,
        unit: unitMetrics,
      },
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unit-economics-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const basicMetrics = calculateBasicMetrics();
  const unitMetrics = calculateUnitEconomics();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalculatorIcon className="h-6 w-6 text-primary" />
            <span>Калькулятор Unit-экономики</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Settings */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>Валюта:</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="RUB">RUB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label>Категория:</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Электроника</SelectItem>
                  <SelectItem value="clothing">Одежда</SelectItem>
                  <SelectItem value="books">Книги</SelectItem>
                  <SelectItem value="cosmetics">Косметика</SelectItem>
                  <SelectItem value="home">Дом и сад</SelectItem>
                  <SelectItem value="sports">Спорт</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="ml-auto flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Базовый расчет</TabsTrigger>
              <TabsTrigger value="advanced">Детальный анализ</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Исходные данные</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Месячный оборот ({currency})</Label>
                      <Input
                        type="number"
                        value={basicData.monthlyRevenue}
                        onChange={(e) => setBasicData(prev => ({ 
                          ...prev, 
                          monthlyRevenue: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Текущая маржа (%)</Label>
                      <Input
                        type="number"
                        value={basicData.currentMargin}
                        onChange={(e) => setBasicData(prev => ({ 
                          ...prev, 
                          currentMargin: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Средний чек ({currency})</Label>
                      <Input
                        type="number"
                        value={basicData.averageOrderValue}
                        onChange={(e) => setBasicData(prev => ({ 
                          ...prev, 
                          averageOrderValue: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Конверсия (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={basicData.conversionRate}
                        onChange={(e) => setBasicData(prev => ({ 
                          ...prev, 
                          conversionRate: Number(e.target.value) 
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Результаты расчета</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Текущая прибыль</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {basicMetrics.currentProfit.toLocaleString()} {currency}
                        </div>
                        <div className="text-xs text-slate-500">в месяц</div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-medium">Потенциал роста</span>
                        </div>
                        <div className="text-2xl font-bold text-secondary">
                          +{basicMetrics.potentialImprovement.toLocaleString()} {currency}
                        </div>
                        <div className="text-xs text-slate-500">в месяц</div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Percent className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Оптимизированная маржа</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {basicMetrics.optimizedMargin}%
                        </div>
                        <div className="text-xs text-slate-500">после оптимизации</div>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">Годовой потенциал</span>
                        </div>
                        <div className="text-2xl font-bold text-accent">
                          {basicMetrics.annualPotential.toLocaleString()} {currency}
                        </div>
                        <div className="text-xs text-slate-500">в год</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Рекомендации по оптимизации</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Оптимизация цен</h4>
                      <p className="text-sm text-slate-600">
                        Проведите A/B тестирование цен для увеличения маржи без потери продаж
                      </p>
                    </div>
                    <div className="p-4 border border-secondary/20 rounded-lg">
                      <h4 className="font-semibold text-secondary mb-2">Снижение затрат</h4>
                      <p className="text-sm text-slate-600">
                        Оптимизируйте рекламные расходы и улучшите описания товаров для снижения возвратов
                      </p>
                    </div>
                    <div className="p-4 border border-accent/20 rounded-lg">
                      <h4 className="font-semibold text-accent mb-2">Увеличение конверсии</h4>
                      <p className="text-sm text-slate-600">
                        Улучшите карточки товаров и фотографии для повышения конверсии
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Detailed Cost Structure */}
                <Card>
                  <CardHeader>
                    <CardTitle>Структура затрат на единицу товара</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Цена продажи ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.revenue}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          revenue: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label>Себестоимость товара ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.cogs}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          cogs: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>
                        Комиссия OZON ({currency}) 
                        <span className="text-xs text-slate-500 ml-1">
                          ({categoryCommissions[category as keyof typeof categoryCommissions].min}-{categoryCommissions[category as keyof typeof categoryCommissions].max}%)
                        </span>
                      </Label>
                      <Input
                        type="number"
                        value={unitEconomics.ozonCommission}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          ozonCommission: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Фулфилмент ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.fulfillment}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          fulfillment: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Реклама ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.advertising}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          advertising: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Возвраты ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.returns}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          returns: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Хранение ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.storage}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          storage: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Эквайринг ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.payment}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          payment: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Упаковка ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.packaging}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          packaging: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Прочие расходы ({currency})</Label>
                      <Input
                        type="number"
                        value={unitEconomics.other}
                        onChange={(e) => setUnitEconomics(prev => ({ 
                          ...prev, 
                          other: Number(e.target.value) 
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Детальный анализ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900">
                          {unitMetrics.currentProfit} {currency}
                        </div>
                        <div className="text-sm text-slate-600">Текущая прибыль</div>
                      </div>
                      
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {unitMetrics.currentMargin}%
                        </div>
                        <div className="text-sm text-slate-600">Текущая маржа</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-3">После оптимизации:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-secondary/10 rounded-lg">
                          <div className="text-2xl font-bold text-secondary">
                            {unitMetrics.optimizedProfit} {currency}
                          </div>
                          <div className="text-sm text-slate-600">Оптимизированная прибыль</div>
                        </div>
                        
                        <div className="text-center p-4 bg-secondary/10 rounded-lg">
                          <div className="text-2xl font-bold text-secondary">
                            {unitMetrics.optimizedMargin}%
                          </div>
                          <div className="text-sm text-slate-600">Оптимизированная маржа</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent mb-2">
                          +{unitMetrics.improvement} {currency}
                        </div>
                        <div className="text-lg font-semibold text-accent">
                          +{unitMetrics.improvementPercent}% прибыли
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          потенциальное улучшение
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Рекомендации:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span>Оптимизируйте рекламные кампании для снижения CPC</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span>Улучшите качество карточек для снижения возвратов</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span>Пересмотрите логистические процессы</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span>Рассмотрите возможность прямых поставок</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-blue-700 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">
                Нужна персональная консультация?
              </h3>
              <p className="text-blue-100 mb-4">
                Получите детальный анализ вашей unit-экономики и план оптимизации
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Записаться на консультацию
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
