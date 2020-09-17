import Config from "./Config";
import { BaseAnnotator } from "./annotators/BaseAnnotator";
export declare const enum ExportType {
    XML = 0,
    JSON = 1,
    IMAGE = 2,
    SVG = 3
}
export declare class AnnotatorContainer {
    private imageElement;
    private targetElement;
    private rectSVGElement;
    private imagePattern;
    private container;
    private svgContainer;
    private toolbar;
    private propertiesToolbar;
    private completeCallback;
    private config;
    private width;
    private height;
    private drawStyle;
    private fillStyle;
    private selectedItems;
    private annotators;
    private isDragging;
    private startX;
    private startY;
    /**
     * Defs node.
     */
    private defs;
    private pushedAnnotator;
    private selectRect;
    private selectPos;
    private isImageElement;
    private imgLoaded;
    private exportType;
    constructor(imageElement: HTMLImageElement | string, config?: Config);
    private imageLoaded;
    show(completeCallback: (result: string) => void, exportType?: ExportType): void;
    private _showAnnotator;
    private init;
    private docPress;
    private onResize;
    private initGradients;
    private addListeners;
    startDrag(x: number, y: number): void;
    private onMouseMove;
    private onMouseDown;
    private onMouseUp;
    private doLayout;
    private initToolbar;
    private toolbarItemClickHandler;
    private disableListeners;
    private _addElement;
    addElement(newAnnotator: BaseAnnotator): void;
    private itemSelected;
    selectAll(): void;
    deselectAll(): void;
    private deleteSelection;
    clear(): void;
    close(): void;
    save(callback: (data: string) => void, exportType?: ExportType): void;
    loadXML(xml: string): void;
    private doLoadJSON;
    loadJSON(json: string): void;
    /**
     * Export data in XML format.
     */
    saveAsXML(): string;
    /**
     * Export data in JSON format.
     */
    saveAsJSON(): string;
    private saveAsPNG;
    private saveAsSVG;
    getSVGContainer(): SVGElement;
    getSelectedItems(): BaseAnnotator[];
}
