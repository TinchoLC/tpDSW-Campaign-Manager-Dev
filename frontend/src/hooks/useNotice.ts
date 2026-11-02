import { useContext } from 'react';
import { NoticeCtx } from '../context/notice.context';

export function useNotice() {
  const context = useContext(NoticeCtx);
  if (!context) {
    throw new Error('useNotice debe usarse dentro de un NoticeProvider');
  }
  return context;
}