<template>
  <div>
    <div
      id="view-box"
      ref="viewBoxRef"
      class="view-box bookedit-view lc-ruler-content"
      :style="{ padding: pageTop + 'px' + ' 0' }"
    >
      <div
        id="view-wrap"
        class="view"
        :style="{
          padding: padding + 'px',
          width: bookWidth + padding * 2 + 'px',
          height: bookHeight + padding * 2 + 'px'
        }"
      >
        <div
          class="shelter"
          :style="{
            width: Math.floor(bookWidth) + 'px',
            height: Math.floor(bookHeight) + 'px',
            '--box-shadow-color': canvasBgColor
          }"
        >
        </div>
        <div
          class="shelter-bg transparent-bg"
          :style="{
            width: Math.floor(bookWidth) + 'px',
            height: Math.floor(bookHeight) + 'px'
          }"
        >
        </div>
        <div
          id="canvas"
          ref="canvasRef"
          class="canvas"
          data-type="page"
          :style="canvasStyle"
          @drop.prevent.stop="dropTarget"
          @dragenter.prevent.stop
          @dragover.prevent.stop
          @dragleave="dragExit"
          v-loading="loading"
          element-loading-text="图片加载中，请稍候"
        >
          <ComponentContainer
            :layerData="layerData"
            v-if="currentPage && currentPage.page_config"
          />
        </div>
        <GroupMovable />
        <GroupSelectable />
      </div>
    </div>
    <div class="tool">
      <div class="other">
        <a-tooltip content="缩小画布" mini>
          <span class="icon" @click="scaleMins"><sc-icon-minus /></span>
        </a-tooltip>
        <span class="select-menu">
          <a-dropdown position="top" @select="selectScale">
            <a-button>{{ showScale }}%&nbsp;<icon-up /></a-button>
            <template #content>
              <a-doption v-for="item in scaleMenu" :key="item" :value="item / 100">
                {{ item + '%' }}
              </a-doption>
            </template>
          </a-dropdown>
        </span>
        <a-tooltip content="放大画布" mini>
          <span class="icon" @click="scalePlus"><sc-icon-plus /></span>
        </a-tooltip>
      </div>
    </div>
    <!-- 右击菜单 -->
    <ContextMenu />
  </div>
</template>
<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { getFileType, getFileSuffix, hexToRgb } from '@/utils'
import MessageBox from '@/hooks/useMessage.js'
import addMouseWheel from '@/hooks/addMouseWheel.js'
import uploadFile from '@/hooks/upload.js'
import useStore from '@/stores/store.js'
import { storeToRefs } from 'pinia'
import useMouseTrap from '@/hooks/useMouseTrap.js'
import ComponentContainer from './ComponentContainer.vue'
import GroupMovable from './operate-provider/movable/GroupMovable.vue'
import GroupSelectable from './operate-provider/movable/GroupSelectable.vue'
import useContextMenuStore from '@/store/ContextMenuStore'
import eventOperateStore from '@/store/EventOperateStore.js'
import designerStore from '@/store/DesignerStore.js'
import ContextMenu from './operate-provider/right-click-menu/ContextMenu.vue'
import { contextMenuHandler } from '@/views/EditMiddle/operate-provider/right-click-menu/ContextMenuUtil'
const { setPointerTarget } = eventOperateStore()
const { layerData } = storeToRefs(designerStore())
console.log(layerData, 'layerData')
const store = useStore()
const { currentPage, bookData, pageZoom, pageTop, canvasBg, padding } = storeToRefs(store)
const emit = defineEmits(['updatePage', 'createWidget', 'loadingChange'])
const viewBoxRef = ref(null)
const canvasRef = ref(null)
onMounted(() => {
  //绑定事件到dom元素
  bindEventToDom()
  fullScreenChange()
  initPanzoom()
  initScale()
  $(window).bind('resize', initScale)
  addMouseWheel('view-box', (isDown) => {
    scale.value = isDown ? scale.value - 0.01 : scale.value + 0.01
    panzoom.zoom(scale.value)
    resetTop()
  })
})
const updateRect = () => {
  const { movableRef } = eventOperateStore()
  setTimeout(() => {
    movableRef.updateRect()
  }, 0)
}
/**
 * 绑定事件到dom元素
 */
function bindEventToDom() {
  document.addEventListener('contextmenu', contextMenuHandler)
  document.addEventListener('pointerdown', pointerDownHandler)
  document.addEventListener('pointerup', pointerUpHandler)
}
let scaleMenu = [10]
for (let i = 20; i <= 400; i += 20) {
  scaleMenu.push(i)
}
const bookHeight = computed(() => {
  return bookData.value.height * pageZoom.value
})
const bookWidth = computed(() => {
  return bookData.value.width * pageZoom.value
})
/**
 * @description:设置顶部距离
 * @author: majun
 */
const setcPaddingTop = () => {
  const { updatePaddingTop } = useStore()
  const wrapperHeight = (viewBoxRef.value && viewBoxRef.value.offsetHeight) || 0
  const paddingMin = 0
  let paddingTop = (wrapperHeight - bookHeight.value - 2 * padding.value) / 2
  paddingTop = Math.max(paddingTop, paddingMin)
  updatePaddingTop(paddingTop)
}
// 画布背景图片
const bgImg = computed(() => {
  if (currentPage.value?.img_url) {
    return currentPage.value.img_url
  } else {
    return ''
  }
})
const canvasBgColor = computed(() => {
  if (canvasBg.value) {
    let result = hexToRgb(canvasBg.value)
    return `rgba(${result.r}, ${result.g}, ${result.b}, 0.9)`
  } else {
    return `rgba(255,255,255,0.9)`
  }
})
const backgroundColor = computed(() => {
  if (currentPage.value?.page_bg_config?.color) {
    return currentPage.value.page_bg_config.color
  } else {
    return '#ffffff'
  }
})

const canvasStyle = computed(() => {
  let style = {}
  style.width = `${bookData.value.width}px`
  style.height = `${bookData.value.height}px`
  style.transform = `scale(${pageZoom.value})`
  style.transformOrigin = (pageZoom.value * 100 >= 100 ? 'center' : 'left') + ' top'
  style.backgroundColor = backgroundColor.value
  if (bgImg.value) {
    if (getFileSuffix(bgImg.value) !== 'svg') {
      const url = `${bgImg.value}?x-oss-process=image/resize,m_fill,w_${Math.round(
        bookData.value.width
      )},h_${Math.round(bookData.value.height)},quality,q_100`
      style.backgroundImage = `url(${url})`
    } else {
      style.backgroundImage = `url(${bgImg.value})`
    }
  }
  return style
})

// const vhLine = reactive({
//   vLine: [],
//   hLine: []
// })

let dropLoading = ref(false)
const dropTarget = (e) => {
  if (e.target.className.includes('group')) {
    return
  }
  dropLoading.value = true
  if (e && e.dataTransfer && e.dataTransfer.files) {
    const arrFiles = Array.from(e.dataTransfer.files)
    if (arrFiles.length === 0) {
      return
    }
    const fileType = getFileType(arrFiles[0]['name'])
    if (!['image', 'video', 'audio'].includes(fileType)) {
      MessageBox.error('只能拖入图片视频和音频')
      return
    }
    uploadFile(arrFiles[0], (file) => {
      const data = {
        style: {
          left: e.layerX / pageZoom.value,
          top: e.layerY / pageZoom.value
        },
        content: file
      }
      emit('createWidget', fileType, data)
    })
  }
}
const dragExit = (e) => {
  dropLoading.value = false
}

let isFullScreen = ref(false)
const fullScreenChange = () => {
  document.addEventListener(
    'fullscreenchange',
    () => {
      if (document.fullscreen) {
        isFullScreen.value = true
      } else {
        isFullScreen.value = false
      }
    },
    false
  )
}

let panzoom
let scale = ref(1) // 缩放比例
const showScale = computed(() => {
  return Math.round(scale.value * 100)
})
const initPanzoom = () => {
  // document: https://github.com/timmywil/panzoom
  const elem = document.querySelector('#canvas')
  panzoom = Panzoom(elem, {
    noBind: true,
    cursor: 'default',
    smoothScroll: true,
    maxScale: 5,
    step: 0.1,
    minScale: 0.01
  })
  elem.addEventListener('panzoomchange', (event) => {
    scale.value = event.detail.scale
  })
  elem.addEventListener('pointerup', (e) => {
    panzoom.handleUp(e)
  })
}
const initScale = () => {
  if (!$('#canvas').width()) {
    setTimeout(() => {
      initScale()
    }, 50)
    return
  }
  let height = $('.editor-main').height() - 50
  let width = $('.editor-main').width() - 50
  let caWidth = $('#canvas').width()
  let caheight = $('#canvas').height()
  if (caWidth > width || caheight > height) {
    if (caWidth > caheight) {
      scale.value = width / caWidth
    } else {
      scale.value = height / (caheight + padding.value * 2 + 150)
    }
  } else {
    scale.value = 1
  }
  panzoom.zoom(scale.value) // , { animate: true }
}
const selectScale = (value) => {
  if (value === 1) {
    panzoom.reset()
  } else {
    panzoom.zoom(value)
  }
  resetTop()
}
const scaleMins = () => {
  scale.value -= 0.1
  panzoom.zoom(scale.value)
  resetTop()
}

/**
 * @description: 重置顶部距离，防止缩放后顶部距离不正确的问题
 * @author: majun
 */
const resetTop = () => {
  setTimeout(() => {
    setcPaddingTop()
    updateRect()
  }, 0)
}
const scalePlus = () => {
  if (scale.value < 4) {
    scale.value += 0.1
  }
  panzoom.zoom(scale.value)
  resetTop()
}
watch(scale, (newVal) => {
  store.updateZoom(newVal)
})
let loading = ref(false)

/**
 * 卸载dom元素上的事件
 */
function unbindEventToDom() {
  document.removeEventListener('contextmenu', contextMenuHandler)
  document.removeEventListener('pointerdown', pointerDownHandler)
  document.removeEventListener('pointerup', pointerUpHandler)
}

const pointerDownHandler = () => {
  const { setMouseDownTime } = useContextMenuStore()
  setMouseDownTime(Date.now())
}

const pointerUpHandler = (event) => {
  const { setMouseUpTime } = useContextMenuStore()
  setMouseUpTime(Date.now())
  setPointerTarget(event.target)
}

// 设置键盘事件
useMouseTrap({
  initScale,
  scaleMins,
  scalePlus
})

onUnmounted(() => {
  unbindEventToDom()
})
</script>
<style lang="less">
.dsubmenu-wrap {
  .arco-dropdown {
    padding: 12px 0;
    border-radius: 10px;
  }
  .arco-dropdown-option.arco-dropdown-option-has-suffix {
    justify-content: flex-start !important;

    .arco-dropdown-option-content {
      flex: 1;
    }
  }
}
</style>
<style lang="less" scoped>
:deep(.arco-dropdown-option-content) {
  flex: 1 !important;
  display: flex;
  width: 200px;
  justify-content: space-between;

  span.key {
    font-size: 12px;
    font-weight: 400;
    color: #3d3d3d;
  }
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #d4d7dd;

  &:hover {
    background-color: #9ea6b0;
  }
}

::-webkit-scrollbar-track {
  background-color: #f0f1f3;
}

.view-box {
  position: relative;
  width: 100%;
  height: calc(100vh - 68px);
  overflow: auto;
}

.view {
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
}

.canvas {
  background-position: 0px 0px;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  position: relative;
}

.shelter {
  position: absolute;
  pointer-events: none;
  box-shadow: 0 0 0 5000px var(--box-shadow-color);
  z-index: 8;
}

.shelter-bg {
  position: absolute;
  pointer-events: none;
  background-color: #f0f0f0;
  background-image:
    -webkit-gradient(
      linear,
      left bottom,
      right top,
      color-stop(25%, #fff),
      color-stop(25%, transparent),
      color-stop(75%, transparent),
      color-stop(75%, #fff),
      to(#fff)
    ),
    -webkit-gradient(linear, left bottom, right top, color-stop(25%, #fff), color-stop(25%, transparent), color-stop(75%, transparent), color-stop(75%, #fff), to(#fff));
  background-image:
    -webkit-linear-gradient(
      bottom left,
      #fff 25%,
      transparent 25%,
      transparent 75%,
      #fff 75%,
      #fff
    ),
    -webkit-linear-gradient(bottom left, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
  background-image: linear-gradient(
      to top right,
      #fff 25%,
      transparent 25%,
      transparent 75%,
      #fff 75%,
      #fff
    ),
    linear-gradient(to top right, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
  background-position:
    0 0,
    8px 8px;
  background-size: 16px 16px;
  overflow: hidden;
  user-select: none;
}

.ref-line {
  position: absolute;
  background-color: #f8bf3b;
  z-index: 9999;
}

.v-line {
  width: 2px;
}

.h-line {
  height: 1px;
}

:deep(.hightLight) {
  border-width: 1px !important;
  border-color: rgb(0, 187, 255);
  box-sizing: border-box;
}

.tool {
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 20;
  display: flex;
  align-items: center;

  .other {
    padding: 0 10px;
    margin: 0 8px 0 0;
    height: 48px;
    background: #fff;
    display: flex;
    align-items: center;
    border-radius: 10px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      margin: 0 0 0 5px;
      color: #686c78;
      cursor: pointer;

      &:first-child {
        margin: 0;
      }

      &.active {
        color: var(--xys-main-color);
      }
    }
  }

  .help {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    background-color: var(--xys-main-color);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
  }
}

.canvasMenu {
  width: 220px;
  position: absolute;
  z-index: 999999;
  padding: 10px 0;
  min-width: 150px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: var(--color-bg-popup);
  border: 1px solid var(--color-fill-3);
  border-radius: 10px;
  box-sizing: border-box;
  --baseFontSize: 14px;

  .options {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 12px;
    color: var(--color-text-1);
    font-size: var(--baseFontSize);
    line-height: 42px;
    text-align: left;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      color: var(--color-text-1);
      background-color: var(--color-fill-2);
      transition: all 0.1s cubic-bezier(0, 0, 1, 1);
    }

    span {
      margin: 0 0 0 5px;
    }
  }
}

.arco-dropdown-option {
  padding: 0 12px;
}

.canvas {
  :deep(.drag-component) {
    position: absolute;
    touch-action: none;

    .drag-box {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      touch-action: none;
    }

    .layer {
      width: 100%;
      height: 100%;
    }

    .input-mask,
    .contenteditable {
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: block;
      background: none;
      border: none;
      outline: none;
      resize: none;
      overflow: hidden;
      &:focus {
        border: none;
      }
    }

    .input-mask {
      z-index: 10;
    }

    .my-handle-class {
      position: absolute;
      z-index: 999999;
      box-sizing: border-box;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgb(0 0 0 / 20%);
    }

    .my-handle-class-rot {
      width: 16px !important;
      height: 16px !important;
      left: 50% !important;
      top: -35px !important;
      margin: 0 0 0 -8px !important;
      border: none !important;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
    }

    .my-handle-class-rot::before {
      display: block;
      width: 16px;
      height: 16px;
      content: '';
      font-size: 0;
      line-height: 0;
      background: url('@/assets/images/rotat.svg');
      background-size: cover;
    }
  }
}
</style>
