<template>
       <!-- <label><Icon :component="menuItem.icon" /></label> -->
    <div v-if="visible" class="lc-right-menu" :style="computedStyle">
        <div v-for="(menuItem, index) in menuList" :key="index" class="menu-item" @click="menuItem.onClick">
            <span>{{ menuItem.name }}</span>
        </div>
    </div>
</template>

<script setup>
import useContextMenuStore from './ContextMenuStore.js';
import {computed} from 'vue';
import './OperateMenu.less';
import { storeToRefs } from 'pinia'
// import {
//     CopyOutlined,
//     DeleteOutlined,
//     EyeInvisibleOutlined,
//     LockOutlined,
//     VerticalAlignBottomOutlined,
//     VerticalAlignTopOutlined,
// } from '@ant-design/icons';
import { doCopy, doDelete, doHide, doLock, doUnLock, toBottom, toTop } from '../hot-key/HotKeyImpl';
const {visible,position} = storeToRefs(useContextMenuStore())
const computedStyle=computed(()=>{
    console.log({
        position: 'fixed',
        // zIndex: 999999999,
        top: position.value[1]+'px',
        left: position.value[0]+'px'
    })
    return {
        position: 'fixed',
        top: position.value[1]+'px',
        left: position.value[0]+'px'
    }
})
const menuList = [
    {
        name: '锁定',
        // icon: LockOutlined,
        onClick: doLock,
    },
    {
        name: '解锁',
        // icon: LockOutlined,
        onClick: doUnLock,
    },
    {
        name: '隐藏',
        // icon: EyeInvisibleOutlined,
        onClick: doHide,
    },
    {
        name: '复制',
        // icon: CopyOutlined,
        onClick: doCopy,
    },
    {
        name: '置顶',
        // icon: VerticalAlignTopOutlined,
        onClick: toTop,
    },
    {
        name: '置底',
        // icon: VerticalAlignBottomOutlined,
        onClick: toBottom,
    },
    {
        name: '删除',
        // icon: DeleteOutlined,
        onClick: doDelete,
    },
]

</script>
