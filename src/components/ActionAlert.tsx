import { AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface ActionAlertProps {
  message: string;
  type: 'warning' | 'suggestion' | 'success';
}

export function ActionAlert({ message, type }: ActionAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'suggestion':
        return <Lightbulb className="w-5 h-5" />;
      case 'success':
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'suggestion':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
    }
  };

  return (
    <div className={`${getColorClasses()} rounded-xl p-4 border flex items-start gap-3`}>
      {getIcon()}
      <p className="flex-1">{message}</p>
    </div>
  );
}
