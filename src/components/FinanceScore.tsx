import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface FinanceScoreProps {
  score: number;
  grade: string;
  reasons: string[];
}

export function FinanceScore({ score, grade, reasons }: FinanceScoreProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <div 
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="text-sm mb-3" style={{ color: '#ffffff' }}>家計スコア</div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-white text-4xl font-bold">{score}</span>
          <span className="text-base" style={{ color: '#ffffff' }}>/ 100点</span>
        </div>
        <div className="mb-3">
          <span className="text-white inline-flex items-center gap-1.5 text-sm">
            評価: {grade}ランク
            {(grade === 'A' || grade === 'B') && <CheckCircle className="w-4 h-4" />}
            {(grade === 'D' || grade === 'E') && <AlertCircle className="w-4 h-4" />}
          </span>
        </div>
        <div className="text-xs" style={{ color: '#ffffff' }}>
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
