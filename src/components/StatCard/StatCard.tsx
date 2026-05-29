import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  accent?: string;
}

/** 统计卡片组件 */
export function StatCard({ title, value, icon, accent = 'text-blue-600' }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
