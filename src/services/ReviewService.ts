import type { KnowledgeItem, ReviewRating } from '../types/KnowledgeItem';
import { addDays, addMinutes, isDueForReview, nowISO } from '../utils/date';

/** 最低难度因子 */
const MIN_EASE_FACTOR = 1.3;

/** 复习算法服务 */
export const ReviewService = {
  /** 获取今日待复习的知识点 */
  getDueItems(items: KnowledgeItem[]): KnowledgeItem[] {
    return items.filter((item) => isDueForReview(item.nextReviewTime));
  },

  /** 根据评分计算下次复习时间和更新后的知识点 */
  applyRating(item: KnowledgeItem, rating: ReviewRating): KnowledgeItem {
    const now = new Date();
    let nextReview: Date;
    let newEaseFactor = item.easeFactor;

    switch (rating) {
      case 'forgot':
        nextReview = addMinutes(now, 10);
        newEaseFactor = Math.max(MIN_EASE_FACTOR, item.easeFactor - 0.2);
        break;
      case 'hard':
        nextReview = addDays(now, 1);
        break;
      case 'good':
        nextReview = addDays(now, 3);
        break;
      case 'easy':
        nextReview = addDays(now, 7);
        newEaseFactor = item.easeFactor + 0.15;
        break;
      default: {
        const _exhaustive: never = rating;
        throw new Error(`未知评分: ${String(_exhaustive)}`);
      }
    }

    return {
      ...item,
      lastReviewTime: nowISO(),
      nextReviewTime: nextReview.toISOString(),
      reviewCount: item.reviewCount + 1,
      easeFactor: newEaseFactor,
    };
  },

  /** 获取评分按钮配置 */
  getRatingOptions(): Array<{ rating: ReviewRating; label: string; description: string }> {
    return [
      { rating: 'forgot', label: '忘记了', description: '10 分钟后' },
      { rating: 'hard', label: '模糊记得', description: '1 天后' },
      { rating: 'good', label: '记住了', description: '3 天后' },
      { rating: 'easy', label: '非常熟悉', description: '7 天后' },
    ];
  },
};
