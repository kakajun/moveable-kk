<template>
    <div class="root">
        <button @click="onClick">Group</button>
        &nbsp;
        <button @click="onClick$0">Ungroup</button>
        <button @click="print">print</button>
<GroupMovable></GroupMovable>
<GroupSelectable></GroupSelectable>
    </div>
</template>
<script setup>
import GroupMovable from './operate-provider/movable/GroupMovable.vue';
import GroupSelectable from  './operate-provider/movable/GroupSelectable.vue';

import { ref, onMounted,reactive  } from "vue";
import Selecto from "../components/Selecto.vue"
import { GroupManager } from "@moveable/helper";
import { deepFlat } from "@daybrush/utils";
import showComponet from './show-component.vue';
const snappable = true;
const isDisplaySnapDigit = true;
const isDisplayInnerSnapDigit = false;
const snapGap = true;
const snapDirections = { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true };
const elementSnapDirections = { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true };
const snapThreshold = 5;
const elementGuidelines = ref([])
const maxSnapElementGuidelineDistance = 9999;
const moveableRef = ref(null);
const targets = ref([]);
const activeItem = ref();
let nextChilds;
const componentSlist = ref([{
    id: 'element1',
    scope:['a'],
    style: {
        width: 100,
        height: 100,
        rotate: 0,
        transform: 'rotate(0deg)',
        top: 0,
        left: 0
    },

},
{
    id: 'element2',
    scope:['a'],
    style: {
        width: 100,
        height: 100,
        top: 100,
        left: 100,
        rotate: 0,
        transform: 'rotate(0deg)',
    }
},
{
    id: 'element3',
    style: {
        width: 100,
        height: 100,
        top: 200,
        left: 200,
        rotate: 0,
        transform: 'rotate(0deg)',
    }
},
{
    id: 'element4',
    style: {
        width: 100,
        height: 100,
        top: 300,
        left: 300,
        rotate: 0,
        transform: 'rotate(0deg)',
    }
}]);
const refList=ref([]);

onMounted(() => {
    const children=refList.value.children;
    const elements = selectoRef.value.getSelectableElements();
    groupManager.set([] , elements);   // 这个必须要,否则多选不会生效
    // groupManager.group([children[0],children[1]] , true);   // 这里设置成组
    // groupManager.group([children[2],children[3]] , true);
    console.log(elements,"elements");
     // 这里获取localStorage
    const copyComponentSliststr = localStorage.getItem('componentSlist');
    if (copyComponentSliststr) {
        componentSlist.value = JSON.parse(copyComponentSliststr)
    }
    const selectedTargets = document.getElementsByClassName("target");
    elementGuidelines.value = ['container', ...Array.from(selectedTargets)]
    console.log(selectedTargets, 'selectedTargets')

})

let moveItem = {}
let groupEvent = null
const selectByClick = ref(true);

// dragGroup
const onDragGroup = (e) => {

    for (const target of e.targets) {
        // console.log(target.style,"target");
        // const item = Object.assign({},  activeItem.value .style)
        // item.top += e.clientY - groupEvent.clientY
        // item.left += e.clientX - groupEvent.clientX
        // Object.assign(target.style, config.elementStyle(item))
    }
}
const dragGroupStart = (e) => {
    groupEvent = e
    console.log("dragGroupStart",nextChilds);
}
// dragGroupEnd
const dragGroupEnd = (e) => {
    for (const target of e.targets) {
        // const item =  activeItem.value .style
        // item.top += e.clientY - groupEvent.clientY
        // item.left += e.clientX - groupEvent.clientX
        // Object.assign(target.style, config.elementStyle(item))
    }
}
const eventStart = () => {
    console.log('eventStart');
    selectByClick.value = false
    const item = activeItem.value.style
    Object.assign(moveItem, item, {
        offset: {
            top: item.top,
            left: item.left,
            width: item.width,
            height: item.height
        }
    })
}
const eventEnd = () => {
    // 在操作完成后更新目标数据，防止频繁刷新DOM导致卡顿
    selectByClick.value = true
    const item = activeItem.value.style
    item.top = Math.round(moveItem.top)
    item.left = Math.round(moveItem.left)
    item.width = Math.round(moveItem.width)
    item.height = Math.round(moveItem.height)
    item.rotate = moveItem.rotate
    item.transform = `rotate(${moveItem.rotate}deg)`
    moveItem = {}
    console.log(item, 'eventEnd');
    console.log(componentSlist.value, 'componentSlist');
    localStorage.setItem('componentSlist', JSON.stringify(componentSlist.value));
}

const onDragStart = e => {
    if (e.inputEvent.target.nodeName === 'PRE') {
        activeItem.value.editable && stop()
    }
    eventStart()
}

const onDragEnd = e => {
    eventEnd()

}
const onRender = e => {
    e.target.style.cssText += e.cssText;
};
const onSnap = e => {
    // console.log('onSnap',e.guidelines, e.elements);
};

const onResize = ({ dist,direction }) => {
    moveItem.width = moveItem.offset.width + dist[0]
    if (direction[0] === -1) {
        moveItem.left = moveItem.offset.left - dist[0]
    }
    moveItem.height = moveItem.offset.height + dist[1]
    if (direction[1] === -1) {
        moveItem.top = moveItem.offset.top - dist[1]
    }
}
const resizeStart = () => {
    eventStart()
}
const resizeEnd = () => {
    eventEnd()
}
const onScale = ({ target, transform }) => {
    target.style.transform = transform;
}

const onDrag = (e) => {
    moveItem.top = e.top
    moveItem.left = e.left
    moveItem.width = e.width
    moveItem.height = e.height
    e.target.style.transform = e.transform;
}
const onRotate = ({ target, transform, rotate }) => {
    target.style.transform = transform;
    moveItem.rotate = Math.round(rotate)
    console.log(moveItem.rotate, 'moveItem.rotate');
}
const onChangeTargets = e => {
    console.log(e.targets, 'onChangeTargets');
    if (e.targets.length == 1) {
        const selectedTargets = document.getElementsByClassName("target");
        const wrapper = document.getElementsByClassName("container");
        const allDoms = [wrapper[0], ...Array.from(selectedTargets)]
        // 目标变化后要过滤掉自己,否则会产生对标原来自己位置的bug
        elementGuidelines.value = allDoms.filter(item => e.targets[0] != item)
        console.log(elementGuidelines.value, "elementGuidelines.value");
    }

}

const groupManager = new GroupManager([]);
const hitRate = 0;
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
        ev.target.style.transform = ev.transform;
    });
};
const ungroup = () => {
  if (pageActiveElement.value.uuid === '-1') {
    return false
  }
  const widgets = currentPage.value.page_config
  const index = widgets.findIndex((item) => item.uuid === pageActiveElement.value.uuid)
  const len = widgets.length
  for (let i = 0; i < len; ++i) {
    if (widgets[i].parent === pageActiveElement.value.uuid) {
      widgets[i].parent = '-1'
      store.dSelectWidgets.push(widgets[i])
    }
  }
  widgets.splice(index, 1)
  currentPage.value.page_config = widgets
  store.setUpdateSelect()
  updatePage(currentPage.value, () => {
    store.selectWidget({ uuid: '-1' })
  })
}

const onClick = () => {

    // console.log(targets.value, "targets.value");
    const nextGroup = groupManager.group(targets.value, true);
    console.log(nextGroup, "nextGroup22222222222");
    if (nextGroup) {
        targets.value = nextGroup;
    }
};
const print=()=>{
    console.log(groupManager,"55555");
}
const onClick$0 = () => {
    const nextGroup = groupManager.ungroup(targets.value);
    if (nextGroup) {
        targets.value = nextGroup;
    }
};

/* ********************** Selecto start************************************ */
const onDragStartSelecto = (e) => {
    const moveable = moveableRef.value;
    const target = e.inputEvent.target;
    const flatted = deepFlat(targets.value);
    if (moveable.isMoveableElement(target)
        || flatted.some(t => t === target || t.contains(target))
    ) {
        console.log("5555555555555");
        e.stop();
    }
};
const onSelectEnd = e => {
    const { isDragStart, added, removed, inputEvent } = e;
    console.log(targets.value,"targets.value");
    const moveable = moveableRef.value;
    if (isDragStart) {
        inputEvent.preventDefault();
        moveable.waitToChangeTarget().then(() => {
            moveable.dragStart(inputEvent);
        });
    }

    if (isDragStart) {
        console.log(1);
        nextChilds = groupManager.selectCompletedChilds(
            targets.value,
            added,
            removed
        );
    } else {
        console.log(2);
        nextChilds = groupManager.selectSameDepthChilds(
            targets.value,
            added,
            removed
        );
    }
    console.log(nextChilds.targets(), 'nextChilds.targets()');
    e.currentTarget.setSelectedTargets(nextChilds.flatten());
    setSelectedTargets(nextChilds.targets());
};


const setSelectedTargets = (nextTargetes) => {
    selectoRef.value.setSelectedTargets(deepFlat(nextTargetes));
    targets.value = nextTargetes;
    console.log(nextTargetes, 'setSelectedTargets');
};


</script>


<style scoped>
.root {
    position: relative;
}

.container {
    background: #fcfafa;
    position: relative;
    margin-top: 50px;
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
