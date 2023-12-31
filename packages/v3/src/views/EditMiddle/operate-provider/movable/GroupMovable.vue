<template>
  <Moveable
    ref="movableRef"
    :target="targets"
    :draggable="draggable"
    :scalable="scalable"
    :resizable="resizable"
    :rotatable="rotatable"
    :keepRatio="keepRatio"
    rotationPosition="bottom"
    :zoom="0.8"
    :style="{ zIndex: 1000 }"
    :renderDirections="renderDirections"
    className="zk-moveable-style"
    :maxSnapElementGuidelineDistance="300"
    :snappable="true"
    :snapGap="true"
    :snapThreshold="5"
    :isDisplaySnapDigit="true"
    :snapDirections="snapDirections"
    :elementSnapDirections="elementSnapDirections"
    :verticalGuidelines="verticalGuidelines"
    :horizontalGuidelines="horizontalGuidelines"
    :isDisplayInnerSnapDigit="true"
    @change-targets="onChangeTargets"
    :elementGuidelines="elementGuidelines"
    :throttleDrag="rasterize ? dragStep : 1"
    :throttleResize="rasterize ? resizeStep : 1"
    @resize="onResize"
    @resize-group="onResizeGroup"
    @drag-start="onDragStart"
    @drag-group-start="onDragGroupStart"
    @resize-start="onResizeStart"
    @resize-end="onResizeEnd"
    @resize-group-start="resizeGroupStart"
    @resize-group-end="onResizeGroupEnd"
    @drag-end="onDragEnd"
    @drag-group-end="onDragGroupEnd"
    @scale-group-end="onScaleGroupEnd"
    @rotate-end="onRotateEnd"
    @rotate-group-end="onRotateGroupEnd"
    @render="onRender"
    @render-group="onRenderGroup"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import designerStore from '@/store/DesignerStore.js'
import Moveable from '@/components/moveable/Moveable.vue'
import useStore from '@/stores/store.js'
import historyRecordOperateProxy, { getPos, reallPos } from '../undo-redo/HistoryRecordOperateProxy'
import eventOperateStore from '@/store/EventOperateStore.js'
import { storeToRefs } from 'pinia'
import useResize from './useResize'
const {
  updateLayout,
  canvasConfig: { rasterize, dragStep, resizeStep }
} = designerStore()
const store = useStore()
const { getGuidelines } = storeToRefs(store)
const verticalGuidelines = ref([])
const horizontalGuidelines = ref([])
const movableRef = ref(null)
const draggable = ref(true)
const elementGuidelines = ref([])
const scalable = ref(true)
const rotatable = ref(true)
const resizable = ref(true)
const renderDirections = ref(['n', 'nw', 'ne', 's', 'se', 'sw', 'e', 'w'])
const { targets, currentWidget } = storeToRefs(eventOperateStore())
const {
  keepRatio,
  snapDirections,
  elementSnapDirections,
  onResize,
  onResizeStart,
  onResizeEnd,
  resizeGroupStart,
  onResizeGroup,
  onResizeGroupEnd
} = useResize()

onMounted(() => {
  elementGuidelines.value = getAllDoms()
  const { setMovableRef } = eventOperateStore()
  setMovableRef(movableRef.value)
})
watch(
  () => currentWidget.value,
  (obj) => {
    if (obj) {
      const lock = obj.config?.lock || false
      draggable.value = !lock
      scalable.value = !lock
      rotatable.value = !lock
      switch (obj.type) {
        case 'tel':
        case 'link':
        case 'text':
          renderDirections.value = ['e', 'se']
          break
        case 'svg':
        case 'image':
        case 'video':
          renderDirections.value = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']
          break
        default:
          renderDirections.value = ['nw', 'ne', 'sw', 'se']
          break
      }
    }
  },
  { deep: true }
)

watch(
  () => getGuidelines.value,
  (lines) => {
    verticalGuidelines.value = lines.verticalGuidelines
    horizontalGuidelines.value = lines.horizontalGuidelines
  }
)

/**
 * @description: 获取所有元素
 * @author: majun
 */
const getAllDoms = () => {
  const selectedTargets = document.getElementsByClassName('drag-component')
  return [document.getElementsByClassName('canvas')[0], ...Array.from(selectedTargets)]
}

/**
 * @description: 切换选择目标后
 * @param {*} e
 * @author: majun
 */
const onChangeTargets = (e) => {
  console.log(e.targets, 'e.targets.length')
  const { isGroup, targetIds, currentWidget } = eventOperateStore()
  const allDoms = getAllDoms()
  console.log(targetIds, 'targetIds')
  if (isGroup) {
    // 群组要过滤掉自己所有的儿子
    let filters = [...targetIds, currentWidget.id]
    console.log(allDoms, 'allDoms')
    elementGuidelines.value = allDoms.filter((item) => {
      return !filters.includes(item.dataset?.id)
    })
  }
  if (e.targets.length == 1) {
    resizable.value = true
    // 目标变化后要过滤掉自己,否则会产生对标原来自己位置的bug
    elementGuidelines.value = allDoms.filter((item) => e.targets[0] != item)
    store.updateCurrentTab('style')
  } else if (e.targets.length > 1) {
    // 只要是多选, 那么都是按比例缩放
    resizable.value = false
    store.updateCurrentTab('style')
  } else {
    resizable.value = false
    store.updateCurrentTab('page')
  }
}
/* ***************************************drag******************************************************* */
/**
 * @description: 单个元素拖拽结束
 * @param {*} e
 * @author: majun
 */
const onDragEnd = (e) => {
  console.log(e, 'onDragEnd')
  const { backoff, setBackoff } = eventOperateStore()
  const { lastEvent, target } = e
  if (lastEvent) {
    const { left, top } = lastEvent
    const data = [
      {
        id: target.id,
        type: target.dataset.type,
        style: {
          width: target.offsetWidth,
          height: target.offsetHeight,
          left,
          top
        }
      }
    ]
    //更新组件位置信息
    if (backoff) {
      updateLayout(data, false)
      setBackoff(false)
    } else historyRecordOperateProxy.doDrag(data)
  }
}

const onDragGroupStart = (e) => {
  console.log(e, 'onDragGroupStart')
  e.events.forEach((ev) => {
    onDragStart(ev)
  })
}
const onDragStart = (e) => {
  // console.log(e, 'onDragStart')
  const { target } = e
  const lock = e.target.dataset.lock
  console.log('lock===>', lock)
  if (target) {
    const { style } = target
    style.baseStartLeft = parseFloat(style.left.replace('px', ''))
    style.baseStartTop = parseFloat(style.top.replace('px', ''))
  }
}
/**
 * @description: 群组拖拽
 * @param {*} e
 * @author: majun
 */
const onDragGroupEnd = (e) => {
  console.log('onDragGroupEnd')
  const { backoff, setBackoff, setGroupCoordinate, groupCoordinate } = eventOperateStore()
  const data = []
  const { pageZoom } = useStore()
  const posChange = e?.lastEvent?.beforeTranslate || [0, 0]
  const minX = groupCoordinate.minX + posChange[0] / pageZoom
  const minY = groupCoordinate.minY + posChange[1] / pageZoom
  setGroupCoordinate({ minX, minY })
  if (e.lastEvent) {
    const { left: disLeft, top: disTop } = e.lastEvent
    e.events.forEach((ev) => {
      const { target, lastEvent } = ev
      if (lastEvent) {
        console.log(lastEvent, 'lastEvent')
        const { left, top } = lastEvent // 移动后的差量x,y
        const baseStartTop = target.style.baseStartTop
        const baseStartLeft = target.style.baseStartLeft
        const isGroup = target.dataset.group === 'true'
        const baseleft = parseFloat(target.dataset.baseleft) // 旋转前的左上角left定位
        const basetop = parseFloat(target.dataset.basetop) // 旋转前的左上角top定位
        // 原始位置+差量
        const adjustedLeft = baseStartLeft + disLeft / pageZoom
        const adjustedTop = baseStartTop + disTop / pageZoom
        const newLeft = isGroup ? baseleft + adjustedLeft : baseleft + left
        const newTop = isGroup ? basetop + adjustedTop : basetop + top
        const style = {
          left: newLeft,
          top: newTop
        }
        data.push({
          id: target.id,
          name: target.dataset.type,
          style
        })
      }
    })
    if (data.length > 0) {
      if (backoff) {
        updateLayout(data, false)
        setBackoff(false)
      } else {
        historyRecordOperateProxy.doDrag(data)
      }
    }
  }
}

/* ***************************************Rotate************************************************************* */
/**
 * @description: 单个旋转
 * @param {*} e
 * @author: majun
 */
const onRotateEnd = (e) => {
  // console.log(e, 'onRotateEnd')
  const { backoff, setBackoff } = eventOperateStore()
  const { lastEvent, target } = e
  if (lastEvent) {
    const { rotate } = lastEvent
    const data = [
      {
        id: target.id,
        type: target.dataset.type,
        style: {
          rotate
        }
      }
    ]
    //更新组件位置信息
    if (backoff) {
      updateLayout(data, false)
      setBackoff(false)
    } else historyRecordOperateProxy.doRotate(data)
  }
}

/**
 * @description: 群组旋转
 * @param {*} e
 * @author: majun
 */
const onRotateGroupEnd = (e) => {
  const { backoff, setBackoff, setGroupCoordinate, groupCoordinate } = eventOperateStore()
  const { layerConfigs } = designerStore()
  console.log(e, 'eeee')
  const beforeRotate = e?.lastEvent?.beforeRotate || 0
  const oldrotate = groupCoordinate.rotate
  setGroupCoordinate({ rotate: beforeRotate })
  console.log(beforeRotate, 'beforeRotate')
  const target = e.events[0].target
  const tarObj = layerConfigs[target.id]
  if (tarObj) {
    let data = []
    e.events.forEach((ev) => {
      const { target, lastEvent } = ev
      const baseleft = parseFloat(target.dataset.baseleft) // 旋转前的左上角left定位
      const basetop = parseFloat(target.dataset.basetop) // 旋转前的左上角top定位
      const isGroup = target.dataset.group === 'true'
      if (lastEvent) {
        const {
          transform,
          beforeRotate,
          drag: { left, top }
        } = lastEvent
        console.log(lastEvent, 'left, top')
        data.push({
          id: target.id,
          type: target.dataset.type,
          style: {
            left: isGroup ? baseleft + left : left,
            top: isGroup ? basetop + top : top,
            rotate: beforeRotate,
            transform
          }
        })
      }
    })
    if (!e.lastEvent) return
    console.log(data, 'onRotateGroupEnd')
    //更新组件位置信息并记录操作
    if (data.length > 0) {
      if (backoff) {
        updateLayout(data, false)
        setBackoff(false)
      } else historyRecordOperateProxy.doRotate(data, oldrotate)
    }
  } else {
    console.error('tarObj没有找到!')
  }
}

/**
 * @description: 同比缩放,群组一定会走这里
 * @param {*} e
 * @author: majun
 */
const onScaleGroupEnd = (e) => {
  console.log(e, 'onScaleGroupEnd')

  const scales = e?.lastEvent?.scale || [1, 1]
  const { pageZoom } = useStore()
  const { movableRef } = eventOperateStore()
  const { layerConfigs } = designerStore()
  const moveables = movableRef.getMoveables()
  const datas = []
  moveables.forEach((child) => {
    const rect = child.getRect()
    const { origin, offsetWidth, offsetHeight } = rect
    console.log(rect, 'rect')
    const [originX, originY] = origin
    const originalWidth = offsetWidth * scales[0] * pageZoom
    const originalHeight = offsetHeight * scales[1] * pageZoom

    // 直接就是旋转中心点进行计算,定位就是中心点减去宽高的一半
    const actualLeft = originX - originalWidth / 2
    const actualTop = originY - originalHeight / 2
    const { style } = layerConfigs[child._dragTarget.id]
    datas.push({
      id: child._dragTarget.id,
      style: {
        left: getPos(actualLeft),
        top: getPos(actualTop),
        fontSize: style.fontSize * scales[0],
        width: originalWidth / pageZoom,
        height: originalHeight / pageZoom
      }
    })
  })
  historyRecordOperateProxy.doStyleUpd(datas)
}
/**
 * @description: 组的渲染走这里
 * @param {*} e
 * @author: majun
 */
const onRenderGroup = (e) => {
  e.events.forEach((ev) => {
    ev.target.style.cssText += ev.cssText
    // console.log(ev.cssText, 'ev.cssText')
  })
}
/**
 * @description: 单个元素渲染走这里
 * @param {*} e
 * @author: majun
 */
const onRender = (e) => {
  e.target.style.cssText += e.cssText
}
</script>

<style lang="less">
.moveable-control-box.zk-moveable-style {
  --moveable-color: #6ccfff;
  --guideline-color: #ff4aff;
  z-index: 999;
  .moveable-origin {
    display: none !important;
  }
  // 缩放圆点
  .moveable-control {
    background-color: #fff !important;
    box-sizing: border-box;
    display: block;
    border: 1px solid #c0c5cf;
    box-shadow: 0 0 2px 0 rgb(86, 90, 98, 0.2);
    width: 12px;
    height: 12px;
    margin-top: -6px;
    margin-left: -6px;

    // 上下缩放点
    &.moveable-n,
    &.moveable-s {
      width: 16px;
      height: 8px;
      margin-top: -4px;
      margin-left: -8px;
      border-radius: 6px;
    }

    // 左右缩放点
    &.moveable-e,
    &.moveable-w {
      width: 8px;
      height: 16px;
      margin-left: -4px;
      margin-top: -8px;
      border-radius: 6px;
    }
  }

  // 旋转按钮
  .moveable-rotation {
    width: 0;
    height: 25px;
    display: block;

    .moveable-rotation-control {
      border: none;
      background-image: url('@/assets/images/rotation-icon.svg');
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
      display: block;
      margin-left: -11px;
    }
    // 旋转的操作条
    .moveable-rotation-line {
      display: none;
    }
  }

  &.moveable-dragging {
    .moveable-line.moveable-guideline.moveable-horizontal.moveable-bold {
      height: 1px;
      background: var(--guideline-color);

      &.moveable-target {
        background: var(--moveable-color);
      }
    }

    .moveable-line.moveable-guideline.moveable-vertical.moveable-bold {
      width: 1px;
      background: var(--guideline-color);

      &.moveable-target {
        background: var(--moveable-color);
      }
    }

    .moveable-line.moveable-dashed.moveable-horizontal {
      border-top-color: var(--guideline-color);
    }

    .moveable-line.moveable-dashed.moveable-vertical {
      border-left-color: var(--guideline-color);
    }
  }
}
</style>
