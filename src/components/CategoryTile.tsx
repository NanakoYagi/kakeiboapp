import { useState } from 'react';
import { ChevronRight, ShoppingCart, Utensils, Car, Home, Heart, CreditCard } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

interface CategoryTileProps {
  category: string;
  spent: number;
  budget: number;
  icon: string;
  transactions: Transaction[];
}

export function CategoryTile({ category, spent, budget, icon, transactions }: CategoryTileProps) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = (spent / budget) * 100;
  const isOverBudget = percentage > 100;

  const getIcon = () => {
    switch (icon) {
      case 'food':
        return <Utensils className="w-5 h-5" />;
      case 'transport':
        return <Car className="w-5 h-5" />;
      case 'shopping':
        return <ShoppingCart className="w-5 h-5" />;
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'health':
        return <Heart className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <>
      <div 
        className={`rounded-xl p-4 cursor-pointer border-2 ${
          isOverBudget 
            ? 'bg-red-50 border-red-300' 
            : percentage > 80 
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-blue-50 border-blue-300'
        }`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span>{category}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="mb-2">
          <div className={`${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            ¥{spent.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            予算 ¥{budget.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${
                isOverBudget 
                  ? 'bg-red-500' 
                  : percentage > 80 
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>{category}の履歴</SheetTitle>
            <SheetDescription>
              最近の取引履歴と予算状況
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">利用額</span>
              <span className={isOverBudget ? 'text-red-600' : 'text-gray-900'}>
                ¥{spent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">予算残高</span>
              <span className={budget - spent < 0 ? 'text-red-600' : 'text-green-600'}>
                ¥{(budget - spent).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <div className="text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.date}</div>
                </div>
                <div className="text-gray-900">
                  ¥{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
