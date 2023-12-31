import { defineStore } from 'pinia'
import { isEqual, cloneDeep } from 'lodash'
import historyRecordOperateProxy from '@/views/EditMiddle/operate-provider/undo-redo/HistoryRecordOperateProxy'
import ObjectUtil from '@/util/ObjectUtil'
import useStore from '@/stores/store.js'
import { doSave } from '@/views/EditMiddle/operate-provider/hot-key/HotKeyImpl'
import { oneGroupCoordinate } from '@/util/DesignerUtils'
/**
 * 解析函数
 */
const parser = (layerMap) => {
  console.log('解析函数')
  layerMap = cloneDeep(layerMap)
  let sourceLayerArr = Object.values(layerMap).sort((a, b) => b - a)
  // 构建树结构
  const resData = []
  for (const layerItem of sourceLayerArr) {
    if (!layerItem?.parent) {
      // 根节点
      resData.push(layerItem)
    } else {
      // 非根节点，将其加入父节点的 children 中
      const parent = layerMap[layerItem.parent]
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(layerItem)
      }
    }
  }
  return resData
}

/**
 * @description:TODO 字段兼容代码, 后期这部分代码会被清理
 * @author: majun
 */
function compatible(obj) {
  if (obj.parent === '-1') {
    delete obj.parent
  }
  if (!obj.style) {
    obj.style = {}
  }
  if (!obj.style.boxshadowType) {
    obj.style.boxshadowType = 'none'
  }
  if (!obj.componentData) {
    obj.componentData = {}
  }
  if (obj.type === 'text') {
    if (obj.text) {
      obj.componentData.data = obj.text
      delete obj.text
    }
  }
  if (obj.type === 'link') {
    if (obj.text) {
      obj.componentData.data = obj.text
      obj.componentData.link = obj.link
      delete obj.text
    }
  }
  if (obj.type === 'image' && obj.style.backgroundImage) {
    obj.componentData.data = obj.style.backgroundImage
    obj.componentData.title = '未命名'
    delete obj.style.backgroundImage
  }
  if (obj.type === 'video' && obj.url) {
    obj.componentData.data = obj.url
    obj.componentData.title = '未命名'
    delete obj.url
    delete obj.title
  }
  if (obj.type === 'audio' && obj.url) {
    obj.componentData.data = obj.url
    obj.componentData.title = obj.title || '未命名'
    delete obj.url
    delete obj.title
  }
}
const useDesignerStore = defineStore('designer', {
  state: () => ({
    id: '',
    loaded: false,
    canvasConfig: {
      rasterize: false,
      dragStep: 1,
      resizeStep: 1,
      width: 1920,
      height: 1080
    },
    pageBgConfig: {}, // page_bg_config  背景相关
    layerConfigs: {}, // 配置相关
    themeConfig: [],
    copyWidgths: [], // 按ctrl +c 时的图层，即后面用户按ctrl + v 时要被塞入的项目，注意，塞入时，需要重新生成id, 以免用户同页粘贴时 出现相同的id  导致bug
    copyStyle: {
      type: undefined,
      style: null
    } // 被复制的图层样式
  }),

  getters: {
    // 自动计算加组, 结组后的数据, 包括父级的位置信息
    layerData() {
      // 转为children结构
      const datas = parser(this.layerConfigs)
      // 递归遍历children,然后计算children的位置
      const traverse = (children, parent) => {
        children.forEach((item) => {
          if (item.children && item.children.length > 0) {
            traverse(item.children, item)
          }
          if (parent) {
            // 处理父级
            const obj = oneGroupCoordinate(parent.children)
            const { minX, minY, groupWidth, groupHeight } = obj
            if (!parent.style) parent.style = {}
            Object.assign(parent.style, {
              left: minX,
              top: minY,
              width: groupWidth,
              height: groupHeight
            })
            // 处理子级,计算相对位置
            const { left, top } = item.style
            Object.assign(item.style, {
              gapLeft: left - minX,
              gapTop: top - minY
            })
          }
        })
      }
      traverse(datas)
      return datas
    }
  },

  actions: {
    updateCopyStyle(payload = {}) {
      this.copyStyle.type = payload.type
      this.copyStyle.style = payload.style
    },
    // 给copyWidgths 塞入图层
    upeateCopyWidghts(widgets = []) {
      this.copyWidgths = widgets
    },
    doInit() {
      const { currentPage } = useStore()
      const layerMap = currentPage?.page_config.reduce((acc, obj) => {
        // TODO 这里做兼容适配，后续需要去掉
        compatible(obj)

        /* ps 导入时会有transform为obj的情况,会影响移动 */
        if (typeof obj.style.transform === 'object') {
          obj.style.transform = 'none'
        }
        if (obj.children) {
          obj.showChilds = false
        }
        acc[obj.id] = obj
        return acc
      }, {})
      this.layerConfigs = layerMap
      this.pageBgConfig = currentPage?.page_bg_config || {}
      this.pageBgConfig.img_url = currentPage?.img_url
    },
    setId(id) {
      this.id = id
    },

    setLoaded(loaded) {
      this.loaded = loaded
    },

    addItem(item) {
      const { currentPage } = useStore()
      this.layerConfigs[item.id + ''] = item
      currentPage.page_config.push(item)
      doSave()
    },

    delItem(ids) {
      const { currentPage } = useStore()
      for (const id of ids) {
        // 删除currentPage?.page_config中的数据
        currentPage?.page_config.forEach((item, index) => {
          debugger
          if (item.id === id) {
            currentPage?.page_config.splice(index, 1)
          }
        })
        delete this.layerConfigs[id]
      }
      doSave()
    },

    updateLayout(items, reRender = true) {
      for (const item of items) {
        const oldItem = this.layerConfigs[item.id + '']
        if (!isEqual(oldItem, item)) {
          this.layerConfigs[item.id + ''] = reRender
            ? { ...ObjectUtil.merge(oldItem, item) }
            : ObjectUtil.merge(oldItem, item)
        }
      }
      doSave()
    },

    /**
     * @description: 背景设置相关
     * @param {*} item
     * @param {*} reRender
     * @author: majun
     */
    updateBgconfig(item, reRender = true) {
      const { currentPage } = useStore()
      const oldItem = currentPage?.page_bg_config
      if (!isEqual(oldItem, item)) {
        reRender ? { ...ObjectUtil.merge(oldItem, item) } : ObjectUtil.merge(oldItem, item)
      }
      doSave()
    },

    delLayout(ids) {
      const { currentPage } = useStore()
      for (const id of ids) {
        if (this.layerConfigs[id] && this.layerConfigs[id].type === 'group') {
          delete this.layerConfigs[id]
        }
        currentPage?.page_config.forEach((item, index) => {
          if (item.id === id) {
            currentPage?.page_config.splice(index, 1)
          }
        })
      }
    },

    updateThemeConfig(data) {
      this.themeConfig = data
    },
    updateCanvasConfig(data) {
      this.canvasConfig = { ...this.canvasConfig, ...data }
    },
    copyItem(ids) {
      return historyRecordOperateProxy.doCopy(ids)
    }
  }
})
export default useDesignerStore
