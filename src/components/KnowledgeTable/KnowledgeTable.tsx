import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { KnowledgeItem } from '../../types/KnowledgeItem';
import { formatDateTime } from '../../utils/date';

interface KnowledgeTableProps {
  items: KnowledgeItem[];
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (item: KnowledgeItem) => void;
  onToggleFavorite: (id: string) => void;
}

/** 知识点表格组件 */
export function KnowledgeTable({
  items,
  onEdit,
  onDelete,
  onToggleFavorite,
}: KnowledgeTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-surface-card p-12 text-center shadow-sm">
        <p className="text-gray-500">暂无知识点</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-4 py-3 font-medium text-gray-600">标题</th>
              <th className="px-4 py-3 font-medium text-gray-600">标签</th>
              <th className="px-4 py-3 font-medium text-gray-600">收藏</th>
              <th className="px-4 py-3 font-medium text-gray-600">复习次数</th>
              <th className="px-4 py-3 font-medium text-gray-600">下次复习</th>
              <th className="px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-900">
                  {item.title}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    className="text-yellow-500 transition hover:scale-110"
                    aria-label={item.favorite ? '取消收藏' : '收藏'}
                  >
                    {item.favorite ? (
                      <StarSolid className="h-5 w-5" />
                    ) : (
                      <StarOutline className="h-5 w-5 text-gray-300" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.reviewCount}</td>
                <td className="px-4 py-3 text-gray-600">{formatDateTime(item.nextReviewTime)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                      aria-label="编辑"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
                      aria-label="删除"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
