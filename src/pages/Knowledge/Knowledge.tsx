import { useMemo, useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { KnowledgeTable } from '../../components/KnowledgeTable';
import { KnowledgeModal } from '../../components/KnowledgeModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useKnowledge } from '../../hooks/useKnowledge';
import { RandomService } from '../../services/RandomService';
import type { KnowledgeItem } from '../../types/KnowledgeItem';

/** 知识库页面 */
export function Knowledge() {
  const { items, addItem, updateItem, deleteItem, toggleFavorite, searchItems } = useKnowledge();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeItem | null>(null);

  const allTags = useMemo(() => RandomService.getAllTags(items), [items]);
  const filteredItems = useMemo(
    () => searchItems(search, selectedTag),
    [searchItems, search, selectedTag]
  );

  const handleSave = (form: Parameters<typeof addItem>[0]) => {
    if (editingItem) {
      updateItem(editingItem.id, form);
    } else {
      addItem(form);
    }
    setEditingItem(null);
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (item: KnowledgeItem) => {
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          新增知识点
        </button>
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索标题、内容、标签..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTag(undefined)}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            !selectedTag
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
          }`}
        >
          全部
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <KnowledgeTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={toggleFavorite}
      />

      <KnowledgeModal
        open={modalOpen}
        item={editingItem}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除知识点"
        message={`确定要删除「${deleteTarget?.title ?? ''}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
