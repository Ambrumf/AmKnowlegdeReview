import type { KnowledgeItem } from '../types/KnowledgeItem';
import { nowISO } from '../utils/date';

/** LocalStorage 存储键名 */
const STORAGE_KEY = 'knowledge-review-data';
const SETTINGS_KEY = 'knowledge-review-settings';

/** 生成唯一 ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** 创建默认 C# 示例知识点 */
function createSampleItems(): KnowledgeItem[] {
  const now = nowISO();
  const samples: Array<Omit<KnowledgeItem, 'id'>> = [
    {
      title: 'async/await',
      content:
        'async/await 是 C# 中用于简化异步编程的语法糖。\n\n```csharp\npublic async Task<string> FetchDataAsync()\n{\n    var result = await httpClient.GetStringAsync(url);\n    return result;\n}\n```\n\nawait 会暂停当前方法执行，直到异步操作完成，但不会阻塞线程。',
      tags: ['C#', '.NET', '异步'],
      createTime: now,
      lastReviewTime: now,
      nextReviewTime: now,
      reviewCount: 0,
      easeFactor: 2.5,
      favorite: false,
    },
    {
      title: 'LINQ',
      content:
        'LINQ (Language Integrated Query) 提供统一的数据查询语法。\n\n```csharp\nvar result = items\n    .Where(x => x.Price > 100)\n    .OrderBy(x => x.Name)\n    .Select(x => x.Name)\n    .ToList();\n```\n\n支持查询语法和方法语法两种写法。',
      tags: ['C#', '.NET', 'LINQ'],
      createTime: now,
      lastReviewTime: now,
      nextReviewTime: now,
      reviewCount: 0,
      easeFactor: 2.5,
      favorite: true,
    },
    {
      title: 'Task',
      content:
        'Task 代表一个异步操作，是 .NET 异步编程的核心类型。\n\n```csharp\nTask<int> task = Task.Run(() => Compute());\nint result = await task;\n\n// 等待多个任务\nawait Task.WhenAll(task1, task2);\n```\n\nTask<T> 表示返回 T 类型结果的异步操作。',
      tags: ['C#', '.NET', '异步'],
      createTime: now,
      lastReviewTime: now,
      nextReviewTime: now,
      reviewCount: 0,
      easeFactor: 2.5,
      favorite: false,
    },
    {
      title: 'Span<T>',
      content:
        'Span<T> 是栈上分配的连续内存区域引用，用于高性能、零分配的数据处理。\n\n```csharp\nSpan<int> numbers = stackalloc int[100];\nReadOnlySpan<char> text = "Hello".AsSpan();\n\n// 切片操作不产生新数组\nvar slice = text.Slice(0, 3);\n```\n\n适用于性能敏感场景，避免堆内存分配。',
      tags: ['C#', '.NET', '性能'],
      createTime: now,
      lastReviewTime: now,
      nextReviewTime: now,
      reviewCount: 0,
      easeFactor: 2.5,
      favorite: false,
    },
    {
      title: 'Dependency Injection',
      content:
        '依赖注入 (DI) 是 .NET 内置的 IoC 容器机制。\n\n```csharp\n// 注册服务\nservices.AddScoped<IUserService, UserService>();\n\n// 构造函数注入\npublic class HomeController\n{\n    private readonly IUserService _userService;\n    public HomeController(IUserService userService)\n    {\n        _userService = userService;\n    }\n}\n```\n\n生命周期：Singleton、Scoped、Transient。',
      tags: ['C#', '.NET', 'DI'],
      createTime: now,
      lastReviewTime: now,
      nextReviewTime: now,
      reviewCount: 0,
      easeFactor: 2.5,
      favorite: true,
    },
  ];

  return samples.map((item) => ({
    ...item,
    id: generateId(),
  }));
}

/** 知识点 LocalStorage 存储服务 */
export const StorageService = {
  /** 获取全部知识点 */
  getAll(): KnowledgeItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const samples = createSampleItems();
        this.saveAll(samples);
        return samples;
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        const samples = createSampleItems();
        this.saveAll(samples);
        return samples;
      }
      return parsed as KnowledgeItem[];
    } catch (error) {
      console.error('读取知识点数据失败:', error);
      const samples = createSampleItems();
      this.saveAll(samples);
      return samples;
    }
  },

  /** 保存全部知识点 */
  saveAll(items: KnowledgeItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('保存知识点数据失败:', error);
      throw new Error('保存数据失败，可能是存储空间不足');
    }
  },

  /** 保存单个知识点（新增） */
  save(item: KnowledgeItem): KnowledgeItem[] {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return items;
  },

  /** 更新知识点 */
  update(updatedItem: KnowledgeItem): KnowledgeItem[] {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === updatedItem.id);
    if (index === -1) {
      throw new Error('知识点不存在');
    }
    items[index] = updatedItem;
    this.saveAll(items);
    return items;
  },

  /** 删除知识点 */
  delete(id: string): KnowledgeItem[] {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) {
      throw new Error('知识点不存在');
    }
    this.saveAll(filtered);
    return filtered;
  },

  /** 导入知识点（覆盖现有数据） */
  import(items: KnowledgeItem[]): KnowledgeItem[] {
    this.saveAll(items);
    return items;
  },

  /** 导出知识点 */
  export(): KnowledgeItem[] {
    return this.getAll();
  },

  /** 创建新知识点对象 */
  createItem(data: {
    title: string;
    content: string;
    tags: string[];
    favorite: boolean;
  }): KnowledgeItem {
    const now = nowISO();
    return {
      id: generateId(),
      title: data.title,
      content: data.content,
      tags: data.tags,
      createTime: now,
      lastReviewTime: now,
      nextReviewTime: now,
      reviewCount: 0,
      easeFactor: 2.5,
      favorite: data.favorite,
    };
  },

  /** 获取设置 */
  getSettings(): { reminderInterval: number } {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        return { reminderInterval: 0 };
      }
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const settings = parsed as Record<string, unknown>;
        const interval = settings['reminderInterval'];
        if (typeof interval === 'number' && [0, 30, 60, 120].includes(interval)) {
          return { reminderInterval: interval };
        }
      }
      return { reminderInterval: 0 };
    } catch {
      return { reminderInterval: 0 };
    }
  },

  /** 保存设置 */
  saveSettings(settings: { reminderInterval: number }): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
      throw new Error('保存设置失败');
    }
  },
};
