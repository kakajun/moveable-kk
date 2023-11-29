<template>
    <div></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export const TriggerType = {
    SINGLE: 'SINGLE',
    COILED: 'COILED'
};

export default {
    props: {
        handlerMapping: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const currHotKey = ref([]);
        let existHandlerKey = '';
        const specialDomCache = {};

        const getSpecialDomCache = (classSelector) => {
            const specialDom = specialDomCache[classSelector];
            if (specialDom) {
                return specialDom;
            } else {
                const specialDom = document.querySelector(classSelector);
                if (!specialDom) {
                    return null;
                }
                specialDomCache[classSelector] = specialDom;
                return specialDom;
            }
        };

        const doHandler = (e, hotKey) => {
            const { handler, triggerType = TriggerType.SINGLE, range } = props.handlerMapping[hotKey] || {};
            if (handler) {
                if ((triggerType === TriggerType.SINGLE && existHandlerKey !== hotKey) || triggerType === TriggerType.COILED) {
                    const pointerTarget = eventOperateStore.pointerTarget;
                    if (range) {
                        const targetDom = getSpecialDomCache(range);
                        if (!targetDom || !targetDom.contains(pointerTarget)) {
                            return;
                        }
                    }
                    if (Array.isArray(handler)) {
                        handler.forEach((func) => func(e));
                    } else {
                        handler(e);
                    }
                    existHandlerKey = hotKey;
                }
            }
        };

        const keyDown = (e) => {
            const key = e.key.toLowerCase();
            if (!currHotKey.value.some((item) => item === key)) {
                currHotKey.value.push(key);
            }
            const hotKey = currHotKey.value.join(' + ');
            if (shieldKeyList.some((item) => item === hotKey)) {
                e.preventDefault();
            }
            doHandler(e, hotKey);
        };

        const keyUp = (e) => {
            const key = e.key.toLowerCase();
            if (currHotKey.value.some((item) => item === key)) {
                currHotKey.value = currHotKey.value.filter((item) => item !== key);
                existHandlerKey = '';
            }
        };

        const onBlur = () => {
            currHotKey.value = [];
            existHandlerKey = '';
        };

        onMounted(() => {
            document.addEventListener('keydown', keyDown);
            document.addEventListener('keyup', keyUp);
            window.onblur = onBlur;
        });

        onBeforeUnmount(() => {
            document.removeEventListener('keydown', keyDown);
            document.removeEventListener('keyup', keyUp);
            window.onblur = null;
        });

        return {};
    }
};
</script>
