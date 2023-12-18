<template>
    <div class="warapper">
        <div class='lc-event-container'>
            <div class='lc-ruler-content' :style="warapperStyle">
                <ComponentContainer :layer="layerData" />
                <GroupMovable></GroupMovable>
                <GroupSelectable></GroupSelectable>
            </div>
        </div>
        <!-- 注册快捷键 -->
        <HotKey :handlerMapping='hotkeyConfigs'></HotKey>
        <!-- 快捷键提示 -->
        <hotkey-right></hotkey-right>
        <!-- 右击菜单 -->
        <ContextMenu></ContextMenu>
    </div>
</template>

<script setup>
import res from './res';
import hotkeyRight from './hotkey-right.vue';
import ContextMenu from './operate-provider/right-click-menu/ContextMenu.vue';
import ComponentContainer from './ComponentContainer.vue';
import useContextMenuStore from "./operate-provider/right-click-menu/ContextMenuStore";
import { onMounted, ref, onUnmounted } from 'vue';
import designerStore from "./store/DesignerStore.js";
import GroupMovable from './operate-provider/movable/GroupMovable.vue';
import { hotkeyConfigs } from "./operate-provider/hot-key/HotKeyConfig";
import GroupSelectable from './operate-provider/movable/GroupSelectable.vue';
import HotKey from './operate-provider/hot-key/HotKey.vue';
import eventOperateStore from "./operate-provider/EventOperateStore.js";
import { storeToRefs } from 'pinia'
const { layerData } = storeToRefs(designerStore())

onMounted(() => {
    //绑定事件到dom元素
    bindEventToDom();
    initExistProject()
})
onUnmounted(() => {
    //卸载dom元素上的事件
    unbindEventToDom();
})
const warapperStyle = ref({
    position: 'absolute',
    width: '1000px', height: '800px', border: '1px solid #f1eeee', position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
})


/**
* 初始化以更新方式打开时项目信息
*/
const initExistProject = () => {
    const { doInit, setLoaded } = designerStore();
    let storeSt=localStorage.getItem('layerConfigs')
    let store={}
    if (storeSt) {
        store ={layerConfigs: JSON.parse(storeSt)}
    }else{
        store = res
    }

    //初始化designerStore
    doInit({
        id: store?.id,
        canvasConfig: store?.canvasConfig,
        projectConfig: store?.projectConfig,
        layerConfigs: store?.layerConfigs,
        statisticInfo: store?.statisticInfo,
        themeConfig: store?.themeConfig,
        extendParams: store?.extendParams,
    })
    // //设置事件操作器的最大最小层级
    const { setMinLevel, setMaxLevel } = eventOperateStore();
    setMinLevel(store?.extendParams?.minLevel || 0);
    setMaxLevel(store?.extendParams?.maxLevel || 0);
}

/**
 * 绑定事件到dom元素
 */
function bindEventToDom() {
    document.addEventListener("click", clickHandler);
    document.addEventListener("contextmenu", contextMenuHandler);
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);
}

/**
 * 卸载dom元素上的事件
 */
function unbindEventToDom() {
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("contextmenu", contextMenuHandler);
    document.removeEventListener("pointerdown", pointerDownHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
}

/*****************事件处理*****************/
const clickHandler = (event) => {
    const { visible, updateVisible } = useContextMenuStore();
    if (visible && event.button === 0) {
        //这里添加异步处理的原因：必须要在操作菜单执行点击事件执行之后才能卸载dom元素，不然操作菜单的点击事件会失效。
        setTimeout(() => {
            updateVisible(false);
        });
    }
}

const contextMenuHandler = (event) => {
    event.preventDefault();
    const { mouseDownTime, mouseUpTime, setPosition, updateVisible } = useContextMenuStore();
    let targetArr = ['lc-comp-item', 'moveable-area'];
    if (targetArr.some((item) => event.target.classList.contains(item)) && mouseUpTime - mouseDownTime < 200) {
        updateVisible && updateVisible(true);
        debugger
        setPosition([event.clientX, event.clientY]);
        console.log("true");
    } else {
        console.log("false");
        updateVisible && updateVisible(false);
    }
}

const pointerDownHandler = () => {
    const { setMouseDownTime } = useContextMenuStore();
    setMouseDownTime(Date.now());
}

const pointerUpHandler = (event) => {
    const { setMouseUpTime } = useContextMenuStore();
    setMouseUpTime(Date.now());
    const { setPointerTarget } = eventOperateStore();
    setPointerTarget(event.target);
}
</script>

<style  lang='less' scoped>
.warapper {
    position: relative;
}
</style>
