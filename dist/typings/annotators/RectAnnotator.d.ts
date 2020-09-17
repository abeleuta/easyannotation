import { BaseAnnotator } from "./BaseAnnotator";
import Config from "../Config";
import InternalConfig from "../utils/InternalConfig";
import { AnnotatorContainer } from "../AnnotatorContainer";
import { StrokeType } from "../model/Styles";
export declare class RectAnnotator extends BaseAnnotator {
    static readonly xtype: string;
    protected resizeElements: Array<SVGGraphicsElement>;
    /**
     * Index of dragging resize element.
     */
    protected currentResizeIndex: number;
    protected x: number;
    protected y: number;
    protected dragStartW: number;
    protected dragStartH: number;
    protected dragStartX: number;
    protected dragStartY: number;
    protected screenX: number;
    protected screenY: number;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    protected initElement(config: Config): void;
    protected addResizeEvents(element: SVGGraphicsElement): void;
    protected onResizeTouchStart: (evt: TouchEvent) => void;
    protected onResizeMouseDown: (evt: MouseEvent) => void;
    private onResizeDown;
    private onResizeMouseUp;
    moveBy(dx: number, dy: number, evt: MouseEvent): void;
    protected onMouseUp: (evt: MouseEvent) => void;
    processMouseUp: () => void;
    protected arrangeResizeElements(): void;
    protected arrangeElement(element: SVGGraphicsElement, x: number, y: number): void;
    setDrawColor(color: string): void;
    setFillColor(color: string): void;
    setFillType(fillType: number): void;
    setSelected(selected: boolean): void;
    intersects(x: number, y: number, w: number, h: number): boolean;
    static intersects(mx: number, my: number, mw: number, mh: number, x: number, y: number, w: number, h: number): boolean;
    containsPoint(x: number, y: number): boolean;
    setStrokeType(strokeType: StrokeType): void;
    setStrokeWidth(width: number): void;
    toXML(): Element;
    protected _toXML(elem: Element): void;
    fromXML(element: Element): void;
    toJSON(): Object;
    fromJSON(obj: any): void;
}
