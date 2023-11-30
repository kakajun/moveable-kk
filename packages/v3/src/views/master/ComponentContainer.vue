<template>
    <div :id="layer.id" :data-type="layer.type" :data-lock="layer.lock" :data-hide="layer.hide" :key="layer.id.toString()"
        :style="cpuStyle" class="lc-comp-item">
        <div ref="myref" :style="{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            position: 'relative'
        }">
            {{ layer.name }}
        </div>
    </div>
</template>

<script setup>
import historyRecordOperateProxy from "./operate-provider/undo-redo/HistoryRecordOperateProxy";
import { ref, computed,onMounted } from 'vue';
const props = defineProps({
    layer: {
        type: Object,
        required: true,
    },
});
const myref=ref(null)
onMounted(() => {
    historyRecordOperateProxy.doAdd(myref, props.layer);
})
const cpuStyle = computed(() => {
    const { layer } = props;
    return {
        width: layer.width + 'px',
        height: layer.height + 'px',
        transform: layer.position ? `translate(${layer.position[0]}px,${layer.position[1]}px)` : '',
        position: 'absolute',
        display: layer.hide ? 'none' : 'block',
        border: '1px solid #65eafc'
    }
})
</script>
