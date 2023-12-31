import {
  doBaseBottomDecreaseUp,
  doBaseBottomEnlargeUp,
  doBaseLeftDecreaseRight,
  doBaseLeftEnlargeRight,
  doBaseRightDecreaseLeft,
  doBaseRightEnlargeLeft,
  doBaseUpDecreaseDown,
  doBaseUpEnlargeDown,
  doCopy,
  doDelete,
  doGrouping,
  doHide,
  doLock,
  doMoveDown,
  doMoveLeft,
  doMoveRight,
  doMoveUp,
  doSave,
  doUnGrouping,
  doUnLock,
  redo,
  selectAll,
  toBottom,
  toggleLayer,
  toTop,
  undo,
  doExise,
  createLine
} from './HotKeyImpl'

export const hotkeyConfigs = {
  escape: {
    handler: doExise,
    range: '.lc-ruler-content'
  },
  'control + a': {
    handler: selectAll,
    range: '.lc-ruler-content'
  },
  'control + v': {
    handler: doCopy,
    range: '.lc-ruler-content'
  },
  'control + l': {
    handler: doLock
  },
  'control + shift + l': {
    handler: doUnLock
  },
  'control + h': {
    handler: doHide
  },
  'control + arrowup': {
    handler: toTop
  },
  'control + arrowdown': {
    handler: toBottom
  },
  'control + s': {
    handler: doSave
  },
  delete: {
    handler: [doDelete]
  },
  'control + z': {
    handler: undo,
    range: '.lc-ruler-content'
  },
  'control + shift + z': {
    handler: redo,
    range: '.lc-ruler-content'
  },

  'control + 5': {
    handler: toggleLayer
  },
  arrowup: {
    handler: doMoveUp,

    range: '.lc-ruler-content'
  },
  arrowdown: {
    handler: doMoveDown,

    range: '.lc-ruler-content'
  },
  arrowleft: {
    handler: doMoveLeft,

    range: '.lc-ruler-content'
  },
  arrowright: {
    handler: doMoveRight,
    range: '.lc-ruler-content'
  },
  'control + shift + arrowup': {
    handler: doBaseBottomEnlargeUp,
    range: '.lc-ruler-content'
  },
  'control + shift + arrowdown': {
    handler: doBaseUpEnlargeDown,
    range: '.lc-ruler-content'
  },
  'control + shift + arrowleft': {
    handler: doBaseRightEnlargeLeft,
    range: '.lc-ruler-content'
  },
  'control + shift + arrowright': {
    handler: doBaseLeftEnlargeRight,
    range: '.lc-ruler-content'
  },
  'control + alt + arrowup': {
    handler: doBaseBottomDecreaseUp,
    range: '.lc-ruler-content'
  },
  'control + alt + arrowdown': {
    handler: doBaseUpDecreaseDown,
    range: '.lc-ruler-content'
  },
  'control + alt + arrowleft': {
    handler: doBaseRightDecreaseLeft,
    range: '.lc-ruler-content'
  },
  'control + alt + arrowright': {
    handler: doBaseLeftDecreaseRight,
    range: '.lc-ruler-content'
  },
  'control + g': {
    handler: doGrouping
  },
  'control + shift + g': {
    handler: doUnGrouping
  },
  // 倒着来一遍
  'shift + control + arrowup': {
    handler: doBaseBottomEnlargeUp,
    range: '.lc-ruler-content'
  },
  'shift + control + arrowdown': {
    handler: doBaseUpEnlargeDown,
    range: '.lc-ruler-content'
  },
  'shift + control + arrowleft': {
    handler: doBaseRightEnlargeLeft,
    range: '.lc-ruler-content'
  },
  'shift + control + arrowright': {
    handler: doBaseLeftEnlargeRight,
    range: '.lc-ruler-content'
  },
  'alt + control + arrowup': {
    handler: doBaseBottomDecreaseUp,
    range: '.lc-ruler-content'
  },
  'alt + control + arrowdown': {
    handler: doBaseUpDecreaseDown,
    range: '.lc-ruler-content'
  },
  'alt + control + arrowleft': {
    handler: doBaseRightDecreaseLeft,
    range: '.lc-ruler-content'
  },
  'alt + control + arrowright': {
    handler: doBaseLeftDecreaseRight,
    range: '.lc-ruler-content'
  },
  'shift + control + g': {
    handler: doUnGrouping
  },
  'shift + control + z': {
    handler: redo,
    range: '.lc-ruler-content'
  },
  'shift + control + l': {
    handler: doUnLock
  },
  l: {
    handler: createLine
  }
}
