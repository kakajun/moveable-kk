/*
    编辑页面组件的公共方法
*/
import { onUpdated, onMounted, watch, ref, computed } from 'vue'

import { debounce, cloneDeep } from 'lodash'
import useStore from '@/stores/store.js'
import { isEqual } from 'lodash'
import historyRecordOperateProxy from '@/views/EditMiddle/operate-provider/undo-redo/HistoryRecordOperateProxy'

/*
 * props: 组件传过来的属性
 * useWidget: 拖拽组件封装方法
 */
export function useWidget(props) {
  let propsItem = computed(() => cloneDeep(props.item))
  let curAnimate = 0
  let totalAnimate = 0
  let style = ref({})
  const layerRef = ref(undefined)
  const store = useStore()
  const componentData = computed(() => propsItem.value.componentData)
  const setAnimationStyle = (animation) => {
    const { name, func, infinite, count, alternate, duration, delay } = animation
    return {
      animationName: name,
      animationDuration: `${duration}s`,
      animationTimingFunction: func ? 'linear' : 'ease-in-out',
      animationDelay: `${delay}s`,
      animationIterationCount: infinite ? 'infinite' : count,
      animationDirection: alternate ? 'alternate' : 'normal',
      animationPlayState: props.playAnimate ? 'running' : 'paused'
    }
  }
  const animateEnd = () => {
    style.value = {}
    const animateList = props.animate
    setTimeout(() => {
      curAnimate++
      if (curAnimate < totalAnimate) {
        style.value = setAnimationStyle(animateList[curAnimate])
      }
    }, 0)
  }

  const flipStyle = computed(() => {
    const transformValues = []
    if (props.item.style.flipVertical) {
      transformValues.push('rotateX(180deg)')
    }
    if (props.item.style.flipHorizontal) {
      transformValues.push('rotateY(180deg)')
    }
    return {
      transform: transformValues.join(' ')
    }
  })

  const commonStyle = (item, style) => {
    let styles = {
      ...item.style,
      ...style,
      left: item.style.left - props.baseLeft + 'px',
      top: item.style.top - props.baseTop + 'px',
      width: item.style.width + 'px',
      height: item.style.height + 'px',
      transform: item.style.transform || '',
      fontSize: `${item.style.fontSize}px`,
      lineHeight: `${item.style.lineHeight * item.style.fontSize}px`,
      letterSpacing: (item.style.fontSize * item.style.letterSpacing) / 100 + 'px',
      color: `${item.style.color}`,
      backgroundColor: item.style.backgroundColor,
      opacity: item.style.opacity,
      borderColor: item.style.borderColor,
      textStroke: `${item.style.textStrokeBorder}px ${item.style.textStrokeColor || ''}`,
      borderRadius: `${item.style.borderLeftTopRadius}px  ${item.style.borderRightTopRadius}px ${item.style.borderRightBottomRadius}px ${item.style.borderLeftBottomRadius}px`,
      borderWidth: `${item.style.borderWidth}px`,
      borderTopWidth: `${item.style.borderTopWidth}px`,
      borderRightWidth: `${item.style.borderRightWidth}px`,
      borderBottomWidth: `${item.style.borderBottomWidth}px`,
      borderLeftWidth: `${item.style.borderLeftWidth}px`,
      borderStyle: 'solid'
      // overflow: 'hidden'
    }
    if (item.style.boxshadowType !== 'none' && item.style.boxShadowColor) {
      if (propsItem.value.type === 'text' || propsItem.value.type === 'link') {
        // 文字组件和2链接组件是 text-shadow, 其余组件是box-shadow
        styles.textShadow = `${item.style.boxShadowX}px ${item.style.boxShadowY}px ${item.style.boxShadowBlur}px ${item.style.boxShadowColor}`
      } else {
        const dir = item.style.boxshadowType === 'outset' ? '' : 'inset'
        styles.boxShadow = `${item.style.boxShadowX}px ${item.style.boxShadowY}px ${item.style.boxShadowBlur}px ${item.style.boxShadowColor} ${dir}`
      }
    }
    return styles
  }
  watch(
    [() => props.playAnimate, () => props.animate],
    (newVal, oldVal) => {
      const playAnimate = newVal[0]
      const playAnimateOld = oldVal[0]
      const animateList = newVal[1]
      const animateListOld = oldVal[1]
      if (!playAnimate || !animateList.length) {
        style.value = {}
        return
      }

      if (playAnimate === playAnimateOld && isEqual(animateList, animateListOld)) {
        return
      }

      curAnimate = 0
      totalAnimate = animateList.length
      style.value = setAnimationStyle(animateList[0])
    },
    { deep: true }
  )

  onUpdated(() => {
    // updateRecord && updateRecord()
  })
  onMounted(() => {
    // updateRecord && updateRecord()
  })

  /**
   * @description: 子组件要更新的就在这里处理
   * @author: majun
   */
  const update = () => {
    historyRecordOperateProxy.doOrderUpd([propsItem.value])
  }

  return {
    layerRef,
    style,
    commonStyle,
    flipStyle,
    propsItem,
    store,
    update,
    componentData,
    animateEnd
  }
}
