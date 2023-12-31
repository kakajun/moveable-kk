import { MoveableManagerState, ResizableProps, MoveableManagerInterface, OnTransformEvent, OnTransformStartEvent, DraggableProps } from "../types";
export declare function calculatePointerDist(moveable: MoveableManagerInterface, e: any): number[];
export declare function setDragStart(moveable: MoveableManagerInterface<any>, { datas }: any): void;
export declare function getTransformDirection(e: any): 1 | -1;
export interface OriginalDataTransformInfos {
    startTransforms: string[];
    nextTransforms: string[];
    nextTransformAppendedIndexes: number[];
}
export declare function resolveTransformEvent(moveable: MoveableManagerInterface, event: any, functionName: string): void;
export declare function convertTransformFormat(datas: any, value: any, dist: any): string;
export declare function getTransformDist({ datas, distX, distY }: any): number[];
export declare function getTransfromMatrix(datas: any, targetMatrix: number[], isAfter?: boolean): number[];
export declare function getBeforeDragDist({ datas, distX, distY }: any): number[];
export declare function getDragDist({ datas, distX, distY }: any, isBefore?: boolean): number[];
export declare function getInverseDragDist({ datas, distX, distY }: any, isBefore?: boolean): number[];
export declare function calculateTransformOrigin(transformOrigin: string[], width: number, height: number, prevWidth?: number, prevHeight?: number, prevOrigin?: number[]): number[];
export declare function getPosIndexesByDirection(direction: number[]): number[];
export declare function getPosesByDirection(poses: number[][], direction: number[]): number[][];
export declare function getPosBySingleDirection(poses: number[][], direction: number): number[];
export declare function getPosByDirection(poses: number[][], direction: number[]): number[];
export declare function getNextMatrix(offsetMatrix: number[], targetMatrix: number[], origin: number[], n: number): number[];
export declare function getNextTransformMatrix(state: MoveableManagerState<any>, datas: any, transform: string | number[], isAllTransform?: boolean): number[];
export declare function scaleMatrix(state: any, scale: number[]): number[];
export declare function fillTransformStartEvent(moveable: MoveableManagerInterface, e: any): OnTransformStartEvent;
export declare function setDefaultTransformIndex(moveable: MoveableManagerInterface, e: any, property: string): void;
export declare function setTransformIndex(moveable: MoveableManagerInterface, e: any, index: number): void;
export declare function fillOriginalTransform(e: any, transform: string): void;
export declare function getBeforeRenderableDatas(e: any): any;
export declare function getNextTransforms(e: any): string[];
export declare function getNextTransformText(e: any): string;
export declare function getNextStyle(e: any): any;
export declare function fillTransformEvent(moveable: MoveableManagerInterface<DraggableProps>, nextTransform: string, delta: number[], isPinch: boolean, e: any): OnTransformEvent;
export declare function getTranslateFixedPosition(moveable: MoveableManagerInterface<any>, transform: string | number[], fixedDirection: number[], fixedOffset: number[], datas: any, isAllTransform?: boolean): number[];
export declare function getTranslateDist(moveable: MoveableManagerInterface<any>, transform: string, fixedDirection: number[], fixedPosition: number[], fixedOffset: number[], datas: any, isAllTransform?: boolean): number[];
export declare function getScaleDist(moveable: MoveableManagerInterface<any>, transform: string, fixedDirection: number[], fixedPosition: number[], fixedOffset: number[], datas: any, isAllTransform?: boolean): number[];
export declare function getOriginDirection(moveable: MoveableManagerInterface<any>): number[];
export declare function getDirectionByPos(pos: number[], width: number, height: number): number[];
export declare function getDirectionOffset(moveable: MoveableManagerInterface, fixedDirection: number[], fixedOffset: number[], nextMatrix?: number[]): number[];
export declare function getRotateDist(moveable: MoveableManagerInterface<any>, rotateDist: number, datas: any): number[];
export declare function getResizeDist(moveable: MoveableManagerInterface<any>, width: number, height: number, fixedPosition: number[], transformOrigin: string[], datas: any): number[];
export declare function getAbsolutePosition(moveable: MoveableManagerInterface<ResizableProps>, direction: number[]): number[];
