import { useRef, useState } from 'react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useKnowledge } from '../../hooks/useKnowledge';
import { StorageService } from '../../services/StorageService';
import { NotificationService } from '../../services/NotificationService';
import { downloadJson } from '../../utils/export';
import { ImportValidationError, parseImportJson, readFileAsText } from '../../utils/import';
import type { ReminderInterval } from '../../types/KnowledgeItem';

const reminderOptions: Array<{ value: ReminderInterval; label: string }> = [
  { value: 0, label: '关闭' },
  { value: 30, label: '30 分钟' },
  { value: 60, label: '60 分钟' },
  { value: 120, label: '120 分钟' },
];

/** 设置页面 */
export function Settings() {
  const { items, importItems } = useKnowledge();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reminderInterval, setReminderInterval] = useState<ReminderInterval>(() => {
    const settings = StorageService.getSettings();
    return settings.reminderInterval as ReminderInterval;
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importing, setImporting] = useState(false);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleReminderChange = async (value: ReminderInterval) => {
    setReminderInterval(value);
    StorageService.saveSettings({ reminderInterval: value });

    if (value > 0) {
      await NotificationService.requestPermission();
    }
    NotificationService.restartReminder(() => StorageService.getAll());
    showMessage('success', '提醒设置已保存');
  };

  const handleExport = () => {
    try {
      downloadJson(items);
      showMessage('success', '导出成功');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '导出失败');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await readFileAsText(file);
      const parsed = parseImportJson(text);
      importItems(parsed);
      showMessage('success', `成功导入 ${parsed.length} 条知识点`);
    } catch (error) {
      if (error instanceof ImportValidationError) {
        showMessage('error', error.message);
      } else {
        showMessage('error', error instanceof Error ? error.message : '导入失败');
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">设置</h1>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl bg-surface-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">提醒间隔</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {reminderOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleReminderChange(value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                reminderInterval === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {!NotificationService.isSupported() && (
          <p className="mt-3 text-xs text-orange-600">当前浏览器不支持通知功能</p>
        )}
      </div>

      <div className="rounded-xl bg-surface-card p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">数据存储</h2>
        <p className="text-sm text-gray-600">
          当前数据存储：<span className="font-medium text-gray-900">LocalStorage</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          存储键名：knowledge-review-data
        </p>
      </div>

      <div className="rounded-xl bg-surface-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">数据管理</h2>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            导出 knowledge.json
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={importing}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowUpTrayIcon className="h-4 w-4" />
            {importing ? '导入中...' : '导入 JSON'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <p className="mt-3 text-xs text-gray-400">
          导入将覆盖现有数据，请先导出备份
        </p>
      </div>
    </div>
  );
}
