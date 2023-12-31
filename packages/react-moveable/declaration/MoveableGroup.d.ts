import MoveableManager from "./MoveableManager";
import { GroupableProps, GroupRect, MoveableManagerInterface, RectInfo } from "./types";
import ChildrenDiffer from "@egjs/children-differ";
/**
 * @namespace Moveable.Group
 * @description You can make targets moveable.
 */
declare class MoveableGroup extends MoveableManager<GroupableProps> {
    static defaultProps: {
        transformOrigin: string[];
        groupable: boolean;
        dragArea: boolean;
        keepRatio: boolean;
        targets: never[];
        defaultGroupRotate: number;
        defaultGroupOrigin: string;
        cssStyled: any;
        customStyledMap: Record<string, any>;
        wrapperMoveable: MoveableManagerInterface<{}, {}> | null;
        isWrapperMounted: boolean;
        parentMoveable: MoveableManagerInterface<{}, {}> | null;
        parentPosition: number[] | null;
        target: HTMLElement | SVGElement | null;
        dragTarget: string | HTMLElement | SVGElement | (() => HTMLElement | SVGElement) | import("./types").MoveableRefObject<HTMLElement | SVGElement> | null;
        dragTargetSelf: boolean;
        dragContainer: string | Window | HTMLElement | (() => HTMLElement) | import("./types").MoveableRefObject<HTMLElement> | null;
        container: HTMLElement | SVGElement | null;
        warpSelf: boolean;
        rootContainer: string | HTMLElement | (() => HTMLElement) | import("./types").MoveableRefObject<HTMLElement> | null;
        viewContainer: string | HTMLElement | (() => HTMLElement) | import("./types").MoveableRefObject<HTMLElement> | null;
        useResizeObserver: boolean;
        useMutationObserver: boolean;
        zoom: number;
        ables: import("./types").Able<import("@daybrush/utils").IObject<any>, import("@daybrush/utils").IObject<any>>[];
        className: string;
        pinchThreshold: number;
        pinchOutside: boolean;
        triggerAblesSimultaneously: boolean;
        checkInput: boolean;
        cspNonce: string;
        translateZ: string | number;
        hideDefaultLines: boolean;
        stopPropagation: boolean;
        preventDefault: boolean;
        preventClickEventOnDrag: boolean;
        dragFocusedInput: boolean;
        preventClickDefault: boolean;
        props: Record<string, any>;
        persistData: import("./types").PersistRectData | null;
        useAccuratePosition: boolean;
        linePadding: number;
        controlPadding: number;
        firstRenderState: import("./types").MoveableManagerState<{}> | null;
        requestStyles: string[];
        flushSync: (callback: () => void) => void;
        passDragArea: boolean;
        origin: boolean;
        svgOrigin: string;
        padding: number | import("./types").PaddingBox;
    };
    differ: ChildrenDiffer<HTMLElement | SVGElement>;
    moveables: MoveableManager[];
    transformOrigin: string;
    renderGroupRects: GroupRect[];
    private _targetGroups;
    private _hasFirstTargets;
    componentDidMount(): void;
    checkUpdate(): void;
    getTargets(): (HTMLElement | SVGElement)[];
    updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState?: boolean): void;
    getRect(): RectInfo;
    triggerEvent(name: string, e: any, isManager?: boolean): any;
    getRequestChildStyles(): (keyof CSSStyleDeclaration)[];
    getMoveables(): MoveableManagerInterface[];
    protected updateAbles(): void;
    protected _updateTargets(): void;
    protected _updateEvents(): void;
    protected _updateObserver(): void;
}
/**
 * Sets the initial rotation of the group.
 * @name Moveable.Group#defaultGroupRotate
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   defaultGroupRotate: 0,
 * });
 *
 * moveable.defaultGroupRotate = 40;
 */
/**
 * Sets the initial origin of the group.
 * @name Moveable.Group#defaultGroupOrigin
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   defaultGroupOrigin: "50% 50%",
 * });
 *
 * moveable.defaultGroupOrigin = "20% 40%";
 */
/**
 * Whether to hide the line in child moveable for group corresponding to the rect of the target.
 * @name Moveable.Group#hideChildMoveableDefaultLines
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   hideChildMoveableDefaultLines: false,
 * });
 *
 * moveable.hideChildMoveableDefaultLines = true;
 */
export default MoveableGroup;
