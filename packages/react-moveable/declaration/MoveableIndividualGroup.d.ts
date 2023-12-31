import * as React from "react";
import MoveableManager from "./MoveableManager";
import { GroupableProps, IndividualGroupableProps, MoveableManagerInterface, RectInfo, Requester } from "./types";
/**
 * @namespace Moveable.IndividualGroup
 * @description Create targets individually, not as a group.Create targets individually, not as a group.
 */
declare class MoveableIndividualGroup extends MoveableManager<GroupableProps & IndividualGroupableProps> {
    moveables: MoveableManager[];
    render(): React.JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    getTargets(): (HTMLElement | SVGElement)[];
    updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState?: boolean): void;
    getRect(): RectInfo;
    request(ableName: string, param?: Record<string, any>, isInstant?: boolean): Requester;
    dragStart(e: MouseEvent | TouchEvent): this;
    hitTest(): number;
    isInside(): boolean;
    isDragging(): boolean;
    getDragElement(): null;
    getMoveables(): MoveableManagerInterface[];
    updateRenderPoses(): void;
    checkUpdate(): void;
    triggerEvent(): void;
    protected updateAbles(): void;
    protected _updateEvents(): void;
    protected _updateObserver(): void;
}
/**
 * Create targets individually, not as a group.
 * @name Moveable.IndividualGroup#individualGroupable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   individualGroupable: true,
 * });
 */
export default MoveableIndividualGroup;
