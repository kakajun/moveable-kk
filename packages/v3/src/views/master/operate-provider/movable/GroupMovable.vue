
<template>
    <div>
        <Moveable ref="movableRef" :target="targets" :draggable="true" :resizable="true" :keepRatio="false"
            :maxSnapElementGuidelineDistance="300" :snappable="true" :snapGap="false" :snapThreshold="5"
            :isDisplaySnapDigit="true" :snapDirections="{
                top: true,
                right: true,
                bottom: true,
                left: true,
                center: true,
                middle: true
            }" :elementSnapDirections="{
    top: true,
    right: true,
    bottom: true,
    left: true,
    center: true,
    middle: true
}" :ables="[dimensionViewable]" :dimensionViewable="true" :verticalGuidelines="['0', '50%', '100%']"
            :horizontalGuidelines="['0', '50%', '100%']" :isDisplayInnerSnapDigit="true"
            :elementGuidelines="selectedTargets" :throttleDrag="rasterize ? dragStep : 1"
            :throttleResize="rasterize ? resizeStep : 1" @clickGroup="handleClickGroup" @drag="onDrag"
            @dragStart="onDragStart" @dragEnd="onDragEnd" @dragGroup="onDragGroup" @dragGroupEnd="onDragGroupEnd"
            @resizeStart="onResizeStart" @resize="onResize" @resizeEnd="onResizeEnd" @resizeGroupStart="onResizeGroupStart"
            @resizeGroup="onResizeGroup" @resizeGroupEnd="onResizeGroupEnd" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Moveable from "../../../components/Moveable.vue";
import eventOperateStore from "../EventOperateStore.js";
const movableRef = ref(null);
const targets = ref([]);
const selectedTargets = document.getElementsByClassName('lc-comp-item');
onMounted(() => {
    const {setMovableRef} = eventOperateStore();
        setMovableRef(movableRef);
});

const handleClickGroup = (e) => {
    this.$refs.selectorRef.clickTarget(e.inputEvent, e.inputTarget);
};

const onDrag = (e) => {
    const { target, beforeTranslate } = e;
    target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
};

const onDragStart = (e) => {
    const { target } = e;
    const { layerConfigs } = designerStore;
    const { lock } = layerConfigs[target.id];
    if (lock) return false;
};

const onDragEnd = (e) => {
    const { updateLayout } = designerStore;
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
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doDrag(data);
    }
};

const onDragGroup = (e) => {
    const { targets } = e;
    const { layerConfigs } = designerStore;
    const firstLock = layerConfigs[targets[0].id].lock;
    if (firstLock) return false;
    else e.events.forEach((ev) => (ev.target.style.transform = ev.transform));
};

const onDragGroupEnd = (e) => {
    const { targets } = e;
    const { updateLayout, layerConfigs } = designerStore;
    const firstLock = layerConfigs[targets[0].id].lock;
    if (firstLock) return false;
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
    const posChange = e?.lastEvent?.beforeTranslate || [0, 0];
    const minX = groupCoordinate.minX + posChange[0];
    const minY = groupCoordinate.minY + posChange[1];
    setGroupCoordinate({ minX, minY });
    if (data.length > 0) {
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doDrag(data);
    }
};

const onResizeStart = (e) => {
    const { target } = e;
    const { layerConfigs } = designerStore;
    const { lock } = layerConfigs[target.id];
    if (lock) return false;
};

const onResize = (e) => {
    const { target, width, height, drag } = e;
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.transform = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
};

const onResizeEnd = (e) => {
    const { updateLayout } = designerStore;
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
    const { layerConfigs } = designerStore;
    const firstLock = layerConfigs[targets[0].id].lock;
    if (firstLock) return false;
};

const onResizeGroup = (e) => {
    const { updateLayout } = designerStore;
    const { backoff, setBackoff } = eventOperateStore();
    const data = [];
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
    if (data.length > 0) {
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doResize(data, direction);
        const { setGroupCoordinate, groupCoordinate } = eventOperateStore();
        if (direction[0] === -1 || direction[1] === -1) {
            setGroupCoordinate({
                minX: groupCoordinate.minX - dist[0],
                minY: groupCoordinate.minY- dist[1],
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

const onResizeGroupEnd = (e) => {
    const { updateLayout } = designerStore;
    const { backoff, setBackoff } = eventOperateStore();
    const data = [];
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
    if (data.length > 0) {
        if (backoff) {
            updateLayout(data, false);
            setBackoff(false);
        } else historyRecordOperateProxy.doResize(data, direction);
        const { setGroupCoordinate, groupCoordinate } = eventOperateStore();
        if (direction[0] === -1 || direction[1] === -1) {
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
