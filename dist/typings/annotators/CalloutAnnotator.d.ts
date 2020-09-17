import { RectAnnotator } from "./RectAnnotator";
import { AnnotatorContainer } from "../AnnotatorContainer";
import InternalConfig from "../utils/InternalConfig";
export declare class CalloutAnnotator extends RectAnnotator {
    private static readonly DIRECTION_TOP;
    private static readonly DIRECTION_RIGHT;
    private static readonly DIRECTION_BOTTOM;
    private static readonly DIRECTION_LEFT;
    static readonly xtype: string;
    private shadowPathElement;
    private bottom;
    private right;
    private calloutHeadX;
    private calloutHeadY;
    private calloutDragX;
    private calloutDragY;
    /**
     * Containe 4 points of virtual extended points of 4 triangles.
     */
    private points;
    private direction;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    protected initElement(config: InternalConfig): void;
    private resize;
    private getNextPoint;
    protected addResizeElements(config: InternalConfig): void;
    protected onResizeTouchStart: (evt: TouchEvent) => void;
    protected onResizeMouseDown: (evt: MouseEvent) => void;
    private onResizePress;
    protected arrangeResizeElements(): void;
    moveBy(dx: number, dy: number, evt: MouseEvent): void;
    private sign;
    private pointInTriangle;
    setDrawColor(color: string): void;
    setFillColor(color: string): void;
    toJSON(): Object;
    fromJSON(obj: any): void;
    toXML(): Element;
    fromXML(element: Element): void;
}
