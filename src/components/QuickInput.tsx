import { useState } from 'react';
import { Utensils, Car, ShoppingCart, Home, Coffee, Film, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QuickInputProps {
  onAddTransaction: (amount: number, category: string) => void;
}

export function QuickInput({ onAddTransaction }: QuickInputProps) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'food', label: '食費', icon: Utensils, color: 'bg-orange-500' },
    { id: 'transport', label: '交通', icon: Car, color: 'bg-blue-500' },
    { id: 'shopping', label: '買物', icon: ShoppingCart, color: 'bg-purple-500' },
    { id: 'cafe', label: 'カフェ', icon: Coffee, color: 'bg-yellow-600' },
    { id: 'entertainment', label: '娯楽', icon: Film, color: 'bg-pink-500' },
    { id: 'home', label: '住居', icon: Home, color: 'bg-green-500' },
  ];

  const handleSubmit = () => {
    if (!amount || !selectedCategory) {
      toast.error('金額とカテゴリーを選択してください');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('有効な金額を入力してください');
      return;
    }

    onAddTransaction(numAmount, selectedCategory);
    toast.success('支出を記録しました');
    setAmount('');
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white shadow-lg border-t border-gray-200 h-[140px] px-3 py-3 flex flex-col gap-3">
      {/* 上段: 金額入力と追加ボタン */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="金額を入力"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 h-14 border-2 border-gray-300 rounded-lg text-center focus:outline-none focus:border-blue-500 px-3"
        />
        
        <button
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          onClick={handleSubmit}
          disabled={!amount || !selectedCategory}
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* 下段: カテゴリー選択 */}
      <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                className={`flex-shrink-0 flex flex-col items-center gap-1 transition-all ${
                  isSelected ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
