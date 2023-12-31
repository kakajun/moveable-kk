/* resize 的所有方法
 */
import { ref } from 'vue'
import historyRecordOperateProxy from '../undo-redo/HistoryRecordOperateProxy'
import eventOperateStore from '@/store/EventOperateStore.js'
import designerStore from '@/store/DesignerStore.js'
import useStore from '@/stores/store.js'
const { updateLayout } = designerStore()
// const { setGroupCoordinate } = eventOperateStore()
export default function useResize() {
  const keepRatio = ref(true)
  const onResize = (e) => {
    // console.log(e, 'onResize')
    const {
      target: { style, dataset },
      width,
      direction
    } = e
    const type = dataset.type
    if (type === 'text' || type === 'link' || type === 'tel') {
      if (keepRatio.value === true) {
        style.resetRatio = width / style.resizeStartWidth
        style.fontSize = style.starFontSize * style.resetRatio + 'px'
        style.letterSpacing = style.startLS * style.resetRatio + 'px'
        style.lineHeight = style.startHL * style.resetRatio + 'px'
      }
      style.backgroundImage = 'none'
    }
  }

  // resizeStart
  const onResizeStart = (args) => {
    const type = args.target.dataset.type
    const direction = String(args.direction)
    const style = args.target.style
    const lock = args.target.dataset.lock
    if (lock === 'true') {
      args.stop()
      return
    }
    const dirs = ['1,1', '-1,1', '-1,-1', '1,-1'] // 四个角 resize的时候
    if (type === 'text' || type === 'link' || type === 'tel') {
      if (direction === '1,1') {
        keepRatio.value = true
      } else {
        keepRatio.value = false
      }
      if (keepRatio.value === true) {
        style.resizeStartWidth = args.target.offsetWidth
        style.startHL = Number(style.lineHeight.replace('px', ''))
        style.startLS = Number(style.letterSpacing.replace('px', ''))
        style.resetRatio = 1
        style.starFontSize = Number(style.fontSize.replace('px', ''))
      }
    } else if (['svg', 'image', 'video'].includes(type)) {
      if (dirs.includes(direction)) {
        keepRatio.value = true
      } else {
        keepRatio.value = false
      }
    } else if (type === 'qrcode') {
      keepRatio.value = true
    }
  }

  const onResizeEnd = (e) => {
    // console.log(e, 'onResizeEnd')
    const { backoff, setBackoff, movableRef } = eventOperateStore()
    const { target, lastEvent } = e
    const { style } = target
    if (lastEvent) {
      const {
        width,
        height,
        drag: { left, top },
        direction
      } = lastEvent
      const data = [
        {
          id: target.id,
          type: target.dataset.type,
          style: {
            fontSize: Number(style.fontSize.replace('px', '')),
            width,
            height,
            left,
            top
          }
        }
      ]
      if (backoff) {
        updateLayout(data, false)
        setBackoff(false)
      } else historyRecordOperateProxy.doResize(data, direction)
    }
    keepRatio.value = true
    // console.log('movableRef=>', movableRef)
  }

  const resizeGroupStart = (e) => {
    // console.log(e, '55555')
    e.events.forEach((ev) => {
      onResizeStart(ev)
    })
  }

  const onResizeGroup = (e) => {
    e.events.forEach((ev) => {
      onResize(ev)
    })
  }
  /**
   * @description: 群组缩放,已废弃,因为群组走 onScaleGroupEnd 方法
   * @param {*} e
   * @author: majun
   */
  const onResizeGroupEnd = (e) => {
    const { backoff, setBackoff, groupCoordinate } = eventOperateStore()
    const data = []
    console.error('这个方法已废弃,查查为什么resizable.value是不是赋值有误')
    console.log(e, 'onResizeGroupEnd')
    e.events.forEach((ev) => {
      const { target, lastEvent } = ev
      if (lastEvent) {
        console.log(lastEvent, 'lastEvent')
        const {
          drag: { left, top }
        } = lastEvent
        data.push({
          id: target.id,
          type: target.dataset.type,
          style: {
            fontSize: Number(target.style.fontSize.replace('px', '')),
            width: target.offsetWidth,
            height: target.offsetHeight,
            left: left + groupCoordinate.minX,
            top: top + groupCoordinate.minY
          }
        })
      }
    })
    if (!e.lastEvent) return
    const { dist, direction } = e.lastEvent
    const { pageZoom } = useStore()
    //更新组件尺寸和坐标信息
    if (data.length > 0) {
      //组件多选情况下，重新计算多选组件的尺寸和坐标信息
      const { setGroupCoordinate, groupCoordinate } = eventOperateStore()
      if (direction[0] === -1 || direction[1] === -1) {
        //缩放元素左侧或上侧，此时需要同时改变坐标
        setGroupCoordinate({
          minX: groupCoordinate.minX - dist[0] / pageZoom,
          minY: groupCoordinate.minY - dist[1] / pageZoom,
          groupWidth: groupCoordinate.groupWidth + dist[0] / pageZoom,
          groupHeight: groupCoordinate.groupHeight + dist[1] / pageZoom
        })
      } else {
        setGroupCoordinate({
          groupWidth: groupCoordinate.groupWidth + dist[0] / pageZoom,
          groupHeight: groupCoordinate.groupHeight + dist[1] / pageZoom
        })
      }

      if (backoff) {
        updateLayout(data, false)
        setBackoff(false)
      } else historyRecordOperateProxy.doResize(data, direction)
    }
    keepRatio.value = true
  }

  const snapDirections = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    center: true,
    middle: true
  }
  const elementSnapDirections = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    center: true,
    middle: true
  }
  return {
    keepRatio,
    snapDirections,
    elementSnapDirections,
    onResize,
    onResizeStart,
    onResizeEnd,
    resizeGroupStart,
    onResizeGroup,
    onResizeGroupEnd
  }
}
