import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

export default function AnalyticsDashboard() {
  const [metrics] = useState({
    roas: { value: 4.2, change: 23, trend: 'up' },
    cac: { value: 45, change: -15, trend: 'down' },
    ltv: { value: 189, change: 31, trend: 'up' },
    margin: { value: 28, change: 12, trend: 'up' },
  });

  const chartData = [60, 40, 80, 45, 90, 55, 100];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between text-white">
        <h3 className="font-semibold">Unit Economics Dashboard</h3>
        <BarChart3 className="h-6 w-6 text-accent" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm text-blue-200 mb-1">ROAS</div>
          <div className="text-2xl font-bold text-accent">{metrics.roas.value}x</div>
          <div className="flex items-center text-xs text-green-300">
            <TrendingUp className="h-3 w-3 mr-1" />
            {metrics.roas.change}%
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm text-blue-200 mb-1">CAC</div>
          <div className="text-2xl font-bold text-accent">€{metrics.cac.value}</div>
          <div className="flex items-center text-xs text-green-300">
            <TrendingDown className="h-3 w-3 mr-1" />
            {metrics.cac.change}%
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm text-blue-200 mb-1">LTV</div>
          <div className="text-2xl font-bold text-accent">€{metrics.ltv.value}</div>
          <div className="flex items-center text-xs text-green-300">
            <TrendingUp className="h-3 w-3 mr-1" />
            {metrics.ltv.change}%
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm text-blue-200 mb-1">Margin</div>
          <div className="text-2xl font-bold text-accent">{metrics.margin.value}%</div>
          <div className="flex items-center text-xs text-green-300">
            <TrendingUp className="h-3 w-3 mr-1" />
            {metrics.margin.change}%
          </div>
        </div>
      </div>
      
      <div className="h-20 bg-white/10 rounded-lg flex items-end p-3 space-x-1">
        {chartData.map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-accent rounded-t transition-all duration-500 hover:bg-accent/80"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-blue-200">
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>
      
      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        <Target className="h-4 w-4 mr-2" />
        Открыть калькулятор
      </Button>
    </div>
  );
}
