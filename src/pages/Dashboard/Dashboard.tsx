import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  StarIcon,
  ClockIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { StatCard } from '../../components/StatCard';
import { useKnowledge } from '../../hooks/useKnowledge';
import { StatisticsService } from '../../services/StatisticsService';
import { formatDateTime } from '../../utils/date';

/** 首页 Dashboard */
export function Dashboard() {
  const { items, getDueItems } = useKnowledge();
  const stats = StatisticsService.calculate(items);
  const dueItems = getDueItems();

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    .slice(0, 5);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  })();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{greeting}，欢迎回来 👋</h1>
        <p className="mt-1 text-gray-500">继续你的知识点复习之旅</p>
      </div>

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
          title="已复习"
          value={stats.reviewedCount}
          icon={<PlusCircleIcon className="h-6 w-6" />}
          accent="text-green-600"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/review"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          开始今日复习 {dueItems.length > 0 && `(${dueItems.length})`}
        </Link>
        <Link
          to="/random"
          className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          随机知识点
        </Link>
      </div>

      <div className="rounded-xl bg-surface-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">最近新增</h2>
        {recentItems.length === 0 ? (
          <p className="text-sm text-gray-500">暂无知识点，去知识库添加吧</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recentItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <div className="mt-1 flex gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDateTime(item.createTime)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
