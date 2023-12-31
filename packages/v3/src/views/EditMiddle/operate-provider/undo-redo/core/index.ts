import { OperateType } from '../OperateType'
import AbstractRollback from './AbstractRollback'
import dragRollbackImpl from './DragRollbackImpl'
import rotateRollbackImpl from './RotateRollbackImpl' // 旋转
import resizeRollbackImpl from './ResizeRollbackImpl' // 缩放
import addRollbackImpl from './AddRollbackImpl' // 记录添加
import delRollbackImpl from './DelRollbackImpl' // 记录删除
import styleRollbackImpl from './StyleRollbackImpl' // 这个准备废掉
import hideRollbackImpl from './HideRollbackImpl'
import lockRollbackImpl from './LockRollbackImpl' // lock
import orderRollBackImpl from './OrderRollbackImpl' // config, componentData, style 的历史记录全部走这里
import updLayerGroupRollbackImpl from './UpdLayerGroupRollbackImpl'
import changePagebackImpl from './ChangePagebackImpl' // 改背景等


const undoRedoMap = new Map<OperateType, AbstractRollback>()
undoRedoMap.set(OperateType.DRAG, dragRollbackImpl)
undoRedoMap.set(OperateType.RESIZE, resizeRollbackImpl)
undoRedoMap.set(OperateType.ROTATE, rotateRollbackImpl)
undoRedoMap.set(OperateType.ADD, addRollbackImpl)
undoRedoMap.set(OperateType.DEL, delRollbackImpl)
undoRedoMap.set(OperateType.UPD_STYLE, styleRollbackImpl)
undoRedoMap.set(OperateType.HIDE, hideRollbackImpl)
undoRedoMap.set(OperateType.LOCK, lockRollbackImpl)
undoRedoMap.set(OperateType.ORDER, orderRollBackImpl)
undoRedoMap.set(OperateType.UPD_LAYER_GROUP, updLayerGroupRollbackImpl)
undoRedoMap.set(OperateType.CHANGEPAGE, changePagebackImpl)
export default undoRedoMap
