import { nextTick, onMounted, onUnmounted } from 'vue'
import Mousetrap from 'mousetrap'
import useStore from '@/stores/store.js'
import { storeToRefs } from 'pinia'
import { SHAPE_LIST } from '@/config/shapes'
import {
  doBaseBottomDecreaseUp,
  doBaseBottomEnlargeUp,
  doBaseLeftDecreaseRight,
  doBaseLeftEnlargeRight,
  doBaseRightDecreaseLeft,
  doBaseRightEnlargeLeft,
  doBaseUpDecreaseDown,
  doBaseUpEnlargeDown,
  doCopy,
  copy,
  pase,
  clip,
  doDelete,
  doGrouping,
  doHide,
  doLock,
  doMoveDown,
  doMoveLeft,
  doMoveRight,
  doMoveUp,
  doSave,
  doUnGrouping,
  doUnLock,
  redo,
  selectAll,
  toBottom,
  toggleLayer,
  toTop,
  undo,
  doExise,
  fasterCreateWidget,
  fastFont,
  doCopyStyle,
  doPaseStyle,
  doPasteEvent
} from '@/views/EditMiddle/operate-provider/hot-key/HotKeyImpl'
import LayerUtil from '@/util/LayerUtil.js'
import { changeAlign } from '@/util/DesignerUtils'
import eventOperateStore from '@/store/EventOperateStore.js'
import designerStore from '@/store/DesignerStore'
const dStore = designerStore()
const { copyWidgths, copyStyle } = storeToRefs(dStore) // 取出即将被 粘贴的图层
const { targetIds } = storeToRefs(eventOperateStore())

export default function useMouseTrap({ initScale, scaleMins, scalePlus, createDeepWidget }) {
  const store = useStore()
  const handleKeydown = (e) => {
    if (e.key === 'Control' || e.key === 'Shift') {
      store.updateAltDown(true)
    }
  }
  const handleKeyup = (e) => {
    let checkCtrl = null
    if (e.key === 'Control' || e.key === 'Shift') {
      clearTimeout(checkCtrl)
      checkCtrl = setTimeout(() => {
        store.updateAltDown(false)
      }, 200)
    }
  }
  const { currentPage, isEditWidght } = storeToRefs(store)

  //需要屏蔽浏览器默认快捷键效果的快捷键列表
  const shieldKeyList = [
    'control + s',
    'alt',
    'control + l',
    'control + shift + l',
    'shift + control + l',
    'control + h',
    // 'control + d',
    'control + k',
    'control + 5',
    'control + g',
    'control + shift + g',
    'shift + control + g'
  ]
  const specialDomCache = {}
  //先从缓存中获取dom元素，如果没有则从document中获取并缓存
  const getSpecialDomCache = (classSelector) => {
    const specialDom = specialDomCache[classSelector]
    if (specialDom) {
      return specialDom
    } else {
      const specialDom = document.querySelector(classSelector)
      if (!specialDom) {
        return null
      }
      specialDomCache[classSelector] = specialDom
      return specialDom
    }
  }
  //如果设定了指定范围并且不在范围内则不执行
  const checkRange = (e) => {
    //先从缓存中获取dom元素，如果没有则从document中获取并缓存
    const targetDom = getSpecialDomCache('.lc-ruler-content')
    const { pointerTarget } = eventOperateStore()
    if (!targetDom || !targetDom.contains(pointerTarget)) {
      return false
    } else return true
  }
  onMounted(() => {
    Mousetrap.bind(['ctrl', 'shift'], (e) => {
      handleKeydown && handleKeydown(e)
    })
    Mousetrap.bind(
      ['ctrl', 'shift'],
      (e) => {
        handleKeyup && handleKeyup(e)
      },
      'keyup'
    )
    Mousetrap.bind('shift+r', (e) => {
      e.preventDefault()
      store.updateOpenGuide()
    })
    Mousetrap.bind('ctrl+0', (e) => {
      initScale && initScale()
    })
    Mousetrap.bind('ctrl++', (e) => {
      console.log(e, 'eeeeeeee')
      scalePlus && scalePlus()
    })
    Mousetrap.bind('ctrl+mousewheelup', (e) => {
      console.log(e, 'eeeeeeee')
    })
    Mousetrap.bind('ctrl+=', (e) => {
      e.preventDefault()
      scalePlus && scalePlus()
    })
    Mousetrap.bind('ctrl+-', (e) => {
      scaleMins && scaleMins()
    })
    Mousetrap.bind('ctrl+.', (e) => {
      // 隐藏面板
    })
    // 全选
    Mousetrap.bind('ctrl+a', (e) => {
      checkRange() && selectAll()
    })
    Mousetrap.bind('esc', (e) => {
      checkRange() && doExise()
    })
    Mousetrap.bind('ctrl+x', (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        copy()
        doDelete()
      }
    })
    Mousetrap.bind('ctrl+d', async (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        copy()
        clip()
      }
      return false
    })
    Mousetrap.bind('ctrl+g', (e) => {
      e.preventDefault()
      checkRange() && doGrouping()
    })
    Mousetrap.bind('ctrl+shift+g', (e) => {
      e.preventDefault()
      checkRange() && doUnGrouping()
    })
    Mousetrap.bind('ctrl+l', (e) => {
      checkRange() && doLock()
      e.preventDefault()
    })
    Mousetrap.bind('ctrl+shift+l', (e) => {
      checkRange() && doUnLock()
    })
    Mousetrap.bind('ctrl+alt+c', (e) => {
      checkRange() && doUnGrouping()
    })
    Mousetrap.bind('ctrl+c', (e) => {
      // 处于编辑状态不可删除
      !isEditWidght.value && checkRange() && copy()
    })
    Mousetrap.bind('ctrl+v', (e) => {
      if (!isEditWidght.value && checkRange() && copyWidgths.value.length !== 0) {
        pase()
      }
      console.log('ctrl+v')
    })
    Mousetrap.bind('ctrl+s', (e) => {
      e.preventDefault()
      // 处于编辑状态不可删除
      doSave()
    })
    Mousetrap.bind('ctrl+alt+v', (e) => {
      checkRange() && doCopy()
    })
    Mousetrap.bind('left', (e) => {
      checkRange() && doMoveLeft()
    })
    Mousetrap.bind('right', (e) => {
      checkRange() && doMoveRight()
    })
    Mousetrap.bind('shift+left', (e) => {
      checkRange() && doBaseRightEnlargeLeft()
    })
    Mousetrap.bind('shift+right', (e) => {
      checkRange() && doBaseLeftEnlargeRight()
    })
    Mousetrap.bind('up', (e) => {
      checkRange() && doMoveUp()
    })
    Mousetrap.bind('down', (e) => {
      checkRange() && doMoveDown()
    })
    Mousetrap.bind('shift+up', (e) => {
      checkRange() && doBaseBottomDecreaseUp()
    })
    Mousetrap.bind('shift+down', (e) => {
      checkRange() && doBaseUpDecreaseDown()
    })
    Mousetrap.bind('shift+b', (e) => {
      checkRange() && fastFont('weight')
    })
    Mousetrap.bind('shift++', (e) => {
      checkRange() && fastFont('plus')
    })
    Mousetrap.bind('shift+=', (e) => {
      checkRange() && fastFont('plus')
    })
    Mousetrap.bind('shift+-', (e) => {
      checkRange() && fastFont('mins')
    })
    Mousetrap.bind('shift+_', (e) => {
      checkRange() && fastFont('mins')
    })
    Mousetrap.bind('ctrl+r', (e) => {
      checkRange() && doUnGrouping()
    })
    Mousetrap.bind('ctrl+o', (e) => {
      checkRange() && doUnGrouping()
    })
    Mousetrap.bind('ctrl+shift+z', (e) => {
      console.log(e)
      checkRange() && redo()
    })
    Mousetrap.bind('ctrl+z', (e) => {
      console.log(e)
      checkRange() && undo()
    })
    Mousetrap.bind('del', (e) => {
      // 处于编辑状态不可删除
      !isEditWidght.value && checkRange() && doDelete()
    })
    Mousetrap.bind('l', (e) => {
      // 添加直线
      !isEditWidght.value && checkRange() && fasterCreateWidget('line')
    })
    Mousetrap.bind('r', (e) => {
      // 添加直线
      !isEditWidght.value && checkRange() && fasterCreateWidget('react')
    })
    Mousetrap.bind('o', (e) => {
      // 添加直线
      !isEditWidght.value && checkRange() && fasterCreateWidget('circle')
    })
    Mousetrap.bind('t', (e) => {
      // 添加直线
      !isEditWidght.value && checkRange() && fasterCreateWidget('text')
    })
    Mousetrap.bind('alt+a', (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        changeAlign('left')
      }
    })
    Mousetrap.bind('alt+h', (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        changeAlign('center')
      }
    })
    Mousetrap.bind('alt+d', (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        changeAlign('right')
      }
    })
    Mousetrap.bind('alt+w', (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        changeAlign('top')
      }
    })
    Mousetrap.bind('alt+s', (e) => {
      if (!isEditWidght.value && checkRange()) {
        e.preventDefault()
        changeAlign('bottom')
      }
    })
    Mousetrap.bind('ctrl+alt+c', (e) => {
      if (!isEditWidght.value && checkRange()) {
        const isGroup = LayerUtil.hasSameGroup(targetIds.value)
        if (isGroup) {
          return
        }
        e.preventDefault()
        doCopyStyle()
      }
    })
    Mousetrap.bind('ctrl+alt+v', (e) => {
      if (!isEditWidght.value && checkRange()) {
        const isGroup = LayerUtil.hasSameGroup(targetIds.value)
        if (isGroup || !copyStyle.value.style) {
          return
        }
        e.preventDefault()
        doPaseStyle()
      }
    })
    // ctrl + v
    // window.addEventListener('paste', pasteEvent)
  })
  onUnmounted(() => {
    Mousetrap.reset()
    // 卸载事件
    // window.removeEventListener('paste', pasteEvent)
  })

  function pasteEvent(e) {
    if (checkRange()) {
      doPasteEvent(e)
    } else {
      console.log('不在范围内')
    }
  }
}
