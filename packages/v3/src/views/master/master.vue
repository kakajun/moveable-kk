<template>
 <div class=''>

 </div>
</template>

<script setup>
const layerData = ref([
    {
        "name": "基础文本",
        "type": "LcBaseText",
        "width": 180,
        "height": 77,
        "position": [
            458,
            281
        ],
        "id": "48y4ImaA5T",
        "lock": false,
        "hide": false,
        "order": 7
    },
    {
        "name": "element1",
        "type": "LcBaseText",
        "width": 154,
        "height": 75,
        "position": [
            439,
            130
        ],
        "id": "t5tVg0Ewtd",
        "lock": false,
        "hide": false,
        "order": 9,
        "pid": "fIcxRvSMw2"
    },
    {
        "name": "基础文本",
        "type": "LcBaseText",
        "width": 153,
        "height": 84,
        "position": [
            638,
            139
        ],
        "id": "yz8ImoqTzH",
        "lock": false,
        "hide": false,
        "order": 10,
        "pid": "fIcxRvSMw2"
    },
    {
        "id": "fIcxRvSMw2",
        "type": "group",
        "name": "新建分组",
        "hide": false,
        "lock": false,
        "childIds": [
            "t5tVg0Ewtd",
            "yz8ImoqTzH"
        ],
        "order": 11,
    }
]);
    /**
     * 解析函数
     */
     const parser = (layerMap, order) => {
        layerMap = cloneDeep(layerMap);
        console.log(layerMap,"layerMap");
        let sourceLayerArr;
        if (order === RenderOrder.DESC)
            sourceLayerArr = Object.values(layerMap).sort((a, b) => b.order - a.order);
        else
            sourceLayerArr = Object.values(layerMap).sort((a, b) => a.order - b.order);
        console.log(sourceLayerArr,"sourceLayerArr");
        // 构建树结构
        const resData= [];
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
</script>

<style  lang='less' scoped>


</style>
