import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { KnowledgeItem, KnowledgeFormData, ReviewRating } from '../types/KnowledgeItem';
import { StorageService } from '../services/StorageService';
import { ReviewService } from '../services/ReviewService';
import { NotificationService } from '../services/NotificationService';

/** 解析标签字符串为数组 */
function parseTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/** 知识点 Context 类型 */
export interface KnowledgeContextType {
  items: KnowledgeItem[];
  loading: boolean;
  addItem: (form: KnowledgeFormData) => void;
  updateItem: (id: string, form: KnowledgeFormData) => void;
  deleteItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  reviewItem: (id: string, rating: ReviewRating) => void;
  importItems: (items: KnowledgeItem[]) => void;
  refresh: () => void;
  getDueItems: () => KnowledgeItem[];
  getFavoriteItems: () => KnowledgeItem[];
  searchItems: (query: string, tag?: string) => KnowledgeItem[];
}

export const KnowledgeContext = createContext<KnowledgeContextType | null>(null);

interface KnowledgeProviderProps {
  children: ReactNode;
}

/** 知识点全局状态 Provider */
export function KnowledgeProvider({ children }: KnowledgeProviderProps) {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(() => {
    try {
      const data = StorageService.getAll();
      setItems(data);
    } catch (error) {
      console.error('加载知识点失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
    void NotificationService.requestPermission();
    NotificationService.startReminder(() => StorageService.getAll());
    return () => {
      NotificationService.stopReminder();
    };
  }, [loadItems]);

  const addItem = useCallback((form: KnowledgeFormData) => {
    const newItem = StorageService.createItem({
      title: form.title.trim(),
      content: form.content,
      tags: parseTags(form.tags),
      favorite: form.favorite,
    });
    const updated = StorageService.save(newItem);
    setItems(updated);
  }, []);

  const updateItem = useCallback((id: string, form: KnowledgeFormData) => {
    const existing = StorageService.getAll().find((item) => item.id === id);
    if (!existing) {
      throw new Error('知识点不存在');
    }
    const updated = StorageService.update({
      ...existing,
      title: form.title.trim(),
      content: form.content,
      tags: parseTags(form.tags),
      favorite: form.favorite,
    });
    setItems(updated);
  }, []);

  const deleteItem = useCallback((id: string) => {
    const updated = StorageService.delete(id);
    setItems(updated);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const existing = StorageService.getAll().find((item) => item.id === id);
    if (!existing) {
      return;
    }
    const updated = StorageService.update({
      ...existing,
      favorite: !existing.favorite,
    });
    setItems(updated);
  }, []);

  const reviewItem = useCallback((id: string, rating: ReviewRating) => {
    const existing = StorageService.getAll().find((item) => item.id === id);
    if (!existing) {
      return;
    }
    const reviewed = ReviewService.applyRating(existing, rating);
    const updated = StorageService.update(reviewed);
    setItems(updated);
  }, []);

  const importItems = useCallback((newItems: KnowledgeItem[]) => {
    const updated = StorageService.import(newItems);
    setItems(updated);
  }, []);

  const getDueItems = useCallback(() => {
    return ReviewService.getDueItems(items);
  }, [items]);

  const getFavoriteItems = useCallback(() => {
    return items.filter((item) => item.favorite);
  }, [items]);

  const searchItems = useCallback(
    (query: string, tag?: string) => {
      const lowerQuery = query.toLowerCase().trim();
      return items.filter((item) => {
        const matchesTag = !tag || item.tags.includes(tag);
        if (!matchesTag) {
          return false;
        }
        if (!lowerQuery) {
          return true;
        }
        const inTitle = item.title.toLowerCase().includes(lowerQuery);
        const inContent = item.content.toLowerCase().includes(lowerQuery);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(lowerQuery));
        return inTitle || inContent || inTags;
      });
    },
    [items]
  );

  const value = useMemo<KnowledgeContextType>(
    () => ({
      items,
      loading,
      addItem,
      updateItem,
      deleteItem,
      toggleFavorite,
      reviewItem,
      importItems,
      refresh: loadItems,
      getDueItems,
      getFavoriteItems,
      searchItems,
    }),
    [
      items,
      loading,
      addItem,
      updateItem,
      deleteItem,
      toggleFavorite,
      reviewItem,
      importItems,
      loadItems,
      getDueItems,
      getFavoriteItems,
      searchItems,
    ]
  );

  return <KnowledgeContext.Provider value={value}>{children}</KnowledgeContext.Provider>;
}
