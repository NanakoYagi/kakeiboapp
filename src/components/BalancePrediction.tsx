import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface BalancePredictionProps {
  data: Array<{ date: string; actual: number | null; predicted: number | null }>;
  currentBalance: number;
  predictedBalance: number;
}

export function BalancePrediction({ data, currentBalance, predictedBalance }: BalancePredictionProps) {
  const isPositive = predictedBalance > currentBalance;
  const difference = predictedBalance - currentBalance;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">残高予測</span>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{difference.toLocaleString()}円</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-900">¥{predictedBalance.toLocaleString()}</span>
          <span className="text-sm text-gray-500">月末予測</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            stroke="#999"
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            stroke="#999"
            tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
          />
          <Tooltip 
            formatter={(value: number) => [`¥${value.toLocaleString()}`, '']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="実績"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            name="予測"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-3 text-xs text-gray-500 flex justify-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500" />
          <span>実績</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-purple-500 border-dashed" />
          <span>予測</span>
        </div>
      </div>
    </div>
  );
}
