import { BaseAnnotator } from "./BaseAnnotator";
import InternalConfig from "../utils/InternalConfig";
import { AnnotatorContainer } from "../AnnotatorContainer";
import { StrokeType } from "../model/Styles";
export declare class EllipseAnnotator extends BaseAnnotator {
    static readonly xtype: string;
    private resizeElements;
    /**
     * Index of dragging resize element.
     */
    private currentResizeIndex;
    private cx;
    private cy;
    private rx;
    private ry;
    private dragStartRx;
    private dragStartRy;
    private dragStartX;
    private dragStartY;
    private screenX;
    private screenY;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    private createEllipse;
    private addResizeEvents;
    protected onResizeTouchStart: (evt: TouchEvent) => void;
    protected onResizeMouseDown: (evt: MouseEvent) => void;
    private onResizeDown;
    private onResizeMouseUp;
    moveBy(dx: number, dy: number, evt: MouseEvent | Touch): void;
    protected onMouseUp: (evt: MouseEvent) => void;
    processMouseUp: () => void;
    private arrangeResizeElements;
    private arrangeElement;
    setDrawColor(color: string): void;
    setFillColor(color: string): void;
    setFillType(fillType: number): void;
    setSelected(selected: boolean): void;
    containsPoint(px: number, py: number): boolean;
    intersects(x: number, y: number, w: number, h: number): boolean;
    setStrokeType(strokeType: StrokeType): void;
    setStrokeWidth(width: number): void;
    getWidth(): number;
    getHeight(): number;
    toXML(): Element;
    fromXML(element: Element): void;
    private setCoordinates;
    toJSON(): Object;
    fromJSON(obj: any): void;
}
