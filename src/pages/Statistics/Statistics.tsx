import {
  BookOpenIcon,
  StarIcon,
  ClockIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { StatCard } from '../../components/StatCard';
import { useKnowledge } from '../../hooks/useKnowledge';
import { StatisticsService } from '../../services/StatisticsService';

/** 统计页面 */
export function Statistics() {
  const { items } = useKnowledge();
  const stats = StatisticsService.calculate(items);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">统计</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总知识点"
          value={stats.totalCount}
          icon={<BookOpenIcon className="h-6 w-6" />}
        />
        <StatCard
          title="收藏数量"
          value={stats.favoriteCount}
          icon={<StarIcon className="h-6 w-6" />}
          accent="text-yellow-500"
        />
        <StatCard
          title="今日待复习"
          value={stats.dueTodayCount}
          icon={<ClockIcon className="h-6 w-6" />}
          accent="text-orange-500"
        />
        <StatCard
          title="已复习数量"
          value={stats.reviewedCount}
          icon={<CheckBadgeIcon className="h-6 w-6" />}
          accent="text-green-600"
        />
      </div>

      <div className="rounded-xl bg-surface-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">标签统计</h2>
        {stats.tagStats.length === 0 ? (
          <p className="text-sm text-gray-500">暂无标签数据</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-4 py-3 font-medium text-gray-600">标签</th>
                  <th className="px-4 py-3 font-medium text-gray-600">数量</th>
                </tr>
              </thead>
              <tbody>
                {stats.tagStats.map(({ tag, count }) => (
                  <tr key={tag} className="border-t border-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{tag}</td>
                    <td className="px-4 py-3 text-gray-600">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
