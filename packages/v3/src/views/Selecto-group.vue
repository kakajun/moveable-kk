<script setup>
import { deepFlat } from "@daybrush/utils";
  import Selecto from '@/components/moveable/Selecto.vue'
  import Moveable from '@/components/moveable/index'
import { GroupManager } from "@moveable/helper";
import { ref, onMounted } from "vue";

const groupManager = new GroupManager([]);
const targets = ref([]);
const moveableRef = ref(null);
const selectoRef = ref(null);
const cubes = [];
for (let i = 0; i < 30; ++i) {
    cubes.push(i);
}
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
const onDrag = e => {
    e.target.style.transform = e.transform;
};
const onRenderGroup = e => {
    e.events.forEach(ev => {
        ev.target.style.cssText += ev.cssText;
    });
};
const onDragStart = e => {
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
onMounted(() => {
    const elements = selectoRef.value.getSelectableElements();
    groupManager.set([], elements);
});
</script>
<template>
    <div class="moveable app">
        <div class="container">
            <div class="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank">
                    <img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" />
                </a>
                <a href="https://github.com/daybrush/moveable" target="_blank">
                    <img src="https://daybrush.com/moveable/images/256x256.png" />
                </a>
            </div>
            <h1>You can Group & Ungroup selected targets.</h1>
            <p class="description">You can do simple Group & Ungroup through the helper.</p>
            <button @click="onClick">Group</button>
            &nbsp;
            <button @click="onClick$0">Ungroup</button>
            <Moveable ref="moveableRef" :draggable="true" :rotatable="true" :scalable="true" :target="targets"
                @drag="onDrag" @renderGroup="onRenderGroup"></Moveable>
            <Selecto ref="selectoRef" :dragContainer="window" :selectableTargets="['.selecto-area .cube']" :hitRate="0"
                :selectByClick="true" :selectFromInside="false" :toggleContinueSelect="['shift']" :ratio="0"
                @dragStart="onDragStart" @selectEnd="onSelectEnd"></Selecto>
            <div class="elements selecto-area">
                <div class="cube" :key="i" v-for="i in cubes">{{ i }}</div>
            </div>
            <div class="empty elements"></div>
        </div>
    </div>
</template>
<style scoped>
#root {
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

h1,
.description {
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

.elements {
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

.infinite-viewer,
.scroll {
    width: 100%;
    height: 300px;
    box-sizing: border-box;
}

.infinite-viewer .viewport {
    padding-top: 10px;
}

.empty.elements {
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
