declare module "*.css" {
    const content: any;
    export default content;
}

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module '@simonwep/pickr';

abstract class PickrConf {
    public abstract on (eventName: string, callback: (color: HSVaColor) => void): void;
    
    public abstract hide() : void;
    
    public abstract setColor(color: string) : void;
}

interface HSVaColor {
    toHSVA(): Array<number>,

    toHSLA(): Array<number>,

    toRGBA(): Array<number>,

    toCMYK(): Array<number>,

    toHEXA(): Array<number>,

    clone(): HSVaColor
}

//declare interface Pickr {
//    on(eventName: string, callback: (color: Object) => void): void;
//}