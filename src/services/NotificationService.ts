import type { KnowledgeItem } from '../types/KnowledgeItem';
import { RandomService } from './RandomService';
import { StorageService } from './StorageService';

/** 提醒间隔 LocalStorage 检查间隔（毫秒） */
const CHECK_INTERVAL_MS = 60 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastReminderTime = 0;

/** 浏览器通知服务 */
export const NotificationService = {
  /** 请求通知权限 */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    if (Notification.permission !== 'denied') {
      try {
        return await Notification.requestPermission();
      } catch (error) {
        console.error('请求通知权限失败:', error);
        return 'denied';
      }
    }
    return Notification.permission;
  },

  /** 发送随机知识点提醒通知 */
  showRandomReminder(items: KnowledgeItem[]): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const item = RandomService.pickRandom(items);
    if (!item) {
      return;
    }

    const summary =
      item.content.length > 80 ? `${item.content.slice(0, 80)}...` : item.content;

    try {
      new Notification(`📚 ${item.title}`, {
        body: summary,
        icon: '/AmKnowlegdeReview/vite.svg',
        tag: 'knowledge-review-reminder',
      });
    } catch (error) {
      console.error('发送通知失败:', error);
    }
  },

  /** 启动提醒定时器 */
  startReminder(getItems: () => KnowledgeItem[]): void {
    this.stopReminder();

    const settings = StorageService.getSettings();
    const intervalMinutes = settings.reminderInterval;

    if (intervalMinutes === 0) {
      return;
    }

    lastReminderTime = Date.now();

    intervalId = setInterval(() => {
      const currentSettings = StorageService.getSettings();
      if (currentSettings.reminderInterval === 0) {
        this.stopReminder();
        return;
      }

      const elapsed = Date.now() - lastReminderTime;
      const requiredMs = currentSettings.reminderInterval * 60 * 1000;

      if (elapsed >= requiredMs) {
        this.showRandomReminder(getItems());
        lastReminderTime = Date.now();
      }
    }, CHECK_INTERVAL_MS);
  },

  /** 停止提醒定时器 */
  stopReminder(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },

  /** 重启提醒（设置变更后调用） */
  restartReminder(getItems: () => KnowledgeItem[]): void {
    lastReminderTime = Date.now();
    this.startReminder(getItems);
  },

  /** 检查浏览器是否支持通知 */
  isSupported(): boolean {
    return 'Notification' in window;
  },
};
