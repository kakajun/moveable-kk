import { SnapInfo, SnappableProps, SnappableState, SnapGuideline, ResizableProps, ScalableProps, SnapOffsetInfo, MoveableManagerInterface, SnapDirectionPoses, SnapDirectionInfo } from "../../types";
export declare function checkMoveableSnapPoses(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, posesX: number[], posesY: number[], dirXs?: string[], dirYs?: string[], customSnapThreshold?: number): {
    vertical: SnapInfo;
    horizontal: SnapInfo;
};
export declare function checkSnapPoses(guidelines: SnapGuideline[], posesX: number[], posesY: number[], dirXs: string[], dirYs: string[], snapThreshold: number, multiples: number[]): {
    vertical: SnapInfo;
    horizontal: SnapInfo;
};
export declare function checkSnapKeepRatio(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, startPos: number[], endPos: number[]): {
    vertical: SnapOffsetInfo;
    horizontal: SnapOffsetInfo;
};
export declare function checkSnaps(moveable: MoveableManagerInterface<SnappableProps, SnappableState>, rect: SnapDirectionPoses, customSnapThreshold?: number): {
    vertical: SnapDirectionInfo;
    horizontal: SnapDirectionInfo;
};
export declare function getNearestSnapGuidelineInfo(snapInfo: SnapInfo): {
    isSnap: boolean;
    offset: number;
    dist: number;
    pos: number;
    guideline: null;
} | {
    isSnap: true;
    offset: number;
    dist: number;
    pos: number;
    guideline: SnapGuideline;
};
export declare function getSnapInfosByDirection(moveable: MoveableManagerInterface<SnappableProps & (ResizableProps | ScalableProps), SnappableState>, poses: number[][], snapDirection: number[], snapThreshold?: number): {
    vertical: SnapDirectionInfo;
    horizontal: SnapDirectionInfo;
};
export declare function checkSnapBoundPriority(a: {
    isBound: boolean;
    isSnap: boolean;
    offset: number;
}, b: {
    isBound: boolean;
    isSnap: boolean;
    offset: number;
}): number;
export declare function getNearOffsetInfo<T extends {
    offset: number[];
    isBound: boolean;
    isSnap: boolean;
    sign: number[];
}>(offsets: T[], index: number): T;
export declare function getCheckSnapDirections(direction: number[], fixedDirection: number[], keepRatio: boolean): number[][][];
