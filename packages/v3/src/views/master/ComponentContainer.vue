<template>
    <div :id="layer.id" :data-type="layer.type" :data-lock="layer.lock" :data-hide="layer.hide" :key="layer.id.toString()"
        :style="cpuStyle" class="lc-comp-item">
        <div ref="ref" :style="{
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
import { ref, computed } from 'vue';
const props = defineProps({
    layer: {
        type: Object,
        required: true,
    },
});

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
