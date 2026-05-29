/** 日期格式化工具 */

/** 将 ISO 字符串格式化为本地日期时间 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '无效日期';
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '无效日期';
  }
}

/** 将 ISO 字符串格式化为相对时间描述 */
export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '无效日期';
    }
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 0) {
      return '已到期';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} 分钟后`;
    }
    if (diffHours < 24) {
      return `${diffHours} 小时后`;
    }
    return `${diffDays} 天后`;
  } catch {
    return '无效日期';
  }
}

/** 获取当前 ISO 时间字符串 */
export function nowISO(): string {
  return new Date().toISOString();
}

/** 判断知识点是否到期需要复习 */
export function isDueForReview(nextReviewTime: string): boolean {
  try {
    return new Date(nextReviewTime).getTime() <= Date.now();
  } catch {
    return false;
  }
}

/** 获取今日开始时间 */
export function getTodayStart(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** 判断是否为今天创建 */
export function isCreatedToday(createTime: string): boolean {
  try {
    const created = new Date(createTime);
    const today = getTodayStart();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return created >= today && created < tomorrow;
  } catch {
    return false;
  }
}

/** 在指定时间基础上增加分钟数 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/** 在指定时间基础上增加天数 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
