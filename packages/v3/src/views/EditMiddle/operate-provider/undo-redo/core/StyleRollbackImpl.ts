import AbstractRollback from './AbstractRollback'
import { IHistoryRecord, IUpdStyleOperateData } from '../OperateType'
import designerStore from '@/store/DesignerStore'
import eventOperateStore from '@/store/EventOperateStore'
/**
 * zIndex, opacity 等style 属性   的撤销与回滚操作实现
 */
export class StyleRollbackImpl extends AbstractRollback {
  redo(record: IHistoryRecord): void {
    const { next } = record
    const { movableRef } = eventOperateStore()
    const { updateLayout } = designerStore()
    if (next) updateLayout(next as IUpdStyleOperateData[])
    setTimeout(() => {
      movableRef.updateRect()
    }, 0)
  }

  undo(record: IHistoryRecord): void {
    const { prev } = record
    const { movableRef } = eventOperateStore()
    const { updateLayout } = designerStore()
    if (prev) updateLayout(prev as IUpdStyleOperateData[])
    setTimeout(() => {
      movableRef.updateRect()
    }, 0)
  }
}

const styleRollbackImpl = new StyleRollbackImpl()
export default styleRollbackImpl
