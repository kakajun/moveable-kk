<template>
  <Teleport to="body">
    <ContextMenu
      ref="popup"
      class="context-box"
      :data="menuList"
      v-if="visible"
      :width="258"
      :style="{ left: `${position[0]}px`, top: `${position[1]}px` }"
      @click="handleClick"
    />
  </Teleport>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'
import useContextMenuStore from '@/store/ContextMenuStore'
import ContextMenu from '@/components/ContextMenu/index.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
const { visible, position, menuList, getPosition } = storeToRefs(useContextMenuStore())
const { updateVisible } = useContextMenuStore()

const popup = ref() // template ref
onClickOutside(popup, () => {
  updateVisible(false)
})
/**
 * @description: 点击事件
 * @param {*} item
 * @author: majun
 */
const handleClick = (item, e) => {
  const obj = getPosition.value
  console.log('obj', obj)
  item.onClick && item.onClick(obj)
  updateVisible(false)
}
</script>
<style>
.context-box {
  position: absolute;
  z-index: 999999;
}
</style>
