interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ value, max = 100, size = 'md', color = 'emerald', showLabel = true }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full ${heightMap[size]}`}>
        <div
          className={`${colorMap[color] || colorMap.emerald} ${heightMap[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
