
<template>
    <Moveable ref="movableRef" :target="targets" :draggable="true" :scalable="true" :rotatable="true" :resizable="true" :keepRatio="keepRatio"
        :zoom="0.8" className="zk-moveable-style" :maxSnapElementGuidelineDistance="300" :snappable="true" :snapGap="false"
        :snapThreshold="5" :isDisplaySnapDigit="true" :snapDirections="snapDirections"  @rotate-end="onRotateEnd"
        :elementSnapDirections="elementSnapDirections" :verticalGuidelines="['0', '50%', '100%']"
        :horizontalGuidelines="['0', '50%', '100%']" :isDisplayInnerSnapDigit="true" @changeTargets="onChangeTargets"
        :elementGuidelines="elementGuidelines" :throttleDrag="rasterize ? dragStep : 1"
        :throttleResize="rasterize ? resizeStep : 1"  @dragStart="onDragStart"
        @render="onRender"  @rotate-group-end="onRotateGroupEnd"
        @dragEnd="onDragEnd" @dragGroupEnd="onDragGroupEnd" @resizeStart="onResizeStart"
      @resizeEnd="onResizeEnd" @resizeGroupStart="onResizeGroupStart" @render-group="onRenderGroup"
        @resizeGroupEnd="onResizeGroupEnd" />
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import designerStore from "../../store/DesignerStore.js";
import Moveable from "../../../components/Moveable.vue";
import historyRecordOperateProxy from "../undo-redo/HistoryRecordOperateProxy";
import eventOperateStore from "../EventOperateStore.js";
const { canvasConfig: { rasterize, dragStep, resizeStep },layerConfigs ,statisticInfo} = designerStore();
import { storeToRefs } from 'pinia'
const movableRef = ref(null);
const { selectorRef, targets } = storeToRefs(eventOperateStore());
const snapDirections = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    center: true,
    middle: true
}
const elementSnapDirections = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    center: true,
    middle: true
}
let elementGuidelines = ref([])
let keepRatio = ref(false)
onMounted(() => {
    elementGuidelines.value = getAllDoms()
    const { setMovableRef } = eventOperateStore();
    setMovableRef(movableRef.value);
});

const getAllDoms = () => {
    const selectedTargets = document.getElementsByClassName("lc-comp-item");
    // 如果是节点里面的就忽略不用再去对齐了, 直接跟group外面的框框对齐
    const allDoms = Array.from(selectedTargets).filter(item => {
        return !Boolean(item.dataset['group'])
    })
    return [document.getElementsByClassName("lc-event-container")[0], ...allDoms]
}

const onChangeTargets = e => {
    if (e.targets.length == 1) {
        const allDoms = getAllDoms()
        // 目标变化后要过滤掉自己,否则会产生对标原来自己位置的bug
        elementGuidelines.value = allDoms.filter(item => e.targets[0] != item)
    }
}

const onRender = (e) => {
  e.target.style.cssText += e.cssText
}
const onRotateEnd = (e) => {
  console.log('onRotateEnd')


  const { backoff, setBackoff } = eventOperateStore()
  const { lastEvent, target } = e
  if (lastEvent) {
    const { transform } = lastEvent
    const data = [
      {
        id: target.id,
        type: target.dataset.type,
        style: {
          transform
        }
      }
    ]
    //更新组件位置信息
    if (backoff) {
      updateLayout(data, false)
      setBackoff(false)
    } else historyRecordOperateProxy.doRotate(data)
  }
}

const onRotateGroupEnd = (e) => {
  const { backoff, setBackoff } = eventOperateStore()
  const {
    lastEvent: { transform }
  } = e
  const { layerConfigs } = designerStore();
  const target = e.events[0].target
  const parent = layerConfigs[target.id].parent
  const parentObj = layerConfigs[parent]
  let rotate = ''
  const tf = e.target.style.transform
  const iof = tf.indexOf('rotate')
  if (iof != -1) {
    const index = iof + 'rotate'.length
    const half = tf.substring(index + 1)
    const result = half.replace(/deg/g, '')
    rotate = result.slice(0, result.indexOf(')'))
  }
  // TODO 为什么translate(180px, 10px) 我也不知道,试出来的
  const data = [
    {
      id: parentObj.id,
      type: parentObj.type,
      style: {
        transform: `rotate(${rotate}deg)`
      }
    }
  ]

  if (!e.lastEvent) return
  console.log(data, 'onRotateGroupEnd')
  //更新组件位置信息并记录操作
  if (data.length > 0) {
    if (backoff) {
      updateLayout(data, false)
      setBackoff(false)
    } else historyRecordOperateProxy.doRotate(data, transform)
  }
}
const onDragStart = (e) => {
    const { target } = e;
    const { layerConfigs } = designerStore();
    const { lock } = layerConfigs[target.id];
    if (lock) { e.stop()
         return false };
};

const onDragEnd = (e) => {
    const { updateLayout } = designerStore();
    const { backoff, setBackoff } = eventOperateStore();
    const { lastEvent, target } = e;
    if (lastEvent) {
        const { beforeTranslate } = lastEvent;
        const data = [
            {
                id: target.id,
                width: target.offsetWidth,
                height: target.offsetHeight,
                type: target.dataset.type,
                position: [beforeTranslate[0], beforeTranslate[1]],
            },
        ];
        //更新组件位置信息
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doDrag(data);
    }
};

const onDragGroupEnd = (e) => {
    const { targets } = e;
    console.log(e, "onDragGroupEnd");
    //通过第一个元素来判断。 框选的所有组件是否处于锁定状态，处于锁定状态，则不允许拖拽和缩放。
    const { updateLayout, layerConfigs } = designerStore();
    const firstLock = layerConfigs[targets[0].id].lock;
    if (firstLock) { e.stop()
         return false };
    const { backoff, setBackoff, setGroupCoordinate, groupCoordinate } = eventOperateStore();
    const data = [];
    e.events.forEach((ev) => {
        const { target, lastEvent } = ev;
        if (lastEvent) {
            const { beforeTranslate } = lastEvent;
            data.push({
                id: target.id,
                width: target.offsetWidth,
                height: target.offsetHeight,
                type: target.dataset.type,
                position: [beforeTranslate[0], beforeTranslate[1]],
            });
        }
    });
    //计算多选组件时的坐标信息
    const posChange = e?.lastEvent?.beforeTranslate || [0, 0];
    const minX = groupCoordinate.minX + posChange[0];
    const minY = groupCoordinate.minY + posChange[1];
    setGroupCoordinate({ minX, minY });
    //更新组件位置信息并记录操作
    if (data.length > 0) {
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doDrag(data);
    }
};

const onResizeStart = (e) => {
    const { target } = e;
    const { layerConfigs } = designerStore();
    const { lock } = layerConfigs[target.id];
    if (lock) { e.stop()
          return false };
};

const onResizeEnd = (e) => {
    const { updateLayout } = designerStore();
    const { backoff, setBackoff } = eventOperateStore();
    const { target, lastEvent } = e;
    if (lastEvent) {
        const { width, height, drag: { translate }, direction } = lastEvent;
        const data = [
            {
                id: target.id,
                width: width,
                height: height,
                type: target.dataset.type,
                position: [translate[0], translate[1]],
            },
        ];
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doResize(data, direction);
    }
};

const onResizeGroupStart = (e) => {
    const { targets } = e;
    const { layerConfigs } = designerStore();
    const firstLock = layerConfigs[targets[0].id].lock;
    if (firstLock) { e.stop()
          return false };
};
const onRenderGroup = (e) => {
  e.events.forEach((ev) => {
    ev.target.style.cssText += ev.cssText
  })
}

const onResizeGroupEnd = (e) => {
    const { updateLayout } = designerStore();
    const { backoff, setBackoff } = eventOperateStore();
    const data = [];
    console.log(e, "onResizeGroupEnd");
    e.events.forEach((ev) => {
        const { target, lastEvent } = ev;
        if (lastEvent) {
            const { drag: { translate } } = lastEvent;
            data.push({
                id: target.id,
                width: target.offsetWidth,
                height: target.offsetHeight,
                type: target.dataset.type,
                position: [translate[0], translate[1]],
            });
        }
    });
    if (!e.lastEvent) return;
    const { dist, direction } = e.lastEvent;
    //更新组件尺寸和坐标信息
    if (data.length > 0) {
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doResize(data, direction);
        //组件多选情况下，重新计算多选组件的尺寸和坐标信息
        const { setGroupCoordinate, groupCoordinate } = eventOperateStore();
        if (direction[0] === -1 || direction[1] === -1) {
            //缩放元素左侧或上侧，此时需要同时改变坐标
            setGroupCoordinate({
                minX: groupCoordinate.minX - dist[0],
                minY: groupCoordinate.minY - dist[1],
                groupWidth: groupCoordinate.groupWidth + dist[0],
                groupHeight: groupCoordinate.groupHeight + dist[1],
            });
        } else {
            setGroupCoordinate({
                groupWidth: groupCoordinate.groupWidth + dist[0],
                groupHeight: groupCoordinate.groupHeight + dist[1],
            });
        }
    }
};
</script>
<style lang="less">
.moveable-control-box.zk-moveable-style {
    --moveable-color: #6ccfff;
    --guideline-color: #ff4aff;
    z-index: 999;

    // 缩放圆点
    .moveable-control {
        background: #fff;
        box-sizing: border-box;
        display: block;
        border: 1px solid #c0c5cf;
        box-shadow: 0 0 2px 0 rgb(86, 90, 98, 0.2);
        width: 12px;
        height: 12px;
        margin-top: -6px;
        margin-left: -6px;

        // 上下缩放点
        &.moveable-n,
        &.moveable-s {
            width: 16px;
            height: 8px;
            margin-top: -4px;
            margin-left: -8px;
            border-radius: 6px;
        }

        // 左右缩放点
        &.moveable-e,
        &.moveable-w {
            width: 8px;
            height: 16px;
            margin-left: -4px;
            margin-top: -8px;
            border-radius: 6px;
        }
    }

    // 旋转按钮
    .moveable-rotation {
        width: 0;
        height: 25px;
        display: block;

        .moveable-rotation-control {
            border: none;
            background-image: url('@/assets/images/rotation-icon.svg');
            width: 24px;
            height: 24px;
            background-size: 100% 100%;
            display: block;
            margin-left: -11px;
        }

        // 旋转的操作条
        .moveable-rotation-line {
            display: none;
        }
    }

    &.moveable-dragging {
        .moveable-line.moveable-guideline.moveable-horizontal.moveable-bold {
            height: 1px;
            background: var(--guideline-color);

            &.moveable-target {
                background: var(--moveable-color);
            }
        }

        .moveable-line.moveable-guideline.moveable-vertical.moveable-bold {
            width: 1px;
            background: var(--guideline-color);

            &.moveable-target {
                background: var(--moveable-color);
            }
        }

        .moveable-line.moveable-dashed.moveable-horizontal {
            border-top-color: var(--guideline-color);
        }

        .moveable-line.moveable-dashed.moveable-vertical {
            border-left-color: var(--guideline-color);
        }
    }
}
</style>
