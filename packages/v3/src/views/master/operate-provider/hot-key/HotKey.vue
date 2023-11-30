<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import eventOperateStore from "../EventOperateStore";
const TriggerType = {
    SINGLE: 'SINGLE',  //单次触发
    COILED: 'COILED' //连续触发
};

//需要屏蔽浏览器默认快捷键效果的快捷键列表
const shieldKeyList = ['control + s', 'alt', 'control + l', 'control + shift + l', 'control + h',
    'control + k', 'control + 1', 'control + 2', 'control + 3', 'control + 4', 'control + 5', 'control + g', 'control + shift + g',]

const props = defineProps({
    handlerMapping: {
        type: Object,
        required: true
    }
})
const currHotKey = ref([]);
let existHandlerKey = '';
const specialDomCache = {};
//先从缓存中获取dom元素，如果没有则从document中获取并缓存
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

/**
 * 从快捷键配置管理映射表中匹配对应的快捷键处理函数并执行。
 * @param e 鼠标事件对象
 * @param hotKey 当前按下的快捷键
 */
const doHandler = (e, hotKey) => {
    const { handler, triggerType = TriggerType.SINGLE, range } = props.handlerMapping[hotKey] || {};
    if (handler) {
        if ((triggerType === TriggerType.SINGLE && existHandlerKey !== hotKey) || triggerType === TriggerType.COILED) {
            const pointerTarget = eventOperateStore().pointerTarget;
            //如果设定了指定范围并且不在范围内则不执行
            if (range) {
                //先从缓存中获取dom元素，如果没有则从document中获取并缓存
                const targetDom = getSpecialDomCache(range);
                if (!targetDom || !targetDom.contains(pointerTarget)) {
                    return;
                }
            }
            //其余情况均执行快捷键，如果是数组则遍历执行，反之直接执行
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
/**
 * 失去焦点时清空当前热键（一般是切换屏幕）
 */
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

</script>
