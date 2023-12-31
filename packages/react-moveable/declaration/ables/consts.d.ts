export declare const MOVEABLE_ABLES: readonly [{
    readonly isPinch: true;
    readonly name: "beforeRenderable";
    readonly props: readonly [];
    readonly events: readonly ["beforeRenderStart", "beforeRender", "beforeRenderEnd", "beforeRenderGroupStart", "beforeRenderGroup", "beforeRenderGroupEnd"];
    readonly dragRelation: "weak";
    readonly setTransform: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly resetStyle: (e: any) => void;
    readonly fillDragStartParams: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => import("../types").OnBeforeRenderStart;
    readonly fillDragParams: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => import("../types").OnBeforeRender;
    readonly dragStart: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly drag: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragEnd: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragGroupStart: (moveable: import("../types").MoveableGroupInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragGroup: (moveable: import("../types").MoveableGroupInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragGroupEnd: (moveable: import("../types").MoveableGroupInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragControlStart: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragControl: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragControlEnd: (moveable: import("../types").MoveableManagerInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragGroupControlStart: (moveable: import("../types").MoveableGroupInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragGroupControl: (moveable: import("../types").MoveableGroupInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
    readonly dragGroupControlEnd: (moveable: import("../types").MoveableGroupInterface<import("../types").BeforeRenderableProps, {}>, e: any) => void;
}, {
    name: string;
    props: readonly ["target", "dragTargetSelf", "dragTarget", "dragContainer", "container", "warpSelf", "rootContainer", "useResizeObserver", "useMutationObserver", "zoom", "dragFocusedInput", "transformOrigin", "ables", "className", "pinchThreshold", "pinchOutside", "triggerAblesSimultaneously", "checkInput", "cspNonce", "translateZ", "hideDefaultLines", "props", "flushSync", "stopPropagation", "preventClickEventOnDrag", "preventClickDefault", "viewContainer", "persistData", "useAccuratePosition", "firstRenderState", "linePadding", "controlPadding", "preventDefault", "requestStyles"];
    events: readonly ["changeTargets"];
}, {
    name: string;
    dragRelation: string;
    props: readonly ["snappable", "snapContainer", "snapDirections", "elementSnapDirections", "snapGap", "snapGridWidth", "snapGridHeight", "isDisplaySnapDigit", "isDisplayInnerSnapDigit", "isDisplayGridGuidelines", "snapDigit", "snapThreshold", "snapRenderThreshold", "snapGridAll", "snapRotationThreshold", "snapRotationDegrees", "horizontalGuidelines", "verticalGuidelines", "elementGuidelines", "bounds", "innerBounds", "snapDistFormat", "maxSnapElementGuidelineDistance", "maxSnapElementGapDistance"];
    events: readonly ["snap", "bound"];
    css: string[];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>, React: import("../types").Renderer): any[];
    dragStart(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>, e: any): void;
    drag(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    pinchStart(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragControlCondition(moveable: import("../types").MoveableManagerInterface<{}, {}>, e: any): boolean | undefined;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragGroupStart(moveable: any, e: any): void;
    dragGroup(moveable: import("../types").MoveableGroupInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragGroupEnd(moveable: import("../types").MoveableGroupInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragGroupControl(moveable: import("../types").MoveableManagerInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    dragGroupControlEnd(moveable: import("../types").MoveableGroupInterface<import("../types").SnappableProps, import("../types").SnappableState>): void;
    unset(moveable: any): void;
}, {
    readonly events: readonly ["pinchStart", "pinch", "pinchEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd"];
    readonly props: readonly ["pinchable"];
    readonly name: "pinchable";
} & {
    props: readonly ["pinchable"];
    events: readonly ["pinchStart", "pinch", "pinchEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd"];
    dragStart(): boolean;
    pinchStart(moveable: import("../types").MoveableManagerInterface<import("../types").PinchableProps, import("../types").SnappableState>, e: any): any;
    pinch(moveable: import("../types").MoveableManagerInterface<import("../types").PinchableProps, {}>, e: any): any;
    pinchEnd(moveable: import("../types").MoveableManagerInterface<import("../types").PinchableProps, {}>, e: any): any;
    pinchGroupStart(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): any;
    pinchGroup(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): any;
    pinchGroupEnd(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): any;
}, {
    name: string;
    props: readonly ["draggable", "throttleDrag", "throttleDragRotate", "hideThrottleDragRotateLine", "startDragRotate", "edgeDraggable"];
    events: readonly ["dragStart", "drag", "dragEnd", "dragGroupStart", "dragGroup", "dragGroupEnd"];
    requestStyle(): string[];
    requestChildStyle(): string[];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, import("../types").DraggableState>, React: import("../types").Renderer): any[];
    dragStart(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, any>, e: any): false | import("../types").OnDragStart;
    drag(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, any>, e: any): import("../types").OnDrag | undefined;
    dragAfter(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, import("../types").DraggableState>, e: any): false | import("../types").OnDrag | undefined;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, import("../types").DraggableState>, e: any): import("../types").OnDragEnd | undefined;
    dragGroupStart(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): false | import("../types").OnDragStart;
    dragGroup(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): import("../types").OnDragGroup | undefined;
    dragGroupEnd(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): any;
    request(moveable: import("../types").MoveableManagerInterface<any, any>): {
        isControl: boolean;
        requestStart(e: Record<string, any>): {
            datas: {};
            useSnap: boolean;
        };
        request(e: Record<string, any>): {
            datas: {};
            distX: number;
            distY: number;
            useSnap: boolean;
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
            useSnap: boolean;
        };
    };
    unset(moveable: import("../types").MoveableManagerInterface<any, Record<string, any>>): void;
}, {
    readonly events: readonly [];
    readonly props: readonly [];
    readonly name: "edgeDraggable";
} & {
    css: string[];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, {}>, React: import("../types").Renderer): any[];
    dragCondition(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, {}>, e: any): boolean;
    dragStart(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, {}>, e: any): false | import("../types").OnDragStart;
    drag(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, {}>, e: any): import("../types").OnDrag | undefined;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").DraggableProps, any>, e: any): import("../types").OnDragEnd | undefined;
    dragGroupCondition(moveable: import("../types").MoveableGroupInterface<import("../types").DraggableProps, {}>, e: any): boolean;
    dragGroupStart(moveable: import("../types").MoveableGroupInterface<import("../types").DraggableProps, {}>, e: any): false | import("../types").OnDragStart;
    dragGroup(moveable: import("../types").MoveableGroupInterface<import("../types").DraggableProps, {}>, e: any): import("../types").OnDragGroup | undefined;
    dragGroupEnd(moveable: import("../types").MoveableGroupInterface<import("../types").DraggableProps, any>, e: any): any;
    unset(moveable: any): void;
}, {
    name: string;
    ableGroup: string;
    canPinch: boolean;
    props: readonly ["resizable", "throttleResize", "renderDirections", "displayAroundControls", "keepRatio", "resizeFormat", "keepRatioFinally", "edge", "checkResizableError"];
    events: readonly ["resizeStart", "beforeResize", "resize", "resizeEnd", "resizeGroupStart", "beforeResizeGroup", "resizeGroup", "resizeGroupEnd"];
    render: (moveable: import("../types").MoveableManagerInterface<Partial<import("../types").RenderDirections>, {}>, React: import("../types").Renderer) => any[];
    dragControlCondition: (moveable: any, e: any) => any;
    viewClassName: (moveable: import("../types").MoveableManagerInterface<{}, {}>) => string;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").ResizableProps & import("../types").DraggableProps, import("../types").SnappableState>, e: any): false | import("../types").OnResizeStart;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").ResizableProps & import("../types").DraggableProps & import("../types").SnappableProps, {}>, e: any): import("../types").OnResize | undefined;
    dragControlAfter(moveable: import("../types").MoveableManagerInterface<import("../types").ResizableProps & import("../types").DraggableProps, {}>, e: any): import("../types").OnResize | undefined;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ResizableProps & import("../types").DraggableProps, {}>, e: any): import("../types").OnResizeEnd | undefined;
    dragGroupControlCondition: (moveable: any, e: any) => any;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): false | import("../types").OnResizeStart;
    dragGroupControl(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): import("../types").OnResizeGroup | undefined;
    dragGroupControlEnd(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): any;
    request(moveable: import("../types").MoveableManagerInterface<any, {}>): {
        isControl: boolean;
        requestStart(e: import("../types").ResizableRequestParam): {
            datas: Record<string, any>;
            parentDirection: number[];
            parentIsWidth: boolean;
            useSnap: boolean;
        };
        request(e: import("../types").ResizableRequestParam): {
            datas: Record<string, any>;
            parentDist: number[];
            parentKeepRatio: boolean | undefined;
            useSnap: boolean;
        };
        requestEnd(): {
            datas: Record<string, any>;
            isDrag: boolean;
            useSnap: boolean;
        };
    };
    unset(moveable: import("../types").MoveableManagerInterface<any, {}>): void;
}, {
    name: string;
    ableGroup: string;
    canPinch: boolean;
    props: readonly ["scalable", "throttleScale", "renderDirections", "keepRatio", "edge", "displayAroundControls"];
    events: readonly ["scaleStart", "beforeScale", "scale", "scaleEnd", "scaleGroupStart", "beforeScaleGroup", "scaleGroup", "scaleGroupEnd"];
    render: (moveable: import("../types").MoveableManagerInterface<Partial<import("../types").RenderDirections>, {}>, React: import("../types").Renderer) => any[];
    dragControlCondition: (moveable: any, e: any) => any;
    viewClassName: (moveable: import("../types").MoveableManagerInterface<{}, {}>) => string;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").ScalableProps & import("../types").DraggableProps, import("../types").SnappableState>, e: any): false | import("../types").OnScaleStart;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").ScalableProps & import("../types").DraggableProps & import("../types").GroupableProps, import("../types").SnappableState>, e: any): false | import("../types").OnScale;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ScalableProps, {}>, e: any): false | import("../types").OnScaleEnd;
    dragGroupControlCondition: (moveable: any, e: any) => any;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): false | import("../types").OnScaleGroupStart;
    dragGroupControl(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): import("../types").OnScaleGroup | undefined;
    dragGroupControlEnd(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): any;
    request(): {
        isControl: boolean;
        requestStart(e: import("@daybrush/utils").IObject<any>): {
            datas: {};
            parentDirection: any;
            useSnap: boolean;
        };
        request(e: import("@daybrush/utils").IObject<any>): {
            datas: {};
            parentDist: number[];
            parentKeepRatio: any;
            useSnap: boolean;
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
            useSnap: boolean;
        };
    };
}, {
    name: string;
    ableGroup: string;
    props: readonly ["warpable", "renderDirections", "edge", "displayAroundControls"];
    events: readonly ["warpStart", "warp", "warpEnd"];
    viewClassName: (moveable: import("../types").MoveableManagerInterface<{}, {}>) => string;
    render(moveable: import("../types").MoveableManagerInterface<import("../types").ResizableProps & import("../types").ScalableProps & import("../types").WarpableProps, {}>, React: import("../types").Renderer): any[];
    dragControlCondition(moveable: any, e: any): boolean;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").WarpableProps, import("../types").SnappableState>, e: any): any;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").WarpableProps & import("../types").SnappableProps, import("../types").SnappableState>, e: any): boolean;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").WarpableProps, {}>, e: any): any;
}, {
    name: string;
    canPinch: boolean;
    props: readonly ["rotatable", "rotationPosition", "throttleRotate", "renderDirections", "rotationTarget", "rotateAroundControls", "edge", "resolveAblesWithRotatable", "displayAroundControls"];
    events: readonly ["rotateStart", "beforeRotate", "rotate", "rotateEnd", "rotateGroupStart", "beforeRotateGroup", "rotateGroup", "rotateGroupEnd"];
    css: string[];
    viewClassName(moveable: import("../types").MoveableManagerInterface<import("../types").RotatableProps, {}>): string;
    render(moveable: import("../types").MoveableManagerInterface<import("../types").RotatableProps, {}>, React: import("../types").Renderer): any;
    dragControlCondition: (moveable: any, e: any) => boolean;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").RotatableProps & import("../types").SnappableProps & import("../types").DraggableProps, import("../types").SnappableState>, e: any): false | import("../types").OnRotateStart;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").RotatableProps & import("../types").DraggableProps, {}>, e: any): import("../types").OnRotate | undefined;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").RotatableProps, {}>, e: any): import("../types").OnRotateEnd | undefined;
    dragGroupControlCondition: (moveable: any, e: any) => boolean;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): false | import("../types").OnRotateStart;
    dragGroupControl(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): import("../types").OnRotateGroup | undefined;
    dragGroupControlEnd(moveable: import("../types").MoveableGroupInterface<any, any>, e: any): any;
    request(moveable: import("../types").MoveableManagerInterface<import("../types").RotatableProps, {}>): {
        isControl: boolean;
        requestStart(): {
            datas: {};
        };
        request(e: import("@daybrush/utils").IObject<any>): {
            datas: {};
            parentDist: number;
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
        };
    };
}, {
    name: string;
    canPinch: boolean;
    props: readonly ["scrollable", "scrollContainer", "scrollThreshold", "scrollThrottleTime", "getScrollPosition", "scrollOptions"];
    events: readonly ["scroll", "scrollGroup"];
    dragRelation: string;
    dragStart(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, Record<string, any>>, e: any): void;
    checkScroll(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, {}>, e: any): true | undefined;
    drag(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, {}>, e: any): true | undefined;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, {}>, e: any): void;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, {}>, e: any): void;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, {}>, e: any): true | undefined;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, {}>, e: any): void;
    dragGroupStart(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): void;
    dragGroup(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): true | undefined;
    dragGroupEnd(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): void;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): void;
    dragGroupControl(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): true | undefined;
    dragGroupControEnd(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): void;
    unset(moveable: import("../types").MoveableManagerInterface<import("../types").ScrollableProps, Record<string, any>>): void;
}, {
    readonly events: readonly [];
    readonly props: readonly ["padding"];
    readonly name: "padding";
} & {
    props: readonly ["padding"];
    render(moveable: import("../types").MoveableManagerInterface<{}, {}>, React: import("../types").Renderer): any[];
}, {
    readonly events: readonly [];
    readonly props: readonly ["origin", "svgOrigin"];
    readonly name: "origin";
} & {
    props: readonly ["origin", "svgOrigin"];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").OriginOptions, {}>, React: import("../types").Renderer): any[];
}, {
    name: string;
    props: readonly ["originDraggable", "originRelative"];
    events: readonly ["dragOriginStart", "dragOrigin", "dragOriginEnd"];
    css: string[];
    dragControlCondition(_: any, e: any): boolean;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").OriginDraggableProps & import("../types").DraggableProps, {}>, e: any): false | import("../types").OnDragOriginStart;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").OriginDraggableProps & import("../types").DraggableProps, {}>, e: any): false | import("../types").OnDragOrigin;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").OriginDraggableProps, {}>, e: any): boolean;
    dragGroupControlCondition(moveable: any, e: any): boolean;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<import("../types").OriginDraggableProps, {}>, e: any): boolean;
    dragGroupControl(moveable: import("../types").MoveableGroupInterface<import("../types").OriginDraggableProps, {}>, e: any): boolean;
    request(moveable: import("../types").MoveableManagerInterface<any, any>): {
        isControl: boolean;
        requestStart(): {
            datas: {};
        };
        request(e: import("@daybrush/utils").IObject<any>): {
            datas: {};
            distX: number;
            distY: number;
            distOrigin: number[];
        };
        requestEnd(): {
            datas: {};
            isDrag: boolean;
        };
    };
}, {
    name: string;
    props: readonly ["clippable", "defaultClipPath", "customClipPath", "keepRatio", "clipRelative", "clipArea", "dragWithClip", "clipTargetBounds", "clipVerticalGuidelines", "clipHorizontalGuidelines", "clipSnapThreshold"];
    events: readonly ["clipStart", "clip", "clipEnd"];
    css: string[];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>, React: import("../types").Renderer): any[];
    dragControlCondition(moveable: any, e: any): any;
    dragStart(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>, e: any): boolean;
    drag(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>, e: any): boolean;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>, e: any): any;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>, e: any): boolean;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps & import("../types").DraggableProps, import("../types").ClippableState>, e: any): boolean;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>, e: any): any;
    unset(moveable: import("../types").MoveableManagerInterface<import("../types").ClippableProps, import("../types").ClippableState>): void;
}, {
    name: string;
    props: readonly ["roundable", "roundRelative", "minRoundControls", "maxRoundControls", "roundClickable", "roundPadding", "isDisplayShadowRoundControls"];
    events: readonly ["roundStart", "round", "roundEnd", "roundGroupStart", "roundGroup", "roundGroupEnd"];
    css: string[];
    className(moveable: import("../types").MoveableManagerInterface<import("../types").RoundableProps, import("../types").RoundableState>): string;
    requestStyle(): (keyof CSSStyleDeclaration)[];
    requestChildStyle(): (keyof CSSStyleDeclaration)[];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").RoundableProps, import("../types").RoundableState>, React: import("../types").Renderer): any;
    dragControlCondition(moveable: any, e: any): boolean;
    dragGroupControlCondition(moveable: any, e: any): boolean;
    dragControlStart(moveable: import("../types").MoveableManagerInterface<import("../types").RoundableProps, import("../types").RoundableState>, e: any): false | import("../types").OnRoundStart;
    dragControl(moveable: import("../types").MoveableManagerInterface<import("../types").RoundableProps, import("../types").RoundableState>, e: any): false | import("../types").OnRound;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").RoundableProps, import("../types").RoundableState>, e: any): false | import("../types").OnRoundEnd;
    dragGroupControlStart(moveable: import("../types").MoveableGroupInterface<import("../types").RoundableProps, import("../types").RoundableState>, e: any): false | import("../types").OnRoundStart;
    dragGroupControl(moveable: import("../types").MoveableGroupInterface<import("../types").RoundableProps, import("../types").RoundableState>, e: any): false | import("../types").OnRoundGroup;
    dragGroupControlEnd(moveable: import("../types").MoveableGroupInterface<import("../types").RoundableProps, import("../types").RoundableState>, e: any): false | import("../types").OnRoundGroupEnd;
    unset(moveable: import("../types").MoveableManagerInterface<import("../types").RoundableProps, import("../types").RoundableState>): void;
}, {
    name: string;
    props: readonly ["defaultGroupRotate", "useDefaultGroupRotate", "defaultGroupOrigin", "groupable", "groupableProps", "targetGroups", "hideChildMoveableDefaultLines"];
    events: readonly [];
    render(moveable: import("../types").MoveableGroupInterface<import("../types").GroupableProps, {}>, React: import("../types").Renderer): any[];
}, {
    readonly name: "individualGroupable";
    readonly props: readonly ["individualGroupable", "individualGroupableProps"];
    readonly events: readonly [];
}, {
    readonly events: readonly ["click", "clickGroup"];
    readonly props: readonly ["clickable"];
    readonly name: "clickable";
} & {
    props: readonly ["clickable"];
    events: readonly ["click", "clickGroup"];
    always: true;
    dragRelation: "weak";
    dragStart(): void;
    dragControlStart(): void;
    dragGroupStart(moveable: import("../types").MoveableManagerInterface<import("../types").ClickableProps, {}>, e: any): void;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ClickableProps, {}>, e: any): void;
    dragGroupEnd(moveable: import("../types").MoveableGroupInterface<import("../types").ClickableProps, {}>, e: any): void;
    dragControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ClickableProps, {}>, e: any): void;
    dragGroupControlEnd(moveable: import("../types").MoveableManagerInterface<import("../types").ClickableProps, {}>, e: any): void;
}, {
    name: string;
    props: readonly ["dragArea", "passDragArea"];
    events: readonly ["click", "clickGroup"];
    render(moveable: import("../types").MoveableManagerInterface<import("../types").GroupableProps, {}>, React: import("../types").Renderer): any[];
    dragStart(moveable: import("../types").MoveableManagerInterface<{}, {}>, { datas, clientX, clientY, inputEvent }: any): false | undefined;
    drag(moveable: import("../types").MoveableManagerInterface<{}, {}>, { datas, inputEvent }: any): false | undefined;
    dragEnd(moveable: import("../types").MoveableManagerInterface<import("../types").DragAreaProps, {}>, e: any): false | undefined;
    dragGroupStart(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): false | undefined;
    dragGroup(moveable: import("../types").MoveableGroupInterface<{}, {}>, e: any): false | undefined;
    dragGroupEnd(moveable: import("../types").MoveableGroupInterface<import("../types").DragAreaProps, {}>, e: any): false | undefined;
    unset(moveable: import("../types").MoveableManagerInterface<import("../types").DragAreaProps, {}>): void;
    enableNativeEvent(moveable: import("../types").MoveableManagerInterface<import("../types").DragAreaProps, {}>): void;
}, {
    readonly name: "renderable";
    readonly props: readonly [];
    readonly events: readonly ["renderStart", "render", "renderEnd", "renderGroupStart", "renderGroup", "renderGroupEnd"];
    readonly dragRelation: "weak";
    readonly dragStart: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly drag: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragAfter: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragEnd: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragGroupStart: (moveable: import("../types").MoveableGroupInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragGroup: (moveable: import("../types").MoveableGroupInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragGroupEnd: (moveable: import("../types").MoveableGroupInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragControlStart: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragControl: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragControlAfter: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragControlEnd: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragGroupControlStart: (moveable: import("../types").MoveableGroupInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragGroupControl: (moveable: import("../types").MoveableGroupInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly dragGroupControlEnd: (moveable: import("../types").MoveableGroupInterface<import("../types").RenderableProps, {}>, e: any) => void;
    readonly fillDragParams: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => import("../types").OnRender;
    readonly fillDragEndParams: (moveable: import("../types").MoveableManagerInterface<import("../types").RenderableProps, {}>, e: any) => import("../types").OnRenderEnd;
}];
export declare const MOVEABLE_EVENTS: ("dragStart" | "render" | "drag" | "dragEnd" | "pinchStart" | "pinch" | "pinchEnd" | "dragGroupStart" | "dragGroup" | "dragGroupEnd" | "pinchGroupStart" | "pinchGroup" | "pinchGroupEnd" | "scale" | "snap" | "round" | "scroll" | "bound" | "resizeStart" | "beforeResize" | "resize" | "resizeEnd" | "resizeGroupStart" | "beforeResizeGroup" | "resizeGroup" | "resizeGroupEnd" | "rotateStart" | "beforeRotate" | "rotate" | "rotateEnd" | "rotateGroupStart" | "beforeRotateGroup" | "rotateGroup" | "rotateGroupEnd" | "scaleStart" | "beforeScale" | "scaleEnd" | "scaleGroupStart" | "beforeScaleGroup" | "scaleGroup" | "scaleGroupEnd" | "warpStart" | "warp" | "warpEnd" | "click" | "clickGroup" | "scrollGroup" | "changeTargets" | "clip" | "clipStart" | "clipEnd" | "dragOriginStart" | "dragOrigin" | "dragOriginEnd" | "roundStart" | "roundEnd" | "roundGroupStart" | "roundGroup" | "roundGroupEnd" | "beforeRenderStart" | "beforeRender" | "beforeRenderEnd" | "beforeRenderGroupStart" | "beforeRenderGroup" | "beforeRenderGroupEnd" | "renderStart" | "renderEnd" | "renderGroupStart" | "renderGroup" | "renderGroupEnd")[];
export declare const MOVEABLE_PROPS: ("props" | "className" | "pinchable" | "rotatable" | "resizable" | "scalable" | "ables" | "target" | "dragTarget" | "dragTargetSelf" | "dragContainer" | "container" | "warpSelf" | "rootContainer" | "viewContainer" | "useResizeObserver" | "useMutationObserver" | "zoom" | "transformOrigin" | "pinchThreshold" | "pinchOutside" | "triggerAblesSimultaneously" | "checkInput" | "cspNonce" | "translateZ" | "hideDefaultLines" | "stopPropagation" | "preventDefault" | "preventClickEventOnDrag" | "dragFocusedInput" | "preventClickDefault" | "persistData" | "useAccuratePosition" | "linePadding" | "controlPadding" | "firstRenderState" | "requestStyles" | "flushSync" | "dragArea" | "passDragArea" | "origin" | "svgOrigin" | "padding" | "defaultGroupRotate" | "useDefaultGroupRotate" | "defaultGroupOrigin" | "targetGroups" | "groupable" | "hideChildMoveableDefaultLines" | "groupableProps" | "draggable" | "throttleDrag" | "throttleDragRotate" | "hideThrottleDragRotateLine" | "startDragRotate" | "edgeDraggable" | "originDraggable" | "originRelative" | "rotationPosition" | "rotateAroundControls" | "resolveAblesWithRotatable" | "throttleRotate" | "rotationTarget" | "renderDirections" | "edge" | "displayAroundControls" | "throttleResize" | "keepRatio" | "keepRatioFinally" | "resizeFormat" | "checkResizableError" | "throttleScale" | "warpable" | "individualGroupable" | "individualGroupableProps" | "snappable" | "snapContainer" | "snapDirections" | "elementSnapDirections" | "snapGap" | "snapThreshold" | "snapRenderThreshold" | "snapDigit" | "isDisplayGridGuidelines" | "snapRotationThreshold" | "snapRotationDegrees" | "snapGridWidth" | "snapGridHeight" | "snapGridAll" | "isDisplaySnapDigit" | "isDisplayInnerSnapDigit" | "horizontalGuidelines" | "verticalGuidelines" | "elementGuidelines" | "maxSnapElementGuidelineDistance" | "maxSnapElementGapDistance" | "bounds" | "innerBounds" | "snapDistFormat" | "scrollable" | "scrollContainer" | "scrollThreshold" | "scrollThrottleTime" | "getScrollPosition" | "scrollOptions" | "clippable" | "customClipPath" | "defaultClipPath" | "clipRelative" | "dragWithClip" | "clipArea" | "clipTargetBounds" | "clipVerticalGuidelines" | "clipHorizontalGuidelines" | "clipSnapThreshold" | "roundable" | "roundRelative" | "minRoundControls" | "maxRoundControls" | "roundClickable" | "isDisplayShadowRoundControls" | "roundPadding" | "clickable")[];
export declare const MOVEABLE_REACT_EVENTS: ("onResizeStart" | "onBeforeResize" | "onResize" | "onResizeEnd" | "onResizeGroupStart" | "onBeforeResizeGroup" | "onResizeGroup" | "onResizeGroupEnd" | "onScaleStart" | "onBeforeScale" | "onScale" | "onScaleEnd" | "onScaleGroupStart" | "onBeforeScaleGroup" | "onScaleGroup" | "onScaleGroupEnd" | "onRotateStart" | "onBeforeRotate" | "onRotate" | "onRotateEnd" | "onRotateGroupStart" | "onBeforeRotateGroup" | "onRotateGroup" | "onRotateGroupEnd" | "onPinchStart" | "onPinch" | "onPinchEnd" | "onPinchGroupStart" | "onPinchGroup" | "onPinchGroupEnd" | "onDragStart" | "onDrag" | "onDragEnd" | "onDragGroupStart" | "onDragGroup" | "onDragGroupEnd" | "onDragOriginStart" | "onDragOrigin" | "onDragOriginEnd" | "onWarpStart" | "onWarp" | "onWarpEnd" | "onSnap" | "onBound" | "onScroll" | "onScrollGroup" | "onClipStart" | "onClip" | "onClipEnd" | "onRoundStart" | "onRound" | "onRoundEnd" | "onRoundGroupStart" | "onRoundGroup" | "onRoundGroupEnd" | "onBeforeRenderStart" | "onBeforeRender" | "onBeforeRenderEnd" | "onBeforeRenderGroupStart" | "onBeforeRenderGroup" | "onBeforeRenderGroupEnd" | "onClick" | "onClickGroup" | "onRenderStart" | "onRender" | "onRenderEnd" | "onRenderGroupStart" | "onRenderGroup" | "onRenderGroupEnd" | "onChangeTargets")[];
