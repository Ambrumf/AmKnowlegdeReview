import { useContext } from 'react';
import { KnowledgeContext } from '../context/KnowledgeContext';

/** 获取知识点 Context 的 Hook */
export function useKnowledge() {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error('useKnowledge 必须在 KnowledgeProvider 内使用');
  }
  return context;
}
