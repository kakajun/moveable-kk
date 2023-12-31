import * as React from "react";
import { Able, MoveableInterface, GroupableProps, MoveableDefaultProps, IndividualGroupableProps, MoveableManagerInterface, MoveableRefTargetsResultType, BeforeRenderableProps, RenderableProps } from "./types";
import MoveableManager from "./MoveableManager";
import MoveableGroup from "./MoveableGroup";
import { IObject } from "@daybrush/utils";
import MoveableIndividualGroup from "./MoveableIndividualGroup";
declare type DefaultAbles = GroupableProps & IndividualGroupableProps & BeforeRenderableProps & RenderableProps;
export declare class InitialMoveable<T = {}> extends React.PureComponent<MoveableDefaultProps & DefaultAbles & T> {
    static defaultAbles: readonly Able<any>[];
    static customStyledMap: Record<string, any>;
    static defaultStyled: any;
    static makeStyled(): void;
    static getTotalAbles(): Able[];
    moveable: MoveableManager | MoveableGroup | MoveableIndividualGroup;
    refTargets: MoveableRefTargetsResultType;
    selectorMap: IObject<Array<HTMLElement | SVGElement>>;
    private _differ;
    private _elementTargets;
    private _tmpRefTargets;
    private _tmpSelectorMap;
    private _onChangeTargets;
    render(): React.JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    /**
     * Get targets set in moveable through target or targets of props.
     * @method Moveable#getTargets
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body, {
     *    target: [targetRef, ".target", document.querySelectorAll(".target")],
     * });
     *
     * console.log(moveable.getTargets());
     */
    getTargets(): (HTMLElement | SVGElement)[];
    /**
     * If the element list corresponding to the selector among the targets is changed, it is updated.
     * @method Moveable#updateSelectors
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body, {
     *    target: ".target",
     * });
     *
     * moveable.updateSelectors();
     */
    updateSelectors(): void;
    /**
     * User changes target and waits for target to change.
     * @method Moveable#waitToChangeTarget
     * @story combination-with-other-components--components-selecto
     * @example
     * document.querySelector(".target").addEventListener("mousedown", e => {
     *   moveable.waitToChangeTarget().then(() => {
     *      moveable.dragStart(e.currentTarget);
     *   });
     *   moveable.target = e.currentTarget;
     * });
     */
    waitToChangeTarget(): Promise<void>;
    waitToChangeTargets(): Promise<void>;
    getManager(): MoveableManagerInterface<any, any>;
    getMoveables(): MoveableManagerInterface[];
    getDragElement(): HTMLElement | SVGElement | null | undefined;
    private _updateRefs;
    private _checkChangeTargets;
}
export interface InitialMoveable<T = {}> extends React.PureComponent<MoveableDefaultProps & DefaultAbles & T>, MoveableInterface {
    setState(state: any, callback?: () => any): any;
    forceUpdate(callback?: () => any): any;
}
export {};
