import { defineStore } from 'pinia'
const useStore = defineStore('store', {
  state: () => ({
    canvasBg: localStorage.getItem('canvasBg') || '#f1f3f4', // 画布背景颜色
    bookData: {},
    padding: 24, // 画布内边距
    paddingTop: 0, // 画布上边距
    currentPageId: undefined,
    currentMenu: 'page',
    currentTab: 'style',
    playAnimate: false,
    saveing: false,
    zoom: 1, // 缩放比
    dAltDown: false, // 记录是否按下alt键 / 或ctrl
    guidelines: {
      verticalGuidelines: [0, '50%', '100%'],
      horizontalGuidelines: [0, '50%', '100%']
    },
    openGuide: false,
    maskCutVisiable: false, // 遮罩裁剪弹窗显示隐藏
    fastKeyVisiable: false, // 快捷键弹窗的显示隐藏
    isEditWidght: false, // 是否正在编辑组件 正在编辑时，不执行 delete的快捷
    refreshHistoryVersion: 0
  }),
  getters: {
    pageTop(state) {
      return state.paddingTop
    },
    pageZoom(state) {
      return state.zoom
    },
    totalPage(state) {
      if (state.bookData.pages) {
        return state.bookData.pages.length
      } else {
        return 0
      }
    },
    pageList(state) {
      if (state.bookData.pages) {
        return state.bookData.pages
      } else {
        return []
      }
    },
    currentPage(state) {
      if (state.pageList.length) {
        return state.pageList.find((item) => item.id === state.currentPageId)
      } else {
        return {}
      }
    },
    getGuidelines(state) {
      return state.guidelines
    },
    getCurrentPageId(state) {
      return state.currentPageId
    },
    getDAltDown(state) {
      return state.dAltDown
    },
    pageBookData(state) {
      return state.bookData
    }
  },
  actions: {
    updatePaddingTop(top) {
      this.paddingTop = top
    },
    updateIsEditWidght(payload) {
      this.isEditWidght = payload || !this.isEditWidght
    },
    updateFastKeyVisiable(payload) {
      this.fastKeyVisiable = payload || !this.fastKeyVisiable
    },
    updateMaskCutVisiable(payload) {
      this.maskCutVisiable = payload
    },
    updateCanvasBg(payload) {
      this.canvasBg = payload
      localStorage.setItem('canvasBg', payload)
    },
    updateCurrentMenu(currentMenu) {
      this.currentMenu = currentMenu
    },
    updateCurrentTab(currentTab) {
      this.currentTab = currentTab
    },
    updateSaveing(flag) {
      this.saveing = flag
    },
    updateBookData(bookData = {}) {
      this.bookData = bookData
    },
    updateImg(pageId, img) {
      const data = this.bookData.pages
      data.forEach((item) => {
        if (item.id === pageId) {
          item.cover_url = img
        }
      })
    },
    updateAltDown(value) {
      this.dAltDown = value
    },
    choosePage(pageId = undefined) {
      this.currentPageId = pageId
      this.currentTab = 'page'
    },
    chooseWidget(widgetId = undefined) {
      this.currentTab = 'style'
    },
    updateZoom(payload) {
      this.zoom = payload
    },

    updateOpenGuide() {
      this.openGuide = !this.openGuide
    },
    updateGuidelines(lines) {
      // 修改标尺线
      this.guidelines = { ...this.guidelines, ...lines }
    },
    updateRefreshHistoryVersion() {
      this.refreshHistoryVersion += 1 // 通知 右侧的版本 页面刷新接口
    }
  }
})

export default useStore
