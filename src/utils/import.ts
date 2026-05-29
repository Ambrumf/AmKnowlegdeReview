import type { KnowledgeItem } from '../types/KnowledgeItem';

/** 导入校验错误 */
export class ImportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportValidationError';
  }
}

/** 校验单个知识点对象字段是否完整 */
function validateKnowledgeItem(item: unknown, index: number): KnowledgeItem {
  if (typeof item !== 'object' || item === null) {
    throw new ImportValidationError(`第 ${index + 1} 条数据不是有效对象`);
  }

  const record = item as Record<string, unknown>;

  const requiredStringFields = [
    'id',
    'title',
    'content',
    'createTime',
    'lastReviewTime',
    'nextReviewTime',
  ] as const;

  for (const field of requiredStringFields) {
    if (typeof record[field] !== 'string' || record[field] === '') {
      throw new ImportValidationError(`第 ${index + 1} 条数据缺少或无效的字段: ${field}`);
    }
  }

  if (!Array.isArray(record['tags'])) {
    throw new ImportValidationError(`第 ${index + 1} 条数据的 tags 必须是数组`);
  }

  const tags = record['tags'] as unknown[];
  if (!tags.every((tag) => typeof tag === 'string')) {
    throw new ImportValidationError(`第 ${index + 1} 条数据的 tags 必须全部为字符串`);
  }

  if (typeof record['reviewCount'] !== 'number') {
    throw new ImportValidationError(`第 ${index + 1} 条数据缺少或无效的字段: reviewCount`);
  }

  if (typeof record['easeFactor'] !== 'number') {
    throw new ImportValidationError(`第 ${index + 1} 条数据缺少或无效的字段: easeFactor`);
  }

  if (typeof record['favorite'] !== 'boolean') {
    throw new ImportValidationError(`第 ${index + 1} 条数据缺少或无效的字段: favorite`);
  }

  return {
    id: record['id'] as string,
    title: record['title'] as string,
    content: record['content'] as string,
    tags: tags as string[],
    createTime: record['createTime'] as string,
    lastReviewTime: record['lastReviewTime'] as string,
    nextReviewTime: record['nextReviewTime'] as string,
    reviewCount: record['reviewCount'] as number,
    easeFactor: record['easeFactor'] as number,
    favorite: record['favorite'] as boolean,
  };
}

/** 解析并校验导入的 JSON 数据 */
export function parseImportJson(jsonString: string): KnowledgeItem[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new ImportValidationError('JSON 格式无效，请检查文件内容');
  }

  if (!Array.isArray(parsed)) {
    throw new ImportValidationError('导入数据必须是数组格式');
  }

  if (parsed.length === 0) {
    throw new ImportValidationError('导入数据不能为空');
  }

  return parsed.map((item, index) => validateKnowledgeItem(item, index));
}

/** 读取文件内容为文本 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('无法读取文件内容'));
      }
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsText(file);
  });
}
