import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { KnowledgeItem, KnowledgeFormData } from '../../types/KnowledgeItem';

interface KnowledgeModalProps {
  open: boolean;
  item?: KnowledgeItem | null;
  onSave: (form: KnowledgeFormData) => void;
  onClose: () => void;
}

const emptyForm: KnowledgeFormData = {
  title: '',
  content: '',
  tags: '',
  favorite: false,
};

/** 新增/编辑知识点弹窗 */
export function KnowledgeModal({ open, item, onSave, onClose }: KnowledgeModalProps) {
  const [form, setForm] = useState<KnowledgeFormData>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (item) {
        setForm({
          title: item.title,
          content: item.content,
          tags: item.tags.join(','),
          favorite: item.favorite,
        });
      } else {
        setForm(emptyForm);
      }
      setError('');
    }
  }, [open, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('标题不能为空');
      return;
    }
    if (!form.content.trim()) {
      setError('内容不能为空');
      return;
    }
    onSave(form);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {item ? '编辑知识点' : '新增知识点'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="关闭"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
          )}

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              标题
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="输入知识点标题"
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
              内容
            </label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="支持代码片段，保留换行"
            />
          </div>

          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium text-gray-700">
              标签
            </label>
            <input
              id="tags"
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="C#,.NET,LINQ"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.favorite}
              onChange={(e) => setForm({ ...form, favorite: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            收藏
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
