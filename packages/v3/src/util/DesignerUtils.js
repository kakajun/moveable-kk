import { layerConfig } from '@/config'
import { SHAPE_PATH_FORMULAS } from '@/config/shapes'
import { getImageSize, drawImage, getDataType } from '@/utils'
import useStore from '@/stores/store.js'
import eventOperateStore from '@/store/EventOperateStore.js'
import LayerUtil from '@/util/LayerUtil.js'
import historyRecordOperateProxy, {
  getPos,
  reallPos
} from '@/views/EditMiddle/operate-provider/undo-redo/HistoryRecordOperateProxy'

/*
   添加元素方法
*/
export const createWidgetItem = async (type, content) => {
  // debugger
  const { bookData } = useStore()
  let obj = layerConfig()
  const pageW = bookData.width
  const pageH = bookData.height
  const baseWidth = 475 // 以475宽度为基准
  const ratio = pageW / baseWidth
  switch (type) {
    case 'image':
      obj.type = 'image'
      obj.name = '图片'
      if (getDataType(content) === 'Object') {
        obj.componentData.data = content.file_url
        obj.componentData.title = content.file_name
      } else {
        obj.componentData.data = content
        obj.componentData.title = '未命名'
      }
      let res
      try {
        res = await getImageSize(obj.componentData.data)
        let { width, height } = drawImage(
          res.width,
          res.height,
          Math.round(pageW * 0.5),
          Math.round(pageH * 0.5)
        )
        obj.style.width = width
        obj.style.height = height
      } catch (e) {
        console.log(e)
      }
      // obj.style.backgroundImage = content
      break
    case 'text':
      obj.type = 'text'
      obj.name = '文本'
      obj.componentData.data = content || '输入文字'
      // obj.text = content
      obj.style.width = 80 * ratio
      obj.style.height = 45 * ratio
      obj.style.fontSize = obj.style.fontSize * ratio
      break
    case 'link':
      obj.type = 'link'
      obj.name = '链接'
      obj.componentData.data = content || '输入链接文字'
      // obj.text = content
      obj.style.width = 120 * ratio
      obj.style.height = 45 * ratio
      obj.style.fontSize = obj.style.fontSize * ratio
      break
    case 'video':
      obj.type = 'video'
      obj.name = '视频'
      obj.style.width = 320 * ratio
      obj.style.height = 180 * ratio
      if (getDataType(content) === 'Object') {
        obj.componentData.data = content.file_url
        obj.componentData.title = content.title
        obj.componentData.cover = content.cover || ''
      } else {
        obj.componentData.data = content
        obj.componentData.title = '未命名'
        obj.componentData.cover = ''
      }
      obj.componentData.style = '1'
      break
    case 'audio':
      obj.type = 'audio'
      obj.name = '音乐'
      obj.style.width = 50 * ratio
      obj.style.height = 50 * ratio
      if (getDataType(content) === 'Object') {
        obj.componentData.data = content.file_url
        obj.componentData.title = content.file_name
      } else {
        obj.componentData.data = content
        obj.componentData.title = '未命名'
      }
      obj.componentData.style = '1'
      obj.componentData.autoPlay = 0
      obj.componentData.crossPlay = 0
      obj.componentData.volume = 100

      break
    case 'svg':
      obj.type = 'svg'
      obj.style.path = content.path
      obj.style.viewBox = content.viewBox
      obj.name = '形状'
      obj.style.width = 100 * ratio
      obj.style.height = 100 * ratio
      obj.style.fill = '#5B9BD5'
      obj.style.outlineColor = '#000000'
      obj.style.outlineWidth = 1
      obj.style.outlineStyle = ''
      obj.style.bookShapeType = content.bookShapeType
      if (content.bookShapeType === 'line') {
        obj.style.outlineStyle = 0
        obj.style.strokeDash = 5
      }
      if (content.pathFormula) {
        const pathFormula = SHAPE_PATH_FORMULAS[content.pathFormula]
        console.log('pathFormula', pathFormula)
        obj.pathFormula = content.pathFormula
        obj.style.viewBox = [100 * ratio, 100 * ratio]
        obj.style.path = pathFormula.formula(
          100 * ratio,
          100 * ratio,
          pathFormula.defaultValue || 1
        )
      }
      break
    case 'group':
      obj.isContainer = true
      obj.type = 'group'
      obj.name = '组合'

      break
    case 'component':
      const { type, name, componentData, style } = content
      obj.type = type
      obj.name = name
      obj.style = { ...obj.style, ...style }
      obj.componentData = componentData
      break
  }
  const { maxZindex } = eventOperateStore()
  obj.style.zIndex = maxZindex + 1
  obj.style.left = (pageW - obj.style.width) / 2
  obj.style.top = (pageH - obj.style.height) / 2
  return obj
}

/**
 * 设置控制点和边框的颜色
 * @param lock 是否锁定
 */
export const setControlPointLineColor = (lock) => {
  console.log(typeof lock, 'bbbbbb')
  const { targetIds } = eventOperateStore()
  //没有选中组件的情况下不会显示边框。
  if (targetIds.length === 0) return
  const pointLineDom = document.querySelectorAll('.moveable-control,.moveable-line')
  if (!pointLineDom) return
  if (lock) {
    pointLineDom.forEach((child) => {
      child.style.backgroundColor = '#ff4b29'
    })
  } else {
    pointLineDom.forEach((child) => {
      child.style.backgroundColor = '#00bbffff'
    })
  }
}

export function calculateGroupCoordinate(compArr) {
  let groupCoordinate = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
    groupWidth: 0,
    groupHeight: 0
  }
  compArr.forEach((item) => {
    if (item.children) {
      calculateGroupCoordinate(item.children)
    } else {
      let { left, top, width, height } = item.style
      const x = left
      const y = top
      if (x < groupCoordinate.minX) groupCoordinate.minX = x
      if (y < groupCoordinate.minY) groupCoordinate.minY = y
      if (x + width > groupCoordinate.maxX) groupCoordinate.maxX = x + width
      if (y + height > groupCoordinate.maxY) groupCoordinate.maxY = y + height
    }
  })
  groupCoordinate.groupWidth = groupCoordinate.maxX - groupCoordinate.minX
  groupCoordinate.groupHeight = groupCoordinate.maxY - groupCoordinate.minY
  return groupCoordinate
}

export function oneGroupCoordinate(compArr) {
  let groupCoordinate = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
    groupWidth: 0,
    groupHeight: 0
  }
  compArr.forEach((item) => {
    let { left, top, width, height, rotate = 0 } = item.style
    const centerX = left + width / 2
    const centerY = top + height / 2

    // 计算元素的四个角的坐标
    const corners = [
      { x: left, y: top },
      { x: left + width, y: top },
      { x: left, y: top + height },
      { x: left + width, y: top + height }
    ].map((corner) => {
      const x =
        centerX +
        (corner.x - centerX) * Math.cos((Math.PI / 180) * rotate) -
        (corner.y - centerY) * Math.sin((Math.PI / 180) * rotate)
      const y =
        centerY +
        (corner.x - centerX) * Math.sin((Math.PI / 180) * rotate) +
        (corner.y - centerY) * Math.cos((Math.PI / 180) * rotate)
      return { x, y }
    })

    // 找出四个角的坐标中的最小x值、最大x值、最小y值和最大y值
    corners.forEach((corner) => {
      if (corner.x < groupCoordinate.minX) groupCoordinate.minX = corner.x
      if (corner.y < groupCoordinate.minY) groupCoordinate.minY = corner.y
      if (corner.x > groupCoordinate.maxX) groupCoordinate.maxX = corner.x
      if (corner.y > groupCoordinate.maxY) groupCoordinate.maxY = corner.y
    })
  })
  groupCoordinate.groupWidth = groupCoordinate.maxX - groupCoordinate.minX
  groupCoordinate.groupHeight = groupCoordinate.maxY - groupCoordinate.minY
  return groupCoordinate
}

const requestDraggable = (moveables, calculatePosition) => {
  moveables.forEach((child) => {
    const rect = child.getRect()

    child.request('draggable', calculatePosition(rect), true)
  })
}
/**
 * @description: 群组的移动
 * @author: majun
 */
const setAlignGroup = (align, wrapperRect) => {
  const { movableRef, selectWidgets } = eventOperateStore()
  //  selectWidgets是所有树形结构
  const moveables = movableRef.getMoveables()
  console.log(wrapperRect, 'wrapperRect')
  const groups = selectWidgets.filter((o) => o.type === 'group')
  const { pageZoom } = useStore()
  groups.forEach((ele) => {
    const { left: groupLeft, top: groupTop, width: groupWidth, height: groupHeight } = ele.style
    const selectedLayerIds = LayerUtil.findAllChildLayer([ele.id])
    const groupMoveables = moveables.filter((o) => selectedLayerIds.includes(o._dragTarget.id))
    const gapLeft = reallPos(groupLeft) - wrapperRect.left
    const gapTop = reallPos(groupTop) - wrapperRect.top
    const groupRight = reallPos(groupLeft) + groupWidth * pageZoom // group的right
    const wrapperRight = wrapperRect.left + wrapperRect.width // wrapper的right
    const groupBottom = reallPos(groupTop) + groupHeight * pageZoom
    const wrapperBottom = wrapperRect.top + wrapperRect.height
    const gapHeight = wrapperBottom - groupBottom // 应该是wrapperBottom与groupBottom的差值
    const gapWidth = wrapperRight - groupRight // 应该是wrapperRight与groupRight的差值
    switch (align) {
      case 'left':
        console.log(wrapperRect.left, 'rect.left')
        console.log(gapLeft, 'gapLeft')
        requestDraggable(groupMoveables, (rect) => ({ x: rect.left - gapLeft }))
        break
      case 'top':
        requestDraggable(groupMoveables, (rect) => ({ y: rect.top - gapTop }))
        break
      case 'right':
        requestDraggable(groupMoveables, (rect) => ({ x: rect.left + gapWidth }))
        break
      case 'bottom':
        requestDraggable(groupMoveables, (rect) => ({ y: rect.top + gapHeight }))
        break
      case 'center':
        // 确保group的中心点与wrapper的中心点重合,先全部靠右,然后再左移动wrapperRect的一半.右移groupWidth一半的宽度
        requestDraggable(groupMoveables, (rect) => ({
          x: rect.left + gapWidth - wrapperRect.width / 2 + (groupWidth * pageZoom) / 2
        }))
        break
      case 'middle':
        requestDraggable(groupMoveables, (rect) => ({
          y: rect.top + gapHeight - wrapperRect.height / 2 + (groupHeight * pageZoom) / 2
        }))
        break
      default:
        break
    }
  })
}
/**
 * @description: 改变组合内的排列,style 里面只有left,top,width,height
 * @param {*} align  (left,center,right,top,middle,bottom)
 * @return {*}
 */
export const changeAlign = (align) => {
  const { pageZoom, bookData } = useStore()
  const { movableRef, selectWidgets } = eventOperateStore()
  let wrapperRect
  // 如果是单个对齐,那么就是以bookData画布边框为准
  if (selectWidgets.length == 1) {
    wrapperRect = {
      width: bookData.width * pageZoom,
      height: bookData.height * pageZoom,
      left: reallPos(0),
      top: reallPos(0)
    }
  } else {
    wrapperRect = movableRef.getRect()
  }
  console.log(wrapperRect, 'wrapperRect')
  const allmoveables = movableRef.getMoveables()
  const noGroupIds = selectWidgets.map((o) => o.id)
  const moveables = allmoveables.filter((o) => noGroupIds.includes(o._dragTarget.id))
  setAlignGroup(align, wrapperRect)
  setDisperse(align)
  switch (align) {
    case 'left':
      requestDraggable(moveables, (rect) => ({ x: wrapperRect.left }))
      break
    case 'top':
      requestDraggable(moveables, (rect) => ({ y: wrapperRect.top }))
      break
    case 'right':
      requestDraggable(moveables, (rect) => ({
        x: wrapperRect.left + wrapperRect.width - rect.width
      }))
      break
    case 'bottom':
      requestDraggable(moveables, (rect) => ({
        y: wrapperRect.top + wrapperRect.height - rect.height
      }))
      break
    case 'center':
      requestDraggable(moveables, (rect) => ({
        x: wrapperRect.left + wrapperRect.width / 2 - rect.width / 2
      }))
      break
    case 'middle':
      requestDraggable(moveables, (rect) => ({
        y: wrapperRect.top + wrapperRect.height / 2 - rect.height / 2
      }))
      break
    default:
      break
  }
  // 存储数据`
  handleDatas(allmoveables)
  // 解决排列后框不随着跑的问题
  setTimeout(() => {
    movableRef.updateRect()
  }, 0)
}

/**
 * @description: 设置分散排列
 * @param {*} align
 * @author: majun
 */
const setDisperse = (align) => {
  const { movableRef, selectWidgets } = eventOperateStore()
  const { pageZoom } = useStore()
  const wrapperRect = movableRef.getRect()
  const allmoveables = movableRef.getMoveables()
  const noGroupIds = selectWidgets.map((o) => o.id)
  const moveables = allmoveables.filter((o) => noGroupIds.includes(o._dragTarget.id))
  const groups = selectWidgets.filter((o) => o.type === 'group')
  // 这里模拟出group的情况
  groups.forEach((ele) => {
    const { left, top, width, height } = ele.style
    if (!ele.state) ele.state = {}
    ele.state.left = reallPos(left)
    ele.state.top = reallPos(top)
    ele.getRect = () => {
      return { width: width * pageZoom, height: height * pageZoom }
    }
    moveables.push(ele)
  })

  const distribute = (dimension, position) => {
    let pos = wrapperRect[position]
    const gap =
      (wrapperRect[dimension] -
        moveables.reduce((prev, cur) => {
          return prev + cur.getRect()[dimension]
        }, 0)) /
      (moveables.length - 1)

    moveables.sort((a, b) => {
      return a.state[position] - b.state[position]
    })
    moveables.forEach((child) => {
      const rect = child.getRect()
      if (child.type === 'group') {
        const selectedLayerIds = LayerUtil.findAllChildLayer([child.id])
        const groupMoveables = allmoveables.filter((o) =>
          selectedLayerIds.includes(o._dragTarget.id)
        )
        const groupPos = reallPos(child.style[position])
        const groupGap = pos - groupPos
        if (parseInt(groupGap)) {
          groupMoveables.forEach((gchild) => {
            const grect = gchild.getRect()
            gchild.request(
              'draggable',
              {
                [position === 'left' ? 'x' : 'y']: grect[position] + groupGap
              },
              true
            )
          })
        }
      } else {
        child.request(
          'draggable',
          {
            [position === 'left' ? 'x' : 'y']: pos
          },
          true
        )
      }
      pos += rect[dimension] + gap
    })
  }

  switch (align) {
    case 'horizontal-distribute':
      distribute('width', 'left')
      break
    case 'vertical-distribute':
      distribute('height', 'top')
      break
  }
}

/**
 * @description: 把前面对齐后的数据通过一定格式进行存储
 * @author: majun
 */
const handleDatas = (moveables) => {
  const datas = []
  const { pageZoom } = useStore()
  moveables.forEach((child, i) => {
    const rect = child.getRect()
    const { origin, offsetWidth, offsetHeight } = rect
    const [originX, originY] = origin
    // 直接就是旋转中心点进行计算,定位就是中心点减去宽高的一半
    const actualLeft = originX - (offsetWidth * pageZoom) / 2
    const actualTop = originY - (offsetHeight * pageZoom) / 2
    datas.push({
      id: child._dragTarget.id,
      style: {
        left: getPos(actualLeft),
        top: getPos(actualTop)
      }
    })
  })
  console.log(datas, 'datas')
  historyRecordOperateProxy.doOrderUpd(datas)
}
