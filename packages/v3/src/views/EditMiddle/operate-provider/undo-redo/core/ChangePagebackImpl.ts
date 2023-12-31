import AbstractRollback from './AbstractRollback'
import { IHistoryRecord, IChangePage } from '../OperateType'
import designerStore from '@/store/DesignerStore'

/**
 * hide, lock, order的撤销与回滚操作实现
 */
export class LockRollbackImpl extends AbstractRollback {
  redo(record: IHistoryRecord): void {
    const { next } = record
    const { updateBgconfig } = designerStore()
    if (next) updateBgconfig(next as IChangePage)
  }

  undo(record: IHistoryRecord): void {
    const { prev } = record
    const { updateBgconfig } = designerStore()
    if (prev) updateBgconfig(prev as IChangePage)
  }
}

const lockRollbackImpl = new LockRollbackImpl()
export default lockRollbackImpl
