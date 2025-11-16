import { useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface FinanceScoreProps {
  score: number;
  grade: string;
  reasons: string[];
}

export function FinanceScore({ score, grade, reasons }: FinanceScoreProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getGradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'B') return 'text-green-500';
    if (grade === 'C') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <div 
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80">家計スコア</span>
          <TrendingUp className="w-5 h-5 text-white/80" />
        </div>
        <div className="flex items-baseline gap-3">
          <span className={`${getScoreColor(score)} text-white`}>{score}</span>
          <span className="text-white/60">/ 100点</span>
        </div>
        <div className="mt-2">
          <span className={`${getGradeColor(grade)} text-white inline-flex items-center gap-1`}>
            評価: {grade}ランク
            {(grade === 'A' || grade === 'B') && <CheckCircle className="w-4 h-4" />}
            {(grade === 'D' || grade === 'E') && <AlertCircle className="w-4 h-4" />}
          </span>
        </div>
        <div className="mt-3 text-white/60 text-sm">
          タップして詳細を表示
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[340px]">
          <DialogHeader>
            <DialogTitle>スコア詳細</DialogTitle>
            <DialogDescription>
              家計スコアの詳細な評価理由をご確認いただけます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>現在のスコア</span>
              <span className={getScoreColor(score)}>{score}点</span>
            </div>
            <div>
              <div className="mb-2">評価理由：</div>
              <ul className="space-y-2">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
