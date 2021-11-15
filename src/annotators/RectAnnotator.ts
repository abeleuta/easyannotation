import {BaseAnnotator} from "./BaseAnnotator"
import Config from "../Config"
import InternalConfig from "../utils/InternalConfig"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {StrokeType} from "../model/Styles"
import {ClassManager} from "../utils/ClassManager"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {Constants} from "../utils/Constants"
import {Utils} from "../utils/Utils"
import {Point} from '../model/Point';

export class RectAnnotator extends BaseAnnotator {

    public static readonly xtype: string = "rect";

    protected resizeElements: Array<SVGGraphicsElement> = [];

    /**
     * Index of dragging resize element.
     */
    protected currentResizeIndex: number = -1;

    protected dragStartW: number;

    protected dragStartH: number;

    protected dragStartX: number;

    protected dragStartY: number;

    protected screenX: number;

    protected screenY: number;

    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        this.config = config as InternalConfig;
        this.initElement(config);
        this.properties = [Constants.DRAW_PROPERTY, Constants.FILL_PROPERTY];

        //position matrix
        this.baseSVGElement.transform.baseVal.appendItem(AnnotationUtils.createTransform(this.config));
        //rotate transform
        this.svgGroupElement.transform.baseVal.appendItem(AnnotationUtils.createTransform(this.config));
    }

    protected initElement(config: Config) {

        let rectSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
            me = this;

        rectSVG.setAttribute('x', '0');
        rectSVG.setAttribute('y', '0');
        rectSVG.setAttribute('width', me.width.toString());
        rectSVG.setAttribute('height', me.height.toString());

        me.svgGroupElement.appendChild(rectSVG);
        me.baseSVGElement = rectSVG;

        for (let i = 0; i < 5; i++) {
            let resizeEl = i == 4 ? me.createRotateElement(config) : me.createResizeElement(config);
            me.resizeElements.push(resizeEl);
            me.addResizeEvents(resizeEl);
            me.svgGroupElement.appendChild(resizeEl);
        }

        me.arrangeResizeElements();
    }

    protected addResizeEvents(element: SVGGraphicsElement) {
        if (Utils.isMobileDevice()) {
            element.addEventListener('touchstart', this.onResizeTouchStart);
            element.addEventListener('touchend', this.onResizeMouseUp);
        } else {
            element.addEventListener('mousedown', this.onResizeMouseDown);
            element.addEventListener('mouseup', this.onResizeMouseUp);
        }
    }

    protected onResizeTouchStart = (evt: TouchEvent) => {
        let touches = evt.changedTouches[0];
        this.onResizeDown(touches);
    }

    protected onResizeMouseDown = (evt: MouseEvent) => {
        this.onResizeDown(evt);
    }

    private onResizeDown = (evt: MouseEvent | Touch) => {
        let me = this,
            numResizeElements = me.resizeElements.length,
            resizeElem = evt.target,
            pixelRatio = me.getPixelRatio();

        let point = new Point(evt.screenX, evt.screenY);
        let rotatedPoint = this.getUnrotatedPoint(point);

        me.screenX = rotatedPoint.x / pixelRatio;
        me.screenY = rotatedPoint.y / pixelRatio;

        me.dragStartW = me.width;
        me.dragStartH = me.height;
        me.dragStartX = me.x;
        me.dragStartY = me.y;
        for (let i = 0; i < numResizeElements; i++) {
            if (resizeElem == this.resizeElements[i] || (resizeElem as Node).parentNode == this.resizeElements[i]) {
                this.currentResizeIndex = i;
                break;
            }
        }
    }

    private onResizeMouseUp = (evt: MouseEvent) => {
        this.currentResizeIndex = -1;
        console.log('this.currentResizeIndex=', this.currentResizeIndex);
    }

    public moveBy(dx: number, dy: number, evt: MouseEvent) {
        let me = this,
            resizeIndex = me.currentResizeIndex;
        if (resizeIndex >= 0) {
            let point = new Point(evt.screenX, evt.screenY);
            let rotatedPoint = this.getUnrotatedPoint(point);

            console.log('point=', point,'  rotated=', rotatedPoint, 'resizeIndex=',resizeIndex);

            let pixelRatio = me.getPixelRatio(),
                difX = rotatedPoint.x / pixelRatio - me.screenX,
                difY = rotatedPoint.y / pixelRatio - me.screenY;
            switch (resizeIndex) {
                case 0:
//                top left
                    me.width = me.dragStartW - difX;
                    me.height = me.dragStartH - difY;
                    me.x = me.dragStartX + difX;
                    me.y = me.dragStartY + difY;
                    break;
                case 1:
//                top right
                    me.y = me.dragStartY + difY;
                    me.width = me.dragStartW + difX;
                    me.height = me.dragStartH - difY;
                    break;
                case 2:
//                bottom right
                    me.width = me.dragStartW + difX;
                    me.height = me.dragStartH + difY;
                    break;
                case 3:
//                bottom left
                    me.x = me.dragStartX + difX;
                    me.width = me.dragStartW - difX;
                    me.height = me.dragStartH + difY;
                    break;
                case 4:
//                rotate
                    this.rotateElement(evt);
                    return;
            }
            me.baseSVGElement.setAttribute('x', me.x.toString());
            me.baseSVGElement.setAttribute('y', me.y.toString());
            me.baseSVGElement.setAttribute('width', me.width.toString());
            me.baseSVGElement.setAttribute('height', me.height.toString());
            me.arrangeResizeElements();
        } else {
            super.moveBy(dx, dy, evt);
        }
    }

    protected rotateElement(evt: MouseEvent) {
        let rect = this.svgGroupElement.getBoundingClientRect();

        let centerX = this.width / 2;
        let centerY = this.height / 2;

        let realCenterX = rect.left + rect.width / 2;

        if (Math.abs(evt.clientX - realCenterX) > 1) {
            const sign = Math.sign(evt.clientX - realCenterX);
            const realCenterY = rect.top + rect.height / 2;
            this.rotateAngle = (Math.atan((evt.clientY - realCenterY) / (evt.clientX - realCenterX)) * 180) / Math.PI
                + 90 * sign;

            const rotate = this.svgGroupElement.transform.baseVal.getItem(1);
            rotate.setRotate(this.rotateAngle, centerX, centerY);
            this.svgGroupElement.transform.baseVal.replaceItem(rotate, 1);
        }
    }

    protected onMouseUp = (evt: MouseEvent) => {
        this.currentResizeIndex = -1;
        this.isDragging = false;
    }

    processMouseUp = () => {
        this.currentResizeIndex = -1;
        super.processMouseUp();
    }

    protected arrangeResizeElements() {
        let halfResizeElemeSize = this.RESIZE_ELEM_SIZE / 2,
            me = this,
            left = me.x - halfResizeElemeSize,
            right = me.x + me.width - halfResizeElemeSize,
            top = me.y - halfResizeElemeSize,
            bottom = me.y + me.height - halfResizeElemeSize;
//        top - left
        me.arrangeElement(me.resizeElements[0], left, top);
//        top - right
        me.arrangeElement(me.resizeElements[1], right, top);
//        bottom - right
        me.arrangeElement(me.resizeElements[2], right, bottom);
//        bottom - left
        me.arrangeElement(me.resizeElements[3], left, bottom);

        //rotate element
        me.arrangeElement(me.resizeElements[4], me.x + me.width / 2, me.y - 25);
    }

    protected arrangeElement(element: SVGGraphicsElement, x: number, y: number) {
        const translate = element.transform.baseVal.getItem(0);
        translate.setTranslate(x, y);
        element.transform.baseVal.replaceItem(translate, 0);
    }

    public setDrawColor(color: string) {
        this.baseSVGElement.style.stroke = color;
    }

    public setFillColor(color: string) {
        this.baseSVGElement.style.fill = color;
    }

    public setFillType(fillType: number) {
        let me = this;
        if (fillType == 0) {
            me.baseSVGElement.style.fill = me.fillStyle.color;
        } else {
            let fillPattern = AnnotationUtils.createFillPattern(me.config, fillType, me.fillPattern);
            fillPattern.style.stroke = me.fillStyle.color;
            fillPattern.style.fill = me.fillStyle.color;
            me.fillPattern = fillPattern;
            me.baseSVGElement.style.fill = 'url(#' + fillPattern.id + ')';
        }
    }

    public setSelected(selected: boolean) {
        let me = this;
        if (me.selected != selected) {
            super.setSelected(selected);
            let resizeElements = me.resizeElements,
                n = resizeElements.length;
            for (let i = 0; i < n; i++) {
                me.resizeElements[i].style.display = selected ? '' : 'none';
            }
        }
    }

    public intersects(x: number, y: number, w: number, h: number): boolean {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            xTransform = matrix.e,
            yTransform = matrix.f,
            mx = me.x + xTransform,
            my = me.y + yTransform,
            mw = me.width,
            mh = me.height;

        return RectAnnotator.intersects(mx, my, mw, mh, x, y, w, h);
    }

    public static intersects(mx: number, my: number, mw: number, mh: number,
                             x: number, y: number, w: number, h: number): boolean {
        return w > 0 && h > 0 && mw > 0 && mh > 0
            && x < mx + mw && x + w > mx && y < my + mh && y + h > my;
    }

    public containsPoint(x: number, y: number): boolean {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            xTransform = matrix.e,
            yTransform = matrix.f,
            mx = me.x + xTransform,
            my = me.y + yTransform,
            w = me.width,
            h = me.height;

        return w > 0 && h > 0 && x >= mx && x < mx + w && y >= my && y < my + h;
    }

    public setStrokeType(strokeType: StrokeType) {
        super._setStrokeType(this.baseSVGElement, strokeType);
    }

    public setStrokeWidth(width: number) {
        super._setStrokeWidth(this.baseSVGElement, width);
    }

    public toXML(): Element {
        let elem = document.createElementNS(null, RectAnnotator.xtype);
        this._toXML(elem);
        return elem;
    }

    protected _toXML(elem: Element) {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            dx = matrix.e,
            dy = matrix.f;
        me.addDraw(elem);
        me.addFill(elem);

        elem.setAttribute('x', (me.x + dx).toString());
        elem.setAttribute('y', (me.y + dy).toString());
        elem.setAttribute('w', me.width.toString());
        elem.setAttribute('h', me.height.toString());
    }

    public fromXML(element: Element) {
        let me = this,
            getValidNumber = function (val: string) {
                if (val === null) {
                    return 0;
                }
                let num = parseInt(val, 10);
                if (isNaN(num)) {
                    num = 0;
                }
                return num;
            };

        let x = getValidNumber(element.getAttribute('x')),
            y = getValidNumber(element.getAttribute('y')),
            width = getValidNumber(element.getAttribute('w')),
            height = getValidNumber(element.getAttribute('h'));

        me.x = x;
        me.y = y;
        me.width = width;
        me.height = height;

        let mainSVGElement = me.baseSVGElement;
        mainSVGElement.setAttribute('x', x.toString());
        mainSVGElement.setAttribute('y', y.toString());
        mainSVGElement.setAttribute('width', width.toString());
        mainSVGElement.setAttribute('height', height.toString());

        me.loadXMLDraw(element);
        me.loadXMLFill(element);

        if (me.resizeElements.length) {
            me.arrangeResizeElements();
        }
    }

    public toJSON(): Object {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            dx = matrix.e,
            dy = matrix.f,
            result = {
                xtype: RectAnnotator.xtype,
                x: me.x + dx,
                y: me.y + dy,
                w: me.width,
                h: me.height
            };

        me.addJSONDraw(result);
        me.addJSONFill(result);
        return result;
    }

    public fromJSON(obj: any) {
        let me = this;
        if (obj.x) {
            me.x = obj.x;
        }
        if (obj.y) {
            me.y = obj.y;
        }
        if (obj.w) {
            me.width = obj.w;
        }
        if (obj.h) {
            me.height = obj.h;
        }

        me.loadJSONDraw(obj);
        me.loadJSONFill(obj);

        me.baseSVGElement.setAttribute('x', me.x.toString());
        me.baseSVGElement.setAttribute('y', me.y.toString());
        me.baseSVGElement.setAttribute('width', me.width.toString());
        me.baseSVGElement.setAttribute('height', me.height.toString());
        if (me.resizeElements.length) {
            me.arrangeResizeElements();
        }

    }
}

ClassManager.register(RectAnnotator.xtype, RectAnnotator);