<template>
    <div class='lc-event-container'>
        <div   v-for="item of  layerData" :key="item.id">
            <div v-if="item.type === 'group'" :key="item.id" class='component-group'>
                <ComponentContainer v-for="o of item.children" :layer="o"></ComponentContainer>
            </div>
            <ComponentContainer v-if="item.type !== 'group'" :layer="item"/>
        </div>
    </div>
<GroupMovable></GroupMovable>
<GroupSelectable></GroupSelectable>
</template>

<script setup>
import res from './res';
import ComponentContainer from './ComponentContainer.vue';
import { cloneDeep } from "lodash";
import { onMounted, ref } from 'vue';
import designerStore from "./store/DesignerStore.js";
import GroupMovable from './operate-provider/movable/GroupMovable.vue';
import GroupSelectable from './operate-provider/movable/GroupSelectable.vue';
import eventOperateStore from "./operate-provider/EventOperateStore.js";
import { storeToRefs } from 'pinia'
const { getlayerConfigs } = storeToRefs(designerStore())
const layerData = ref([])
onMounted(() => {
    console.log(getlayerConfigs.value, "getlayerConfigs");
    initExistProject()
    layerData.value = parser(getlayerConfigs.value)
    console.log(layerData.value,"layerData");
})
/**
 * 解析函数
 */
const parser = (layerMap, order) => {
    layerMap = cloneDeep(layerMap);
    console.log(layerMap, "layerMap");
    let sourceLayerArr;
    if (order === 'DESC')
        sourceLayerArr = Object.values(layerMap).sort((a, b) => b - a);
    else
        sourceLayerArr = Object.values(layerMap).sort((a, b) => a - b);
    // console.log(sourceLayerArr, "sourceLayerArr");
    // 构建树结构
    const resData = [];
    for (const layerItem of sourceLayerArr) {
        if (!layerItem?.pid) {
            // 根节点
            resData.push(layerItem);
        } else {
            // 非根节点，将其加入父节点的 children 中
            const parent = layerMap[layerItem.pid];
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(layerItem);
            }
        }
    }
    return resData;
};
/**
* 初始化以更新方式打开时项目信息
*/
const initExistProject = () => {
    const { doInit, setLoaded } = designerStore();
    const store = res
    //初始化designerStore
    doInit({
        id: store?.id,
        canvasConfig: store?.canvasConfig,
        projectConfig: store?.projectConfig,
        elemConfigs: store?.elemConfigs,
        layerConfigs: store?.layerConfigs,
        statisticInfo: store?.statisticInfo,
        themeConfig: store?.themeConfig,
        extendParams: store?.extendParams,
    })
    // //设置事件操作器的最大最小层级
    const { setMinLevel, setMaxLevel } = eventOperateStore();
    setMinLevel(store?.extendParams?.minLevel || 0);
    setMaxLevel(store?.extendParams?.maxLevel || 0);

    // //初始化bpStore（蓝图状态） todo 是否可以以更规范的方式处理？
    // const { setAPMap, setLines, setAPLineMap, setBpNodeLayoutMap, setBpNodeConfigMap } = bpStore;
    // setAPMap(store?.bpAPMap || {});
    // setLines(store?.bpLines || {});
    // setAPLineMap(store?.bpAPLineMap || {});
    // setBpNodeLayoutMap(store?.bpNodeLayoutMap || {});
    // setBpNodeConfigMap(store?.bpNodeConfigMap || {});
    // //初始化蓝图左侧节点列表
    // const { initUsedLayerNodes } = bpLeftStore;
    // const usedLayerNodes: Record<string, boolean> = {};
    // Object.keys(store?.bpNodeLayoutMap || {}).forEach(key => {
    //     usedLayerNodes[key] = true;
    // })
    // initUsedLayerNodes(usedLayerNodes);
    // setLoaded(true);

}
</script>

<style  lang='less' scoped>
.warapper{
    position: relative;
}
</style>
