import {FreeDrawAnnotator} from './FreeDrawAnnotator';
import InternalConfig from '../utils/InternalConfig';
import {Utils} from '../utils/Utils';
import {Point} from '../model/Point';
import {Constants} from '../utils/Constants';
import {AnnotationUtils} from '../utils/AnnotationUtils';

export class PolygonAnnotator extends FreeDrawAnnotator {

    public static readonly xtype: string = "polygon";

    private lineStarted: boolean = false;

    private closedPointElement: SVGCircleElement;

    private polygonPoints: Array<Point> = [];

    protected resizeElements: Array<SVGGraphicsElement> = [];

    private listeners: Map<keyof AnnotatorEventMap, Array<() => void>> = new Map<keyof AnnotatorEventMap, Array<() => void>>();

    protected currentPointIndex: number = -1;

    private startDragX: number;

    private startDragY: number;

    protected createPath(config: InternalConfig) {
        super.createPath(config);

        this.fillStyle.color = '#00000000';
        this.baseSVGElement.style.fill = '#FFFFFF00';
        this.baseSVGElement.removeAttribute("fill");

        this.properties = [Constants.DRAW_PROPERTY, Constants.FILL_PROPERTY];
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('fill', '#fff');
        circle.setAttribute('stroke', '#000');
        circle.setAttribute('cx', '-100');
        circle.style.cursor = 'pointer';

        this.closedPointElement = circle;
        this.svgGroupElement.appendChild(circle);

        Utils.on(circle, ['mousedown', 'touchstart'], () => {
            this.onClosePointDown();
        });

        setTimeout(() => {
            Utils.on(document.body, ['mousedown', 'touchstart'], this.onDocMouseDown)
            this.svgContainer.addEventListener('contextmenu', this.onContextMenu, false);
        }, 500);

    }

    private onContextMenu = (evt: MouseEvent) => {
        evt.preventDefault();
    }

    protected doMouseDown(evt: MouseEvent) {
        if (!this.closedPointElement) {
            super.doMouseDown(evt);
        }
    }

    protected startDragging (evt: MouseEvent | Touch) {
        let pt = super.getMousePosition(evt);
        this.polygonPoints.push(pt);
        if (!this.lineStarted) {
        //    initial move
            this.strPath = 'M ' + pt.x + ' ' + pt.y;

            let circle = this.closedPointElement;
            circle.setAttribute('cx', pt.x.toString());
            circle.setAttribute('cy', pt.y.toString());
            circle.setAttribute('r', Utils.isMobileDevice() ? '10' : '6');
            this.lineStarted = true;
        } else {
            this.strPath += ' L ' + pt.x + ' ' + pt.y;
        }
    }

    protected endDragging (evt: MouseEvent | Touch) {

    }

    protected onParentMouseMove (evt:MouseEvent) {
        if (this.lineStarted) {
            let pt = this.getMousePosition(evt);
            (this.baseSVGElement as SVGPathElement).setAttribute("d",
                this.strPath + ' L ' + pt.x + ' ' + pt.y + ' Z');
        }
    }

    protected onClosePointDown() {
        if (this.polygonPoints.length > 2) {
            this.strPath += ' Z';

            (this.baseSVGElement as SVGPathElement).setAttribute("d", this.strPath);

            this.stop();
            this.svgGroupElement.removeChild(this.closedPointElement);
            this.closedPointElement = null;
            let stopListeners = this.listeners.get('stop');
            if (stopListeners) {
                stopListeners.forEach(listener => {
                    listener();
                });
            }
        }
    }

    public stop() {
        super.stop();

        this.svgContainer.removeEventListener('contextmenu', this.onContextMenu);
        Utils.un(document.body, ['mousedown', 'touchstart'], this.onDocMouseDown);

        this.addResizeElements();
    }

    protected addResizeElements() {
        if (this.resizeElements.length) {
            return;
        }
        let config = this.config;
        this.polygonPoints.forEach((point) => {
            let resizeEl = this.createResizeElement(config);
            this.resizeElements.push(resizeEl);
            this.addResizeEvents(resizeEl);
            this.svgGroupElement.appendChild(resizeEl);
            this.arrangeElement(resizeEl,
                    point.x - parseInt(resizeEl.getAttribute('cx'), 10),
                    point.y - parseInt(resizeEl.getAttribute('cy'), 10));
        });
    }

    protected arrangeElement(element: SVGGraphicsElement, x: number, y: number) {
        const translate = element.transform.baseVal.getItem(0);
        translate.setTranslate(x, y);
        element.transform.baseVal.replaceItem(translate, 0);
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
        this.onResizeMouseDown(touches);
    }

    private onResizeMouseDown = (evt: MouseEvent | Touch) => {
        this.currentPointIndex = this.resizeElements.indexOf(evt.target as SVGGraphicsElement);
        const translate = (evt.target as SVGGraphicsElement).transform.baseVal.getItem(0);
        let x = translate.matrix.e,
            y = translate.matrix.f;
        this.startDragX = x;
        this.startDragY = y;
    }

    private onResizeMouseUp = () => {
        this.currentPointIndex = -1;
    }

    public moveBy(dx: number, dy: number, evt: MouseEvent) {
        if (this.currentPointIndex >= 0) {
            this.arrangeElement(this.resizeElements[this.currentPointIndex],
                this.startDragX + dx,
                this.startDragY + dy);
            let point = this.polygonPoints[this.currentPointIndex];
            point.x = this.startDragX + dx;
            point.y = this.startDragY + dy;

            let firstPoint = this.polygonPoints[0],
                path = 'M ' + firstPoint.x + ' ' + firstPoint.y;
            this.polygonPoints.forEach((point, index) => {
                if (index > 0) {
                    path += ' L ' + point.x + ' ' + point.y;
                }
            });
            (this.baseSVGElement as SVGPathElement).setAttribute("d",
                path + ' Z');
        } else {
            super.moveBy(dx, dy, evt);
        }
    }

    isDisableListeners() {
        return false;
    }

    on<K extends keyof AnnotatorEventMap>(type: K, listener: () => void) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Array<() => void>());
        }

        this.listeners.get(type).push(listener);
    }

    public setFillColor(color: string) {
        console.log('set fill color:', color);
        this.baseSVGElement.style.fill = color;
    }

    public setFillType(fillType: number) {
        console.log('set fill type', fillType);
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

    getType(): string {
        return PolygonAnnotator.xtype;
    }

    protected onDocMouseDown = (evt: MouseEvent | TouchEvent) => {
        let target = Utils.getTarget(evt),
            svgContainer = this.parent.getSVGContainer();

        if (evt instanceof MouseEvent && evt.button != 0) {
            //right click, so close polygon
            this.onClosePointDown();
            evt.stopPropagation();
            evt.preventDefault();
            return;
        }

        while (target) {
            if (target == svgContainer) {
                return;
            }

            target = target.parentElement;
        }

        //close polygon when user click outside drawing area
        this.onClosePointDown();
    }
}

interface AnnotatorEventMap {
    'stop' : null
};