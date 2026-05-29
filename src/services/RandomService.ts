import type { KnowledgeItem } from '../types/KnowledgeItem';

/** 随机知识点抽取服务 */
export const RandomService = {
  /** 从列表中随机抽取一条，排除指定 ID */
  pickRandom(
    items: KnowledgeItem[],
    excludeId?: string,
    options?: { favoritesOnly?: boolean; tag?: string }
  ): KnowledgeItem | null {
    let pool = [...items];

    if (options?.favoritesOnly) {
      pool = pool.filter((item) => item.favorite);
    }

    if (options?.tag) {
      pool = pool.filter((item) => item.tags.includes(options.tag!));
    }

    if (excludeId) {
      const filtered = pool.filter((item) => item.id !== excludeId);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    if (pool.length === 0) {
      return null;
    }

    const index = Math.floor(Math.random() * pool.length);
    return pool[index] ?? null;
  },

  /** 获取所有不重复标签 */
  getAllTags(items: KnowledgeItem[]): string[] {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  },
};
