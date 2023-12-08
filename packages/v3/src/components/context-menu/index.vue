<template>
  <div>
    <div
      :class="{
        'context-menu': true,
        'context-menu_acctive': subShow,
        'context-menu_issub': sub
      }"
      :style="{ width: `${width}px` }"
    >
      <div
        :class="{
          'context-menu__item': true,
          'is-disabled': item.disabled,
          'context-menu__item_active': currentIndex === index
        }"
        v-for="(item, index) in data.filter(it => !it.hide)"
        :key="index"
        @click="hander($event, item, index)"
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
      @click="data => $emit('click', data)"
      v-if="subShow && children.length > 0"
      :style="{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`
      }"
    ></ContextMenu>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
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
  },
  data() {
    return {
      children: [],
      subShow: false,
      position: {
        x: 0,
        y: 0
      },
      isSub: true,
      currentIndex: ''
    }
  },
  methods: {
    /**
     * @desc: 点击
     * @author: wenrun
     * @param {*} e
     * @param {*} item
     * @param {*} index
     */
    hander(e, item, index) {
      this.currentIndex = index
      if (item.disabled) return
      if (item.children && item.children.length > 0) {
        this.children = item.children
        this.$set(this, 'subShow', !this.subShow)
        let target = e.target
        if (e.target.className.indexOf('context-menu__item-label') > -1) {
          target = target.parentNode
        }
        let rect = target.getBoundingClientRect()
        this.position.x = rect.width + rect.x
        this.position.y = rect.y - 1
      } else {
        this.currentIndex = null
        this.$emit('click', item)
      }
    }
  }
}
</script>

