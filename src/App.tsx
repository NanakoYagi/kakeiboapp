import { useState, useMemo } from 'react';
import { FinanceScore } from './components/FinanceScore';
import { GoalCarousel } from './components/GoalCarousel';
import { ActionAlert } from './components/ActionAlert';
import { BalancePrediction } from './components/BalancePrediction';
import { CategoryTile } from './components/CategoryTile';
import { QuickInput } from './components/QuickInput';
import { Toaster } from './components/ui/sonner';
import { ScrollArea } from './components/ui/scroll-area';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

// カテゴリーマッピング
const categoryMapping: Record<string, { name: string; icon: string; budget: number }> = {
  food: { name: '食費', icon: 'food', budget: 50000 },
  transport: { name: '交通費', icon: 'transport', budget: 15000 },
  shopping: { name: '買い物', icon: 'shopping', budget: 30000 },
  home: { name: '住居費', icon: 'home', budget: 80000 },
  cafe: { name: 'カフェ', icon: 'food', budget: 10000 },
  entertainment: { name: '娯楽', icon: 'shopping', budget: 25000 },
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '11/1', description: 'スーパーマーケット', amount: 3200, category: 'food' },
    { id: '2', date: '11/2', description: 'コンビニ', amount: 850, category: 'food' },
    { id: '3', date: '11/3', description: 'レストラン', amount: 4500, category: 'food' },
    { id: '4', date: '11/5', description: 'スーパーマーケット', amount: 5600, category: 'food' },
    { id: '5', date: '11/7', description: 'カフェ', amount: 1200, category: 'cafe' },
    { id: '6', date: '11/1', description: '定期券', amount: 12000, category: 'transport' },
    { id: '7', date: '11/4', description: 'タクシー', amount: 2800, category: 'transport' },
    { id: '8', date: '11/8', description: 'バス', amount: 1200, category: 'transport' },
    { id: '9', date: '11/12', description: 'ガソリン', amount: 2000, category: 'transport' },
    { id: '10', date: '11/2', description: '映画', amount: 2000, category: 'entertainment' },
    { id: '11', date: '11/6', description: '書籍', amount: 3500, category: 'entertainment' },
    { id: '12', date: '11/9', description: 'ゲーム', amount: 6800, category: 'entertainment' },
    { id: '13', date: '11/14', description: 'カラオケ', amount: 3200, category: 'entertainment' },
    { id: '14', date: '11/16', description: 'ライブチケット', amount: 6500, category: 'entertainment' },
  ]);

  // カテゴリー別の支出を計算
  const categoryData = useMemo(() => {
    const categorySpending: Record<string, number> = {};
    const categoryTransactions: Record<string, Transaction[]> = {};

    transactions.forEach((transaction) => {
      if (!categorySpending[transaction.category]) {
        categorySpending[transaction.category] = 0;
        categoryTransactions[transaction.category] = [];
      }
      categorySpending[transaction.category] += transaction.amount;
      categoryTransactions[transaction.category].push(transaction);
    });

    // カテゴリーを支出額順にソート
    const sortedCategories = Object.entries(categorySpending)
      .map(([categoryId, spent]) => {
        const categoryInfo = categoryMapping[categoryId];
        return {
          category: categoryInfo.name,
          spent,
          budget: categoryInfo.budget,
          icon: categoryInfo.icon,
          transactions: categoryTransactions[categoryId].slice(-5).reverse(),
          percentage: (spent / categoryInfo.budget) * 100,
        };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);

    return sortedCategories;
  }, [transactions]);

  // 総支出を計算
  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // 残高予測データを計算
  const balanceData = useMemo(() => {
    const initialBalance = 320000;
    const currentBalance = initialBalance - totalSpent;
    const dailySpending = totalSpent / 18; // 18日間での平均
    const daysRemaining = 12;
    const predictedSpending = dailySpending * daysRemaining;
    const predictedBalance = currentBalance - predictedSpending;

    return {
      currentBalance,
      predictedBalance: Math.round(predictedBalance),
      data: [
        { date: '11/1', actual: 320000, predicted: null },
        { date: '11/5', actual: 305000, predicted: null },
        { date: '11/10', actual: 290000, predicted: null },
        { date: '11/15', actual: currentBalance, predicted: null },
        { date: '11/20', actual: null, predicted: Math.round(currentBalance - dailySpending * 5) },
        { date: '11/25', actual: null, predicted: Math.round(currentBalance - dailySpending * 10) },
        { date: '11/30', actual: null, predicted: Math.round(predictedBalance) },
      ],
    };
  }, [totalSpent]);

  // 全カテゴリーの目標データ
  const goalsData = useMemo(() => {
    const categoryGroups = {
      food: ['food', 'cafe'],
      transport: ['transport'],
      shopping: ['shopping'],
      entertainment: ['entertainment'],
      home: ['home'],
    };

    const goals = Object.entries(categoryGroups).map(([key, categories]) => {
      const spent = transactions
        .filter((t) => categories.includes(t.category))
        .reduce((sum, t) => sum + t.amount, 0);

      const categoryInfo = categoryMapping[key];
      return {
        current: spent,
        target: categoryInfo.budget,
        category: categoryInfo.name,
        daysLeft: 12,
      };
    });

    // 予算達成率の高い順にソート
    return goals.sort((a, b) => {
      const percentA = (a.current / a.target) * 100;
      const percentB = (b.current / b.target) * 100;
      return percentB - percentA;
    });
  }, [transactions]);

  // 食費の目標データ（メッセージ用）
  const foodGoal = useMemo(() => {
    return goalsData.find((g) => g.category === '食費') || goalsData[0];
  }, [goalsData]);

  // 家計スコアを計算
  const financeData = useMemo(() => {
    let score = 100;
    const reasons = [];

    // 食費チェック
    const foodPercentage = (foodGoal.current / foodGoal.target) * 100;
    if (foodPercentage > 100) {
      score -= 15;
      reasons.push('食費が予算を超過しています');
    } else if (foodPercentage > 80) {
      score -= 8;
      reasons.push('食費が先月比15%増加しています');
    } else {
      reasons.push('食費は予算内に収まっています');
    }

    // 総支出チェック
    const totalBudget = Object.values(categoryMapping).reduce((sum, c) => sum + c.budget, 0);
    const totalPercentage = (totalSpent / totalBudget) * 100;
    if (totalPercentage > 70) {
      score -= 10;
      reasons.push('全体的な支出が多めです');
    } else {
      reasons.push('貯蓄目標は順調に達成中です');
    }

    // 予算超過カテゴリーチェック
    const overBudgetCount = categoryData.filter((c) => c.percentage > 100).length;
    if (overBudgetCount > 0) {
      score -= overBudgetCount * 5;
      reasons.push(`${overBudgetCount}つのカテゴリーが予算超過しています`);
    } else {
      reasons.push('固定費の支払いは問題ありません');
    }

    score = Math.max(0, Math.min(100, score));

    let grade = 'A';
    if (score < 80) grade = 'B';
    if (score < 65) grade = 'C';
    if (score < 50) grade = 'D';
    if (score < 35) grade = 'E';

    return { score, grade, reasons: reasons.slice(0, 3) };
  }, [foodGoal, totalSpent, categoryData]);

  // アクションメッセージを生成
  const actionMessage = useMemo(() => {
    const foodPercentage = (foodGoal.current / foodGoal.target) * 100;
    const remaining = foodGoal.target - foodGoal.current;
    const dailyBudget = Math.floor(remaining / foodGoal.daysLeft);

    if (foodPercentage >= 100) {
      return `${foodGoal.category}が予算を超過しました。今月は節約を心がけましょう`;
    } else if (foodPercentage >= 80) {
      return `今月は${foodGoal.category}がハイペースです。残り${foodGoal.daysLeft}日、1日の予算を${dailyBudget}円に抑えましょう`;
    } else {
      return `順調です！${foodGoal.category}の残り予算は${remaining.toLocaleString()}円です`;
    }
  }, [foodGoal]);

  const actionType = useMemo(() => {
    const foodPercentage = (foodGoal.current / foodGoal.target) * 100;
    if (foodPercentage >= 100) return 'warning';
    if (foodPercentage >= 80) return 'warning';
    return 'success';
  }, [foodGoal]);

  const handleAddTransaction = (amount: number, category: string) => {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}`;
    const categoryName = categoryMapping[category]?.name || 'その他';

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: dateStr,
      description: categoryName,
      amount,
      category,
    };

    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-[375px] mx-auto relative">
      <Toaster position="top-center" />
      
      <ScrollArea className="h-screen">
        <div className="pb-32">
          {/* アンケート誘導 - アプリ外の説明部分 */}
          <div className="px-3 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
            <p className="text-xs text-gray-800 mb-2 text-center leading-relaxed px-1">
              一通り触り終わったら以下のボタンから<br />アンケートに進んでください
            </p>
            <a 
              href="https://forms.gle/3y3Y6Y8o9gk6r1YdA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                📝 アンケートに進む
              </button>
            </a>
          </div>

          {/* 上部セクション: 現状把握 */}
          <div className="px-4 pt-6 space-y-4 mb-6">
            <FinanceScore 
              score={financeData.score}
              grade={financeData.grade}
              reasons={financeData.reasons}
            />
            
            <GoalCarousel goals={goalsData} />
            
            <ActionAlert
              message={actionMessage}
              type={actionType as 'warning' | 'suggestion' | 'success'}
            />
          </div>

          {/* 中部セクション: 未来シミュレーション */}
          <div className="px-4 space-y-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-purple-500 rounded-full" />
              <span className="text-gray-700">未来予測</span>
            </div>
            
            <BalancePrediction
              data={balanceData.data}
              currentBalance={balanceData.currentBalance}
              predictedBalance={balanceData.predictedBalance}
            />
          </div>

          {/* カテゴリー別支出ハイライト */}
          <div className="px-4 space-y-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full" />
              <span className="text-gray-700">支出ハイライト（TOP3）</span>
            </div>
            
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <CategoryTile
                  key={index}
                  category={category.category}
                  spent={category.spent}
                  budget={category.budget}
                  icon={category.icon}
                  transactions={category.transactions}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* 下部セクション: 瞬時入力エリア（固定） */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto">
        <QuickInput onAddTransaction={handleAddTransaction} />
      </div>
    </div>
  );
}

export default App;
