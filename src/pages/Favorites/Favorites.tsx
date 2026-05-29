import { useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { KnowledgeTable } from '../../components/KnowledgeTable';
import { KnowledgeModal } from '../../components/KnowledgeModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useKnowledge } from '../../hooks/useKnowledge';
import type { KnowledgeItem } from '../../types/KnowledgeItem';

/** 收藏夹页面 */
export function Favorites() {
  const { getFavoriteItems, updateItem, deleteItem, toggleFavorite } = useKnowledge();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeItem | null>(null);

  const favoriteItems = getFavoriteItems();
  const filteredItems = useMemo(() => {
    const lower = search.toLowerCase().trim();
    if (!lower) return favoriteItems;
    return favoriteItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.content.toLowerCase().includes(lower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  }, [favoriteItems, search]);

  const handleSave = (form: Parameters<typeof updateItem>[1]) => {
    if (editingItem) {
      updateItem(editingItem.id, form);
    }
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">收藏夹</h1>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索收藏的知识点..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <KnowledgeTable
        items={filteredItems}
        onEdit={(item) => {
          setEditingItem(item);
          setModalOpen(true);
        }}
        onDelete={(item) => setDeleteTarget(item)}
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
        message={`确定要删除「${deleteTarget?.title ?? ''}」吗？`}
        confirmLabel="删除"
        onConfirm={() => {
          if (deleteTarget) {
            deleteItem(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
