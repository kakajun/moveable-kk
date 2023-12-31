import { Able, MoveableManagerInterface } from "../types";
import { IObject } from "@daybrush/utils";
import Gesto from "gesto";
export declare function triggerAble(moveable: MoveableManagerInterface, moveableAbles: Able[], eventOperations: string[], eventAffix: string, eventType: any, e: any, requestInstant?: boolean): boolean;
export declare function checkMoveableTarget(moveable: MoveableManagerInterface): (e: {
    inputEvent: Event;
}) => any;
export declare function getTargetAbleGesto(moveable: MoveableManagerInterface, moveableTarget: HTMLElement | SVGElement, eventAffix: string): Gesto;
export declare function getAbleGesto(moveable: MoveableManagerInterface, target: HTMLElement | SVGElement | Array<HTMLElement | SVGElement>, ableType: string, eventAffix: string, conditionFunctions?: IObject<any>): Gesto;
