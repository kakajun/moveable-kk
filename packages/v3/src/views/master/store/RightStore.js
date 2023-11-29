import { defineStore } from 'pinia';
export const bgMenu = [{
    icon: 'PictureFilled',
    name: '背景',
    key: 'background',
}];

export const useRightStore = defineStore('right', {
    state: () => ({
        activeElem: {},
        menus: [],
        activeMenu: '',
        visible: false,
    }),
    actions: {
        setActiveMenu(menu, newMenus) {
            if (newMenus && newMenus.includes(this.activeMenu))
                return;
            this.activeMenu = menu;
        },
        setContentVisible(visible) {
            this.visible = visible;
        },
        activeConfig(id, type) {

        },
    },
});

export default useRightStore;
