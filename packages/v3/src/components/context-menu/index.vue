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
          'context-menu__item_active': currentIndex === index
        }"
        v-for="(item, index) in filteredData"
        :key="index"
        @click="handleClick($event, item, index)"
      >
        <div class="context-menu__item-label">{{ item.label }}</div>
        <i
          class="el-icon-arrow-right"
          v-if="item.children && item.children.length > 0"
        ></i>
      </div>
    </div>
    <ContextMenu
      :sub="isSub"
      :data="children"
      @click="handleClick"
      v-if="subShow && children.length > 0"
      :style="{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`
      }"
    ></ContextMenu>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted,computed} from 'vue';
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
    }})

const children = ref([]);
const subShow = ref(false);
const position = reactive({
  x: 0,
  y: 0
});
onMounted(() => {
  console.log(props.data,"6666");
})

const isSub = ref(true);
const currentIndex = ref('');
const filteredData = computed(() => {
  return props.data.filter(it => !it.hide);
});

const handleClick = (e, item, index) => {
  currentIndex.value = index;
  if (item.disabled) return;
  if (item.children && item.children.length > 0) {
    children.value = item.children;
    subShow.value = !subShow.value;
    let target = e.target;
    if (e.target.className.indexOf('context-menu__item-label') > -1) {
      target = target.parentNode;
    }
    let rect = target.getBoundingClientRect();
    position.x = rect.width + rect.x;
    position.y = rect.y - 1;
  } else {
    currentIndex.value = null;
    emit('click', item);
  }
};
</script>
