<script setup>
import Moveable from "./components/index";
import { ref, onMounted } from "vue";
import Selecto from "./components/Selecto.vue"
const snapDirections = { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true };
const elementSnapDirections = { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true };
const elementGuidelines=ref([])
const maxSnapElementGuidelineDistance = 9999;
const moveableRef = ref(null);
const targets = ref([]);
onMounted(() => {
    const selectedTargets = document.getElementsByClassName("target");
    elementGuidelines.value=['container',... Array.from(selectedTargets)]
})
const onRender = e => {
    e.target.style.cssText += e.cssText;
};
const onSnap = e => {
    // console.log('onSnap',e.guidelines, e.elements);
};

const mouseEnter = (e) => {
    console.log(e, 'mouseEnter');
}
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
    console.log(e, 'onDragStart');
    const target = e.inputEvent.target;
    if (moveableRef.value.isMoveableElement(target)
        || targets.value.some(t => t === target || t.contains(target))
    ) {
        e.stop();
    }
};
const onSelectEnd = e => {
    if (e.isDragStartEnd) {
        e.inputEvent.preventDefault();
        moveableRef.value.waitToChangeTarget().then(() => {
            moveableRef.value.dragStart(e.inputEvent);
        });
    }
    targets.value = e.selected;

};

</script>
<template>
    <div class="root">
        <div class="container" @mouseEnter.native="mouseEnter"
            style="left: 0;top: 100px;width: 500px;height: 500px;border: 1px solid #f1eeee;">
            <div class="target element1" id='element1' style="width: 100px;height: 100px;left: 20px;top: 120px;">Element1
            </div>
            <div class="target element2" id='element2' style="width: 100px;height: 100px;left: 400px;top: 120px;">Element2
            </div>
            <div class="target element3" id='element3' style="width: 300px;height: 100px;top: 400px;left: 50px;">Element3
            </div>
            <div class="target element4" style="width: 150px;height: 150px;">Target</div>
            <Moveable ref="moveableRef"  :target="targets" :draggable="true" :scalable="true" :rotatable="true"
                :zoom="0.8" :snappable="true" :isDisplaySnapDigit="true"
                :isDisplayInnerSnapDigit="false" :snapGap="true" :snapDirections="snapDirections"
                :elementSnapDirections="elementSnapDirections" :snapThreshold="5"
                :maxSnapElementGuidelineDistance="maxSnapElementGuidelineDistance" :elementGuidelines="elementGuidelines"
                @rotate="onRotate" @scale="onScale" @resize="onResize" @dragGroupEnd="dragGroupEnd"
                @ChangeTargets="onChangeTargets" @click="onClick" @drag="onDrag" @snap="onSnap" @clickGroup="onClickGroup"
                @render="onRender" @renderGroup="onRenderGroup" />
            <Selecto ref="selectoRef" :dragContainer="'.container'" :selectableTargets="['.target']" :hitRate="hitRate"
                :selectByClick="selectByClick" :selectFromInside="selectFromInside"
                :toggleContinueSelect="toggleContinueSelect" :ratio="ratio" :keyContainer="window" @dragStart="onDragStart"
                @selectEnd="onSelectEnd" />
        </div>
    </div>
</template>
<style scoped>

.root {
    left: 100px;
    top:20px;
    position: relative;
}

.container {
    background: #fcfafa;
    position: relative;
    margin-top: 50px;
}
.target {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 150px;
    left: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}
/* pos guidelines */
.moveable-normal.pink {

    background: rgb(0, 255, 76) !important;
}

/* gap guidelines */
.moveable-gap.pink {

    background: rgb(255, 174, 0) !important;
}

/* When snapped to an element in elementGuidelines */
.moveable-bold.pink {
    background: red !important;
}

/* A dashed line between target and element */
.moveable-dashed.pink {
    border-top-color: red !important;
    border-left-color: red !important;
}

/* pos guidelines */
.moveable-normal.green {
    background: green !important;
}

/* gap guidelines */
.moveable-gap.green {
    background: green !important;
}

/* When snapped to an element in elementGuidelines */
.moveable-bold.green {
    background: green !important;
}

/* A dashed line between target and element */
.moveable-dashed.green {
    border-top-color: green !important;
    border-left-color: green !important;
}

.infinite-viewer {
    height: 500px;
}

.control-padding .moveable-around-control {
    background: #f55 !important;
}

</style>
