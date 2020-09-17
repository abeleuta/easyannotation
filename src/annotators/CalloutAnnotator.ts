import {RectAnnotator} from "./RectAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"
import InternalConfig from "../utils/InternalConfig"
import {ClassManager} from "../utils/ClassManager"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {Point} from "../model/Point"

export class CalloutAnnotator extends RectAnnotator {
    
    private static readonly DIRECTION_TOP = 1;
    
    private static readonly DIRECTION_RIGHT = 2;
    
    private static readonly DIRECTION_BOTTOM = 3;
    
    private static readonly DIRECTION_LEFT = 4;
    
    public static readonly xtype: string = "callout";
    
    private shadowPathElement: SVGPathElement;
    
    private bottom: number;
    
    private right: number;
    
    private calloutHeadX: number;
    
    private calloutHeadY: number;
    
    private calloutDragX: number;
    
    private calloutDragY: number;
    
    /**
     * Containe 4 points of virtual extended points of 4 triangles.
     */
    private points: Array<Point>;
    
    private direction: number = CalloutAnnotator.DIRECTION_BOTTOM;
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        
        this.addResizeElements(config);
    }
    
    protected initElement(config: InternalConfig) {
        let me = this, d = document;
        
        me.width = 200 * config.sizePercentage;
        me.height = 150 * config.sizePercentage;
        
        me.bottom = me.height * 0.65;
        me.right = me.width;
        let shadowPathElement = d.createElementNS("http://www.w3.org/2000/svg", "path");
//        shadowPathElement.setAttribute('d', 'M 38,44 C 38,44 488,43 486,43 C 485,43 485,319 485,319 L 296,319 L 71,473 L 220,321 L 38,323 L 38,44 z');
//        shadowPathElement.setAttribute('d', `M 38,44 C 38,44 ${this.width},43 ${this.width-2},43 C ${this.width-1},43 ${this.width-1},319 ${this.width-1},319 L 296,319 L 71,473 L 220,321 L 38,323 L 38,44 z`);
        shadowPathElement.setAttribute('class', config.ui + '-annotator-callout-shadow');
        
        let pathElement = d.createElementNS("http://www.w3.org/2000/svg", "path");
//        pathElement.setAttribute('d', `M 0,0 C 0,0 471,30 470,30 C 469,30 469,306 469,306 L 280,306 L 55,460 L 204,308 L 22,310 L 22,31 z`);
////        pathElement.setAttribute('d', 'M 22,31 C 22,31 471,30 470,30 C 469,30 469,306 469,306 L 280,306 L 55,460 L 204,308 L 22,310 L 22,31 z');
        pathElement.setAttribute('class', config.ui + '-annotator-callout');
        
        me.svgGroupElement.appendChild(shadowPathElement);
        me.svgGroupElement.appendChild(pathElement);
        
        me.shadowPathElement = shadowPathElement;
        me.baseSVGElement = pathElement;
        
        let filterElement = d.createElementNS("http://www.w3.org/2000/svg", "filter");
        filterElement.id = 'calloutFilter258';
        filterElement.innerHTML = '<feGaussianBlur stdDeviation="6.5873096"/>';
        
        AnnotationUtils.addToDefs(config, filterElement);
        
        me.calloutHeadX = me.width * 0.1127;
        me.calloutHeadY = me.height * 0.9725;
        me.resize();
    }
    
    private resize() {
        let me = this,
            left = me.x,
            top = me.y,
            right = me.right,// width - Math.abs(me.x),
            bottom = me.bottom,
            circleRadius = Math.min(10, Math.min(right * 0.08, bottom * 0.08)),
            circleRadius_2 = circleRadius*0.2,
            circleRadius_6 = circleRadius*0.6,
            top_circleRadius = top + circleRadius,
            right_circleRadius = right - circleRadius,
            topLeftCurve = `C ${left+circleRadius/10},${top+circleRadius_6} ${left+circleRadius_2},${top+circleRadius_2} ${left+circleRadius},${top}`,
            topRightCurve = `C ${right-circleRadius_6},${top+circleRadius*.1} ${right-circleRadius_2},${top+circleRadius_2} ${right-circleRadius*.1},${top+circleRadius_6}`,
            bottomRightCurve = `C ${right-circleRadius/10},${bottom-circleRadius_6} ${right-circleRadius_2},${bottom-circleRadius_2} ${right_circleRadius},${bottom}`,
            bottomLeftCurve = `C ${left+circleRadius*.9},${bottom-circleRadius*.1} ${left+circleRadius_2},${bottom-circleRadius_2} ${left+circleRadius*.1},${bottom-circleRadius*.9}`,
            pathStr = null;//height - Math.abs(me.y);
        switch (me.direction) {
            case CalloutAnnotator.DIRECTION_TOP:
                pathStr = `M ${left},${top_circleRadius} ${topLeftCurve} L ${left+(right-left)*0.418},${top} L ${me.calloutHeadX},${me.calloutHeadY} L ${left+(right-left)*0.574},${top} L ${right_circleRadius},${top} ${topRightCurve} L ${right},${bottom-circleRadius} ${bottomRightCurve} L ${left+circleRadius},${bottom} ${bottomLeftCurve} L ${left},${top_circleRadius} z`;
                break;
            case CalloutAnnotator.DIRECTION_RIGHT:
                pathStr = `M ${left},${top_circleRadius} ${topLeftCurve} L ${right_circleRadius},${top} ${topRightCurve} L ${right},${top+(bottom-top)*.418} L ${me.calloutHeadX},${me.calloutHeadY} ${right},${top+(bottom-top)*.574} L ${right},${bottom-circleRadius} ${bottomRightCurve} L ${left+circleRadius},${bottom} ${bottomLeftCurve} L ${left},${top_circleRadius} z`;
                break;
            case CalloutAnnotator.DIRECTION_BOTTOM:
                pathStr = `M ${left},${top_circleRadius} ${topLeftCurve} L ${right_circleRadius},${top} ${topRightCurve} L ${right},${bottom-circleRadius} ${bottomRightCurve} L ${left+(right-left)*0.5737},${bottom} L ${me.calloutHeadX},${me.calloutHeadY} L ${left+(right-left)*0.418},${bottom} L ${left+circleRadius},${bottom} ${bottomLeftCurve} L ${left},${top_circleRadius} z`;
                break;
            case CalloutAnnotator.DIRECTION_LEFT:
                pathStr = `M ${left},${top_circleRadius} ${topLeftCurve} L ${right_circleRadius},${top} ${topRightCurve} L ${right},${bottom-circleRadius} ${bottomRightCurve} L ${left+circleRadius},${bottom} ${bottomLeftCurve} L ${left},${top+(bottom-top)*.574} L ${me.calloutHeadX},${me.calloutHeadY} ${left},${top+(bottom-top)*.418} L ${left},${top_circleRadius} z`;
                break;
        }
        
        if (pathStr) {
            me.baseSVGElement.setAttribute('d', pathStr);
            me.shadowPathElement.setAttribute('d', pathStr);
        }
        if (!me.points) {
            me.points = [];
        } else {
            me.points.length = 0;
        }
        
        let centerX = left + right / 2,
            centerY = top + bottom / 2;
        
//        center point
        me.points.push(new Point(centerX, centerY));
//        top right
        me.points.push(new Point(20000, me.getNextPoint(centerX, centerY, left + right, top, 20000)));
//        bottom right
        me.points.push(new Point(20000, me.getNextPoint(centerX, centerY, left + right, top + bottom, 20000)));
//        bottom left
        me.points.push(new Point(-20000, me.getNextPoint(centerX, centerY, left, top + bottom, -20000)));
//        top left
        me.points.push(new Point(-20000, me.getNextPoint(centerX, centerY, left, top, -20000)));
    }
    
    private getNextPoint(x1: number, y1: number, x2: number, y2: number, nextX:number) {
//        we have 2 points, calculate equation of each of 4 lines
        let slope = (y2 - y1) / (x2 - x1);
        return slope * (nextX - x1) + y1;
    }
    
    protected addResizeElements(config: InternalConfig) {
        let me = this;
        for(let i=0;i<5;i++) {
            let resizeEl = this.createResizeElement(config);
            me.resizeElements.push(resizeEl);
            me.addResizeEvents(resizeEl);
            me.svgGroupElement.appendChild(resizeEl);
        }
        
        me.arrangeResizeElements();
    }
    
    protected onResizeTouchStart = (evt: TouchEvent) => {
        let touches = evt.changedTouches[0];
        this.onResizePress(touches);
    }
    
    protected onResizeMouseDown = (evt: MouseEvent) => {
        this.onResizePress(evt);
    }
    
    private onResizePress(evt: MouseEvent | Touch) {
        let me = this,
            resizeElem = evt.target as SVGGraphicsElement,
            numResizeElements = me.resizeElements.length;
        me.screenX = evt.screenX;
        me.screenY = evt.screenY;
        
        me.dragStartW = me.right;
        me.dragStartH = me.bottom;
        me.dragStartX = me.x;
        me.dragStartY = me.y;
        
        for(let i=0;i<numResizeElements;i++) {
            if (resizeElem == me.resizeElements[i]) {
                me.currentResizeIndex = i;
                me.calloutDragX = me.calloutHeadX;
                me.calloutDragY = me.calloutHeadY;
                break;
            }
        }
    }
    
    protected arrangeResizeElements() {
        let me = this,
            halfResizeElemeSize = me.RESIZE_ELEM_SIZE / 2,
            left = me.x - halfResizeElemeSize,
            right = me.right - halfResizeElemeSize,
            top = me.y - halfResizeElemeSize,
            bottom = me.bottom - halfResizeElemeSize;
//            bottom = me.y + me.height * 0.6469 - halfResizeElemeSize;
//        top - left
        me.arrangeElement(me.resizeElements[0], left, top);
//        top - right
        me.arrangeElement(me.resizeElements[1], right, top);
//        bottom - right
        me.arrangeElement(me.resizeElements[2], right, bottom);
//        bottom - left
        me.arrangeElement(me.resizeElements[3], left, bottom);
//        callout arrow
        me.arrangeElement(me.resizeElements[4], me.calloutHeadX, me.calloutHeadY);
    }

    public moveBy(dx: number, dy: number, evt: MouseEvent) {
        let me = this,
            resizeIndex = me.currentResizeIndex;
            
        if (resizeIndex >= 0) {
            let difX = evt.screenX - me.screenX,
                difY = evt.screenY - me.screenY;

            switch (resizeIndex) {
                case 0:
//                top left
                    me.x = me.dragStartX + difX;
                    me.y = me.dragStartY + difY;
                    break;
                case 1:
//                top right
                    me.y = me.dragStartY + difY;
                    me.right = me.dragStartW + difX;
                    break;
                case 2:
//                bottom right
                    me.right = me.dragStartW + difX;
                    me.bottom = me.dragStartH + difY;
                    break;
                case 3:
//                bottom left
                    me.x = me.dragStartX + difX;
                    me.bottom = me.dragStartH + difY;
                    break;
                case 4:
                    me.calloutHeadX = me.calloutDragX + difX;
                    me.calloutHeadY = me.calloutDragY + difY;
                    let centerPoint = me.points[0],
                        calloutPoint = new Point(me.calloutHeadX, me.calloutHeadY);
                    if (me.pointInTriangle(calloutPoint, centerPoint, me.points[1], me.points[2])) {
                        me.direction = CalloutAnnotator.DIRECTION_RIGHT;
                    } else if (me.pointInTriangle(calloutPoint, centerPoint, me.points[2], me.points[3])) {
                        me.direction = CalloutAnnotator.DIRECTION_BOTTOM;
                    } else if (me.pointInTriangle(calloutPoint, centerPoint, me.points[3], me.points[4])) {
                        me.direction = CalloutAnnotator.DIRECTION_LEFT;
                    } else if (me.pointInTriangle(calloutPoint, centerPoint, me.points[4], me.points[1])) {
                        me.direction = CalloutAnnotator.DIRECTION_TOP;
                    }
                    break;
            }
            me.baseSVGElement.setAttribute('x', me.x.toString());
            me.baseSVGElement.setAttribute('y', me.y.toString());
        } else {
            super.moveBy(dx, dy, evt);
        }
        
        me.arrangeResizeElements();
        me.resize();
    }
    
    private sign(p1: Point, p2: Point, p3: Point): number {
         return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
    
    private pointInTriangle(pt: Point, p1: Point, p2: Point, p3: Point) {
        let d1, d2, d3;
        let has_neg, has_pos,
            me = this;
        
        d1 = me.sign(pt, p1, p2);
        d2 = me.sign(pt, p2, p3);
        d3 = me.sign(pt, p3, p1);

        has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }
        
    public setDrawColor(color: string) {
        this.baseSVGElement.style.stroke = color;
    }
    
    public setFillColor(color: string) {
        this.baseSVGElement.style.fill = color;
    }
    
    public toJSON() : Object {
        let me = this,
            result = super.toJSON() as any;
        
        result.xtype = CalloutAnnotator.xtype;
        result.dx = result.x;
        result.dy = result.y;
        result.x = me.x;
        result.y = me.y;
        result.r = me.right;
        result.b = me.bottom;
        result.cx = me.calloutHeadX;
        result.cy = me.calloutHeadY;
        result.d = me.direction;
            
        return result;
    }
    
    public fromJSON(obj: any) {
        let me = this;
        super.fromJSON(obj);
        me.right = obj.r;
        me.bottom = obj.b;
        me.calloutHeadX = obj.cx;
        me.calloutHeadY = obj.cy;
        me.direction = obj.d;
        me.moveBy(obj.dx - obj.x, obj.dy - obj.y, null);
        me.resize();
    }
    
    public toXML() : Element {
        let elem = document.createElementNS(null, CalloutAnnotator.xtype),
            me = this;
        me._toXML(elem);
        
        elem.setAttribute('dx', elem.getAttribute('x'));
        elem.setAttribute('dy', elem.getAttribute('y'));
        elem.setAttribute('x', me.x.toString());
        elem.setAttribute('y', me.y.toString());
        elem.setAttribute('r', me.right.toString());
        elem.setAttribute('b', me.bottom.toString());
        elem.setAttribute('cx', me.calloutHeadX.toString());
        elem.setAttribute('cy', me.calloutHeadY.toString());
        elem.setAttribute('d', me.direction.toString());

        return elem;
    }
    
    public fromXML(element: Element) {
        super.fromXML(element);
        
        let me = this;
        me.right = me.getXMLNumber(element, 'r');
        me.bottom = me.getXMLNumber(element, 'b');
        me.calloutHeadX = me.getXMLNumber(element, 'cx');
        me.calloutHeadY = me.getXMLNumber(element, 'cy');
        me.direction = me.getXMLNumber(element, 'd');

        me.moveBy(me.getXMLNumber(element, 'dx') - me.x,
                me.getXMLNumber(element, 'dy') - me.y, null);
        me.resize();

    }

}

ClassManager.register(CalloutAnnotator.xtype, CalloutAnnotator);