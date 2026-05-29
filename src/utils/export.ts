import type { KnowledgeItem } from '../types/KnowledgeItem';

/** 导出知识点数据为 JSON 字符串 */
export function exportToJson(items: KnowledgeItem[]): string {
  return JSON.stringify(items, null, 2);
}

/** 触发浏览器下载 JSON 文件 */
export function downloadJson(items: KnowledgeItem[], filename = 'knowledge.json'): void {
  const json = exportToJson(items);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
