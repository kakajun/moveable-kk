import AbstractRollback from './AbstractRollback'
import { IHistoryRecord, IOrderOperateData } from '../OperateType'
import designerStore from '@/store/DesignerStore'
import eventOperateStore from '@/store/EventOperateStore'

/**
 * 所有属性撤销与回滚操作实现
 */
export class OrderRollBackImpl extends AbstractRollback {
  redo(record: IHistoryRecord): void {
    const { next } = record
    const { movableRef } = eventOperateStore()
    const { updateLayout } = designerStore()
    if (next) updateLayout(next as IOrderOperateData[])
      setTimeout(() => {
        movableRef.updateRect()
      }, 0)

  }

  undo(record: IHistoryRecord): void {
    const { prev } = record
    const { movableRef } = eventOperateStore()
    const { updateLayout } = designerStore()
    if (prev) updateLayout(prev as IOrderOperateData[])
    setTimeout(() => {
      movableRef.updateRect()
    }, 0)
  }
}

const orderRollBackImpl = new OrderRollBackImpl()
export default orderRollBackImpl
