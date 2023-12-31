import { setControlPointLineColor } from '@/util/DesignerUtils'
import LayerUtil from '@/util/LayerUtil.js'
import eventOperateStore from '@/store/EventOperateStore.js'
import useContextMenuStore from '@/store/ContextMenuStore'
import designerStore from '@/store/DesignerStore'
import { changeAlign } from '@/util/DesignerUtils'
import { storeToRefs } from 'pinia'
import {
  doGrouping,
  doUnGrouping,
  copy,
  pase,
  clip,
  adjustZindex,
  doDelete,
  doLock,
  doUnLock,
  toBottom,
  toTop,
  clearWidghts,
  doCopyStyle,
  doPaseStyle
} from '../hot-key/HotKeyImpl'

const { setTargetIds } = eventOperateStore()
const dStore = designerStore()
const { copyWidgths, copyStyle } = storeToRefs(dStore) // 取出即将被 粘贴的图层

/**
 * @description: 根据不同类型获取右键不同菜单
 * @author: majun
 */
const getMenuList = () => {
  const { currentWidget, targetIds } = eventOperateStore()
  const isGroup = LayerUtil.hasSameGroup(targetIds)
  let meluLIst = []
  // if (!targetIds.length) {
  //   // 没有选中图层时，显示画布的 右键菜单
  //   meluLIst = [
  //     {
  //       label: '清空画布',
  //       icon: 'ContextmenuCopy',
  //       fastKey: '',
  //       onClick: clearWidghts
  //     },
  //     {
  //       label: '放大画布',
  //       icon: 'ContextmenuCopy',
  //       fastKey: '',
  //       onClick: () => {
  //         console.log('fangda')
  //       }
  //     },
  //     {
  //       label: '缩小画布',
  //       icon: 'ContextmenuCopy',
  //       fastKey: '',
  //       onClick: () => {
  //         console.log('suoxiao')
  //       }
  //     }
  //   ]
  //   return meluLIst
  // }

  // 选中了图层时的右键菜单

  let lockObj = []
  if (targetIds.length === 1 || isGroup) {
    // 选中单个图层或者组时，才有锁定和解锁
    const lockState = currentWidget.config.lock
    if (lockState) {
      lockObj.push({
        label: '解锁',
        icon: 'ContextmenuUnLock',
        fastKey: 'Ctrl + L',
        onClick: doUnLock
      })
    } else {
      lockObj.push({ label: '锁定', icon: 'ContextmenuLock', fastKey: 'Ctrl + L', onClick: doLock })
    }
  }
  let groupArray = []
  if (targetIds.length > 1) {
    if (isGroup) {
      groupArray = [
        {
          label: '拆分组',
          icon: 'ContextGroup',
          fastKey: 'Ctrl + Shinft + G',
          onClick: doUnGrouping
        },
        { type: 'line' }
      ]
    } else {
      groupArray = [
        {
          label: '合并组',
          icon: 'ContextUnGroup',
          fastKey: 'Ctrl + G',
          onClick: doGrouping
        },
        { type: 'line' }
      ]
    }
  }
  meluLIst = [
    ...groupArray,
    {
      label: '复制',
      icon: 'ContextmenuCopy',
      children: [
        {
          label: '图层',
          fastKey: 'Ctrl + C',
          onClick: copy
        },
        {
          label: '图层样式',
          disabled: groupArray.length,
          fastKey: 'Ctrl + Alt + C',
          onClick: doCopyStyle
        }
      ]
    },
    {
      label: '创建为副本',
      icon: 'ContextmenuDup',
      fastKey: 'Ctrl + D',
      onClick: () => {
        copy()
        clip()
      }
    },
    {
      label: '剪切图层',
      icon: 'ContextmenuClip',
      fastKey: 'Ctrl + X',
      onClick: () => {
        copy()
        doDelete()
      }
    },
    {
      label: '粘贴',
      icon: 'ContextmenuPase',
      disabled: copyWidgths.value.length === 0 && copyStyle.value.style === null,
      children: [
        {
          label: '图层',
          fastKey: 'Ctrl + V',
          onClick: pase,
          disabled: copyWidgths.value.length === 0 // 如果被粘贴的 图层 数量为 0  ，（即没有先复制，就不允许粘贴）
        },
        {
          label: '图层样式',
          fastKey: 'Ctrl + Alt + V',
          disabled: groupArray.length || !copyStyle.value,
          onClick: doPaseStyle
        }
      ]
    },
    { type: 'line' },
    {
      label: '水平翻转',
      icon: 'ContextmenuHorizontal',
      fastKey: 'Shift + H',
      onClick: copy
    },
    {
      label: '垂直翻转',
      icon: 'Contextmenuvertical',
      fastKey: 'Shift + V',
      onClick: copy
    },
    { type: 'line' },
    {
      label: '顺序',
      icon: 'ContextmenuLayer',
      fastKey: '',
      children: [
        {
          label: '置顶',
          fastKey: '',
          onClick: toTop
        },
        {
          label: '置底',
          fastKey: '',
          onClick: toBottom
        },
        {
          label: '上移一层',
          fastKey: '',
          onClick: () => {
            adjustZindex('plus')
          }
        },
        {
          label: '下移一层',
          fastKey: '',
          onClick: () => {
            adjustZindex('mins')
          }
        }
      ]
    },
    {
      label: '图层位置',
      icon: 'ContextmenuPos',
      children: [
        {
          label: '左对齐',
          fastKey: 'Alt + A',
          onClick: () => {
            changeAlign('left')
          }
        },
        {
          label: '左右居中对齐',
          fastKey: 'Alt + H',
          onClick: () => {
            changeAlign('center')
          }
        },
        {
          label: '右对齐',
          fastKey: 'Alt + D',
          onClick: () => {
            changeAlign('right')
          }
        },
        {
          label: '顶部对齐',
          fastKey: 'Alt + W',
          onClick: () => {
            changeAlign('top')
          }
        },
        {
          label: '底部对齐',
          fastKey: 'Alt + S',
          onClick: () => {
            changeAlign('bottom')
          }
        }
      ]
    },
    ...lockObj,
    { type: 'line' },
    {
      label: '删除',
      icon: 'ContextmenuDel',
      fastKey: 'Del',
      onClick: doDelete
    }
  ]
  return meluLIst
}

/**
 * @description: 目录右键处理事件
 * @param {*} event
 * @author: majun
 */
export const contextMenuHandler = (event) => {
  event.preventDefault()
  const { mouseDownTime, mouseUpTime, setPosition, updateVisible, setMenuList } =
    useContextMenuStore()
  let targetArr = ['layer', 'layer-into', 'my-class', 'moveable-area', 'canvas']
  // console.log(event.target.id, 'event.target.id')
  // console.log(event.target.classList, 'event.target.classList')
  if (
    targetArr.some((item) => event.target.classList.contains(item)) &&
    mouseUpTime - mouseDownTime < 200
  ) {
    updateVisible && updateVisible(true)
    // console.log(event, 'event')
    // 不能把画布给激活了
    if (event.target.id && event.target.id !== 'canvas') {
      // 激活这个元素---group没有id
      setTargetIds([event.target.id])
      // 注意,这里拿到的lock是字符串
      const lock = event.target.dataset.lock === 'true'
      // 重新设置样式
      setControlPointLineColor(lock)
    }
    setPosition([event.clientX, event.clientY])
    // 设置菜单
    const list = getMenuList()
    setMenuList(list)
    // 这里要模拟左键点击并且激活该元素
  } else {
    console.log('这里不能右键显示的东西')
  }
}
