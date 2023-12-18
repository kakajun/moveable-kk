<template>
    <template v-for="item of  layer" :key="item.id">
        <div v-if="item.type === 'group'" data-describe="group的参考线,真节点在下面" :style="getGroupStyle(item)" class=" lc-comp-item"></div>
        <div v-if="item.type === 'group'"   class='component-group'>
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
function calculateGroupCoordinate(compArr) {
            let groupCoordinate = {
                minX: Infinity,
                minY: Infinity,
                maxX: -Infinity,
                maxY: -Infinity,
                groupWidth: 0,
                groupHeight: 0,
            };
            compArr.forEach((item) => {
                if (item.children) {
                    calculateGroupCoordinate(item.children)
                }else{
                let { position, width, height } = item;
                const x = position[0];
                const y = position[1];
                if (x < groupCoordinate.minX) groupCoordinate.minX = x;
                if (y < groupCoordinate.minY) groupCoordinate.minY = y;
                if (x + width > groupCoordinate.maxX) groupCoordinate.maxX = x + width;
                if (y + height > groupCoordinate.maxY) groupCoordinate.maxY = y + height;
                }

            });
            groupCoordinate.groupWidth = groupCoordinate.maxX - groupCoordinate.minX;
            groupCoordinate.groupHeight = groupCoordinate.maxY - groupCoordinate.minY;
          return groupCoordinate
        }
const getGroupStyle=(item)=>{
   const obj= calculateGroupCoordinate(item.children)
   const {minX,minY,groupWidth,groupHeight}=obj
   console.log(obj,"777777");
    return {
       width:groupWidth+'px',
       height:groupHeight+'px',
       transform:`translate(${minX}px,${minY}px)`,
    //    background:'red',
       position:'absolute',
    }
}
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
