import eventOperateStore from '@/store/EventOperateStore.js'
import designerStore from '@/store/DesignerStore'
import { debounce, cloneDeep } from 'lodash'
import useHistoryOperator from '@/store/HistoryOperator'
import historyRecordOperateProxy, { reallPos } from '../undo-redo/HistoryRecordOperateProxy'
import undoRedoMap from '../undo-redo/core'
import layerListStore from '@/store/LayerListStore'
import useStore from '@/stores/store.js'

import { createWidgetItem } from '@/util/DesignerUtils'
import { SHAPE_LIST } from '@/config/shapes'
import MessageBox from '@/hooks/useMessage.js'
const historyOperator = useHistoryOperator()

export const doExise = () => {
  const { setTargetIds } = eventOperateStore()
  setTargetIds([])
}
// yes
export const selectAll = () => {
  const { layerConfigs } = designerStore()
  const { setTargetIds, calculateGroupCoordinate } = eventOperateStore()
  const selected = Object.values(layerConfigs).map((item) => {
    if (!item.config.lock && !item.hide) return item.id
  })
  setTargetIds(selected)
  if (selected.length > 0)
    calculateGroupCoordinate(
      selected.map((id) => document.getElementById(id))?.filter((item) => !!item)
    )
}
/**
 * 复制选中的数据，用于后面的粘贴
 */
export const copy = () => {
  const { targetIds } = eventOperateStore()
  const { layerConfigs, upeateCopyWidghts } = designerStore()
  if (!targetIds.length) {
    MessageBox.info('请先选中图层再复制')
    // 没有选中要复制的元素，什么也不做就行了
    return
  }
  const copyWidgths = [] // 被复制的项目
  for (let id in layerConfigs) {
    if (targetIds.includes(id)) {
      copyWidgths.push(cloneDeep(layerConfigs[id]))
    }
  }
  upeateCopyWidghts(copyWidgths)
}
// 粘贴
export const pase = (e) => {
  historyRecordOperateProxy.doPase(e)
}
// 剪贴
export const clip = (e) => {
  historyRecordOperateProxy.doPase(e, true)
}

// 监听系统的粘贴事件
export const doPasteEvent = (e) => {
  e.preventDefault()
  const clipboardData = e.clipboardData || window.clipboardData
  const items = clipboardData.items
  let file = []
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      file.push(items[i].getAsFile())
    }
  }
  clear()
  if (file.length) {
    // 添加图片图层
    console.log('添加图片图层', file)
  } else {
    // 执行图层粘贴
    pase()
  }
  clipboardData.setData('Text', '')
}

// 复制图层样式
export const doCopyStyle = () => {
  const { targetIds, currentWidget } = eventOperateStore()
  const { updateCopyStyle } = designerStore()
  if (targetIds.length === 1 && currentWidget.type !== 'group') {
    const style = cloneDeep(currentWidget.style)
    updateCopyStyle({
      type: currentWidget.type,
      style: style
    })
  } else {
    MessageBox.info('请选择单个图层复制样式')
  }
}

export const doPaseStyle = () => {
  const { copyStyle } = designerStore()
  if (!copyStyle.style) {
    return
  }
  const { currentWidget } = eventOperateStore()
  let style = cloneDeep(copyStyle.style)
  let d = ['width', 'height', 'left', 'top', 'transform']
  d.forEach((s) => {
    delete style[s]
  })
  if (currentWidget.type !== copyStyle.type) {
    delete style.fontSize
    delete style.color
  }
  handleStyle(style)
  if (currentWidget.type === 'text' || currentWidget.type === 'link') {
    getFont(currentWidget)
  }
}

const getFont = async (item) => {
}

/**
 * 普通复制，只复制非分组图层 右键过来的有 'keyBoard'
 */
export const doCopy = (e) => {
  // console.log(e, '555555555')
  let { targetIds, setTargetIds } = eventOperateStore()
  if (!targetIds || targetIds.length === 0) return

  const { copyItem } = designerStore()
  let newIds = copyItem(targetIds)
  //延迟10毫秒，等待dom元素渲染完毕后再获取。
  setTimeout(() => setTargetIds(newIds), 10)
}

export const doLock = () => {
  const { targetIds, setTargetIds } = eventOperateStore()
  if (!targetIds || targetIds.length === 0) return
  const { layerConfigs } = designerStore()
  const toBeUpdate = targetIds.map((targetId) => {
    const item = layerConfigs[targetId]
    return { ...item, config: { ...item.config, lock: true } }
  })
  historyRecordOperateProxy.doLockUpd(toBeUpdate)
  setTargetIds([])
}

export const doUnLock = () => {
  const { setTargetIds, targetIds } = eventOperateStore()
  if (!targetIds || targetIds.length === 0) return
  const { layerConfigs } = designerStore()
  let toUpdate = []
  targetIds
    .filter((id) => {
      //过滤出被锁定的组件
      return layerConfigs[id].config.lock
    })
    .forEach((id) => {
      toUpdate.push({ id, config: { lock: false } })
    })
  historyRecordOperateProxy.doLockUpd(toUpdate)
  setTargetIds([])
}

/**
 * @description: 控制层级
 * @param {*} style
 * @author: majun
 */
export const handleStyle = (style = {}) => {
  const { currentWidget } = eventOperateStore()
  let copyWidget = cloneDeep(currentWidget)
  copyWidget.style = {
    ...copyWidget.style,
    ...style
  }
  historyRecordOperateProxy.doStyleUpd([copyWidget])
}

/**
 * 切换字体粗细 / 增加或减小字体
 */
export const fastFont = (type) => {
  const { currentWidget } = eventOperateStore()
  if (currentWidget.type !== 'text' || currentWidget.type !== 'link') {
    let style = {}
    console.log('type2', type)
    if (type === 'weight') {
      const fontWeight = currentWidget.style.fontWeight
      style.fontWeight = fontWeight === 'bold' ? '' : 'bold'
    } else if (type === 'plus') {
      const fontSize = Math.round(currentWidget.style.fontSize)
      style.fontSize = fontSize + 1
    } else if (type === 'mins') {
      const fontSize = Math.round(currentWidget.style.fontSize)
      style.fontSize = fontSize > 12 ? fontSize - 1 : 12
    }
    handleStyle(style)
  }
}

/**
 * @description: 置顶
 * @author: majun
 */
export const toTop = () => {
  const { maxZindex } = eventOperateStore()
  handleStyle({ zIndex: maxZindex + 1 })
}

/**
 * @description: 置底
 * @author: majun
 */
export const toBottom = () => {
  const { minZindex } = eventOperateStore()
  handleStyle({ zIndex: minZindex })
}

export const adjustZindex = (type = 'plus') => {
  const { currentWidget } = eventOperateStore()
  let zIndex = currentWidget.style.zIndex
  if (type == 'plus') {
    zIndex = zIndex + 1
  } else {
    if (zIndex > 0) {
      zIndex = zIndex - 1
    } else {
      MessageBox.info('已经是最底层了')
    }
  }
  handleStyle({ zIndex })
}

export const doDelete = () => {
  //删除设计器中的组件，并记录到历史操作
  historyRecordOperateProxy.doDelete()
}

export const updatePage = async (page, cb) => {

}

//保存防抖
export const doSave = debounce(async (prop) => {
  const { currentPage } = useStore()
  const { layerData } = designerStore()
  const obj = cloneDeep(prop || currentPage)
  obj.img_url = obj?.page_bg_config?.img_url || ''
  // 递归查找树结构,找到对应style
  function getStyle(id, datas) {
    datas.forEach((element) => {
      if (element.id === id) {
        return element.style
      } else if (element.children && element.children.length > 0) {
        return getStyle(id, element.children)
      }
    })
  }
  // group的信息一直是动态计算的,没有存起来,所以这里要重新加回来,因为展示需要用
  obj.page_config.forEach((item) => {
    if (item.type === 'group') {
      item.style = getStyle(item.id, layerData)
    }
  })
  // TODO 这里做适配,后面要去掉
  // obj.page_config.forEach((item) => {
  //   if (!item.parent) item.parent = '-1'
  // })

  await updatePage(obj)
  console.log(obj, '保存')
  // ElMessage.success('保存!!!')
}, 500)

export const doHide = () => {
  const { targetIds, setTargetIds } = eventOperateStore()
  if (!targetIds || targetIds.length === 0) return
  const { layerConfigs } = designerStore()
  let toBeUpdate = []
  targetIds.forEach((id) => {
    let item = layerConfigs[id]
    toBeUpdate.push({ ...item, hide: true })
  })
  historyRecordOperateProxy.doHideUpd(toBeUpdate)
  setTargetIds([])
}

/**
 * 图层编组,
 * 编组时候，如果都是普通组件图层，则直接编组
 * 如果包含了已经分组的图层，则将将已经编组的这个组作为基本图层和其他图层进行编组，
 * 比如有A,B,C三个普通图层，则编组的时候可直接生成编组G
 * 如果A,B已经编组为G1，此时再选中A,C或B,C，或者A,B,C，则编组的时候，G1作为基本图层，和C进行编组，生成G2
 */
export const doGrouping = () => {
  historyRecordOperateProxy.doGrouping()
}

export const doUnGrouping = () => {
  historyRecordOperateProxy.doUnGrouping()
}

/*************************快捷键控制移动组件的位置*************************/

export const doMoveUp = () => {
  console.log('doMoveUp')
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { dragStep = 1 }
  } = designerStore()
  if (targets.length === 1) {
    let id = targets[0].id
    let yPos = reallPos(layerConfigs[id].style.top) - dragStep
    movableRef?.request('draggable', { y: yPos }, true)
  } else {
    const yPos = reallPos(groupCoordinate.minY) - dragStep
    movableRef?.request('draggable', { y: yPos }, true)
  }
}

export const doMoveDown = () => {
  console.log('doMoveDown')
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { dragStep = 1 }
  } = designerStore()
  if (targets.length === 1) {
    let id = targets[0].id
    let yPos = reallPos(layerConfigs[id].style.top) + dragStep
    movableRef?.request('draggable', { y: yPos }, true)
  } else {
    const yPos = reallPos(groupCoordinate.minY) + dragStep
    movableRef?.request('draggable', { y: yPos }, true)
  }
}

export const doMoveLeft = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  console.log('doMoveLeft')
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { dragStep = 1 }
  } = designerStore()
  if (targets.length === 1) {
    let id = targets[0].id
    let xPos = reallPos(layerConfigs[id].style.left)
    movableRef?.request('draggable', { x: xPos - dragStep }, true)
  } else {
    const xPos = reallPos(groupCoordinate.minX) - dragStep
    movableRef?.request('draggable', { x: xPos }, true)
  }
}

export const doMoveRight = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  console.log('doMoveRight')
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { dragStep = 1 }
  } = designerStore()
  if (targets.length === 1) {
    let id = targets[0].id
    let xPos = reallPos(layerConfigs[id].style.left)
    movableRef?.request('draggable', { x: xPos + dragStep }, true)
  } else {
    const xPos = reallPos(groupCoordinate.minX) + dragStep
    movableRef?.request('draggable', { x: xPos }, true)
  }
}

/*************************快捷键控制缩放组件尺寸*************************/

/**
 * 以底部为基准向上扩大
 */
export const doBaseBottomEnlargeUp = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let height
  if (targets.length === 1) {
    let id = targets[0].id
    height = layerConfigs[id].height + resizeStep
  } else {
    height = groupCoordinate.groupHeight + resizeStep
  }
  movableRef?.request('resizable', { offsetHeight: height, direction: [1, -1] }, true)
}

/**
 * 以顶部为基准向下扩大
 */
export const doBaseUpEnlargeDown = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let height
  if (targets.length === 1) {
    let id = targets[0].id
    height = layerConfigs[id].height + resizeStep
  } else {
    height = groupCoordinate.groupHeight + resizeStep
  }
  movableRef?.request('resizable', { offsetHeight: height, direction: [1, 1] }, true)
}

/**
 * 以右边为基准向左扩大
 */
export const doBaseRightEnlargeLeft = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let width
  if (targets.length === 1) {
    let id = targets[0].id
    width = layerConfigs[id].width + resizeStep
  } else {
    width = groupCoordinate.groupWidth + resizeStep
  }
  movableRef?.request('resizable', { offsetWidth: width, direction: [-1, 1] }, true)
}

/**
 * 以左边为基准向右扩大
 */
export const doBaseLeftEnlargeRight = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let width
  if (targets.length === 1) {
    let id = targets[0].id
    width = layerConfigs[id].width + resizeStep
  } else {
    width = groupCoordinate.groupWidth + resizeStep
  }
  movableRef?.request('resizable', { offsetWidth: width, direction: [1, 1] }, true)
}

/**
 * 以底部为基准向上缩小
 */
export const doBaseBottomDecreaseUp = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let height
  if (targets.length === 1) {
    height = layerConfigs[targets[0].id].height - resizeStep
  } else {
    height = groupCoordinate.groupHeight - resizeStep
  }
  movableRef?.request('resizable', { offsetHeight: height, direction: [1, -1] }, true)
}

/**
 * 以顶部为基准向下缩小
 */
export const doBaseUpDecreaseDown = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let height
  if (targets.length === 1) {
    let id = targets[0].id
    height = layerConfigs[id].height - resizeStep
  } else {
    height = groupCoordinate.groupHeight - resizeStep
  }
  movableRef?.request('resizable', { offsetHeight: height, direction: [1, 1] }, true)
}

/**
 * 以右边为基准向左缩小
 */
export const doBaseRightDecreaseLeft = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let width
  if (targets.length === 1) {
    let id = targets[0].id
    width = layerConfigs[id].width - resizeStep
  } else {
    width = groupCoordinate.groupWidth - resizeStep
  }
  movableRef?.request('resizable', { offsetWidth: width, direction: [-1, 1] }, true)
}

/**
 * 以左边为基准向右缩小
 */
export const doBaseLeftDecreaseRight = () => {
  const { targets, movableRef, groupCoordinate } = eventOperateStore()
  if (!targets || targets.length === 0) return
  const {
    layerConfigs,
    canvasConfig: { resizeStep = 1 }
  } = designerStore()
  let width
  if (targets.length === 1) {
    let id = targets[0].id
    width = layerConfigs[id].width - resizeStep
  } else {
    width = groupCoordinate.groupWidth - resizeStep
  }
  movableRef?.request('resizable', { offsetWidth: width, direction: [1, 1] }, true)
}

/**
 * 撤销
 */
export const undo = () => {
  let history = historyOperator.backoff()
  if (!history) return
  const { actions } = history
  actions.forEach((action) => {
    const { type } = action
    console.log('撤销', action)
    undoRedoMap.get(type)?.undo(action)
  })
}

/**
 * 重做
 */
export const redo = () => {
  debugger
  let history = historyOperator.forward()
  if (!history) return
  const { actions } = history
  actions.forEach((action) => {
    const { type } = action
    console.log('重做', action)
    undoRedoMap.get(type)?.redo(action)
  })
}

/**
 * 快捷键 添加图层
 */
export const fasterCreateWidget = async (type) => {
  let widget = null
  if (type === 'line') {
    const shapes = SHAPE_LIST.find((item) => item.type === '直线')
    widget = await createWidgetItem('svg', shapes.children[0])
  } else if (type === 'react') {
    const shapes = SHAPE_LIST.find((item) => item.type === '矩形')
    widget = await createWidgetItem('svg', shapes.children[0])
  } else if (type === 'circle') {
    const shapes = SHAPE_LIST.find((item) => item.type === '常用形状')
    widget = await createWidgetItem('svg', shapes.children[0])
  } else if (type === 'text') {
    widget = await createWidgetItem('text')
  } else {
    console.log('====')
  }
  console.log('widget=>', widget)
  widget && historyRecordOperateProxy.doAdd(widget)
}

/**
 * 清空所有图层
 */
export const clearWidghts = () => {
  historyRecordOperateProxy.doClearWidghts()
}

/*************************运行时配置快捷键*************************/

/**
 * 切换组件库弹框
 */
export const toggleLayer = () => {
  const { setVisible, visible } = layerListStore()
  setVisible && setVisible(!visible)
}
