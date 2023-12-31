<template>
  <ComponentContainerItem
    :baseLeft="baseLeft"
    :baseTop="baseTop"
    :baseWidth="baseWidth"
    :baseHeight="baseHeight"
    :rotate="rotate"
    v-for="item in layerData"
    :key="item.id"
    :playAnimate="playAnimate"
    :animate="item.animate || []"
    :isGroup="isGroup"
    :propItem="item"
  />
</template>

<script setup>
import ComponentContainerItem from './ComponentContainerItem.vue'
import { storeToRefs } from 'pinia'
import useStore from '@/stores/store.js'
const store = useStore()
const { playAnimate } = storeToRefs(store)
const props = defineProps({
  baseLeft: Number,
  baseTop: Number,
  baseWidth: {
    type: Number,
    default: 0
  },
  baseHeight: {
    type: Number,
    default: 0
  },
  rotate: Number,
  layerData: {
    type: Array
  },
  propItem: {
    type: Array
  },
  animate: {
    type: Array,
    default: () => []
  },
  isGroup: Boolean
})
</script>
