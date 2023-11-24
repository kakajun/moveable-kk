<script>
import Moveable from "./components/index";

import Selecto from "./components/Selecto.vue"
import { ref } from "vue";

export default {
    components: { Moveable, Selecto },
    setup() {
        const hitRate = 0;
        const selectByClick = true;
        const selectFromInside = false;
        const toggleContinueSelect = ["shift"];
        const ratio = 0;
        const cubes = [];
        for (let i = 0; i < 30; ++i) {
            cubes.push(i);
        }
        const targets = ref([]);
        const moveableRef = ref(null);
        const selectoRef = ref(null);
        const onClickGroup = e => {
            selectoRef.value.clickTarget(e.inputEvent, e.inputTarget);
        };
        const onRender = e => {
            e.target.style.cssText += e.cssText;
        };
        const onRenderGroup = e => {
            e.events.forEach(ev => {
                ev.target.style.cssText += ev.cssText;
            });
        };
        const onDragStart = (e) => {
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
        return {
            moveableRef,
            targets,
            onClickGroup,
            onRender,
            onRenderGroup,
            selectoRef,
            hitRate,
            selectByClick,
            selectFromInside,
            toggleContinueSelect,
            ratio,
            window,
            onDragStart,
            onSelectEnd,
            cubes
        };
    }
};
</script>
<template>
    <div class="moveable app">
        <div class="container">
            <div
                class="logo logos"
                id="logo"
            >
                <a
                    href="https://github.com/daybrush/selecto"
                    target="_blank"
                >
                    <img
                        src="https://daybrush.com/selecto/images/256x256.png"
                        class="selecto"/>
                </a>
                <a
                    href="https://github.com/daybrush/moveable"
                    target="_blank"
                >
                    <img src="https://daybrush.com/moveable/images/256x256.png"/>
                </a>
            </div>
            <h1>Change the Moveable targets by selecting it.</h1>
            <p class="description">You can drag and move targets and select them.</p>
            <Moveable
                ref="moveableRef"
                :target="targets"
                :draggable="true"
                @clickGroup="onClickGroup"
                @render="onRender"
                @renderGroup="onRenderGroup"/>
            <Selecto
                ref="selectoRef"
                :dragContainer="'.container'"
                :selectableTargets="['.target']"
                :hitRate="hitRate"
                :selectByClick="selectByClick"
                :selectFromInside="selectFromInside"
                :toggleContinueSelect="toggleContinueSelect"
                :ratio="ratio"
                :keyContainer="window"
                @dragStart="onDragStart"
                @selectEnd="onSelectEnd"/>
            <div class="container selecto-area">
                <div
                    class="cube target"
                    :key="i"
                    v-for="i in cubes"
                ></div>
            </div>

        </div>
    </div>
</template>
<style>
html, body, #root {
    position: relative;
    margin: 0;
    padding: 0;
    height: 100%;
    color: #333;
    background: #fdfdfd;
}

.app {
    position: relative;
    min-height: 100%;
    padding: 10px 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.container {
    max-width: 800px;
    ;
}

body {
    background: #fff;
}

.logo {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0px auto;
    font-size: 0;
    text-align: left;
}

.logo.logos {
    width: 320px;
    text-align: center;
}

.logos .selecto {
    padding: 16px;
}

.logo img {
    position: relative;
    height: 100%;
    box-sizing: border-box;
}

.cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    --color: #4af;
    line-height: 40px;
}

h1, .description {
    text-align: center;
}

.button {
    border: 1px solid #333;
    color: #333;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    cursor: pointer;
    width: 120px;
    height: 42px;
    font-size: 14px;
    letter-spacing: 1px;
    transition: all ease 0.2s;
    margin: 0px 5px;
}

.button:hover {
    background: #333;
    color: white;
}

.container {
    margin-top: 40px;
    border: 2px solid #eee;
}

.selecto-area {
    padding: 20px;
}

#selecto1 .cube {
    transition: all ease 0.2s;
}

.moveable #selecto1 .cube {
    transition: none;
}

.selecto-area .selected {
    color: #fff;
    background: var(--color);
}

.scroll {
    overflow: auto;
    padding-top: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.infinite-viewer, .scroll {
    width: 100%;
    height: 300px;
    box-sizing: border-box;
}

.infinite-viewer .viewport {
    padding-top: 10px;
}

.empty.container {
    border: none;
}

.correct {
    position: relative;
    padding: 20px;
    text-align: center;
    margin: auto;
    width: 100%;
}
.correct .target {
    position: relative;
    width: 100px;
    height: 100px;
    color: #fff;
    margin: 10px 20px;
    line-height: 100px;
    text-align: center;
    display: inline-block;
}
.correct svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0.9;
    transform: translateZ(0px);
}
.correct svg path {
    stroke: #333;
    stroke-width: 2;
    fill: transparent;
}
</style>
