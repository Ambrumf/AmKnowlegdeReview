import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useKnowledge } from '../../hooks/useKnowledge';
import { ReviewService } from '../../services/ReviewService';
import type { KnowledgeItem, ReviewRating } from '../../types/KnowledgeItem';

/** 今日复习页面 */
export function Review() {
  const { getDueItems, reviewItem } = useKnowledge();
  const [queue, setQueue] = useState<KnowledgeItem[]>([]);
  const [current, setCurrent] = useState<KnowledgeItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const loadQueue = useCallback(() => {
    const due = getDueItems();
    setQueue(due);
    setCurrent(due[0] ?? null);
    setShowAnswer(false);
  }, [getDueItems]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const handleRating = (rating: ReviewRating) => {
    if (!current) return;
    reviewItem(current.id, rating);
    const remaining = queue.filter((item) => item.id !== current.id);
    setQueue(remaining);
    setCurrent(remaining[0] ?? null);
    setShowAnswer(false);
  };

  const ratingOptions = ReviewService.getRatingOptions();

  if (queue.length === 0 && !current) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">今日复习已完成 🎉</h2>
        <p className="text-gray-500">没有待复习的知识点了</p>
        <Link
          to="/random"
          className="mt-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          随机复习
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">今日复习</h1>
        <span className="text-sm text-gray-500">
          剩余 {queue.length} 条
        </span>
      </div>

      {current && (
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

          <h2 className="text-xl font-semibold text-gray-900">{current.title}</h2>

          {!showAnswer ? (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="mt-6 rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              显示答案
            </button>
          ) : (
            <div className="mt-6">
              <div className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 font-mono text-sm text-gray-800">
                {current.content}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ratingOptions.map(({ rating, label, description }) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRating(rating)}
                    className="flex flex-col items-center rounded-xl border border-gray-200 px-3 py-3 text-sm transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="font-medium text-gray-900">{label}</span>
                    <span className="mt-1 text-xs text-gray-500">{description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
