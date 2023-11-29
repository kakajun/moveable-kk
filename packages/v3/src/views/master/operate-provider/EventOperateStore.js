import { defineStore } from 'pinia';
import layerListStore from "../store/LayerListStore";
import designerStore from '../store/DesignerStore.js';
export default  defineStore('eventOperateStore', {
    state: () => ({
        movableRef: '',
        selectorRef: '',
        rulerRef: '',
        dsContentRef:'',
        targets: [],
        targetIds: [],
        maxLevel: 0,
        minLevel: 0,
        pointerTarget: null,
        groupCoordinate: {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
            groupWidth: 0,
            groupHeight: 0,
        },
        backoff: false,
        addRecordCompId: null,
        scale: 1,
        ratio: 1,
    }),

    actions: {
        setMovableRef(ref) {
            this.movableRef = ref;
        },
        setSelectorRef(ref) {
            this.selectorRef = ref;
        },
        setRuleRef(ref) {
            this.rulerRef = ref;
        },
        setDsContentRef(ref) {
            this.dsContentRef = ref;
        },
        setTargetIds(ids) {
            const oldTargetIds = [...this.targetIds];
            this.targetIds = ids;
            const _targets = [];
            ids.forEach((id) => {
                const target = document.getElementById(id);
                target && _targets.push(target);
            });
            this.targets = _targets;
            // 更新图层列表状态
            const { visible, layerInstances } = layerListStore();
            if (visible) {
                // 清除之前的选中
                oldTargetIds.forEach((id) => {
                    const instance = layerInstances[id];
                    if (!!instance) instance.setState({ selected: false });
                });
                // 设置本次选中的组件id
                this.targetIds.forEach((id) => {
                    const instance = layerInstances[id];
                    if (!!instance) instance.setState({ selected: true });
                });
            }

            // 若选中多个组件，计算更新组件多选时的左上角坐标
            if (this.targets.length > 1) {
                this.calculateGroupCoordinate(this.targets);
            }
        },
        setPointerTarget(target) {
            this.pointerTarget = target;
        },
        setGroupCoordinate(coordinate) {
            this.groupCoordinate = {
                ...this.groupCoordinate,
                ...coordinate,
            };
        },
        calculateGroupCoordinate(compArr) {
            const { layerConfigs } = designerStore();
            let groupCoordinate = {
                minX: Infinity,
                minY: Infinity,
                maxX: -Infinity,
                maxY: -Infinity,
                groupWidth: 0,
                groupHeight: 0,
            };
            compArr.forEach((item) => {
                const layerConfig = layerConfigs[item.id];
                let { position, width, height } = layerConfig;
                const x = position[0];
                const y = position[1];
                if (x < groupCoordinate.minX) groupCoordinate.minX = x;
                if (y < groupCoordinate.minY) groupCoordinate.minY = y;
                if (x + width > groupCoordinate.maxX) groupCoordinate.maxX = x + width;
                if (y + height > groupCoordinate.maxY) groupCoordinate.maxY = y + height;
            });
            groupCoordinate.groupWidth = groupCoordinate.maxX - groupCoordinate.minX;
            groupCoordinate.groupHeight = groupCoordinate.maxY - groupCoordinate.minY;
            this.setGroupCoordinate(groupCoordinate);
        },
        setScale(scale) {
            this.scale = scale;
        },
        setAddRecordCompId(id) {
            this.addRecordCompId = id;
        },
        setBackoff(backoff) {
            this.backoff = backoff;
        },
        setMaxLevel(order) {
            this.maxLevel = order;
        },
        setMinLevel(order) {
            this.minLevel = order;
        },
        setRatio(ratio) {
            this.ratio = ratio;
        },
    },
});
