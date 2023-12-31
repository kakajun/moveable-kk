<!-- 右键菜单公共组件 -->
<template>
  <div>
    <div
      :class="{
        'context-menu': true,
        'context-menu_acctive': subShow,
        'context-menu_issub': sub
      }"
      :style="{ width: `${props.width}px` }"
    >
      <div
        :class="{
          'context-menu__item': true,
          'is-disabled': item.disabled,
          'context-menu__item_active': currentIndex === index,
          is_line: item.type === 'line'
        }"
        v-for="(item, index) in filteredData"
        :key="index"
        @click="handleClick($event, item, index)"
        @mouseenter="handleEnter($event, item, index)"
        @mouseleave="handleOut"
      >
        <svg-icon :icon-class="item.icon" />
        <div class="context-menu__item-label">{{ item.label }}</div>
        <div class="context-menu__item-fast" v-if="!item.children && item.fastKey">
          {{ item.fastKey }}
        </div>
        <icon-right v-if="item.children && item.children.length > 0" />
      </div>
    </div>
    <ContextMenu
      :sub="isSub"
      :data="children"
      :width="198"
      @click="handleClickSub"
      @mouseenter="handleSubEnter"
      @mouseleave="handleOut"
      v-if="subShow && children.length > 0"
      :style="{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`
      }"
    />
  </div>
</template>

<script setup>
// 3.模板自定义名称 利用defineOptions
defineOptions({
  name: 'ContextMenu'
})
import { ref, reactive, computed } from 'vue'
const emit = defineEmits(['click'])
const props = defineProps({
  value: Boolean,
  data: {
    type: Array,
    default() {
      return []
    }
  },
  width: {
    type: Number,
    default() {
      return 105
    }
  },
  sub: {
    type: Boolean,
    default() {
      return false
    }
  }
})
const children = ref([])
const subShow = ref(false)
const position = reactive({
  x: 0,
  y: 0
})
const isSub = ref(true)
const currentIndex = ref('')
const filteredData = computed(() => {
  return props.data.filter((it) => !it.hide)
})

const handleEnter = (e, item, index) => {
  currentIndex.value = index
  if (item.children && item.children.length > 0 && !item.disabled) {
    children.value = item.children
    if (!props.sub && !subShow.value) {
      subShow.value = !subShow.value
    }
    let target = e.target
    if (e.target.className.indexOf('context-menu__item-label') > -1) {
      target = target.parentNode
    }
    let rect = target.getBoundingClientRect()
    position.x = rect.width + rect.x
    position.y = rect.y - 1
  } else {
    subShow.value = false
  }
  tid && clearTimeout(tid)
}

let tid = null
const handleOut = () => {
  tid && clearTimeout(tid)
  tid = setTimeout(() => {
    subShow.value = false
  }, 200)
}

const handleSubEnter = () => {
  tid && clearTimeout(tid)
  subShow.value = true
}

const handleClick = (e, item, index) => {
  // if (!item) {
  //   // 处理底层抛出事件
  //   emit('click', e)
  //   return
  // }
  // currentIndex.value = index
  // if (item.disabled) return
  // if (item.children && item.children.length > 0) {
  //   children.value = item.children
  //   if (!props.sub && !subShow.value) {
  //     subShow.value = !subShow.value
  //   }

  //   let target = e.target
  //   if (e.target.className.indexOf('context-menu__item-label') > -1) {
  //     target = target.parentNode
  //   }
  //   let rect = target.getBoundingClientRect()
  //   position.x = rect.width + rect.x
  //   position.y = rect.y - 1
  // } else {
  //   subShow.value = false
  //   currentIndex.value = null
  //   emit('click', item, e)
  // }
  subShow.value = false
  currentIndex.value = null
  emit('click', item, e)
}
const handleClickSub = (item, e) => {
  emit('click', item, e)
}
</script>
