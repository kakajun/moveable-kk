import { defineStore } from 'pinia';
import { isEqual } from 'lodash';
import historyRecordOperateProxy from '../operate-provider/undo-redo/HistoryRecordOperateProxy';
import ObjectUtil from '../util/ObjectUtil';
import {doSave}
 from "../operate-provider/hot-key/HotKeyImpl";
import { cloneDeep } from "lodash";
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
        if (!layerItem?.parent) {
            // 根节点
            resData.push(layerItem);
        } else {
            // 非根节点，将其加入父节点的 children 中
            const parent = layerMap[layerItem.parent];
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(layerItem);
            }
        }
    }
    return resData;
};
 const useDesignerStore = defineStore('designer', {
    state: () => ({
        id: '',
        loaded: false,
        canvasConfig: {
            rasterize: false,
            dragStep: 1,
            resizeStep: 1,
            width: 1920,
            height: 1080,
        },
        projectConfig: {
            name: '',
            des: '',
            state: '',
            createTime: '',
            updateTime: '',
            saveType: '',
        },
        elemConfigs: null,
        compInstances: {},
        layerConfigs: {},
        statisticInfo: {
            count: 0,
        },
        themeConfig: [
            {
                id: '0',
                name: '科技风格(默认主题)',
                colors: {
                    main: '#00dfff',
                    mainText: '#62edff',
                    subText: '#4ca4b1',
                    background: '#00dfff33',
                    supplementFirst: '#38929f',
                    supplementSecond: '#1790a2',
                },
            },
        ],
        extendParams: {
            maxLevel: 0,
            minLevel: 0,
        },
        lastTimeSave: Date.now(),
    }),

    getters: {
        layerData(state) {
           return parser( state.layerConfigs)
        },
        getData() {
            // const elemConfigs = {};
            // Object.keys(this.compInstances).forEach((key) => {
            //     elemConfigs[key] = this.compInstances[key].getConfig();
            // });
            return {
                id: this.id,
                canvasConfig: { ...this.canvasConfig },
                projectConfig: { ...this.projectConfig },
                // elemConfigs: { ...this.elemConfigs },
                layerConfigs: { ...this.layerConfigs },
                statisticInfo: { ...this.statisticInfo },
                themeConfig: [...this.themeConfig],
                extendParams: { ...this.extendParams },
            };
        },
    },

    actions: {
        doInit(store) {

            this.id = store.id ?? this.id;
            this.canvasConfig = store.canvasConfig
                ? { ...this.canvasConfig, ...store.canvasConfig }
                : this.canvasConfig;
            this.projectConfig = store.projectConfig
                ? { ...this.projectConfig, ...store.projectConfig }
                : this.projectConfig;
            // this.elemConfigs = store.elemConfigs
            //     ? { ...this.elemConfigs, ...store.elemConfigs }
            //     : this.elemConfigs;
                console.log(store.layerConfigs,"store.layerConfigs");
            this.layerConfigs = store.layerConfigs || this.layerConfigs;

            this.statisticInfo = store.statisticInfo
                ? { ...this.statisticInfo, ...store.statisticInfo }
                : this.statisticInfo;
            this.themeConfig = store.themeConfig || this.themeConfig;
            this.extendParams = store.extendParams
                ? { ...this.extendParams, ...store.extendParams }
                : this.extendParams;
        },

        doDestroy() {
            this.id = '';
            this.canvasConfig = {};
            this.projectConfig = {};
            // this.elemConfigs = null;
            this.layerConfigs = {};
            this.statisticInfo = {};
            this.themeConfig = [
                {
                    id: '0',
                    name: '科技风格(默认主题)',
                    colors: {
                        main: '#00dfff',
                        mainText: '#62edff',
                        subText: '#4ca4b1',
                        background: '#00dfff33',
                        supplementFirst: '#38929f',
                        supplementSecond: '#1790a2',
                    },
                },
            ];
            this.extendParams = {};
        },

        setId(id) {
            this.id = id;
        },

        setLoaded(loaded) {
            this.loaded = loaded;
        },

        addItem(item) {
            this.layerConfigs[item.id + ''] = item;
            if (this.statisticInfo) {
                this.statisticInfo.count = Object.keys(this.layerConfigs).length;
            }
        },

        delItem(ids) {
            debugger
            for (const id of ids) {
                delete this.layerConfigs[id];
                delete this.compInstances[id];
            }
        },

        updateLayout(items, reRender = true) {
            for (const item of items) {
                const oldItem = this.layerConfigs[item.id + ''];
                if (!isEqual(oldItem, item)) {
                    this.layerConfigs[item.id + ''] = reRender
                        ? { ...ObjectUtil.merge(oldItem, item) }
                        : ObjectUtil.merge(oldItem, item);
                }
            }
            doSave();
        },

        delLayout(ids) {
            for (const id of ids) {
                if (this.layerConfigs[id] && this.layerConfigs[id].type === 'group') {
                    delete this.layerConfigs[id];
                }
            }
        },

        updateThemeConfig(data) {
            this.themeConfig = data;
        },

        flashGlobalTheme(newTheme) {
            this.compInstances &&
                Object.keys(this.compInstances).forEach((key) => {
                    const instance = this.compInstances[key];
                    if (instance) {
                        instance.updateTheme(newTheme);
                    }
                });
        },

        updateCanvasConfig(data) {
            this.canvasConfig = { ...this.canvasConfig, ...data };
        },

        updateProjectConfig(data) {
            this.projectConfig = { ...this.projectConfig, ...data };
        },

        copyItem(ids) {
            return historyRecordOperateProxy.doCopy(ids);
        },
    },
});
export default useDesignerStore;
