<template>
   <div  @mousedown="onMouseDownItem(item)"     v-for="(item, index) in componentSlist"
                :key="index" :class="'target ' + item.id" :id='item.id' :style="getStyle(item)">
                {{ item.id }}
            </div>
</template>

<script setup>
const props=defineProps({
  componentSlist:Array,
  activeItem:Object
})
const emit=defineEmits(['update:activeItem'])
const onMouseDownItem = item => {
    console.log("onMouseDownItem");
    emit('update:activeItem', item)
}

const getStyle = (item) => {
    const { width, height, rotate, transform, top, left } = item.style
    return `width:${width}px;height:${height}px;transform:${transform};top:${top}px;left:${left}px;transform:rotate(${rotate}deg);`
}
</script>

<style  lang='less' scoped>
.target {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 150px;
    left: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}

</style>
