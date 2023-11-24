<script setup>
import Moveable from "./components/index";
import { ref, onMounted } from "vue";
import Selecto from "./components/Selecto.vue"
import { GroupManager } from "@moveable/helper";
import { deepFlat } from "@daybrush/utils";
import './app.css'
const snappable = true;
const isDisplaySnapDigit = true;
const isDisplayInnerSnapDigit = false;
const snapGap = true;
const snapDirections = { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true };
const elementSnapDirections = { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true };
const snapThreshold = 5;
const elementGuidelines=ref([])
const maxSnapElementGuidelineDistance = 9999;
const moveableRef = ref(null);
const targets = ref([]);
onMounted(() => {
    const selectedTargets = document.getElementsByClassName("target");
    elementGuidelines.value=['container',... Array.from(selectedTargets)]

    const elements = selectoRef.value.getSelectableElements();
            groupManager.set([], elements);
})
const onRender = e => {
    e.target.style.cssText += e.cssText;
};
const onSnap = e => {
    // console.log('onSnap',e.guidelines, e.elements);
};

const onResize = ({ target, width, height, delta }) => {
    delta[0] && (target.style.width = `${width}px`);
    delta[1] && (target.style.height = `${height}px`);
}
const onScale = ({ target, transform }) => {
    target.style.transform = transform;
}

const onDrag = ({ target, transform }) => {
    console.log('onDrag');
    target.style.transform = transform;
}
const onRotate = ({ target, transform }) => {
    target.style.transform = transform;
}
const dragGroupEnd = e => {
    console.log(e, 'dragGroupEnd');
}
const onChangeTargets = e => {
    console.log(e.targets, 'onChangeTargets');
    if (e.targets.length == 1) {
   const selectedTargets = document.getElementsByClassName("target");
   const wrapper=document.getElementsByClassName("container");
   const allDoms =[wrapper[0],... Array.from(selectedTargets)]
   // 目标变化后要过滤掉自己,否则会产生对标原来自己位置的bug
    elementGuidelines.value=allDoms.filter(item=>e.targets[0]!=item)
    console.log(elementGuidelines.value,"elementGuidelines.value");
    }

}

const groupManager = new GroupManager([]);

const hitRate = 0;
const selectByClick = true;
const selectFromInside = false;
const toggleContinueSelect = ["shift"];
const ratio = 0;
const selectoRef = ref(null);
const onClickGroup = e => {
    selectoRef.value.clickTarget(e.inputEvent, e.inputTarget);
};
const onRenderGroup = e => {
    e.events.forEach(ev => {
        ev.target.style.cssText += ev.cssText;
    });
};
const onDragStart = (e) => {
    const moveable = moveableRef.value;
            const target = e.inputEvent.target;
            const flatted = deepFlat(targets.value);
            if (target.tagName === "BUTTON" || moveable.isMoveableElement(target)
                || flatted.some(t => t === target || t.contains(target))
            ) {
                e.stop();
            }
};
const onSelectEnd = e => {
            const { isDragStart, added, removed, inputEvent } = e;
            const moveable = moveableRef.value;
            if (isDragStart) {
                inputEvent.preventDefault();
                moveable.waitToChangeTarget().then(() => {
                    moveable.dragStart(inputEvent);
                });
            }
            let nextChilds;
            if (isDragStart) {
                nextChilds = groupManager.selectCompletedChilds(
                    targets.value,
                    added,
                    removed
                );
            } else {
                nextChilds = groupManager.selectSameDepthChilds(
                    targets.value,
                    added,
                    removed
                );
            }
            e.currentTarget.setSelectedTargets(nextChilds.flatten());
            setSelectedTargets(nextChilds.targets());
        };


const setSelectedTargets = (nextTargetes) => {
            selectoRef.value.setSelectedTargets(deepFlat(nextTargetes));
            targets.value = nextTargetes;
        };
        const onClick = () => {
            const nextGroup = groupManager.group(targets.value, true);
            if (nextGroup) {
                targets.value = nextGroup;
            }
        };
        const onClick$0 = () => {
            const nextGroup = groupManager.ungroup(targets.value);
            if (nextGroup) {
                targets.value = nextGroup;
            }
        };

</script>
<template>
    <div class="root">
        <button @click="onClick">Group</button>
            &nbsp;
            <button @click="onClick$0">Ungroup</button>
        <div class="container"
            style="left: 0;top: 100px;width: 500px;height: 500px;border: 1px solid #f1eeee;">
            <div class="target element1" id='element1' style="width: 100px;height: 100px;left: 20px;top: 120px;">Element1
            </div>
            <div class="target element2" id='element2' style="width: 100px;height: 100px;left: 400px;top: 120px;">Element2
            </div>
            <div class="target element3" id='element3' style="width: 300px;height: 100px;top: 400px;left: 50px;">Element3
            </div>
            <div class="target element4" style="width: 150px;height: 150px;">Target</div>

        </div>
        <Moveable ref="moveableRef"  :target="targets" :draggable="true" :scalable="true" :rotatable="true"
                :zoom="0.8" :snappable="snappable" :isDisplaySnapDigit="isDisplaySnapDigit"
                :isDisplayInnerSnapDigit="isDisplayInnerSnapDigit" :snapGap="snapGap" :snapDirections="snapDirections"
                :elementSnapDirections="elementSnapDirections" :snapThreshold="snapThreshold"
                :maxSnapElementGuidelineDistance="maxSnapElementGuidelineDistance" :elementGuidelines="elementGuidelines"
                @rotate="onRotate" @scale="onScale" @resize="onResize" @dragGroupEnd="dragGroupEnd"
                @ChangeTargets="onChangeTargets" @click="onClick" @drag="onDrag" @snap="onSnap" @clickGroup="onClickGroup"
                @render="onRender" @renderGroup="onRenderGroup" />
            <Selecto ref="selectoRef" :dragContainer="'.container'" :selectableTargets="['.target']" :hitRate="hitRate"
                :selectByClick="selectByClick" :selectFromInside="selectFromInside"
                :toggleContinueSelect="toggleContinueSelect" :ratio="ratio" :keyContainer="window" @dragStart="onDragStart"
                @selectEnd="onSelectEnd" />
    </div>
</template>
