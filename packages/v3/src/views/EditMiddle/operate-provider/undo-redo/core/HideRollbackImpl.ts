import AbstractRollback from './AbstractRollback'
import { IHideOperateData, IHistoryRecord } from '../OperateType'
import { ref, Component } from 'vue'
import designerStore from '@/store/DesignerStore'

import layerListStore from '@/store/LayerListStore'

/**
 * hide, lock, order的撤销与回滚操作实现
 */
export class HideRollbackImpl extends AbstractRollback {
  redo(record: IHistoryRecord): void {
    if (!record) return
    const { next } = record
    const { updateLayout } = designerStore()
    if (next) updateLayout(next as IHideOperateData[])
    const { visible, layerInstances } = layerListStore()
    if (visible) {
      //图层列表若显示，则需要更新图层列表的组件状态
      ;(next as IHideOperateData[])?.forEach((item) => {
        const { id, hide } = item
        ;(layerInstances[id] as Component).ctx.emit('update:hide', hide)
      })
    }
  }

  undo(record: IHistoryRecord): void {
    if (!record) return
    const { prev } = record
    const { updateLayout } = designerStore()
    if (prev) updateLayout(prev as IHideOperateData[])
    const { visible, layerInstances } = layerListStore()
    if (visible) {
      //图层列表若显示，则需要更新图层列表的组件状态
      ;(prev as IHideOperateData[])?.forEach((item) => {
        const { id, hide } = item
        ;(layerInstances[id] as Component).ctx.emit('update:hide', hide)
      })
    }
  }
}

const hideRollbackImpl = new HideRollbackImpl()
export default hideRollbackImpl
