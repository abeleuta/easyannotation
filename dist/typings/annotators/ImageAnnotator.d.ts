import { AnnotatorContainer } from "../AnnotatorContainer";
import InternalConfig from "../utils/InternalConfig";
import { RectAnnotator } from "./RectAnnotator";
export declare class ImageAnnotator extends RectAnnotator {
    static readonly xtype: string;
    private uploadInput;
    private foreignObject;
    private imageSVGElement;
    private blur;
    private opacity;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    private attachUploadInput;
    private onFileUpload;
    private createImageElement;
    protected arrangeResizeElements(): void;
    setBlur(blur: number): void;
    getBlur(): string;
    setOpacity(opacity: number): void;
    getOpacity(): string;
    setDrawColor(color: string): void;
    setFillColor(color: string): void;
    setSelected(selected: boolean): void;
    toXML(): Element;
    fromXML(element: Element): void;
    toJSON(): Object;
    fromJSON(obj: any): void;
}
