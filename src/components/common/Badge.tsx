export interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const variantMap = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };
  const sizeMap = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantMap[variant]} ${sizeMap[size]}`}>
      {label}
    </span>
  );
}
