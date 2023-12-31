/*
  主要功能数据处理 + 保存数据 + 历史记录
*/
import designerStore from '@/store/DesignerStore'
import useHistoryOperator from '@/store/HistoryOperator'
import eventOperateStore from '@/store/EventOperateStore.js'
import { cloneDeep } from 'lodash'
import { OperateType } from './OperateType'
import IdGenerate from '@/util/IdGenerate'
import LayerUtil from '@/util/LayerUtil'
import useStore from '@/stores/store.js'
import useContextMenuStore from '@/store/ContextMenuStore'
import { layerConfig } from '@/config'
import { oneGroupCoordinate } from '@/util/DesignerUtils'
import MessageBox from '@/hooks/useMessage.js'

export const reallPos = (pos) => {
  const { pageZoom, padding } = useStore()
  return pos * pageZoom + padding
}
// 逆向计算
export const getPos = (reallPos) => {
  const { pageZoom, padding } = useStore()
  return (reallPos - padding) / pageZoom
}
class HistoryRecordOperateProxy {
  doDrag(items) {
    console.log('doDragdoDragdoDrag')
    const { updateLayout } = designerStore()
    const historyOperator = useHistoryOperator()
    //构建历史记录数据
    const { layerConfigs } = designerStore()
    const ids = items.map((item) => item.id)
    const oldItems = []
    ids.forEach((id) => oldItems.push(layerConfigs[id]))
    const olds = oneGroupCoordinate(oldItems)
    const prev = { ids, x: reallPos(olds.minX), y: reallPos(olds.minY) }
    const news = oneGroupCoordinate(items)
    const next = { ids, x: reallPos(news.minX), y: reallPos(news.minY) }
    const data = {
      type: OperateType.DRAG,
      prev: prev,
      next: next
    }
    //更新布局数据
    updateLayout(items, false)
    //历史记录入队
    historyOperator.put({ actions: [data] })
  }

  doResize(items, direction) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    //构建历史记录数据
    const { layerConfigs } = designerStore()
    const ids = []
    let prev
    let next
    if (items.length === 1) {
      //单个组件缩放
      //构建prev数据
      const { width = 0, height = 0 } = layerConfigs[items[0].id].style
      prev = { ids: [items[0].id], width, height, direction }
      //构建next数据
      const { id, style } = items[0]
      next = { ids: [id], width: style.width, height: style.height, direction }
    } else {
      //多个组件缩放
      //构建prev数据
      const { pageZoom } = useStore()
      const oldItems = []
      items.forEach((item) => ids.push(item.id))
      ids.forEach((id) => oldItems.push(layerConfigs[id]))
      let minX = +Infinity,
        minY = +Infinity,
        maxX = -Infinity,
        maxY = -Infinity
      oldItems.forEach(({ style }) => {
        const { left, top, width, height } = style
        if (left < minX) minX = left
        if (top < minY) minY = top
        if (left + width > maxX) maxX = left + width
        if (top + height > maxY) maxY = top + height
      })
      const width = maxX - minX
      const height = maxY - minY
      prev = { ids, width: width * pageZoom, height: height * pageZoom, direction }
      console.log(prev, 'prev')
      //构建next数据
      const { groupCoordinate } = eventOperateStore()
      next = {
        ids,
        width: groupCoordinate.groupWidth * pageZoom,
        height: groupCoordinate.groupHeight * pageZoom,
        direction
      }
      console.log(next, 'next')
    }
    //构建历史记录节点1
    const data = { type: OperateType.RESIZE, prev: prev, next: next }
    //更新布局数据
    updateLayout(items, false)
    console.log(items, '历史记录保存!')
    //历史记录入队
    historyOperator.put({ actions: [data] })
  }

  doAdd(widget) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    const data = {
      type: OperateType.ADD,
      prev: null,
      next: [
        {
          id: widget.id,
          data: {
            layerConfig: widget,
            elemConfig: null
          }
        }
      ]
    }
    historyOperator.put({ actions: [data] })
    designerStore().addItem(widget)
  }

  doDelete() {
    const historyOperator = useHistoryOperator()
    let { targetIds, setTargetIds } = eventOperateStore()
    const { updateLayout, updateBgconfig } = designerStore()
    const { delItem, layerConfigs } = designerStore()
    if (!targetIds || targetIds.length === 0) return
    //对被删除元素分类：1. 完全独立的组件（没有分组）2.分组的子组件（选中了分组中的子组件，但没有选中分组）3.分组图层（包括分组图层和其下所有子图层）
    //可删除数据分为：1. 可以直接删除的数据。 2. 删除后需要维护图层关系的数据
    const directDelIds = []
    const maintenanceDelIds = []
    targetIds.forEach((id) => {
      const layer = layerConfigs[id]
      if (layer) {
        const { type, parent } = layer
        if (type !== 'group' && parent && !targetIds.includes(parent)) maintenanceDelIds.push(id)
        else directDelIds.push(id)
      }
    })

    const prev = []
    //可直接删除的数据--构建操作记录
    directDelIds.forEach((id) => {
      const { type } = layerConfigs[id]
      if (type === 'group') {
        prev.push({ id, data: { layerConfig: { ...layerConfigs[id] } } })
      } else {
        prev.push({
          id,
          data: {
            layerConfig: { ...layerConfigs[id] }
          }
        })
      }
    })
    //需要维护图层关系的数据--构建操作记录
    const updPrev = []
    const updNext = []
    maintenanceDelIds.forEach((id) => {
      const { parent } = layerConfigs[id]
      const groupLayer = layerConfigs[parent]
      if (groupLayer.childIds.length === 1 && groupLayer.childIds[0] === id) {
        //说明该分组下只有一个图层，且本次需要删除。这种场景下，将分组图层一起删除
        prev.push({ id: parent, data: { layerConfig: { ...layerConfigs[parent] } } })
        targetIds = [...targetIds, parent]
      } else {
        //否则，只需要更新分组图层的childIds字段即可
        updPrev.push({ id: parent, childIds: { ...groupLayer.childIds } })
        //删除分组图层中的目标子图层
        const oldChildIds = cloneDeep(groupLayer.childIds)
        const newChildIds = oldChildIds.filter((cid) => cid !== id)
        updateLayout([{ id: parent, childIds: newChildIds }], false)
        updNext.push({ id: parent, childIds: { ...groupLayer.childIds } })
      }
      prev.push({
        id,
        data: {
          layerConfig: { ...layerConfigs[id] }
        }
      })
    })

    const actions = [{ type: OperateType.DEL, prev, next: null }]
    if (updPrev.length > 0 || updNext.length > 0)
      actions.push({ type: OperateType.UPD_LAYER_GROUP, prev: updPrev, next: updNext })

    historyOperator.put({ actions })

    //删除组件
    targetIds.length > 0 && delItem(targetIds)
    setTargetIds([])
    const { setPointerTarget } = eventOperateStore()
    const enforcementCap = document.querySelector('.lc-ruler-content')
    //删除组件后，重新聚焦鼠标指针到容器上，避免鼠标失去焦点导致其他快捷键失效。
    setPointerTarget && setPointerTarget(enforcementCap)
  }

  _copyGroupLayer(layout, newIds, newLayouts, maxZindex) {
    const { layerConfigs } = designerStore()
    //生成新id
    const newId = 'group' + IdGenerate.generateId()
    newIds.push(newId)
    //生成新布局
    const newLayout = cloneDeep(layout)
    newLayouts.push(newLayout)
    newLayout.id = newId
    newLayout.style.zIndex = maxZindex
    newLayout.childIds = []
    layerConfigs[newId] = newLayout
    return newLayout
  }

  _copyNormalLayer(layout, newLayouts, maxZindex, newIds) {
    const { visible, position } = useContextMenuStore()
    const { pageZoom } = useStore()
    const { layerConfigs } = designerStore()
    //生成新id  1
    const newId = IdGenerate.generateId()
    //生成新布局
    const newLayout = cloneDeep(layout)
    newLayouts.push(newLayout)
    newLayout.id = newId
    const { left, top } = newLayout.style
    // TODO 这里在复制group时会有问题, 有时间再处理
    if (visible && !newLayout.parent) {
      const element = document.querySelector('.lc-ruler-content')
      if (!element) {
        return {}
      }
      const rect = element.getBoundingClientRect()
      newLayout.style.left = getPos(position[0] - rect.left)
      newLayout.style.top = getPos(position[1] - rect.top)
    } else {
      newLayout.style.left = left + 10 / pageZoom
      newLayout.style.top = top + 10 / pageZoom
    }
    newLayout.style.zIndex = maxZindex
    layerConfigs[newId] = newLayout
    newIds.push(newId)
    return newLayout
  }

  /**
   * 粘贴
   * @param {*} e 事件对象
   * @param {*} isClip 是否剪贴(剪贴会把 图层 left top 值 稍做修改)
   */
  doPase(e, isClip = false) {
    const historyOperator = useHistoryOperator()
    const { updateLayout, updateBgconfig } = designerStore()
    const { copyWidgths, addItem } = designerStore()
    if (!copyWidgths.length) {
      MessageBox.info('请先复制要粘贴的图层')
      return
    }
    let next = []
    let selected = []
    const widgets = cloneDeep(this._reCreateWidghts(copyWidgths, e))
    widgets.forEach((item) => {
      next.push({
        id: item.id,
        data: {
          layerConfig: { ...item }
        }
      })
      selected.push(item.id)
      addItem(item)
    })
    historyOperator.put({ actions: [{ type: OperateType.ADD, prev: null, next }] })

    // 选中粘贴出来的元素
    const { setTargetIds } = eventOperateStore()
    setTimeout(() => {
      setTargetIds(selected)
    }, 50)
  }
  // 粘贴时，需要重新生成id
  _reCreateWidghts(widgets, e) {
    const { padding, pageZoom } = useStore()
    let left, top
    if (e) {
      console.log(e, 'eeeeeeeeeeee')
      const wrap = document.getElementById('view-wrap')
      const offsetLeft =
        document.querySelector('.aside').clientWidth +
        document.querySelector('.editor-aside').clientWidth +
        wrap.offsetLeft +
        padding
      const offsetTop = document.querySelector('.topbar').clientHeight + wrap.offsetTop + padding
      left = getPos(e.clientX - offsetLeft)
      top = getPos(e.clientY - offsetTop)
    }
    // 单个的先处理,因为要拿到新的id更新group的childIds
    widgets.forEach((item) => {
      if (item.type !== 'group') {
        item.id = IdGenerate.generateId()
        // 这里区分是快捷键粘贴还是菜单粘贴, 快捷键粘贴需要加10像素
        const newLeft = e ? left - item.style.width / 2 : item.style.left + 10 / pageZoom
        const newTop = e ? top - item.style.height / 2 : item.style.top + 10 / pageZoom
        item.style.left = newLeft
        item.style.top = newTop
        // 复制的层级要大一些
        item.style.zIndex = item.style.zIndex + 1
      }
    })
    widgets.forEach((item) => {
      if (item.type === 'group') {
        const oldGroupId = item.id
        item.id = 'group' + IdGenerate.generateId()
        // 找到之前parent的id等于oldGroupId的图层，将其parent改为新的id
        const childIds = []
        widgets.forEach((c) => {
          if (c.parent === oldGroupId) {
            c.parent = item.id
            childIds.push(c.id)
          }
        })
        item.childIds = childIds
        item.style.zIndex = item.style.zIndex + 1
      }
    })
    return widgets
  }

  /**
   * 被复制的图层可以同时包含普通图层、分组图层和分组图层的子图层。1
   * 1.普通图层和没有包含分组图层的子图层，则直接复制。
   * 2.对于分组图层和其下的子图层，复制时需要创建复制前后的映射关系，复制完毕后根据映射关系恢复新图层之前的层级关系。
   * @param ids
   */
  doCopy(ids) {
    const historyOperator = useHistoryOperator()
    const { updateLayout, updateBgconfig } = designerStore()
    // debugger
    let newIds = []
    const { layerConfigs } = designerStore()
    let { maxZindex } = eventOperateStore()
    //next用于保存操作记录的下一个状态
    const next = []
    const newLayouts = []

    //区分图层类型， 普通图层和独立的子图层一类（可直接复制），分组图层及其下子图层一类（复制后重新建立关系）。
    const groupIds = []
    const normalIds = []
    ids.forEach((id) => {
      const { type, parent } = layerConfigs[id]
      if ((type !== 'group' && !parent) || (parent && !ids.includes(parent))) normalIds.push(id)
      else groupIds.push(id)
    })

    //复制normalIds
    for (const id of normalIds) {
      //获取被复制元素布局
      const { [id]: layout } = layerConfigs
      if (layout) {
        maxZindex++
        const newLayout = this._copyNormalLayer(layout, newLayouts, maxZindex, newIds)
        //如果本图层是属于单独选中的分组图层的子图层（有pid，但pid对应的图层未被选中），则需要将新复制出来的图层id加入到pid对应图层的childIds中
        if (newLayout.parent) layerConfigs[newLayout.parent].childIds.push(newLayout.id)
      }
    }
    debugger
    /**
     * 复制分组图层及其下子图层
     */
    const groupIdOldToNew = new Map() //分组图层映射关系
    const childIdNewToOld = new Map() //子图层映射关系
    //复制分组图层下的子图层
    const onlyChildIds = groupIds.filter((id) => layerConfigs[id].type !== 'group')
    for (const id of onlyChildIds) {
      //获取被复制元素布局
      const { [id]: layout } = layerConfigs
      if (layout) {
        maxZindex++
        const newLayout = this._copyNormalLayer(layout, newLayouts, maxZindex, newIds)
        childIdNewToOld.set(newLayout.id, id)
      }
    }

    //复制type=group的图层
    const onlyGroupIds = groupIds.filter((id) => layerConfigs[id].type === 'group')
    for (const id of onlyGroupIds) {
      //获取被复制元素布局
      const { [id]: layout } = layerConfigs
      if (layout) {
        maxZindex++
        const newLayout = this._copyGroupLayer(layout, newIds, newLayouts, maxZindex)
        groupIdOldToNew.set(id, newLayout.id)
      }
    }

    //根据映射，重新建立分组图层和子图层的关系
    childIdNewToOld.forEach((oldId, newId) => {
      const newLayerItem = layerConfigs[newId]
      //设置新子图层的pid
      newLayerItem.parent = groupIdOldToNew.get(layerConfigs[oldId].parent)
      //设置新分组图层的childIds
      layerConfigs[newLayerItem.parent].childIds.push(newId)
    })

    //设置分组复制的操作记录信息
    newIds.forEach((id) => {
      const newLayout = layerConfigs[id]
      if (newLayout.type === 'group') {
        next.push({
          id: id,
          data: {
            layerConfig: { ...newLayout }
          }
        })
      } else {
        next.push({
          id: id,
          data: {
            layerConfig: { ...newLayout }
          }
        })
      }
    })

    historyOperator.put({ actions: [{ type: OperateType.ADD, prev: null, next }] })
    //多个组件同时复制时，需要计算多选框的新位置
    if (newLayouts.length > 1) {
      const { groupCoordinate, setGroupCoordinate } = eventOperateStore()
      setGroupCoordinate({ minX: groupCoordinate.minX + 10, minY: groupCoordinate.minY + 10 })
    }
    return newIds
  }
  doClearWidghts() {
    const historyOperator = useHistoryOperator()
    const { layerConfigs, delItem } = designerStore()
    let prev = []
    Object.keys(layerConfigs).forEach((item) => {
      prev.push({
        id: item,
        data: {
          layerConfig: { ...layerConfigs[item] }
        }
      })
    })
    historyOperator.put({ actions: [{ type: OperateType.DEL, prev: prev, next: null }] })
    delItem(Object.keys(layerConfigs))
  }

  doHideUpd(items) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    let prev = []
    let next = []
    const { layerConfigs } = designerStore()
    items.forEach((item) => {
      const { id, hide } = item
      next.push({ id: id, hide: hide })
      const oldHideData = layerConfigs[id]
      prev.push({ id: id, hide: oldHideData.hide })
    })
    const data = { type: OperateType.HIDE, prev: prev, next: next }
    historyOperator.put({ actions: [data] })
    //更新隐藏状态
    updateLayout(items)
    //取消所有选中状态
    const { setTargetIds } = eventOperateStore()
    setTargetIds([])
  }

  doLockUpd(items) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    let prev = []
    let next = []
    const { layerConfigs } = designerStore()
    items.forEach((item) => {
      const { id, config } = item
      next.push({ id: id, lock: config.lock })
      const oldLockData = layerConfigs[id]
      prev.push({ id: id, lock: oldLockData.config.lock })
    })
    const data = { type: OperateType.LOCK, prev: prev, next: next }
    historyOperator.put({ actions: [data] })
    updateLayout(items)
  }

  /**
   * @description: 一些杂七杂八的配置项 的历史记录全部走这里,当然如果有些历史记录需要分拆, 到时候再说 这个不适合更新group,因为group没有componentData
   * @param {*} items
   * @author: majun
   */
  doOrderUpd(items) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    let prev = []
    let next = []
    const { layerConfigs } = designerStore()
    // 这里一定要深度克隆,不然会出现问题
    const copyLayerConfigs = cloneDeep(layerConfigs)
    items.forEach((item) => {
      const oldOrderData = copyLayerConfigs[item.id]
      prev.push(oldOrderData)
      next.push(item)
    })
    const data = { type: OperateType.ORDER, prev: prev, next: next }
    historyOperator.put({ actions: [data] })
    updateLayout(items)
  }

  /**
   * @description: 这个给group-普通通用
   * @author: majun
   */
  doStyleUpd(items) {
    const { updateLayout } = designerStore()
    const historyOperator = useHistoryOperator()
    let prev = []
    let next = []
    const { layerConfigs } = designerStore()
    const copyLayerConfigs = cloneDeep(layerConfigs)
    items.forEach((item) => {
      const { id, style } = item
      next.push({ id: id, style })
      const oldOrderData = copyLayerConfigs[id]
      prev.push({
        id: id,
        style: oldOrderData.style
      })
    })
    const data = { type: OperateType.ORDER, prev: prev, next: next }
    historyOperator.put({ actions: [data] })
    updateLayout(items)
    console.log(prev, 'prev')
    console.log(next, 'next')
  }

  doGrouping() {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    const { targetIds, maxZindex, setTargetIds } = eventOperateStore()
    if (!targetIds || targetIds.length <= 1) return
    if (LayerUtil.hasSameGroup(targetIds)) return
    //查找当前选中的图层的所有父级图层
    const layerIdSet = LayerUtil.findTopGroupLayer(targetIds, true)
    //新建编组
    const { addItem, layerConfigs } = designerStore()
    const zIndex = maxZindex + 1
    const parent = 'group' + IdGenerate.generateId()
    const childIds = Array.from(layerIdSet)
    let obj = layerConfig()
    //构建操作记录
    const actions = []
    //构建分组数据
    const groupItem = {
      ...obj,
      id: parent,
      type: 'group',
      name: '新建分组',
      hide: false,
      showChilds: false,
      childIds
    }
    groupItem.style.zIndex = zIndex
    //操作记录-新增分组图层
    actions.push({
      type: OperateType.ADD,
      prev: null,
      next: [{ id: parent, data: { layerConfig: groupItem } }]
    })
    addItem(groupItem)

    //操作记录-更新子图层的pid
    const childPrev = []
    const childNext = []

    //设置子图层的pid
    const updateItems = []
    childIds.forEach((id) => {
      childPrev.push({ id, parent: undefined })
      updateItems.push({ id, parent })
      childNext.push({ id, parent: undefined })
    })
    updateLayout(updateItems, false)
    setTargetIds([])
    actions.push({ type: OperateType.UPD_LAYER_GROUP, prev: childPrev, next: childNext })
    historyOperator.put({ actions })
  }

  doUnGrouping() {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    const { targetIds, setTargetIds } = eventOperateStore()
    //找出当前选中的图层中，最顶层的分组图层
    let groupIds = LayerUtil.findTopGroupLayer(targetIds, true)
    //过滤掉其中分组等于自身的图层（即非分组图层）
    const { layerConfigs, delLayout } = designerStore()
    groupIds = groupIds.filter((id) => layerConfigs[id].type === 'group')
    //对每个分组图层进行解组
    const actions = []
    const childPrev = []
    const childNext = []
    const groupPrev = []
    groupIds.forEach((groupId) => {
      let item = layerConfigs[groupId]
      //记录被删除的分组图层
      groupPrev.push({ id: groupId, data: { layerConfig: item } })
      let childIds = item.childIds
      const updateItems = []
      childIds &&
        childIds.forEach((childId) => {
          childPrev.push({ id: childId, parent: groupId })
          //更新每个分组图层的子图层的pid为null
          updateItems.push({ id: childId, parent: undefined })
          childNext.push({ id: childId, parent: undefined })
        })
      updateLayout(updateItems, false)
      groupPrev.push({ id: groupId, data: { layerConfig: item } })
    })
    actions.push({ type: OperateType.UPD_LAYER_GROUP, prev: childPrev, next: childNext })
    //操作记录--被删除的分组图层
    actions.push({ type: OperateType.DEL, prev: groupPrev, next: null })
    //执行操作记录入队
    historyOperator.put({ actions })
    //2.删除分组图层
    delLayout(groupIds)
    setTargetIds([])
  }

  doRotate(items, rotate) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    //构建历史记录数据
    const { layerConfigs } = designerStore()
    const ids = []
    let prev
    let next
    const oldItems = []
    items.forEach((item) => ids.push(item.id))
    ids.forEach((id) => oldItems.push(layerConfigs[id]))
    if (items.length === 1) {
      prev = { ids, rotate: oldItems[0].style.rotate }
      next = { ids, rotate: items[0].style.rotate }
    } else {
      const { groupCoordinate } = eventOperateStore()
      prev = { ids, rotate: rotate }
      next = { ids, rotate: groupCoordinate.rotate }
    }

    //构建历史记录节点
    const data = { ids, type: OperateType.ROTATE, prev: prev, next: next }
    console.log(data, 'data')
    //更新布局数据
    updateLayout(items, false)
    //历史记录入队
    historyOperator.put({ actions: [data] })
  }
  /**
   * @description: 背景更改调用的记录
   * @param {*} page
   * @author: majun
   */
  doChangeBg(page) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    const { pageBgConfig } = designerStore()
    const prev = cloneDeep(pageBgConfig)
    updateBgconfig(page, false)
    const next = page
    //构建历史记录节点
    const data = { type: OperateType.CHANGEPAGE, prev, next }
    console.log(data, 'data')
    //历史记录入队
    historyOperator.put({ actions: [data] })
  }

  /**
   * @description: 动作记录1
   * @param {*} page
   * @author: majun
   */
  doChangeEvent(item) {
    const { updateLayout, updateBgconfig } = designerStore()
    const historyOperator = useHistoryOperator()
    const { currentWidget } = eventOperateStore()
    const prev = cloneDeep([currentWidget.event])
    updateLayout([item], false)
    const next = [item]
    //构建历史记录节点
    const data = { type: OperateType.ORDER, prev, next }
    console.log(data, 'data')
    //历史记录入队
    historyOperator.put({ actions: [data] })
  }
}

const historyRecordOperateProxy = new HistoryRecordOperateProxy()
export default historyRecordOperateProxy
