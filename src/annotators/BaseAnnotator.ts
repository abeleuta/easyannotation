import {AnnotationUtils} from "../utils/AnnotationUtils"
import Config from "../Config"
import {AnnotatorContainer} from "../AnnotatorContainer"
import DrawStyle from "../model/Styles"
import FillStyle from "../model/Styles"
import {EffectType} from "../model/Styles"
import {StrokeType} from "../model/Styles"
import {Utils} from "../utils/Utils"
import InternalConfig from "../utils/InternalConfig"

export class BaseAnnotator {

    protected properties: Array<string> = [];

    protected readonly RESIZE_ELEM_SIZE = 8;

    protected svgGroupElement: SVGGElement;

    protected baseSVGElement: SVGGElement;

    protected fillPattern: SVGPatternElement = null;

    protected isDragging: boolean;

    protected x: number = 0;

    protected y: number = 0;

    protected width: number;

    protected height: number;

    protected startX: number;

    protected startY: number;

    /**
     * Original matrix of the element, so we can translate from original point.
     */
    private elementMatrix: DOMMatrix;

    protected selected: boolean;

    public onSelectHandler: (element: BaseAnnotator) => void;

    protected parent: AnnotatorContainer;

    protected config: InternalConfig;

    protected filters: any = {};

    protected drawStyle: DrawStyle = {
        startArrow: 0,
        endArrow: 0,
        width: 2,
        type: StrokeType.SOLID,
        color: '#000'
    } as DrawStyle;

    protected fillStyle: FillStyle = {
        fillType: 0,
        color: '#000'
    } as FillStyle;

    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        let me = this;

        me.config = config;
        me.parent = parent;
        me.width = 200 * config.sizePercentage;
        me.height = 80 * config.sizePercentage;
        me.init();
    }

    public getElement(): SVGGElement {
        return this.svgGroupElement;
    }

    public clean() {

    }

    protected init() {
        let svgGroupElement = document.createElementNS("http://www.w3.org/2000/svg", "g"),
            me = this;

//        add a transform to list of transforms so we can move the element
//        this is used instead of setting positions x,y as this would be different for different SVG elements
        svgGroupElement.transform.baseVal.appendItem(AnnotationUtils.createTransform(me.config));

        svgGroupElement.addEventListener("touchstart", me.onTouchStart, {passive: false});
        svgGroupElement.addEventListener("touchend", me.onTouchEnd, {passive: false});
        svgGroupElement.addEventListener("touchmove", me.onTouchMove, {passive: false});
        svgGroupElement.addEventListener("mousedown", me.onMouseDown);
        svgGroupElement.addEventListener("mouseup", me.onMouseUp);
        svgGroupElement.addEventListener("mousemove", me.onMouseMove);

        svgGroupElement.style.zIndex = '100';

        this.svgGroupElement = svgGroupElement;
        me.elementMatrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix.translate(0, 0);
    }

    protected startDrag = (x: number, y: number) => {
        let me = this;
        me.startX = x;
        me.startY = y;
        me.isDragging = true;
        me.elementMatrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix.translate(0, 0);
        me.parent.startDrag(x, y);
        if (me.onSelectHandler) {
            me.onSelectHandler(me);
        }
    }

    protected onTouchStart = (evt: TouchEvent) => {
        let touches = evt.changedTouches[0];
        evt.stopPropagation();
        this.setSelected(true);
        this.startDrag(touches.screenX, touches.screenY);
    }

    protected onMouseDown = (evt: MouseEvent) => {
        this.doMouseDown(evt);
    }

    protected doMouseDown(evt: MouseEvent) {
        evt.stopPropagation();
        this.setSelected(true);
        let pixelRatio = this.getPixelRatio();
        this.startDrag(evt.screenX/pixelRatio, evt.screenY/pixelRatio);
    }

    protected getPixelRatio() {
        return Utils.isEdge() ? window.devicePixelRatio : 1;
    }

    protected onTouchEnd = (evt: TouchEvent) => {
        this.isDragging = false;
    }

    protected onMouseUp = (evt: MouseEvent) => {
        this.isDragging = false;
    }

    processMouseUp() {
        this.isDragging = false;
    }

    protected onTouchMove = (evt: TouchEvent) => {
        let me = this;
        evt.stopImmediatePropagation();
        evt.preventDefault();
        evt.stopPropagation();
        if (me.isDragging) {
            let touches = evt.changedTouches[0];
            me.move(touches.screenX, touches.screenY, touches);
        }
    }

    protected onMouseMove = (evt: MouseEvent) => {
        let me = this;
        if (me.isDragging) {
            evt.stopPropagation();
            let pixelRatio = this.getPixelRatio();
            me.move(evt.screenX / pixelRatio, evt.screenY / pixelRatio, evt);
        }
    }

    private move(screenX: number, screenY: number, evt: MouseEvent | Touch) {
        let me = this;
        const scale = me.svgGroupElement.getScreenCTM().a;

        me.moveBy((screenX - me.startX) / scale, (screenY - me.startY) / scale, evt);
    }

    public moveBy(dx: number, dy: number, evt: MouseEvent | Touch) {
        let moveTransform = this.svgGroupElement.transform.baseVal.getItem(0);
        moveTransform.setMatrix(this.elementMatrix.translate(dx, dy));

        this.svgGroupElement.transform.baseVal.replaceItem(moveTransform, 0);
    }

    protected createResizeElement(config: Config): SVGGraphicsElement {
        let resizeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        resizeElement.transform.baseVal.appendItem(AnnotationUtils.createTransform(this.config));
        resizeElement.setAttribute('class', 'anotator-resize-element');
        if (Utils.isMobileDevice()) {
            resizeElement.setAttribute('r', '10');
            resizeElement.setAttribute('cx', '5');
            resizeElement.setAttribute('cy', '5');
        } else {
            resizeElement.setAttribute('r', '8');
            resizeElement.setAttribute('cx', '4');
            resizeElement.setAttribute('cy', '4');
        }

        resizeElement.style.display = 'none';

        return resizeElement;
    }

    public intersects(x: number, y: number, width: number, height: number): boolean {
        return false;
    }

    public containsPoint(px: number, py: number): boolean {
        return false;
    }

    public setStrokeType(strokeType: StrokeType) {

    }

    public getStrokeType(): StrokeType {
        return this.drawStyle ? this.drawStyle.type : -1;
    }

    public getStrokeWidth(): number {
        return this.drawStyle ? this.drawStyle.width : -1;
    }

    public setStrokeWidth(width: number) {

    }

    public setDrawColor(color: string) {

    }

    public setFillColor(color: string) {

    }

    public setFillType(fillType: number) {

    }

    public setSelected(selected: boolean) {
        this.selected = selected;
    }

    protected _setStrokeType(svgElement: SVGElement, strokeType: StrokeType) {
        let strokeArray = 'none';
        let strokeLineCap = 'unset';
        this.drawStyle.type = strokeType;
        let elemStyle = svgElement.style;
        switch (strokeType) {
            case StrokeType.DOTTED:
                let strokeWidth = parseInt(elemStyle.strokeWidth, 10);
                if (isNaN(strokeWidth)) {
                    return;
                }
                strokeArray = '1 ' + (strokeWidth * (strokeWidth < 7 ? 2 : 1.5)).toString();
                strokeLineCap = 'round';
//                strokeArray = '5%';
                break;
            case StrokeType.DASHED:
                strokeArray = '10%';
                break;
        }

        elemStyle.strokeDasharray = strokeArray;
        elemStyle.strokeLinecap = strokeLineCap;
    }

    protected _setStrokeWidth(svgElement: SVGElement, width: number) {
        let elemStyle = svgElement.style;
        elemStyle.strokeWidth = width.toString();
        if (this.drawStyle.type == StrokeType.DOTTED) {
            elemStyle.strokeDasharray = '1 ' + (width * (width < 7 ? 2 : 1.5)).toString()
            elemStyle.strokeLinecap = 'round';
        }
    }

    public setDrawStyle(drawStyle: DrawStyle) {
        let me = this,
            currentDrawStyle = me.drawStyle;

        currentDrawStyle.type = drawStyle.type;
        currentDrawStyle.width = drawStyle.width;
        currentDrawStyle.color = drawStyle.color;
        currentDrawStyle.startArrow = drawStyle.startArrow;
        currentDrawStyle.endArrow = drawStyle.endArrow;

        if (drawStyle.color) {
            this.setDrawColor(drawStyle.color);
        }

        if (drawStyle.width) {
            this.setStrokeWidth(drawStyle.width);
        }

        if (drawStyle.type) {
            this.setStrokeType(drawStyle.type);
        }
    }

    public getDrawStyle() {
        return this.drawStyle;
    }

    public setFillStyle(fillStyle: FillStyle) {
        let me = this,
            currentFillStyle = me.fillStyle,
            colorChanged = false,
            styleChanged = false;

        if (fillStyle.color !== undefined && currentFillStyle.color != fillStyle.color) {
            currentFillStyle.color = fillStyle.color;
            colorChanged = true;
        }
        if (fillStyle.fillType !== undefined && currentFillStyle.fillType != fillStyle.fillType) {
            currentFillStyle.fillType = fillStyle.fillType;
            styleChanged = true;
        }

        if (colorChanged) {
            me.setFillColor(fillStyle.color);
        }

        if (styleChanged) {
            me.setFillType(fillStyle.fillType);
        }

        if (fillStyle.opacity !== undefined && currentFillStyle.opacity != fillStyle.opacity) {
            currentFillStyle.opacity = fillStyle.opacity;
            me.setOpacity(currentFillStyle.opacity);
        }

        let hasBlur = false,
            hasShadow = false,
            filters = me.filters,
            defs = AnnotationUtils.getDefs(me.config);

        if (filters[EffectType.BLUR]) {
            defs.removeChild(filters[EffectType.BLUR]);
            filters[EffectType.BLUR] = null;
        }
        if (filters[EffectType.SHADOW]) {
            defs.removeChild(filters[EffectType.SHADOW]);
            filters[EffectType.SHADOW] = null;
        }

        if (fillStyle.effects && fillStyle.effects.length) {
            for (let effect of fillStyle.effects) {
                let shaddowEffect = null;
                switch (effect.effectType) {
                    case EffectType.BLUR:
                        hasBlur = true;
                        if (fillStyle.effects.length > 1) {
                            for (let effect1 of fillStyle.effects) {
                                if (effect1.effectType == EffectType.SHADOW) {
                                    hasShadow = true;
                                    shaddowEffect = effect1;
                                    break;
                                }
                            }
                        }
//                      first check if there is a filter already
                        if (filters[EffectType.BLUR]) {
                            (filters[EffectType.BLUR] as SVGFilterElement).innerHTML =
                                '<feGaussianBlur stdDeviation="' + parseInt(effect.value, 10) + '"/>';
                        } else {
                            if (hasShadow) {
                                let blurAndShadowFilter = AnnotationUtils.createShadowFilter(me.config, effect, shaddowEffect);
                                me.baseSVGElement.setAttribute('filter', 'url(#' + blurAndShadowFilter.id + ')');
                                filters[EffectType.BLUR] = blurAndShadowFilter;
                            } else {
                                let blurFilter = AnnotationUtils.createBlurFilter(me.config, effect);
                                me.baseSVGElement.setAttribute('filter', 'url(#' + blurFilter.id + ')');
                                filters[EffectType.BLUR] = blurFilter;
                            }
                        }
                        break;
                    case EffectType.SHADOW:
                        hasShadow = true;
                        if (hasBlur) {
//                            filter added in Blur
                            break;
                        }
//                      first check if there is a filter already
                        if (filters[EffectType.SHADOW]) {
                            AnnotationUtils.setShadowFilterValue((filters[EffectType.SHADOW] as SVGFilterElement), effect);
                        } else {
                            let blurFilter = AnnotationUtils.createShadowFilter(me.config, effect);
                            me.baseSVGElement.setAttribute('filter', 'url(#' + blurFilter.id + ')');
                            filters[EffectType.SHADOW] = blurFilter;
                        }
                        break;
                }
            }
        }

        if (!hasBlur && !hasShadow) {
            me.baseSVGElement.setAttribute('filter', 'none');
        }

        currentFillStyle.effects = fillStyle.effects;

    }

    public getFillStyle() {
        return this.fillStyle;
    }

    public setOpacity(opacity: number) {
        if (opacity > 100) {
            opacity = 100;
        } else if (opacity < 0) {
            opacity = 0;
        }

        if (this.baseSVGElement) {
            this.baseSVGElement.style.opacity = (opacity / 100).toString();
        }
    }

    public isOnTop(): boolean {
        return false;
    }

    public toXML(): Element {
        return null;
    }

    public fromXML(element: Element) {
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    protected loadXMLDraw(element: Element) {
        let me = this;
        me.setDrawStyle({
            width: me.getXMLNumber(element, 'dw'),
            type: me.getXMLNumber(element, 'dt'),
            color: element.getAttribute('dc') || '#000',
            startArrow: me.getXMLNumber(element, 'sa'),
            endArrow: me.getXMLNumber(element, 'ea')
        } as DrawStyle);
    }

    protected loadXMLFill(element: Element) {
        let me = this;
        this.setFillStyle({
            fillType: me.getXMLNumber(element, 'ft'),
            color: element.getAttribute('fc') || '#000',
            opacity: me.getXMLNumber(element, 'op')
        } as FillStyle);
        for (let filterID in me.filters) {
            let filterElement = document.createElement('f');
            filterElement.setAttribute('i', filterID);
            filterElement.setAttribute('v', me.filters[filterID]);
            element.appendChild(filterElement);
        }
    }

    protected getXMLNumber(elem: Element, attributeName: string): number {
        let attr = elem.getAttribute(attributeName),
            attrNumericValue = 0;
        if (attr) {
            attrNumericValue = parseInt(attr, 10);
            if (isNaN(attrNumericValue)) {
                attrNumericValue = 0;
            }
        }

        return attrNumericValue;
    }

    public toJSON(): Object {
        return null;
    }

    public fromJSON(obj: Object) {

    }

    protected addDraw(element: Element) {
        let drawStyle = this.drawStyle;
        element.setAttribute('dw', drawStyle.width.toString());
        element.setAttribute('dt', drawStyle.type.toString());
        element.setAttribute('dc', drawStyle.color);
        element.setAttribute('sa', drawStyle.startArrow.toString());
        element.setAttribute('ea', drawStyle.endArrow.toString());
    }

    protected addFill(element: Element) {
        let fillStyle = this.fillStyle;
        element.setAttribute('ft', fillStyle.fillType.toString());
        element.setAttribute('fc', fillStyle.color);
        if (fillStyle.opacity) {
            element.setAttribute('op', fillStyle.opacity.toString());
        }
    }

    protected addJSONDraw(obj: any) {
        let drawStyle = this.drawStyle;
        obj.dw = drawStyle.width;
        obj.dt = drawStyle.type;
        obj.dc = drawStyle.color;
        obj.sa = drawStyle.startArrow;
        obj.ea = drawStyle.endArrow;
    }

    protected loadJSONDraw(obj: any) {
        this.setDrawStyle({
            width: obj.dw,
            type: obj.dt,
            color: obj.dc,
            startArrow: parseInt(obj.sa, 10),
            endArrow: parseInt(obj.ea, 10),
        } as DrawStyle);
    }

    protected loadJSONFill(obj: any) {
        this.setFillStyle({
            fillType: obj.ft,
            color: obj.fc,
            opacity: obj.op
        } as FillStyle);
    }

    protected addJSONFill(obj: any) {
        let fillStyle = this.fillStyle;
        obj.ft = fillStyle.fillType;
        obj.fc = fillStyle.color;
        obj.op = fillStyle.opacity;
    }

    public getProperties() {
        return this.properties;
    }

    getType(): string {
        return '';
    }
}
