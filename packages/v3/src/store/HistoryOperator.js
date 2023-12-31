import { defineStore } from 'pinia'

const MAX_LIMIT = 50 //最大限制点
const useHistoryQueue = defineStore('historyQueue', {
  state: () => ({
    undoStack: [],
    rollbackStack: []
  }),
  actions: {
    put(data) {
      //当可撤销栈的大小大于最大的限制的话
      //那么需要删除头结点
      if (this.undoStack.length >= MAX_LIMIT) {
        this.undoStack.shift()
      }
      this.undoStack.push(data)
      this.rollbackStack = []
    },
    backoff() {
      if (this.undoStack.length === 0) return
      const data = this.undoStack.pop()
      this.rollbackStack.push(data)
      return data
    },
    forward() {
      if (this.rollbackStack.length === 0) return
      const data = this.rollbackStack.pop()
      this.undoStack.push(data)
      return data
    }
  },
  getters: {
    disabledUnRedo() {
      return this.undoStack.length === 0
    },
    disabledRedo() {
      return this.rollbackStack.length === 0
    }
  }
})

export default useHistoryQueue
