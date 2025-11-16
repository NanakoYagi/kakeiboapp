import { GoalMeter } from './GoalMeter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface Goal {
  current: number;
  target: number;
  category: string;
  daysLeft: number;
}

interface GoalCarouselProps {
  goals: Goal[];
}

export function GoalCarousel({ goals }: GoalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = Math.min(340, window.innerWidth - 32); // 画面幅に応じて調整
      const newIndex = direction === 'left' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(goals.length - 1, currentIndex + 1);
      
      setCurrentIndex(newIndex);
      scrollRef.current.scrollTo({
        left: newIndex * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollAmount = Math.min(340, window.innerWidth - 32);
      setCurrentIndex(index);
      scrollRef.current.scrollTo({
        left: index * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // スクロールイベントでインデックスを更新
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollAmount = Math.min(340, window.innerWidth - 32);
        const index = Math.round(scrollRef.current.scrollLeft / scrollAmount);
        setCurrentIndex(index);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative px-4">
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {goals.map((goal, index) => (
          <div key={index} className="flex-shrink-0">
            <GoalMeter
              current={goal.current}
              target={goal.target}
              category={goal.category}
              daysLeft={goal.daysLeft}
            />
          </div>
        ))}
      </div>
      
      {goals.length > 1 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="前へ"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="次へ"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </>
      )}
      
      {goals.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {goals.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className="p-2 -m-1"
              aria-label={`スライド ${index + 1} へ移動`}
            >
              <span
                className={`block w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
