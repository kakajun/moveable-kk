import { defineStore } from 'pinia';
import historyRecordOperateProxy from '../operate-provider/undo-redo/HistoryRecordOperateProxy';
import LayerUtil from '../util/LayerUtil';
import designerStore from './DesignerStore';
import eventOperateStore from '../operate-provider/EventOperateStore';
export default defineStore('layerList', {
    state: () => ({
        visible: false,
        layerInstances: {},
        searchContent: '',
    }),
    actions: {
        setVisible(visible) {
            this.visible = visible;
        },
        setContent(content) {
            this.searchContent = content;
        },
        lockChange(id, lock) {
            const updData = [];
            const { layerConfigs } = designerStore();
            const { type } = layerConfigs[id];
            if (type === 'group') {
                LayerUtil.findAllChildLayer([id]).forEach((id) => updData.push({ id, lock }));
            } else {
                updData.push({ id, lock });
            }
            historyRecordOperateProxy.doLockUpd(updData);
        },
        selectedChange(id, event) {
            const { targetIds, setTargetIds } = eventOperateStore();
            const { layerConfigs } = designerStore();
            const { type, lock } = layerConfigs[id];
            if (!type) return;
            const groupLayer = type === 'group';
            let selectedLayerIds = [];
            if (event.ctrlKey) {
                if (targetIds.includes(id)) {
                    if (groupLayer) {
                        const toBeCancelled = LayerUtil.findAllChildLayer([id]);
                        selectedLayerIds = targetIds.filter((_id) => !toBeCancelled.includes(_id));
                    } else selectedLayerIds = targetIds.filter((_id) => _id !== id);
                } else {
                    if (targetIds.length === 0) {
                        if (groupLayer) selectedLayerIds = LayerUtil.findAllChildLayer([id]);
                        else selectedLayerIds = [id];
                    } else {
                        const firstLock = layerConfigs[targetIds[0]].lock;
                        if (lock !== firstLock) {
                            if (groupLayer)
                                selectedLayerIds = [...targetIds, ...LayerUtil.findAllChildLayer([id])].filter(
                                    (id) => !layerConfigs[id].lock
                                );
                            else selectedLayerIds = [...targetIds, id].filter((id) => !layerConfigs[id].lock);
                        } else {
                            if (groupLayer) selectedLayerIds = [...targetIds, ...LayerUtil.findAllChildLayer([id])];
                            else selectedLayerIds = [...targetIds, id];
                        }
                        selectedLayerIds = [...new Set(selectedLayerIds)];
                    }
                }
            } else {
                if (groupLayer) selectedLayerIds = LayerUtil.findAllChildLayer([id]);
                else selectedLayerIds = [id];
            }
            const targetTimer = setTimeout(() => {
                setTargetIds(selectedLayerIds);
                clearTimeout(targetTimer);
            }, 0);

            let finalLock = layerConfigs[selectedLayerIds[0]]?.lock;
            const tempTimer = setTimeout(() => {
                /**
 * 设置控制点和边框的颜色
 * @param lock 是否锁定
 */
                function setControlPointLineColor(lock) {
                    const { targetIds } = eventOperateStore()();
                    //没有选中组件的情况下不会显示边框。
                    if (targetIds.length === 0) return;
                    const pointLineDom = document.querySelectorAll('.moveable-control,.moveable-line');
                    if (!pointLineDom) return;
                    if (lock) {
                        pointLineDom.forEach((child) => {
                            child.style.backgroundColor = '#ff4b29';
                        });
                    } else {
                        pointLineDom.forEach((child) => {
                            child.style.backgroundColor = '#00bbffff';
                        });
                    }
                }
                setControlPointLineColor(finalLock);
                clearTimeout(tempTimer);
            }, 0);
        },
        hideChange(id, hide) {
            const updData = [];
            const { layerConfigs } = designerStore();
            const { type } = layerConfigs[id];
            if (type === 'group') {
                LayerUtil.findAllChildLayer([id]).forEach((id) => updData.push({ id, hide }));
            } else {
                updData.push({ id, hide });
            }
            historyRecordOperateProxy.doHideUpd(updData);
        },
    },
});
