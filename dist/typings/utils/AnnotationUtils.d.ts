import InternalConfig from "../utils/InternalConfig";
import Effect from "../model/Styles";
export declare class AnnotationUtils {
    private static annotatorIdx;
    private static patternIdx;
    private static arrowMarkerIdx;
    private static filterIdx;
    static getNextAnnotatorIdx(): number;
    private static getSVGElement;
    static createTransform(config: InternalConfig): SVGTransform;
    static getDefs(config: InternalConfig): SVGDefsElement;
    static addToDefs(config: InternalConfig, element: SVGElement): void;
    static createBlurFilter(config: InternalConfig, effect: Effect): SVGFilterElement;
    static createShadowFilter(config: InternalConfig, effect: Effect, blurEffect?: Effect): SVGFilterElement;
    static setShadowFilterValue(bluringFilter: SVGFilterElement, shadowEffect: Effect, blurEffect?: Effect): void;
    static createFillPattern(config: InternalConfig, fillType: number, currentPattern: SVGPatternElement): SVGPatternElement;
    static createArrowMarker(config: InternalConfig, arrowType: number, currentMarker?: SVGElement, startMarker?: boolean): Array<any>;
}
