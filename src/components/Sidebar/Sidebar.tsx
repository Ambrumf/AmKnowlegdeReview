import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  ClockIcon,
  SparklesIcon,
  StarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

/** 导航菜单项配置 */
const navItems = [
  { to: '/dashboard', label: '首页', icon: HomeIcon },
  { to: '/knowledge', label: '知识库', icon: BookOpenIcon },
  { to: '/review', label: '今日复习', icon: ClockIcon },
  { to: '/random', label: '随机知识', icon: SparklesIcon },
  { to: '/favorites', label: '收藏夹', icon: StarIcon },
  { to: '/statistics', label: '统计', icon: ChartBarIcon },
  { to: '/settings', label: '设置', icon: Cog6ToothIcon },
] as const;

/** 左侧导航栏 */
export function Sidebar() {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col bg-sidebar text-gray-200">
      <div className="border-b border-white/10 px-6 py-5">
        <h1 className="text-lg font-semibold text-white">KnowledgeReview</h1>
        <p className="mt-1 text-xs text-gray-400">知识点随机复习工具</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-gray-500">数据存储于 LocalStorage</p>
      </div>
    </aside>
  );
}
