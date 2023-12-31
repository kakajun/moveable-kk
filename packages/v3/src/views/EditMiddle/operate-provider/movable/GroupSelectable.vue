<template>
  <Selecto
    ref="selectorRef"
    :dragContainer="'.view-box'"
    :selectableTargets="['.drag-component']"
    :hitRate="0"
    :selectByClick="true"
    :selectFromInside="true"
    :toggleContinueSelect="['ctrl']"
    :ratio="0"
    @drag-start="onDragStart"
    @select-end="onSelectEnd"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Selecto from '@/components/moveable/Selecto.vue'
import eventOperateStore from '@/store/EventOperateStore.js'
import designerStore from '@/store/DesignerStore.js'
import LayerUtil from '@/util/LayerUtil.js'
import { setControlPointLineColor } from '@/util/DesignerUtils'
const { setTargetIds } = eventOperateStore()
const selectorRef = ref(null)

onMounted(() => {
  const { setSelectorRef } = eventOperateStore()
  setSelectorRef(selectorRef.value)
})

const onSelectEnd = (e) => {
  // debugger
  let { selected } = e
  const { movableRef } = eventOperateStore()
  if (!movableRef) return
  //如果为拖拽，则将当前的整个dom事件传递给movable，确保选中元素后可以立马拖拽
  if (e.isDragStart) {
    e.inputEvent.preventDefault()
    setTimeout(() => {
      //使用异步操作，确保在拖拽前已经给movable传递target
      movableRef.dragStart(e.inputEvent)
    })
  }
  // debugger

  const { layerConfigs } = designerStore()
  let layerIds = selected.map((item) => item.id)
  if (layerIds.length === 1) {
    //点选
    const parent = layerConfigs[layerIds[0]]?.parent
    if (!parent) {
      //普通图层--不管是否锁定，都可以选中
    } else {
      //分组图层--选中这个分组下的所有未锁定、未隐藏的组件
      layerIds = LayerUtil.findAllChildLayerBySubId(layerIds)
    }
  } else if (layerIds.length > 1) {
    /**
     * 框选
     * 框选多个组件时，不能同时包含锁定和非锁定的组件。在同时包含锁定和未锁定状态下的组件时，只选中未锁定状态的组件。
     * 对于框选组件中存在分组的。 要选中分组内的所有相同锁定状态的组件。
     */
    let allChildLayerId = LayerUtil.findAllChildLayerBySubId(layerIds, true)
    //过滤非锁定的组件, 有的组件 layerConfigs[id].config.lock 为undefined
    layerIds = allChildLayerId.filter((id) => {
      return !layerConfigs[id]?.config.lock
    })
  }
  let lockState = !!layerConfigs[layerIds[0]]?.config.lock
  //更新选中的组件id
  setTargetIds(layerIds)
  //更新选中组件的边框颜色（锁定状态组件为红色，非锁定状态组件为蓝色）
  setControlPointLineColor(lockState)
}

const onDragStart = (e) => {
  const { movableRef, targets } = eventOperateStore()
  const target = e.inputEvent.target
  if (
    movableRef.isMoveableElement(target) ||
    targets.some((t) => t === target || t.contains(target))
  ) {
    e.stop()
  }
}
</script>
