<template>
    <template v-for="item of  layer" :key="item.id">
        <div v-if="item.type === 'group'" :key="item.id" class='component-group lc-comp-item'>
            <ComponentContainer  isGroup="true"  :layer="item.children" />
        </div>
        <div v-else :id="item.id" :data-type="item.type" :data-group="isGroup" :data-lock="item.lock" :data-hide="item.hide" :style="cpuStyle(item)" class="lc-comp-item">
            <div ref="myref" :style="{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                position: 'relative'
            }">
                {{ item.name }}
            </div>
        </div>
    </template>
</template>

<script setup>
import historyRecordOperateProxy from "./operate-provider/undo-redo/HistoryRecordOperateProxy";
import { ref, computed, onMounted } from 'vue';
const props = defineProps({
    layer: {
        type: Object,
        required: true,
    },
    isGroup: {
        type: String  // 给个标记证明是子节点
    }
});
const myref = ref(null)
onMounted(() => {
    if (myref.value) {
        historyRecordOperateProxy.doAdd(myref, props.layer);
    }

})
const cpuStyle = (item) => {
    return {
        width: item.width + 'px',
        height: item.height + 'px',
        transform: item.position ? `translate(${item.position[0]}px,${item.position[1]}px)` : '',
        position: 'absolute',
        display: item.hide ? 'none' : 'block',
        border: '1px solid #65eafc'
    }
}
</script>
