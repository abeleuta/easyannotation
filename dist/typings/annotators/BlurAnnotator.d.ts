import { AnnotatorContainer } from "../AnnotatorContainer";
import InternalConfig from "../utils/InternalConfig";
import { RectAnnotator } from "./RectAnnotator";
import DrawStyle from "../model/Styles";
import FillStyle from "../model/Styles";
export declare class BlurAnnotator extends RectAnnotator {
    static readonly xtype: string;
    private static BLURING_ID;
    private bluringFilter;
    private imagePattern;
    private blur;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    moveBy(dx: number, dy: number, evt: MouseEvent): void;
    setDrawStyle(drawStyle: DrawStyle): void;
    setFillStyle(fillStyle: FillStyle): void;
    setBlur(blur: number): void;
    getBlur(): string;
    clean(): void;
    isOnTop(): boolean;
    toXML(): Element;
    fromXML(element: Element): void;
    toJSON(): Object;
    fromJSON(obj: any): void;
}
