import type { KnowledgeItem, StatisticsData } from '../types/KnowledgeItem';
import { ReviewService } from './ReviewService';

/** 统计数据服务 */
export const StatisticsService = {
  /** 计算统计数据 */
  calculate(items: KnowledgeItem[]): StatisticsData {
    const favoriteCount = items.filter((item) => item.favorite).length;
    const dueTodayCount = ReviewService.getDueItems(items).length;
    const reviewedCount = items.filter((item) => item.reviewCount > 0).length;

    const tagMap = new Map<string, number>();
    items.forEach((item) => {
      item.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      });
    });

    const tagStats = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCount: items.length,
      favoriteCount,
      dueTodayCount,
      reviewedCount,
      tagStats,
    };
  },
};
