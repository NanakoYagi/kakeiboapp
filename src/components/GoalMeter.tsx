import { Progress } from './ui/progress';
import { Target } from 'lucide-react';

interface GoalMeterProps {
  current: number;
  target: number;
  category: string;
  daysLeft: number;
}

export function GoalMeter({ current, target, category, daysLeft }: GoalMeterProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = target - current;

  const getColorClass = () => {
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 w-[calc(100%-2rem)] max-w-full snap-center">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700">{category}の目標</span>
        </div>
        <span className={`${getColorClass()}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      <div className="relative">
        <Progress value={percentage} className="h-3" />
        <div className={`absolute inset-0 ${getProgressColor()} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
      
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-gray-500">
          ¥{current.toLocaleString()} / ¥{target.toLocaleString()}
        </span>
        <span className="text-gray-500">
          残り{daysLeft}日
        </span>
      </div>
      
      {remaining > 0 ? (
        <div className="mt-2 text-sm text-gray-600">
          残り予算: ¥{remaining.toLocaleString()}
        </div>
      ) : (
        <div className="mt-2 text-sm text-red-600">
          予算超過: ¥{Math.abs(remaining).toLocaleString()}
        </div>
      )}
    </div>
  );
}
