export declare class Utils {
    private static isMobile;
    private static checkMobile;
    private static _isMobilePhone;
    private static _isEdge;
    static isMobileDevice(): boolean;
    static isPhone(): boolean;
    static isEdge(): boolean;
    static getBrowserSpec(): any;
    static fixIOSSlider(slider: HTMLInputElement): void;
    private static onSliderTouch;
    static exportToPNG(imageElement: HTMLImageElement, svgElement: SVGSVGElement, callback: (imageData: string) => void): void;
    static on<K extends keyof HTMLElementEventMap>(elements: Array<Element> | Element | HTMLDocument, events: Array<K>, func: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): void;
    static un<K extends keyof HTMLElementEventMap>(elements: Array<HTMLElement> | Element | HTMLDocument, events: Array<K>, func: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): void;
    static getEvent(evt: MouseEvent | TouchEvent): Touch | MouseEvent;
}
