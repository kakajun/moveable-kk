<template>
  <div class="wrapper">
    <VueInfiniteViewer class="viewer">
    <div class="viewport">
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
    </div>
  </div>
  </VueInfiniteViewer>
  </div>

</template>
<script setup>
import { VueInfiniteViewer } from "vue3-infinite-viewer";
  import Moveable from '@/components/moveable/index'
import { ref, onMounted ,watch} from "vue";
  import Selecto from '@/components/moveable/Selecto.vue'
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
<style scoped>
.wrapper{
  position: absolute;
  left: 100px;
  top:  100px;
}
.container {
  position: relative;
  height: 100%;
  margin: 0;
  padding: 0;
}
.viewer {
  border: 1px solid black;
  position: relative;
  width: 800px;
  height: 800px;
}
.viewport {
  position: relative;
  /* margin-left: 200px; */
  width: 700px;
  height: 600px;
  background: #f55;
}


.description {
    padding: 10px;
}

.root {
    position: relative;
}

.container {
    background: #fcfafa;
    position: relative;
    margin-top: 50px;
}

.will-change-container {
    padding-left: 100px;
    padding-top: 100px;
    will-change: transform;
}

.will-change-target {
    position: relative;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
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

.target1 {
    left: 120px;
    top: 120px;
}

.target2 {
    left: 300px;
    top: 140px;
}

.target3 {
    left: 180px;
    top: 250px;
}

.nested {
    position: absolute;
    border: 4px solid #ccc;
    width: 100px;
    height: 100px;
    top: 50px;
    left: 70px;
    color: #333;
    /* box-sizing: border-box; */
}

.nested.first {
    top: 150px;
}

.nested.rotate {
    transform-origin: 0 0;
    transform: rotate(-30deg);
}

.nested.scale {
    transform: scale(1.5, 1.5);
}

.nested .target {
    top: 50px;
    left: 50px
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

.scrollArea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;
}

.scrollArea:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 300%;
    width: 100%;
    background: linear-gradient(#333,
            #fff);
}

.infinite-viewer {
    height: 500px;
}

.control-padding .moveable-around-control {
    background: #f55 !important;
}


.cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    --color: rgb(255, 68, 255);
    color: #333;
    line-height: 40px;
    text-align: center;
}

/* .rCS1w3zcxh .moveable-line{
  background: #ff4aff !important;
} */

.cube .cube {
    background: #ddd;
    margin-left: 20px;
}
</style>
