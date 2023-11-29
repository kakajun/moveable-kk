import { defineStore } from 'pinia';
import { PictureFilled } from "@ant-design/icons";
import DesignerLoaderFactory from "../loader/DesignerLoaderFactory";

export const bgMenu = [{
    icon: PictureFilled,
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
            if (!id || !type) {
                this.activeMenu = '';
                this.activeElem = {};
                this.menus = [];
                return;
            }
            this.menus = (DesignerLoaderFactory.getLoader()?.customComponentInfoMap[type]?.getMenuList()) || [];
            if (this.menus.length > 0) {
                let setNewActiveMenu = true;
                for (let i = 0; i < this.menus.length; i++) {
                    if (this.menus[i].key === this.activeMenu) {
                        setNewActiveMenu = false;
                        break;
                    }
                }
                if (setNewActiveMenu)
                    this.activeMenu = this.menus[0].key;
            }
            this.activeElem = { id, type };
            if (this.visible) {
                this.visible = false;
                setTimeout(() => {
                    this.visible = true;
                }, 0);
            }
        },
    },
});

export default useRightStore;
