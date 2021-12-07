import {BaseStopableAnnotator} from "./BaseStopableAnnotator"
import InternalConfig from "../utils/InternalConfig"
import {Point} from "../model/Point"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {LineAnnotator} from "./LineAnnotator"
import {StrokeType} from "../model/Styles"
import {ClassManager} from "../utils/ClassManager"
import {Utils} from "../utils/Utils"
import {Constants} from "../utils/Constants"

export class FreeDrawAnnotator extends BaseStopableAnnotator {
    
    public static readonly xtype: string = "freeDraw";
    
    private bufferSize: number = 6;

    private rect: ClientRect;

    protected strPath: string;

    private buffer: Array<Point> = []; // Contains the last positions of the mouse cursor
    
//    all points of this path, if point x or y is Number.NaN, this means path is closed
    private points: Array<Point> = [];

    protected svgContainer: SVGElement;

    protected initialized: boolean = false;

    protected isDrawing: boolean = false;
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        this.config = config;
        this.strPath = '';
        this.initAnnotator();
        this.properties.push(Constants.DRAW_PROPERTY);
    }
    
    protected createPath(config: InternalConfig) {
        let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("fill", "none");
        pathElement.setAttribute("stroke", config.drawStyle.color);
        pathElement.setAttribute("stroke-width", config.drawStyle.width.toString());
        
        this.baseSVGElement = pathElement;
        this.svgGroupElement.appendChild(pathElement);
        this.parent.getSVGContainer().appendChild(this.svgGroupElement);
    }
    
    private initAnnotator() {
        let me = this,
            parent = me.parent.getSVGContainer();
        me.rect = parent.getBoundingClientRect();
        if (Utils.isMobileDevice()) {
            parent.addEventListener('touchstart', me.parentTouchStart, { passive: false });
            parent.addEventListener('touchmove', me.parentTouchMove, { passive: false });
            parent.addEventListener('touchend', me.parentTouchEnd, { passive: false });
        } else {
            parent.addEventListener('mousemove', me.parentMouseMove);
            parent.addEventListener('mousedown', me.parentMouseDown);
            parent.addEventListener('mouseup', me.parentMouseUp);
        }
        
        this.svgContainer = parent;
        this.createPath(this.config);
    }
    
    public stop() {
        let me = this,
            parent = me.parent.getSVGContainer();
        
        if (Utils.isMobileDevice()) {
            parent.removeEventListener('touchstart', me.parentTouchStart);
            parent.removeEventListener('touchmove', me.parentTouchMove);
            parent.removeEventListener('touchend', me.parentTouchEnd);
        } else {
            parent.removeEventListener('mousemove', me.parentMouseMove);
            parent.removeEventListener('mousedown', me.parentMouseDown);
            parent.removeEventListener('mouseup', me.parentMouseUp);
        }
        me.initialized = true;
    }
    
    protected parentTouchMove = (evt: TouchEvent) => {
        let me = this;
        evt.preventDefault();
        if (me.isDrawing && me.baseSVGElement) {
            me.appendToBuffer(me.getMousePosition(evt.changedTouches[0]));
            me.updateSvgPath();
        }
    }

    protected parentMouseMove = (evt:MouseEvent) => {
        this.onParentMouseMove(evt);
    }

    protected onParentMouseMove(evt: MouseEvent) {
        let me = this;
        evt.preventDefault();
        if (me.isDrawing && me.baseSVGElement) {
            me.appendToBuffer(me.getMousePosition(evt));
            me.updateSvgPath();
        }
    }

    protected parentTouchStart = (evt: TouchEvent) => {
        evt.preventDefault();
        this.startDragging(evt.changedTouches[0]);
    }

    private parentMouseDown = (evt:MouseEvent) => {
        this.startDragging(evt);
    }

    protected startDragging (evt: MouseEvent | Touch) {
        let me = this;
        if (!me.baseSVGElement) {
            me.createPath(me.config);
        }
        me.isDrawing = true;
        me.buffer = [];
        let pt = me.getMousePosition(evt);
        me.appendToBuffer(pt);
        me.points.push(pt);
        me.strPath += "M" + pt.x + " " + pt.y;
        (me.baseSVGElement as SVGPathElement).setAttribute("d", me.strPath);
    }

    protected parentTouchEnd = (evt: TouchEvent) => {
        evt.preventDefault();
        this.endDragging(evt.changedTouches[0]);
    }

    protected parentMouseUp = (evt:MouseEvent) => {
        this.endDragging(evt);
    }
    
    protected endDragging (evt: MouseEvent | Touch) {
        let me = this;
        me.isDrawing = false;
        let pt = me.getMousePosition(evt);
        me.appendToBuffer(pt);
        me.updateSvgPath();
        me.points.push(new Point(Number.NaN, Number.NaN));
        me.strPath += " ";
        (me.baseSVGElement as SVGPathElement).setAttribute("d", me.strPath);
    }
    
    protected getMousePosition (e:MouseEvent | Touch) {
        let rect = this.rect;
        return new Point(Math.round(e.pageX - rect.left - window.scrollX),
                         Math.round(e.pageY - rect.top - window.scrollY));
    }
    
    private appendToBuffer = (pt: Point) => {
        let buffer = this.buffer,
            bufferSize = this.bufferSize;
        buffer.push(pt);
        while (buffer.length > bufferSize) {
            buffer.shift();
        }
    }
    
// Calculate the average point, starting at offset in the buffer
    private getAveragePoint = (offset: number) => {
        let len = this.buffer.length;
        if (len % 2 === 1 || len >= this.bufferSize) {
            let totalX = 0;
            let totalY = 0;
            let pt, i;
            let count = 0;
            for (i = offset; i < len; i++) {
                count++;
                pt = this.buffer[i];
                totalX += pt.x;
                totalY += pt.y;
            }
            return {
                x: Math.round(totalX / count),
                y: Math.round(totalY / count)
            }
        }
        return null;
    }

    private updateSvgPath = () => {
        let me = this,
            pt = me.getAveragePoint(0);

        if (pt) {
            // Get the smoothed part of the path that will not change
            me.strPath += " L" + pt.x + " " + pt.y;
            me.points.push(pt);

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            let tmpPath = "", bufferLength = me.buffer.length;
            for (let offset = 2; offset < bufferLength; offset += 2) {
                pt = me.getAveragePoint(offset);
                tmpPath += " L" + pt.x + " " + pt.y;
            }

            // Set the complete current path coordinates
            (me.baseSVGElement as SVGPathElement).setAttribute("d", me.strPath + tmpPath);
        }
    }
    
    public moveBy(dx: number, dy: number, evt: MouseEvent) {
        if (this.initialized) {
            super.moveBy(dx, dy, evt);
        }
    }
    
    public setSelected(selected: boolean) {
        super.setSelected(selected);
        if (this.baseSVGElement) {
            this.baseSVGElement.style.stroke = selected ? 'green': this.drawStyle.color;
        }
    }
    
    public intersects(x: number, y: number, w: number, h: number): boolean {

        let matrix = this.svgGroupElement.transform.baseVal.getItem(0).matrix;
        let xTransform = matrix.e,
            yTransform = matrix.f;

        let prevPoint: Point = null;
        for (let point of this.points) {
            if (isNaN(point.x)) {
                prevPoint = null;
                continue;
            }
            if (prevPoint) {
                if (LineAnnotator.intersectsRect(prevPoint.x + xTransform, prevPoint.y + yTransform, 
                    point.x + xTransform, point.y + yTransform, x, y, w, h)) {
                    return true;
                }
            }
            prevPoint = point;
        }

        return false;
    }
    
    public setStrokeType(strokeType: StrokeType) {
        if (this.baseSVGElement) {
            super._setStrokeType(this.baseSVGElement, strokeType);
        }
    }
    
    public setStrokeWidth(width: number) {
        if (this.baseSVGElement) {
            super._setStrokeWidth(this.baseSVGElement, width);
        }
    }
    
    public setDrawColor(color: string) {
        if (this.baseSVGElement) {
            this.baseSVGElement.style.stroke = color;
        }
    }
    
    public toXML() : Element {
        let elem = document.createElementNS(null, FreeDrawAnnotator.xtype),
            me = this;
        me.addDraw(elem);
        me.addFill(elem);
        let points = this.points,
            l = points.length, i, pointElem,
            d = document, point;
            
        for(i = 0;i<l;i++) {
            point = points[i];
            pointElem = d.createElementNS(null, 'p');
            if (!isNaN(point.x)) {
                pointElem.setAttribute('x', point.x.toFixed(1));
                pointElem.setAttribute('y', point.y.toFixed(1));
            }
            elem.appendChild(pointElem);
        }
        
        return elem;
    }
    
    public fromXML(element: Element) {
        let me = this,
            pointElements = element.getElementsByTagName('p'), 
            n = pointElements.length, i,
            points = [],
            pathString = '', x, y, pointElem,
            isMovePoint = false;
            
        if (n > 0) {
            pointElem = pointElements[0];
            x = parseInt(pointElem.getAttribute('x'), 10);
            y = parseInt(pointElem.getAttribute('y'), 10);
            points.push({x: x, y: y});
            pathString = 'M' + x + ' ' + y;
        }
            
        for(i=1;i<n;i++) {
            pointElem = pointElements[i];
            x = parseInt(pointElem.getAttribute('x'), 10);
            y = parseInt(pointElem.getAttribute('y'), 10);

            points.push({x: x, y: y});
            if (isMovePoint) {
                pathString += ' M' + x + ' ' + y;
                isMovePoint = false;
            } else if (isNaN(x)) {
                isMovePoint = true;
            } else {
                pathString += ' L' + x + ' ' + y;
            }
        }
        
        if (!me.baseSVGElement) {
            me.createPath(me.config);
        }
        
        me.loadXMLDraw(element);
        me.loadXMLFill(element);
        
        (me.baseSVGElement as SVGPathElement).setAttribute('d', pathString);
        me.strPath = pathString;
        me.points = points;
    }
    
    public toJSON() : Object {
        let obj = {} as any,
            pointsCopy = [], p;
            
        for (p of this.points) {
            pointsCopy.push({
                x: p.x.toFixed(1),
                y: p.y.toFixed(1)
            });
        }
        this.addJSONDraw(obj);
        this.addJSONFill(obj);
        obj.xtype = FreeDrawAnnotator.xtype;
        obj.points = pointsCopy;
        return obj;
    }
    
    public fromJSON(obj: any) {
        let me = this;
        if (obj.points && Array.isArray(obj.points)) {
            let pointsArray = obj.points as Array<any>,
                l = pointsArray.length, i,
                points = [],
                pathString = '', x, y, pointElem,
                isMovePoint = false;
            
            if (l > 0) {
                pointElem = pointsArray[0];
                x = parseInt(pointElem.x, 10);
                y = parseInt(pointElem.y, 10);
                points.push({x: x, y: y});
                pathString = 'M' + x + ' ' + y;
            }

            for(i=1;i<l;i++) {
                pointElem = pointsArray[i];
                x = parseInt(pointElem.x, 10);
                y = parseInt(pointElem.y, 10);
                

                points.push({x: x, y: y});
                if (isMovePoint) {
                    pathString += ' M' + x + ' ' + y;
                    isMovePoint = false;
                } else if (isNaN(x)) {
                    isMovePoint = true;
                } else {
                    pathString += ' L' + x + ' ' + y;
                }
            }
            
        
            if (!me.baseSVGElement) {
                me.createPath(me.config);
            }
            
            me.loadJSONDraw(obj);
            me.loadJSONFill(obj);
            (me.baseSVGElement as SVGPathElement).setAttribute('d', pathString);
            me.strPath = pathString;
            me.points = points;
            
        }
    }
    
}

ClassManager.register(FreeDrawAnnotator.xtype, FreeDrawAnnotator);