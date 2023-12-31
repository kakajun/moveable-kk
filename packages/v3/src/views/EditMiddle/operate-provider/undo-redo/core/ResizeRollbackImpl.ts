import AbstractRollback from './AbstractRollback'
import eventOperateStore from '@/store/EventOperateStore.js'
import { IHistoryRecord, IResizeOperateData } from '../OperateType'

export class ResizeRollbackImpl extends AbstractRollback {
  redo(record: IHistoryRecord): void {
    console.log('resize redo')
    if (!record) return
    const { movableRef, setBackoff, setTargetIds } = eventOperateStore()
    const { next } = record!
    let nextResizeData = next! as IResizeOperateData
    //选中目标元素
    setTargetIds(nextResizeData.ids)
    setBackoff(true)
    console.log('nextResizeData', nextResizeData)
    //执行反向操作
    movableRef?.request(
      'resizable',
      {
        offsetWidth: nextResizeData!.width,
        offsetHeight: nextResizeData!.height,
        direction: nextResizeData!.direction
      },
      true
    )
  }

  undo(record: IHistoryRecord): void {
    console.log('resize undo')
    if (!record) return
    const { movableRef, setBackoff, setTargetIds } = eventOperateStore()
    const { prev } = record!
    let prevResizeData = prev! as IResizeOperateData
    //选中目标元素
    setTargetIds(prevResizeData.ids)
    setBackoff(true)
    console.log('prevResizeData', prevResizeData)
    //执行反向操作
    movableRef?.request(
      'resizable',
      {
        offsetWidth: prevResizeData!.width,
        offsetHeight: prevResizeData!.height,
        direction: prevResizeData!.direction
      },
      true
    )
  }
}

const resizeRollbackImpl = new ResizeRollbackImpl()
export default resizeRollbackImpl
