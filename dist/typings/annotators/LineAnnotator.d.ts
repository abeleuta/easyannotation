import { BaseAnnotator } from "./BaseAnnotator";
import InternalConfig from "../utils/InternalConfig";
import { AnnotatorContainer } from "../AnnotatorContainer";
import { StrokeType } from "../model/Styles";
import DrawStyle from "../model/Styles";
export declare class LineAnnotator extends BaseAnnotator {
    static readonly xtype: string;
    private backLineSVG;
    private resizeElement1;
    private resizeElement2;
    /**
     * Current dragging resize element.
     */
    private currentResizeElement;
    protected x1: number;
    protected y1: number;
    protected x2: number;
    protected y2: number;
    private lineStartX;
    private lineStartY;
    private screenX;
    private screenY;
    protected arrowEndHead: SVGElement;
    protected arrowStartHead: SVGElement;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    protected createLine(config: InternalConfig): void;
    private addResizeEvents;
    protected onResizeTouchStart: (evt: TouchEvent) => void;
    protected onResizeMouseDown: (evt: MouseEvent) => void;
    clean(): void;
    private onResizeDown;
    private onResizeMouseUp;
    moveBy(dx: number, dy: number, evt: MouseEvent): void;
    protected onMouseUp: (evt: MouseEvent) => void;
    processMouseUp: () => void;
    private arrangeResizeElements;
    private arrangeElement;
    setDrawStyle(drawStyle: DrawStyle): void;
    setDrawColor(color: string): void;
    setSelected(selected: boolean): void;
    containsPoint(px: number, py: number): boolean;
    intersects(x: number, y: number, w: number, h: number): boolean;
    static intersectsRect(x1: number, y1: number, x2: number, y2: number, x: number, y: number, w: number, h: number): boolean;
    private static linesIntersect;
    private static area2;
    private static between;
    setStrokeType(strokeType: StrokeType): void;
    setStrokeWidth(width: number): void;
    toXML(): Element;
    fromXML(element: Element): void;
    private setCoordinates;
    toJSON(): Object;
    fromJSON(obj: any): void;
}
