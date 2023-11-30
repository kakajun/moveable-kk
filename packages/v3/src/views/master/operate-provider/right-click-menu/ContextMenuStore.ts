import { defineStore } from 'pinia';

/**
 * 右键操作菜单的状态管理类。
 */
export const useContextMenuStore = defineStore('contextMenu', {
    state: () => ({
        visible: false,
        position: [0, 0],
        mouseDownTime: 0,
        mouseUpTime: 0,
    }),
    actions: {
        updateVisible(visible: boolean) {
            this.visible = visible;
        },
        setPosition(position: number[]) {
            this.position = position;
        },
        setMouseDownTime(time: any) {
            this.mouseDownTime = time;
        },
        setMouseUpTime(time: any) {
            this.mouseUpTime = time;
        },
    },
});
export default useContextMenuStore;
