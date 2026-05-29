/** 知识点数据模型 */
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];

  createTime: string;
  lastReviewTime: string;
  nextReviewTime: string;

  reviewCount: number;
  easeFactor: number;

  favorite: boolean;
}

/** 复习评分等级 */
export type ReviewRating = 'forgot' | 'hard' | 'good' | 'easy';

/** 提醒间隔选项（分钟），0 表示关闭 */
export type ReminderInterval = 0 | 30 | 60 | 120;

/** 应用设置 */
export interface AppSettings {
  reminderInterval: ReminderInterval;
}

/** 统计数据 */
export interface StatisticsData {
  totalCount: number;
  favoriteCount: number;
  dueTodayCount: number;
  reviewedCount: number;
  tagStats: Array<{ tag: string; count: number }>;
}

/** 知识点表单数据 */
export interface KnowledgeFormData {
  title: string;
  content: string;
  tags: string;
  favorite: boolean;
}
