<template>
    <div v-if="visible" class="lc-right-menu" :style="{ position: 'fixed', top: position[1], left: position[0] }">
        <div v-for="(menuItem, index) in menuList" :key="index" class="menu-item" @click="menuItem.onClick">
            <label><Icon :component="menuItem.icon" /></label>
            <span>{{ menuItem.name }}</span>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import contextMenuStore from './ContextMenuStore';
import './OperateMenu.less';
import {
    CopyOutlined,
    DeleteOutlined,
    EyeInvisibleOutlined,
    LockOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { doCopy, doDelete, doHide, doLock, doUnLock, toBottom, toTop } from '../hot-key/HotKeyImpl';

export default defineComponent({
    name: 'ContextMenu',
    components: {
        Icon: AntdIcon,
    },
    data() {
        return {
            menuList: [
                {
                    name: '锁定',
                    icon: LockOutlined,
                    onClick: doLock,
                },
                {
                    name: '解锁',
                    icon: LockOutlined,
                    onClick: doUnLock,
                },
                {
                    name: '隐藏',
                    icon: EyeInvisibleOutlined,
                    onClick: doHide,
                },
                {
                    name: '复制',
                    icon: CopyOutlined,
                    onClick: doCopy,
                },
                {
                    name: '置顶',
                    icon: VerticalAlignTopOutlined,
                    onClick: toTop,
                },
                {
                    name: '置底',
                    icon: VerticalAlignBottomOutlined,
                    onClick: toBottom,
                },
                {
                    name: '删除',
                    icon: DeleteOutlined,
                    onClick: doDelete,
                },
            ],
        };
    },
    computed: {
        visible() {
            return contextMenuStore().visible;
        },
        position() {
            return contextMenuStore().position || [0, 0];
        },
    },
});
</script>
