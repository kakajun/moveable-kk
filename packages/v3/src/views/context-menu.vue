<template>
  <div class=''>
    <div class="wrapper" @contextmenu="showContextmenus">右键我</div>
    <ContextMenu ref="popup" class="context-box" :data="newList" v-if="createVisible" :width="120"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }" @click="create" v-clickoutside="handleClose">
    </ContextMenu>
  </div>
</template>

<script setup >
import ContextMenu from '@/components/context-menu/index.vue'
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
const position = ref({})
const createVisible = ref(false)
const showContextmenus = (event, item) => {
  event.preventDefault();
  console.log("5555");
  position.value.x = event.pageX
  position.value.y = event.pageY
  console.log(position.value, "777");
  createVisible.value = true
  console.log(item)
}


const newList = [
  {
    id: 0,
    label: 'hahah'
  },
  {
    id: 1,
    label: 'hahah2'
  },
  {
    id: 2,
    label: 'hahah3'
  }
]
const popup = ref() // template ref

onClickOutside(popup, () => {
  console.log("clickoutside");
  createVisible.value = false
})
const create = (type) => {
  console.log("click", type);
  createVisible.value = false
}
</script>

<style  lang='less' scoped>
.wrapper {
  position: absolute;
  left: 200px;
  top: 200px;
  background: pink;
  width: 100px;
  height: 100px;
}
.context-box{
  position: absolute;
}
</style>
