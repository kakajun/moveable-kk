<!-- 注意这里群组不能有id, 否则移动什么的都会有问题, 只能在dataset里面弄个id来区分 -->
<template>
  <!-- , { hightLight: hightLight } -->
  <div
    v-if="item.type === 'group'"
    :style="groupStyle"
    @webkitAnimationEnd="animateEnd()"
    :key="item.id"
    :data-id="item.id"
    :class="{ animated: playAnimate }"
    class="drag-component group-wrapper"
  >
    <ComponentContainer
      :isGroup="true"
      :baseLeft="item.style.left"
      :baseTop="item.style.top"
      :baseWidth="item.style.width"
      :baseHeight="item.style.height"
      :rotate="cpuRotate"
      :playAnimate="playAnimate"
      :animate="item.animate || []"
      :layerData="item.children"
    />
  </div>

  <component
    v-else
    :data-id="item.id"
    :data-group="isGroup"
    :data-type="item.type"
    :data-lock="item.config.lock"
    :data-baseLeft="baseLeft"
    :data-baseTop="baseTop"
    :data-baseWidth="baseWidth"
    :data-baseHeight="baseHeight"
    :data-rotate="rotate"
    :id="item.id"
    :baseLeft="baseLeft"
    :baseTop="baseTop"
    :baseWidth="baseWidth"
    :baseHeight="baseHeight"
    :is="componentMap[item.type]"
    :playAnimate="playAnimate"
    :animate="item.animate || []"
    :item="item"
    :class="[item.type]"
    @toggle-copy="toggleCopy"
    class="drag-component"
  />
</template>

<script setup>
import { reactive, markRaw, defineAsyncComponent } from 'vue'
import { useWidget } from '@/hooks/useWidget.js'
import ComponentContainer from './ComponentContainer.vue'

const ImageComponent = defineAsyncComponent(() => import('@/components/components/Image.vue'))
const Text = defineAsyncComponent(() => import('@/components/components/Text.vue'))
const Link = defineAsyncComponent(() => import('@/components/components/Link.vue'))
const Audio = defineAsyncComponent(() => import('@/components/components/Audio.vue'))
const Video = defineAsyncComponent(() => import('@/components/components/Video.vue'))
const Qrcode = defineAsyncComponent(() => import('@/components/components/Qrcode.vue'))
const Tel = defineAsyncComponent(() => import('@/components/components/Tel.vue'))
const Hot = defineAsyncComponent(() => import('@/components/components/Hot.vue'))
const Svg = defineAsyncComponent(() => import('@/components/components/Svg.vue'))
const props = defineProps({
  baseLeft: {
    type: Number,
    default: 0
  },
  baseTop: {
    type: Number,
    default: 0
  },
  baseWidth: {
    type: Number,
    default: 0
  },
  baseHeight: {
    type: Number,
    default: 0
  },
  rotate: {
    type: Number,
    default: 0
  },
  activeItem: {
    type: Object
  },
  propItem: {
    type: Object
  },
  animate: {
    type: Array,
    default: () => []
  },
  playAnimate: {
    type: Boolean,
    default: false
  },
  isGroup: Boolean
})
const { style, animateEnd, commonStyle } = useWidget(props)
// 计算旋转度
const cpuRotate = computed(() => {
  if (item.value.style.transform) {
    return parseFloat(item.value.style.transform.match(/rotate\(([^)]+)\)/)[1])
  }
  return 0
})
const item = computed(() => props.propItem)
const componentMap = reactive({
  image: markRaw(ImageComponent),
  text: markRaw(Text),
  link: markRaw(Link),
  audio: markRaw(Audio),
  video: markRaw(Video),
  qrcode: markRaw(Qrcode),
  tel: markRaw(Tel),
  hot: markRaw(Hot),
  svg: markRaw(Svg)
})

const hightLight = ref(false)
const mouseover = () => {
  hightLight.value = true
}
const mouseleave = () => {
  hightLight.value = false
}
const groupStyle = computed(() => {
  if (props.propItem) {
    const common = commonStyle(props.propItem, style.value)
    return {
      ...common,
      overflow: 'visible',
      borderStyle: 'none'
    }
  }
})

const toggleCopy = (flag) => {
  // doCopy = flag
}
</script>

<style lang="less" scoped></style>
