
import {BaseAnnotator} from "./BaseAnnotator"
import InternalConfig from "../utils/InternalConfig"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {StrokeType} from "../model/Styles"
import {ClassManager} from "../utils/ClassManager"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {Constants} from "../utils/Constants"

export class EllipseAnnotator extends BaseAnnotator {

    public static readonly xtype: string = "ellipse";

    private resizeElements: Array<SVGGraphicsElement>;

    /**
     * Index of dragging resize element.
     */
    private currentResizeIndex: number = -1;

    private cx: number = 0;

    private cy: number = 0;

    private rx: number;

    private ry: number;

    private dragStartRx: number;

    private dragStartRy: number;

    private dragStartX: number;

    private dragStartY: number;

    private screenX: number;

    private screenY: number;

    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        let me = this;
        me.rx = 50 * config.sizePercentage;
        me.ry = 50 * config.sizePercentage;
        me.createEllipse(config);
        me.properties = [Constants.DRAW_PROPERTY, Constants.FILL_PROPERTY];
    }

    private createEllipse(config: InternalConfig) {

        var ellipseSVG = document.createElementNS("http://www.w3.org/2000/svg", "ellipse"),
            me = this;

        ellipseSVG.setAttribute('cx', '0');
        ellipseSVG.setAttribute('cy', '0');
        ellipseSVG.setAttribute('rx', me.rx.toString());
        ellipseSVG.setAttribute('ry', me.ry.toString());

        me.svgGroupElement.appendChild(ellipseSVG);
        me.baseSVGElement = ellipseSVG;

        me.resizeElements = new Array();
        for (var i = 0; i < 4; i++) {
            var resizeEl = me.createResizeElement(config);
            me.resizeElements.push(resizeEl);
            me.addResizeEvents(resizeEl);
            me.svgGroupElement.appendChild(resizeEl);
        }

        me.arrangeResizeElements();
    }

    private addResizeEvents(element: SVGGraphicsElement) {
        element.addEventListener('mousedown', this.onResizeMouseDown);
        element.addEventListener('mouseup', this.onResizeMouseUp);
        element.addEventListener('touchstart', this.onResizeTouchStart);
        element.addEventListener('touchend', this.onResizeMouseUp);
    }

    protected onResizeTouchStart = (evt: TouchEvent) => {
        var touches = evt.changedTouches[0];
        this.onResizeDown(touches);
    }
    
    protected onResizeMouseDown = (evt: MouseEvent) => {
        this.onResizeDown(evt);
    }
    
    private onResizeDown(evt: MouseEvent | Touch) {
        let me = this,
            numResizeElements = me.resizeElements.length,
            resizeElem = evt.target;
        me.screenX = evt.screenX;
        me.screenY = evt.screenY;

        me.dragStartRx = me.rx;
        me.dragStartRy = me.ry;
        for(var i=0;i<numResizeElements;i++) {
            if (resizeElem == me.resizeElements[i]) {
                me.currentResizeIndex = i;
                me.dragStartX = me.cx;
                me.dragStartY = me.cy;
                break;
            }
        }
    }

    private onResizeMouseUp = (evt: MouseEvent) => {
        this.currentResizeIndex = -1;
    }

    public moveBy(dx: number, dy: number, evt: MouseEvent | Touch) {
        var me = this,
            resizeIndex = me.currentResizeIndex;
        if (resizeIndex >= 0) {
            var difX = evt.screenX - me.screenX,
                difY = evt.screenY - me.screenY;
            switch (resizeIndex) {
                case 0:
//                    top left
                    me.rx = me.dragStartRx - difX / 2;
                    me.ry = me.dragStartRy - difY / 2;
                    break;
                case 1:
//                    top right
                    me.rx = me.dragStartRx + difX / 2;
                    me.ry = me.dragStartRy - difY / 2;
                    break;
                case 2:
//                    bottom right
                    me.rx = me.dragStartRx + difX / 2;
                    me.ry = me.dragStartRy + difY / 2;
                    break;
                case 3:
//                    bottom left
                    me.rx = me.dragStartRx - difX / 2;
                    me.ry = me.dragStartRy + difY / 2;
                    break;
            }
            me.cx = me.dragStartX + difX / 2;
            me.cy = me.dragStartY + difY / 2;
            let mainSVGElement = me.baseSVGElement;
            mainSVGElement.setAttribute('cx', me.cx.toString());
            mainSVGElement.setAttribute('cy', me.cy.toString());
            mainSVGElement.setAttribute('rx', me.rx.toString());
            mainSVGElement.setAttribute('ry', me.ry.toString());
            this.arrangeResizeElements();
        } else {
            super.moveBy(dx, dy, evt);
        }
    }

    protected onMouseUp = (evt: MouseEvent) => {
        this.currentResizeIndex = -1;
        this.isDragging = false;
    }

    processMouseUp = () => {
        super.processMouseUp();
    }

    private arrangeResizeElements() {
        var halfResizeElemeSize = this.RESIZE_ELEM_SIZE / 2;
        //        top - left
        this.arrangeElement(this.resizeElements[0], this.cx - this.rx - halfResizeElemeSize, this.cy - this.ry - halfResizeElemeSize);
        //        top - right
        this.arrangeElement(this.resizeElements[1], this.cx + this.rx, this.cy - this.ry - halfResizeElemeSize);
        //        bottom - right
        this.arrangeElement(this.resizeElements[2], this.cx + this.rx, this.cy + this.ry - halfResizeElemeSize);
        //        bottom - left
        this.arrangeElement(this.resizeElements[3], this.cx - this.rx - halfResizeElemeSize, this.cy + this.ry - halfResizeElemeSize);
    }

    private arrangeElement(element: SVGGraphicsElement, x: number, y: number) {
        const translate = element.transform.baseVal.getItem(0);
        translate.setTranslate(x, y);
        element.transform.baseVal.replaceItem(translate, 0);
    }

    public setDrawColor(color: string) {
        this.baseSVGElement.style.stroke = color;
    }

    public setFillColor(color: string) {
        let me = this;
        if (me.fillStyle.fillType == 0) {
            me.baseSVGElement.style.fill = color;
        } else {
            let fillPattern = me.fillPattern;
            if (fillPattern) {
                fillPattern.style.stroke = color;
                fillPattern.style.fill = color;
            }
        }
    }
    
    public setFillType(fillType: number) {
        let me = this;
        if (fillType == 0) {
            me.baseSVGElement.style.fill = me.fillStyle.color;
        } else {
            var fillPattern = AnnotationUtils.createFillPattern(me.config, fillType, me.fillPattern);
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
            for (var i = 0; i < 4; i++) {
                me.resizeElements[i].style.display = selected ? '' : 'none';
            }
        }
    }

    public containsPoint(px: number, py: number): boolean {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            xTransform = matrix.e,
            yTransform = matrix.f,
            rx = me.rx,
            ry = me.ry,
            x = me.cx + xTransform,
            y = me.cy + yTransform;

        let tx = (px - (x + rx)) / rx,
            ty = (py - (y + ry)) / ry;
        return tx * tx + ty * ty < 1.0;
    }

    public intersects(x: number, y: number, w: number, h: number): boolean {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            xTransform = matrix.e,
            yTransform = matrix.f,
            radiusX = me.rx,
            radiusY = me.ry,
            mx = me.cx + xTransform - radiusX,
            my = me.cy + yTransform - radiusY,
            mw = me.rx * 2,
            mh = me.ry * 2;

        if (w <= 0.0 || h <= 0.0) {
            return false;
        }
        
//        code below taken from source code of Java 1.7: 
//        https://github.com/Himansu-Nayak/java7-sourcecode/blob/master/java/awt/geom/Ellipse2D.java#L352
        // Normalize the rectangular coordinates compared to the ellipse
        // having a center at 0,0 and a radius of 0.5.
        let normx0 = (x - mx) / mw - 0.5;
        let normx1 = normx0 + w / mw;

        let normy0 = (y - my) / mh - 0.5;
        let normy1 = normy0 + h / mh;
        // find nearest x (left edge, right edge, 0.0)
        // find nearest y (top edge, bottom edge, 0.0)
        // if nearest x,y is inside circle of radius 0.5, then intersects
        let nearx, neary;
        if (normx0 > 0.0) {
            // center to left of X extents
            nearx = normx0;
        } else if (normx1 < 0.0) {
            // center to right of X extents
            nearx = normx1;
        } else {
            nearx = 0.0;
        }
        if (normy0 > 0.0) {
            // center above Y extents
            neary = normy0;
        } else if (normy1 < 0.0) {
            // center below Y extents
            neary = normy1;
        } else {
            neary = 0.0;
        }
        return (nearx * nearx + neary * neary) < 0.25;

    }

    public setStrokeType(strokeType: StrokeType) {
        super._setStrokeType(this.baseSVGElement, strokeType);
    }
    
    public setStrokeWidth(width: number) {
        super._setStrokeWidth(this.baseSVGElement, width);
    }
    
    public getWidth() {
        return this.rx * 2;
    }
    
    public getHeight() {
        return this.ry * 2;
    }
    
    public toXML() : Element {
        var elem = document.createElementNS(null, EllipseAnnotator.xtype),
            me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            dx = matrix.e,
            dy = matrix.f;
        me.addDraw(elem);
        me.addFill(elem);
        
        elem.setAttribute('cx', (me.cx + dx).toString());
        elem.setAttribute('cy', (me.cy + dy).toString());
        elem.setAttribute('rx', me.rx.toString());
        elem.setAttribute('ry', me.ry.toString());
        
        return elem;
    }
    
    public fromXML(element: Element) {
        let me = this,
            getValidNumber = function(val: string) {
                var num = parseInt(val, 10);
                if (isNaN(num) || num < 0) {
                    num = 0;
                }
                return num;
            };
        
        let cx = getValidNumber(element.getAttribute('cx')),
            cy = getValidNumber(element.getAttribute('cy')),
            rx = getValidNumber(element.getAttribute('rx')),
            ry = getValidNumber(element.getAttribute('ry'));

        me.cx = cx;
        me.cy = cy;
        me.rx = rx;
        me.ry = ry;

        me.setCoordinates();
        me.loadXMLDraw(element);
        me.loadXMLFill(element);
        
        me.arrangeResizeElements();
    }
    
    private setCoordinates() {
        let me = this,
            mainSVGElement = me.baseSVGElement;
            
        mainSVGElement.setAttribute('cx', me.cx.toString());
        mainSVGElement.setAttribute('cy', me.cy.toString());
        mainSVGElement.setAttribute('rx', me.rx.toString());
        mainSVGElement.setAttribute('ry', me.ry.toString());
    }
    
    public toJSON() : Object {
        let me = this,
        matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
        dx = matrix.e,
        dy = matrix.f,
        result = {
            xtype: EllipseAnnotator.xtype,
            cx: me.cx + dx,
            cy: me.cy + dy,
            rx: me.rx,
            ry: me.ry
        };
        
        me.addJSONDraw(result);
        me.addJSONFill(result);
        return result;
    }
    
    public fromJSON(obj: any) {
        let me = this;
        if (obj.cx) {
            me.cx = obj.cx;
        }
        if (obj.cy) {
            me.cy = obj.cy;
        }
        if (obj.rx) {
            me.rx = obj.rx;
        }
        if (obj.ry) {
            me.ry = obj.ry;
        }
        
        me.loadJSONDraw(obj);
        me.loadJSONFill(obj);
        
        me.setCoordinates();
        me.arrangeResizeElements();
    }
    
}

ClassManager.register(EllipseAnnotator.xtype, EllipseAnnotator);