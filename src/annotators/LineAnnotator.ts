
import {BaseAnnotator} from "./BaseAnnotator"
import InternalConfig from "../utils/InternalConfig"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {StrokeType} from "../model/Styles"
import DrawStyle from "../model/Styles"

import {ClassManager} from "../utils/ClassManager"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {Constants} from "../utils/Constants"

export class LineAnnotator extends BaseAnnotator {

    public static readonly xtype: string = "line";

    private backLineSVG: SVGLineElement;

    private resizeElement1: SVGGraphicsElement;

    private resizeElement2: SVGGraphicsElement;

    /**
     * Current dragging resize element.
     */
    private currentResizeElement: SVGGraphicsElement;

    protected x1: number = 0;

    protected y1: number = 0;

    protected x2: number;

    protected y2: number = 0;

    private lineStartX: number;

    private lineStartY: number;

    private screenX: number;

    private screenY: number;
    
    protected arrowEndHead: SVGElement;
    
    protected arrowStartHead: SVGElement;
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        this.x2 = this.width;
        this.config = config;
        this.createLine(config);
        this.properties = [Constants.DRAW_PROPERTY];
    }

    protected createLine(config: InternalConfig) {

        let lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line"),
            backLineSVG = document.createElementNS("http://www.w3.org/2000/svg", "line"),
            me = this,
            svgGroupElement = me.svgGroupElement,
            w = me.width.toString();

        lineSVG.setAttribute('x2', w);
        lineSVG.setAttribute('class', config.ui + '-annotator-line');

        backLineSVG.setAttribute('class', 'annotator-back-line');
        backLineSVG.setAttribute('x2', w);

        me.resizeElement1 = me.createResizeElement(config);
        me.resizeElement2 = me.createResizeElement(config);

        me.addResizeEvents(me.resizeElement1);
        me.addResizeEvents(me.resizeElement2);

        svgGroupElement.appendChild(lineSVG);
        svgGroupElement.appendChild(backLineSVG);
        svgGroupElement.appendChild(me.resizeElement1);
        svgGroupElement.appendChild(me.resizeElement2);
        me.baseSVGElement = lineSVG;
        me.backLineSVG = backLineSVG;

        me.arrangeResizeElements();
    }

    private addResizeEvents(element: SVGGraphicsElement) {
        element.addEventListener('mousedown', this.onResizeMouseDown);
        element.addEventListener('mouseup', this.onResizeMouseUp);
        element.addEventListener('touchstart', this.onResizeTouchStart, { passive: false });
        element.addEventListener('touchend', this.onResizeMouseUp, { passive: false });
    }
    
    protected onResizeTouchStart = (evt: TouchEvent) => {
        var touches = evt.changedTouches[0];
        evt.preventDefault();
        this.onResizeDown(touches);
    }

    protected onResizeMouseDown = (evt: MouseEvent) => {
        this.onResizeDown(evt);
    }

    public clean() {
        let me = this,
            defs = AnnotationUtils.getDefs(me.config);
        if (me.arrowEndHead) {
            defs.removeChild(me.arrowEndHead.parentNode);
        }
        
        if (me.arrowStartHead) {
            defs.removeChild(me.arrowStartHead.parentNode);
        }
    }

    private onResizeDown = (evt: MouseEvent | Touch) => {
        var me = this;
        me.currentResizeElement = evt.target as SVGGraphicsElement;
        me.screenX = evt.screenX;
        me.screenY = evt.screenY;
        if (me.currentResizeElement == me.resizeElement1) {
            me.lineStartX = me.x1;
            me.lineStartY = me.y1;
        } else {
            me.lineStartX = me.x2;
            me.lineStartY = me.y2;
        }
    }

    private onResizeMouseUp = (evt: MouseEvent) => {
        evt.preventDefault();
        this.currentResizeElement = null;
    }

    public moveBy(dx: number, dy: number, evt: MouseEvent) {
        var me = this,
            resizeElement = me.currentResizeElement,
            baseSVGElement = me.baseSVGElement,
            backLineSVG = me.backLineSVG;
        if (resizeElement) {
            if (resizeElement == this.resizeElement1) {
                me.x1 = me.lineStartX + evt.screenX - me.screenX;
                me.y1 = me.lineStartY + evt.screenY - me.screenY;
                var _x1 = me.x1.toString(),
                    _y1 = me.y1.toString();

                baseSVGElement.setAttribute('x1', _x1);
                baseSVGElement.setAttribute('y1', _y1);
                backLineSVG.setAttribute('x1', _x1);
                backLineSVG.setAttribute('y1', _y1);
            } else {
                me.x2 = this.lineStartX + evt.screenX - me.screenX;
                me.y2 = this.lineStartY + evt.screenY - me.screenY;
                var _x2 = me.x2.toString(),
                    _y2 = me.y2.toString();
                baseSVGElement.setAttribute('x2', _x2);
                baseSVGElement.setAttribute('y2', _y2);
                backLineSVG.setAttribute('x2', _x2);
                backLineSVG.setAttribute('y2', _y2);
            }
            this.arrangeResizeElements();
        } else {
            super.moveBy(dx, dy, evt);
        }
    }

    protected onMouseUp = (evt: MouseEvent) => {
        this.currentResizeElement = null;
        this.isDragging = false;
    }

    processMouseUp = () => {
        super.processMouseUp();
    }

    private arrangeResizeElements() {

        var me = this,
            halfResizeElemeSize = me.RESIZE_ELEM_SIZE / 2;

        const x1 = me.x1 - halfResizeElemeSize;
        const y1 = me.y1 - halfResizeElemeSize;
        const x2 = me.x2 - halfResizeElemeSize;
        const y2 = me.y2 - halfResizeElemeSize;

        me.arrangeElement(me.resizeElement1, x1, y1);
        me.arrangeElement(me.resizeElement2, x2, y2);

    }

    private arrangeElement(element: SVGGraphicsElement, x: number, y: number) {
        const translate = element.transform.baseVal.getItem(0);
        translate.setTranslate(x, y);
        element.transform.baseVal.replaceItem(translate, 0);
    }
    
    public setDrawStyle(drawStyle: DrawStyle) {
        super.setDrawStyle(drawStyle);
        let startArrow = drawStyle.startArrow,
            endArrow = drawStyle.endArrow,
            me = this,
            color = drawStyle.color,
            lineSVG = me.baseSVGElement;
        
        switch (startArrow) {
            case 0:
                if (me.arrowStartHead) {
                    AnnotationUtils.getDefs(me.config).removeChild(me.arrowStartHead.parentNode);
                    me.arrowStartHead = null;
                }
                lineSVG.setAttribute('marker-start', 'none');
                break;
            default:
                let markerResult = AnnotationUtils.createArrowMarker(me.config, startArrow - 1, 
                    me.arrowStartHead ? me.arrowStartHead.parentNode as SVGElement : null, true);
                lineSVG.setAttribute('marker-start', "url(#" + markerResult[0].getAttribute('id') + ")");
                this.arrowStartHead = markerResult[1];
                markerResult[1].style.fill = color;
                markerResult[1].style.stroke = color;
        }
        
        switch (endArrow) {
            case 0:
                if (me.arrowEndHead) {
                    AnnotationUtils.getDefs(me.config).removeChild(me.arrowEndHead.parentNode);
                    me.arrowEndHead = null;
                }
                lineSVG.setAttribute('marker-end', 'none');
                break;
            default:
                let markerResult = AnnotationUtils.createArrowMarker(me.config, endArrow - 1, 
                    me.arrowEndHead ? me.arrowEndHead.parentNode as SVGElement : null);
                lineSVG.setAttribute('marker-end', "url(#" + markerResult[0].getAttribute('id') + ")");
                this.arrowEndHead = markerResult[1];
                markerResult[1].style.fill = color;
                markerResult[1].style.stroke = color;
        }
    }

    public setDrawColor(color: string) {
        let me = this,
            arrowEndHead = me.arrowEndHead,
            arrowStartHead = me.arrowStartHead;
        
        me.baseSVGElement.style.stroke = color;
        if (arrowEndHead) {
            arrowEndHead.style.fill = color;
            arrowEndHead.style.stroke = color;
        }
        
        if (arrowStartHead) {
            arrowStartHead.style.fill = color;
            arrowStartHead.style.stroke = color;
        }
    }

    public setSelected(selected: boolean) {
        let me = this;
        if (me.selected !== selected) {
            super.setSelected(selected);
            this.resizeElement1.style.display = selected ? '' : 'none';
            this.resizeElement2.style.display = selected ? '' : 'none';
        }
    }

    public containsPoint(px: number, py: number): boolean {
        let matrix = this.svgGroupElement.transform.baseVal.getItem(0).matrix;

        let me = this,
            xTransform = matrix.e,
            yTransform = matrix.f,
            x1 = me.x1 + xTransform,
            y1 = me.y1 + yTransform,
            x2 = me.x2 + xTransform,
            y2 = me.y2 + yTransform;

        let pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

        let x, y;
        if (pd2 == 0) {
            // Points are coincident.
            x = x1;
            y = y2;
        } else {
            let u = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / pd2;

            if (u < 0) {
                // "Off the end"
                x = x1;
                y = y1;
            }
            else if (u > 1.0) {
                x = x2;
                y = y2;
            }
            else {
                x = x1 + u * (x2 - x1);
                y = y1 + u * (y2 - y1);
            }
        }

        return (x - px) * (x - px) + (y - py) * (y - py) < 3;
    }

    public intersects(x: number, y: number, w: number, h: number): boolean {

        let matrix = this.svgGroupElement.transform.baseVal.getItem(0).matrix;

        if (w <= 0 || h <= 0) {
            return false;
        }

        let me = this,
            xTransform = matrix.e,
            yTransform = matrix.f,
            x1 = me.x1 + xTransform,
            y1 = me.y1 + yTransform,
            x2 = me.x2 + xTransform,
            y2 = me.y2 + yTransform;
        
        return LineAnnotator.intersectsRect(x1, y1, x2, y2, x, y, w, h);
    }
    
    public static intersectsRect(x1:number, y1:number, x2:number, y2:number, 
        x: number, y: number, w: number, h: number) :boolean {
        if (x1 >= x && x1 <= x + w && y1 >= y && y1 <= y + h) {
            return true;
        }

        if (x2 >= x && x2 <= x + w && y2 >= y && y2 <= y + h) {
            return true;
        }

        let x3 = x + w;
        let y3 = y + h;

        let linesIntersect = LineAnnotator.linesIntersect;
        return (linesIntersect(x1, y1, x2, y2, x, y, x, y3)
            || linesIntersect(x1, y1, x2, y2, x, y3, x3, y3)
            || linesIntersect(x1, y1, x2, y2, x3, y3, x3, y)
            || linesIntersect(x1, y1, x2, y2, x3, y, x, y));
    }
    
    private static linesIntersect = (x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        x4: number, y4: number): boolean => {

        let a1, a2, a3, a4;
        let between = LineAnnotator.between;
        let area2 = LineAnnotator.area2;

        // deal with special cases
        if ((a1 = area2(x1, y1, x2, y2, x3, y3)) == 0.0) {
            // check if p3 is between p1 and p2 OR
            // p4 is collinear also AND either between p1 and p2 OR at opposite ends
            if (between(x1, y1, x2, y2, x3, y3)) {
                return true;
            }
            else {
                if (area2(x1, y1, x2, y2, x4, y4) == 0.0) {
                    return between(x3, y3, x4, y4, x1, y1)
                        || between(x3, y3, x4, y4, x2, y2);
                }
                else {
                    return false;
                }
            }
        }
        else if ((a2 = area2(x1, y1, x2, y2, x4, y4)) == 0.0) {
            // check if p4 is between p1 and p2 (we already know p3 is not
            // collinear)
            return between(x1, y1, x2, y2, x4, y4);
        }

        if ((a3 = area2(x3, y3, x4, y4, x1, y1)) == 0.0) {
            // check if p1 is between p3 and p4 OR
            // p2 is collinear also AND either between p1 and p2 OR at opposite ends
            if (between(x3, y3, x4, y4, x1, y1)) {
                return true;
            }
            else {
                if (area2(x3, y3, x4, y4, x2, y2) == 0.0) {
                    return between(x1, y1, x2, y2, x3, y3)
                        || between(x1, y1, x2, y2, x4, y4);
                }
                else {
                    return false;
                }
            }
        }
        else if ((a4 = area2(x3, y3, x4, y4, x2, y2)) == 0.0) {
            // check if p2 is between p3 and p4 (we already know p1 is not
            // collinear)
            return between(x3, y3, x4, y4, x2, y2);
        }
        else {  // test for regular intersection
            let firstTest = (a1 > 0) != (a2 > 0),
                secondTest = (a3 > 0) != (a4 > 0);
            return firstTest && secondTest;
            //            ((a1 > 0.0) ^ (a2 > 0.0)) && ((a3 > 0.0) ^ (a4 > 0.0));
        }
    }

    private static area2 = (x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number) => {
        return (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
    }

    private static between = (x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number) => {
        if (x1 != x2) {
            return (x1 <= x3 && x3 <= x2) || (x1 >= x3 && x3 >= x2);
        } else {
            return (y1 <= y3 && y3 <= y2) || (y1 >= y3 && y3 >= y2);
        }
    }
    
    public setStrokeType(strokeType: StrokeType) {
        super._setStrokeType(this.baseSVGElement, strokeType);
    }
    
    public setStrokeWidth(width: number) {
        super._setStrokeWidth(this.baseSVGElement, width);
    }

    public toXML() : Element {
        var elem = document.createElementNS(null, (<typeof LineAnnotator> this.constructor).xtype),
            me = this,
            matrix = this.svgGroupElement.transform.baseVal.getItem(0).matrix,
            dx = matrix.e,
            dy = matrix.f;
        me.addDraw(elem);
        
        elem.setAttribute('x1', (me.x1 + dx).toString());
        elem.setAttribute('y1', (me.y1 + dy).toString());
        elem.setAttribute('x2', (me.x2 + dx).toString());
        elem.setAttribute('y2', (me.y2 + dy).toString());
        
        return elem;
    }
    
    public fromXML(element: Element) {
        let me = this;
        
        me.x1 = me.getXMLNumber(element, 'x1');
        me.y1 = me.getXMLNumber(element, 'y1');
        me.x2 = me.getXMLNumber(element, 'x2');
        me.y2 = me.getXMLNumber(element, 'y2');

        me.setCoordinates();
        me.arrangeResizeElements();
        
        me.loadXMLDraw(element);
    }
    
    private setCoordinates() {
        let me = this,
            baseSVGElement = me.baseSVGElement,
            backLineSVG = me.backLineSVG;

        baseSVGElement.setAttribute('x1', me.x1.toString());
        baseSVGElement.setAttribute('y1', me.y1.toString());
        backLineSVG.setAttribute('x1', me.x1.toString());
        backLineSVG.setAttribute('y1', me.y1.toString());
        
        baseSVGElement.setAttribute('x2', me.x2.toString());
        baseSVGElement.setAttribute('y2', me.y2.toString());
        backLineSVG.setAttribute('x2', me.x2.toString());
        backLineSVG.setAttribute('y2', me.y2.toString());
    }
    
    public toJSON() : Object {
        let me = this,
            matrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix,
            dx = matrix.e,
            dy = matrix.f,
        result = {
            xtype: (<typeof LineAnnotator> this.constructor).xtype,
            x1: me.x1 + dx,
            y1: me.y1 + dy,
            x2: me.x2 + dx,
            y2: me.y2 + dy
        };
        
        me.addJSONDraw(result);
        return result;
    }
    
    public fromJSON(obj: any) {
        let me = this;
        if (obj.x1) {
            me.x1 = obj.x1;
        }
        if (obj.y1) {
            me.y1 = obj.y1;
        }
        if (obj.x2) {
            me.x2 = obj.x2;
        }
        if (obj.y2) {
            me.y2 = obj.y2;
        }
        
        me.setCoordinates();
        me.arrangeResizeElements();
                
        me.loadJSONDraw(obj);
    }
    
}

ClassManager.register(LineAnnotator.xtype, LineAnnotator);