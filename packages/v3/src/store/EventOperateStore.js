import { defineStore } from 'pinia'
import designerStore from '@/store/DesignerStore.js'
import useStore from '@/stores/store.js'
import LayerUtil from '@/util/LayerUtil.js'

export default defineStore('eventOperateStore', {
  state: () => ({
    movableRef: '',
    selectorRef: '',
    rulerRef: '',
    targets: [],
    targetIds: [],
    pointerTarget: null,
    groupCoordinate: {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
      rotate: '',
      groupWidth: 0,
      groupHeight: 0
    },
    backoff: false,
    scale: 1,
    ratio: 1
  }),
  getters: {
    minZindex() {
      const { currentPage } = useStore()
      return (
        currentPage.page_config?.reduce((a, b) => {
          return Math.min(a, b.style.zIndex)
        }, 1) || 0
      )
    },
    maxZindex() {
      const { currentPage } = useStore()
      return (
        currentPage.page_config?.reduce((a, b) => {
          return Math.max(a, b.style.zIndex)
        }, 1) || 0
      )
    },
    isGroup() {
      return LayerUtil.hasSameGroup(this.targetIds)
    },
    /**
     * @description:选中的对象,其中组的话,返回的是组对象,其余临时返回空对象
     *   当选了很多个时要用selectWidgets,它是数组
     * @author: majun
     */
    currentWidget() {
      const { layerConfigs } = designerStore()
      if (this.targetIds.length === 1) {
        return layerConfigs[this.targetIds[0]]
      } else if (this.isGroup) {
        const obj = layerConfigs[this.targetIds[0]]
        const parent = layerConfigs[obj.parent]
        return parent
      } else {
        return {}
      }
    },
    /**
     * @description: 记录多选的组件,包含group,但不包含子节点,想使用单个请用currentWidget
     * @author: majun
     */
    selectWidgets() {
      const { layerData } = designerStore()
      const alls = layerData.filter((item) => this.targetIds.includes(item.id)) || []
      return alls
    },
    /**
     * @description: 统计选的组件个数, 方法是统计没有parent的个数
     * @author: majun
     */
    selectCount() {
      return this.selectWidgets.length
    }
  },
  actions: {
    setMovableRef(ref) {
      this.movableRef = ref
    },
    setSelectorRef(ref) {
      this.selectorRef = ref
    },
    setRuleRef(ref) {
      this.rulerRef = ref
    },
    setTargetIds(ids) {
      this.targetIds = ids
      const _targets = []
      ids.forEach((id) => {
        const target = document.getElementById(id)
        target && _targets.push(target)
      })
      this.targets = _targets
      // 若选中多个组件，计算更新组件多选时的左上角坐标
      if (this.targets.length > 1) {
        this.calculateGroupCoordinate(this.targets)
      }
    },
    setPointerTarget(target) {
      this.pointerTarget = target
    },
    setGroupCoordinate(coordinate) {
      this.groupCoordinate = {
        ...this.groupCoordinate,
        ...coordinate
      }
    },
    // 每次setTargetIds都会调用，及时更新群组左上角坐标系
    calculateGroupCoordinate(compArr) {
      const { layerConfigs } = designerStore()
      let groupCoordinate = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
        rotate: 0,
        groupWidth: 0,
        groupHeight: 0
      }
      let isSetTrans = false // 设置标记是否已经设置过transform
      compArr.forEach((item) => {
        const layerConfig = layerConfigs[item.id]
        const { left, top, width, height, rotate } = layerConfig.style
        const centerX = left + width / 2
        const centerY = top + height / 2
        if (layerConfig.type !== 'group' && rotate && !isSetTrans) {
          if (!groupCoordinate.rotate) {
            groupCoordinate.rotate = rotate
          } else if (groupCoordinate.rotate != rotate) {
            groupCoordinate.rotate = 0
            isSetTrans = true
          }
        }
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
      this.setGroupCoordinate(groupCoordinate)
    },
    setScale(scale) {
      this.scale = scale
    },
    setBackoff(backoff) {
      this.backoff = backoff
    }
  }
})
