import { defineStore } from 'pinia'

/**
 * 右键操作菜单的状态管理类。
 */
export const useContextMenuStore = defineStore('contextMenu', {
  state: () => ({
    visible: false,
    position: [100, 100],
    mouseDownTime: 0,
    mouseUpTime: 0,
    menuList: [] // 右键菜单列表
  }),
  getters: {
    getPosition(state) {
      return {
        clientX: state.position[0],
        clientY: state.position[1]
      }
    }
  },
  actions: {
    setMenuList(list) {
      this.menuList = list
    },
    updateVisible(visible) {
      this.visible = visible
    },
    setPosition(position) {
      this.position = position
    },
    setMouseDownTime(time) {
      this.mouseDownTime = time
    },
    setMouseUpTime(time) {
      this.mouseUpTime = time
    }
  }
})
export default useContextMenuStore
