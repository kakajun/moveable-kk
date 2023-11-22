<script>
import Moveable from "./components/index";
import { ref } from "vue";
export default {
    components: { Moveable },
    setup() {
        const snappable = true;
        const isDisplaySnapDigit = true;
        const isDisplayInnerSnapDigit = false;
        const snapGap = true;
        const snapDirections = {"top":true,"left":true,"bottom":true,"right":true,"center":true,"middle":true};
        const elementSnapDirections = {"top":true,"left":true,"bottom":true,"right":true,"center":true,"middle":true};
        const snapThreshold = 5;
        const maxSnapElementGuidelineDistance = 9999;
        const targetRef = ref(null);
        const moveableRef = ref(null);
        const elementGuidelines=[{ element: '.container', className: 'pink' } ,
         { element: '.element1', className: 'pink' } ,
         { element: '.element2', className: 'pink' } ,
         { element: '.element3', className: 'pink' } ]
        const onRender = e => {
            e.target.style.cssText += e.cssText;
        };
        const onSnap = e => {
            // console.log('onSnap',e.guidelines, e.elements);
        };
        const dragGroupEnd=e=>{
          console.log(e,'dragGroupEnd');
        }
        return {
            targetRef,
            moveableRef,
            snappable,
            isDisplaySnapDigit,
            isDisplayInnerSnapDigit,
            snapGap,
            snapDirections,
            elementSnapDirections,
            snapThreshold,
            maxSnapElementGuidelineDistance,
            onRender,
            onSnap,
            dragGroupEnd,
            elementGuidelines
        };
    }
};
</script>
<template>
    <div class="root">
        <div
            class="container"
            style="left: 0;top: 100px;width: 500px;height: 500px;border: 1px solid #ccc;"
        >
            <div
                class="target element1"
                style="width: 100px;height: 100px;left: 20px;top: 120px;"
            >Element1</div>
            <div
                class="target element2"
                style="width: 100px;height: 100px;left: 400px;top: 120px;"
            >Element2</div>
            <div
                class="target element3"
                style="width: 300px;height: 100px;top: 400px;left: 50px;"
            >Element3</div>
            <div
                class="target"
                ref="targetRef"
                style="width: 150px;height: 150px;"
            >Target</div>
            <Moveable
                ref="moveableRef"
                :target="targetRef"
                :draggable="true"
                :scalable="true"
                :rotatable="true"
                :snappable="snappable"
                :isDisplaySnapDigit="isDisplaySnapDigit"
                :isDisplayInnerSnapDigit="isDisplayInnerSnapDigit"
                :snapGap="snapGap"
                :snapDirections="snapDirections"
                :elementSnapDirections="elementSnapDirections"
                :snapThreshold="snapThreshold"
                :maxSnapElementGuidelineDistance="maxSnapElementGuidelineDistance"
                :elementGuidelines="elementGuidelines"
                @render="onRender"
                @dragGroupEnd="dragGroupEnd"
                @snap="onSnap"/>
        </div>
    </div>
</template>
<style>
html,
body {
    position: relative;
    height: 100%;
    margin: 0;
    padding: 0;
}

html:has(.no-relative),
body:has(.no-relative) {
    margin: 8px;
    padding: 8px;
    position: static;
    /* border: 8px solid red; */
}

html:has(.no-relative) {
    position: relative;
}

html:has(.margin),
body:has(.margin) {
    /* margin-top: 50px; */
}

.margin .root {
    position: static;
}

.description {
    padding: 10px;
}

.root {
    position: relative;
}

.container {
  background: #fff;
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
}</style>
