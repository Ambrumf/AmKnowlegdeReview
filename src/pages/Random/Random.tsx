import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useKnowledge } from '../../hooks/useKnowledge';
import { RandomService } from '../../services/RandomService';
import type { KnowledgeItem } from '../../types/KnowledgeItem';

type FilterMode = 'all' | 'favorites';

/** 随机知识页面 */
export function Random() {
  const { items } = useKnowledge();
  const [current, setCurrent] = useState<KnowledgeItem | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const allTags = useMemo(() => RandomService.getAllTags(items), [items]);

  const pickNext = useCallback(
    (excludeId?: string) => {
      const picked = RandomService.pickRandom(items, excludeId, {
        favoritesOnly: filterMode === 'favorites',
        tag: selectedTag,
      });
      setCurrent(picked);
      setShowContent(false);
    },
    [items, filterMode, selectedTag]
  );

  useEffect(() => {
    pickNext();
  }, [pickNext]);

  const handleNext = () => {
    pickNext(current?.id);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">随机知识</h1>

      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
            }`}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('favorites')}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              filterMode === 'favorites'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
            }`}
          >
            仅收藏
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTag(undefined)}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            !selectedTag
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
          }`}
        >
          全部标签
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {!current ? (
        <div className="rounded-xl bg-surface-card p-12 text-center shadow-sm">
          <p className="text-gray-500">没有符合条件的知识点</p>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-card p-8 shadow-sm">
          <div className="mb-2 flex flex-wrap gap-1">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowContent(!showContent)}
            className="text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 transition hover:text-blue-600">
              {current.title}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {showContent ? '点击隐藏内容' : '点击显示内容'}
            </p>
          </button>

          {showContent && (
            <div className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 font-mono text-sm text-gray-800">
              {current.content}
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-4 w-4" />
            下一条
          </button>
        </div>
      )}
    </div>
  );
}
