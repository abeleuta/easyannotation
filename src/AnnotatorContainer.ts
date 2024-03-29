import {Toolbar} from "./toolbar/Toolbar";
import Config from "./Config"
import InternalConfig from "./utils/InternalConfig"
import Font from "./Config"

import {AbstractToolbarItem} from "./toolbar/AbstractToolbarItem"
import {LineToolbarItem} from "./toolbar/LineToolbarItem"
import {FreeDrawToolbarItem} from "./toolbar/FreeDrawToolbarItem"
import {EllipseToolbarItem} from "./toolbar/EllipseToolbarItem"
import {RectToolbarItem} from "./toolbar/RectToolbarItem"
import {ArrowToolbarItem} from "./toolbar/ArrowToolbarItem"
import {TextToolbarItem} from "./toolbar/TextToolbarItem"
import {CalloutToolbarItem} from "./toolbar/CalloutToolbarItem"
import {ImageToolbarItem} from "./toolbar/ImageToolbarItem"
import {BlurToolbarItem} from "./toolbar/BlurToolbarItem"
import {AbstractToolbarPushItem} from "./toolbar/AbstractToolbarPushItem"

import {BaseAnnotator} from "./annotators/BaseAnnotator"
import {TextAnnotator} from "./annotators/TextAnnotator"
import {BaseStopableAnnotator} from "./annotators/BaseStopableAnnotator"

import {ToolbarItem} from "./toolbar/ToolbarItem"

import {PropertiesToolbar} from "./properties/PropertiesToolbar"

import {DrawToolbarItem} from "./properties/DrawToolbarItem"
import {FillToolbarItem} from "./properties/FillToolbarItem"
import {FontToolbarItem} from "./properties/FontToolbarItem"
import {BlurPropsToolbarItem} from "./properties/BlurPropsToolbarItem"
import {PolygonToolbarItem} from './toolbar/PolygonToolbarItem';

import {Point} from "./model/Point"
import DrawStyle from "./model/Styles"
import FillStyle from "./model/Styles"
import {StrokeType} from "./model/Styles"

import {ClassManager} from "./utils/ClassManager"
import {AnnotationUtils} from "./utils/AnnotationUtils"
import {Utils} from "./utils/Utils"

import EraseIcon from "./icons/eraser-solid.svg"
import SaveIcon from "./icons/save-solid.svg"
import CloseIcon from './icons/close.svg'
import {BlurAnnotator} from './annotators/BlurAnnotator';

export const enum ExportType {
    XML = 0,
    JSON = 1,
    IMAGE = 2,
    SVG = 3
}

export class AnnotatorContainer {
    
    private imageElement: HTMLImageElement;
    
    private targetElement: HTMLElement;
    
    private rectSVGElement: SVGRectElement;
    
    private imagePattern: SVGPatternElement;
    
    private container: HTMLElement;
    
    private svgContainer: SVGSVGElement;
    
    private toolbar: Toolbar;
    
    private propertiesToolbar: PropertiesToolbar;
    
    private completeCallback: (result: string) => void;
    
    private config: InternalConfig;
    
    private width: number;
    
    private height: number;
    
    private drawStyle: DrawStyle;
    
    private fillStyle: FillStyle;
    
    private selectedItems: Array<BaseAnnotator> = new Array();
    
    private annotators: Array<BaseAnnotator> = new Array();
    
    private isDragging: boolean = false;
    
    private startX: number;
    
    private startY: number;
    
    /**
     * Defs node.
     */
    private defs: SVGDefsElement;
    
    private pushedAnnotator: BaseStopableAnnotator = null;
    
    private selectRect: SVGRectElement;
    
    private selectPos: Point = new Point(0, 0);
    
    private isImageElement: boolean = true;
    
    private imgLoaded: boolean = false;
    
    private exportType: ExportType;
    
    constructor(imageElement: HTMLImageElement | string, config? : Config) {
        if (!imageElement) {
            throw new Error('Image element must be specified!');
        }
        
        let me = this,
            internalConfig = {} as any;
        if (typeof(imageElement) === 'string') {
            me.imageElement = new Image();
            if (config?.useCrossOrigin) {
                me.imageElement.crossOrigin = 'anonymous';
            }
            me.imageElement.src = imageElement;
            me.isImageElement = false;
            me.imageElement.onload = me.imageLoaded;
        } else {
            me.imageElement = imageElement as HTMLImageElement;
            me.imgLoaded = me.imageElement.complete;
            if (!me.imgLoaded) {
                me.imageElement.onload = me.imageLoaded;
            }
        }

        this.addStyleElement();
        
        if (!config) {
            config = {
            } as Config;
        }

        config.targetElement = config.targetElement || document.body;

        let annotatorIdx = AnnotationUtils.getNextAnnotatorIdx();
        (internalConfig as InternalConfig).annotatorIdx = annotatorIdx;
        internalConfig.targetElement = config.targetElement;

        config.ui = config.ui || '';
        if (config.ui === 'default') {
            config.ui = '';
        }
        config.font = config.font || {
            italic: false,
            bold: false,
            color: '#000'
        } as unknown as Font;
        
        config.font.size = config.font.size || 24;
        config.font.name = config.font.name || 'Arial';
        
        let width = config.width,
            height = config.height;
        
        if (!width) {
            width = me.imageElement.clientWidth || me.imageElement.width;
        }
        
        if (!height) {
            height = me.imageElement.clientHeight || me.imageElement.height;
        }
            
        let strokeWidth = width < 600 ? 1 : 2;
        
        if (!config.drawStyle) {
            config.drawStyle = {
                width: strokeWidth,
                type: StrokeType.SOLID,
                startArrow: 0,
                endArrow: 0,
                color: '#000'
            } as DrawStyle;
        }
        
        if (!config.fillStyle) {
            config.fillStyle = {} as FillStyle;
        }

        if (!config.fillStyle.color) {
            config.fillStyle.color = '#787878';
        }

        if (!config.fillStyle.fillType) {
            config.fillStyle.fillType = 0;
        }

        if (config.fillStyle.opacity === undefined) {
            config.fillStyle.opacity = 100;
        }

        me.width = width;
        me.height = height;
        
        me.targetElement = config.targetElement;

        if (config.showToolbar === undefined) {
            config.showToolbar = true;
        }
        
        if (config.showProperties === undefined) {
            config.showProperties = true;
        }
        
        let confAny = config as any;
        for(let a in confAny) {
            internalConfig[a] = confAny[a];
        }

        internalConfig.annotatorIdx = annotatorIdx;
        me.config = internalConfig;

        let confDrawStyle = config.drawStyle,
            confFillStyle = config.fillStyle;
        me.drawStyle = {
            color: confDrawStyle.color,
            width: confDrawStyle.width,
            type: confDrawStyle.type,
            startArrow: confDrawStyle.startArrow,
            endArrow: confDrawStyle.endArrow
        } as DrawStyle;
        
        me.fillStyle = {
            fillType: confFillStyle.fillType,
            color: confFillStyle.color,
            opacity: confFillStyle.opacity
        } as FillStyle;

    }

    private imageLoaded = () => {
        this.imgLoaded = true;
    }
    
    public show(completeCallback: (result: string) => void, exportType?: ExportType) {
        let me = this;
        if (!me.imgLoaded) {
            window.setTimeout(function() {
                me.show(completeCallback, exportType);
            }, 500);
        } else {
            me.completeCallback = completeCallback;
            if (exportType === undefined) {
                exportType = ExportType.IMAGE;
            }
            me.exportType = exportType;
            if (this.config.loadOnClick === true) {
                Utils.on(this.imageElement, ['click', 'touchstart'], me._showAnnotator);
            } else {
                this._showAnnotator();
            }
        }

        return this;
    }

    private _showAnnotator = () => {
        this.init();
        this.addListeners();
        this.initToolbar();
    }
    
    private init() {
        let d = document,
            containerParent = d.createElement('easy-annotation'),
            containerElement = d.createElement('div'),
            svgContainer = d.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            me = this,
            config = me.config,
            ui = config.ui,
            imageElement = me.imageElement;

        if (config.mainCls) {
            containerParent.className = config.mainCls;
        }

        config.annotatorContainer = containerParent;
        containerParent.appendChild(containerElement);
        containerElement.className = 'default-annotator-container ' + ui;

        containerElement.setAttribute('part', 'container');

        if (me.config.style) {
            containerElement.setAttribute('style', me.config.style);
        }
        
        me.selectRect = d.createElementNS('http://www.w3.org/2000/svg', 'rect');
        me.selectRect.setAttribute('class', 'default-annotator-select-rect ' + ui);

        if (me.width == 0 || me.height == 0) {
            me.width = imageElement.clientWidth || imageElement.width;
            me.height = imageElement.clientHeight || imageElement.height;
        }

        (config as InternalConfig).sizePercentage = Math.max(0.25, Math.min(1, me.width / 800));

        let w = me.width.toString(),
            h = me.height.toString();
        svgContainer.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgContainer.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svgContainer.setAttribute('version', '1.1');
        svgContainer.setAttribute('width', w);
        svgContainer.setAttribute('height', h);
        svgContainer.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        
        let rect = imageElement.getBoundingClientRect(),
            parentRect = me.targetElement.parentElement.getBoundingClientRect();
        
        containerElement.appendChild(svgContainer);
        
        if (!me.isImageElement) {
            containerElement.style.position = 'unset';
//            containerElement.style.marginTop = '50px';
        }
        
        me.container = containerParent;
        me.svgContainer = svgContainer;
        
        me.targetElement.appendChild(containerParent);
        
        let x = config.x,
            y = config.y;
        if (x === null || x === undefined) {
            x = (rect.left - parentRect.left + window.scrollX);
        }

        if (y === null || y === undefined) {
            y = (rect.top - /*parentRect.top + */window.scrollY);
        }

        containerParent.style.top = y + 'px';
        containerParent.style.left = x + 'px';
        containerParent.style.width = w + 'px';
        containerParent.style.height = h + 'px';
        
        me.defs = d.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let mainPattern = d.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        
        mainPattern.setAttribute('width', w);
        mainPattern.setAttribute('height', h);
        mainPattern.setAttribute('patternUnits', 'userSpaceOnUse');
        
        let patternID = me.config.annotatorIdx;
        svgContainer.id = 'easyAnnotatorSVGContainer' + patternID;
        mainPattern.setAttribute('id', 'mainFillPattern' + patternID);
        mainPattern.innerHTML = '<image preserveAspectRatio="none" width="' + w + '" height="' + h + '" xlink:href="' + 
                    me.imageElement.src + '"/>';
        
        me.defs.appendChild(mainPattern);
        svgContainer.appendChild(me.defs);
        
        me.imagePattern = mainPattern;
        
        let mainRect = d.createElementNS('http://www.w3.org/2000/svg', 'rect');
        mainRect.setAttribute('width', '100%');
        mainRect.setAttribute('height', '100%');
        mainRect.setAttribute('fill', 'url(#mainFillPattern' + patternID + ')');
//        this.rectSVGElement.setAttribute('href', this.imageElement.src);
        svgContainer.appendChild(mainRect);
        me.rectSVGElement = mainRect;
        
        me.initGradients(containerElement);
        
        window.addEventListener('resize', me.onResize);
        
        if (me.isImageElement) {
            let hideImageElement = me.config.hideElement;
            if (hideImageElement || hideImageElement === undefined) {
//                hide existing image element
                me.imageElement.style.visibility = 'hidden';
            }
        }

        Utils.on(document, ['click', 'touchstart'], this.docPress);
    }

    private docPress = (evt: MouseEvent | TouchEvent) => {
        let finalEvent = Utils.getEvent(evt);
        if (finalEvent) {
            let target = finalEvent.target,
                container = this.container,
                ui = this.config.ui;
            while (target) {
                if (target == container) {
                    return;
                }
                if (target instanceof Element) {
                    let cls = target.classList;
                    if (cls.contains(ui + '-dialog') ||
                        cls.contains(ui + '-toolbar') ||
                        cls.contains(ui + '-toolbar-item') ||
                        cls.contains('ea-color-picker')) {
                        return;
                    }
                    target = (target as Element).parentElement;
                } else {
                    return;
                }
            }
        }

        this.deselectAll();
    }

    private onResize = (evt: UIEvent) => {
        this.doLayout();
    }

    private initGradients(containerElement: HTMLElement) {
        let gradientSVGContainer = <Element>document.getElementById('easyAnnotationGradientSVG');
        if (!gradientSVGContainer) {
            gradientSVGContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            gradientSVGContainer.setAttribute('id', 'easyAnnotationGradientSVG');
            gradientSVGContainer.setAttribute('style', 'width:0;height:0;position:absolute;');
            gradientSVGContainer.setAttribute('aria-hidden', 'true');
            gradientSVGContainer.setAttribute('focusable', 'false');
            gradientSVGContainer.innerHTML = 
                '<linearGradient class="default-btn-gradient ' + this.config.ui + '" id="easyAnnotatorBtnGradient" x2="1" y2="1">\
                    <stop offset="0%" stop-color="var(--color-stop-1)" />\
                    <stop offset="50%" stop-color="var(--color-stop-2)" />\
                    <stop offset="100%" stop-color="var(--color-stop-3)" />\
                </linearGradient>';
            containerElement.appendChild(gradientSVGContainer);
        }
    }
    
    private addListeners() {
        let svgContainer = this.svgContainer;

        if (Utils.isMobileDevice()) {
            svgContainer.addEventListener('touchstart', this.onTouchStart);
            svgContainer.addEventListener('touchmove', this.onTouchMove);
            svgContainer.addEventListener('touchend', this.onMouseUp);
        } else {
            svgContainer.addEventListener('mousedown', this.onMouseDown);
            svgContainer.addEventListener('mousemove', this.onMouseMove);
            svgContainer.addEventListener('mouseup', this.onMouseUp);
        }

    }
    
    startDrag(x: number, y: number) {
        let me = this;
        me.startX = x;
        me.startY = y;
        me.isDragging = true;
        // console.log('start drag, x=', x);
    }

    private onTouchMove = (evt: TouchEvent) => {
        if (evt.touches.length) {
            this.onMouseMove(evt.touches[0]);
        }
    }
    
    private onMouseMove = (evt: MouseEvent | Touch) => {
        let isTouchEvent = window.Touch && (evt instanceof Touch);
        if (isTouchEvent || ((evt instanceof MouseEvent) && (evt.buttons) & 1) > 0) {
            let me = this,
                selectedItems = me.selectedItems,
                dx = evt.screenX - me.startX,
                dy = evt.screenY - me.startY;

            // console.log('!!!!!!move, dx=', dx);

            if (me.isDragging && selectedItems.length) {
                for (let item of me.selectedItems) {
                    item.moveBy(dx, dy, evt);
                }
            } else if (!me.pushedAnnotator) {
                let selectRect = me.selectRect,
                    selectBounds = me.selectPos,
                    svgBounds = me.svgContainer.getBoundingClientRect(),
                    rectX, rectY, rectWidth, rectHeight;
                dx = evt.clientX - svgBounds.left - selectBounds.x;
                dy = evt.clientY - svgBounds.top - selectBounds.y;
                
                if (dx < 0) {
                    rectX = selectBounds.x + dx;
                    rectWidth = (-1 * dx);
                    selectRect.setAttribute('x', rectX.toString());
                    selectRect.setAttribute('width', rectWidth.toString());
                } else {
                    rectX = selectRect.x.baseVal.value;
                    rectWidth = dx;
                    selectRect.setAttribute('width', dx.toString());
                }
                
                if (dy < 0) {
                    rectY = selectBounds.y + dy;
                    rectHeight = -1 * dy;
                    selectRect.setAttribute('y', rectY.toString());
                    selectRect.setAttribute('height', rectHeight.toString());
                } else {
                    rectY = selectRect.y.baseVal.value;
                    rectHeight = dy;
                    selectRect.setAttribute('height', dy.toString());
                }
                
                selectedItems.length = 0;
                for (let item of me.annotators) {
                    if (item.intersects(rectX, rectY, rectWidth, rectHeight)) {
                        item.setSelected(true);
                        selectedItems.push(item);
                    } else {
                        item.setSelected(false);
                    }
                }
                
                if (me.propertiesToolbar) {
                    me.propertiesToolbar.setSelectedItems(selectedItems);
                }
                
            }
        }
    }

    private onTouchStart = (evt: TouchEvent) => {
        if (evt.touches.length) {
            this.onMouseDown(evt.touches[0]);
        }
    }
    
    private onMouseDown = (evt: MouseEvent | Touch) => {
        let me = this,
            selectBounds = me.selectPos,
            selectRect = me.selectRect,
            svgBounds = me.svgContainer.getBoundingClientRect(),
            atLeastOneIntersection = false,
            clientX = evt.clientX - svgBounds.left,
            clientY = evt.clientY - svgBounds.top;

        selectBounds.x = clientX;
        selectBounds.y = clientY;
        
        me.selectedItems.length = 0;
        for (let item of me.annotators) {
            if (item.containsPoint(clientX, clientY)) {
                item.setSelected(true);
                atLeastOneIntersection = true;
                me.selectedItems.push(item);
            } else {
                item.setSelected(false);
            }
        }
        
        if (me.propertiesToolbar) {
            me.propertiesToolbar.setSelectedItems(me.selectedItems);
        }
        
        if (!atLeastOneIntersection && !me.pushedAnnotator) {
            selectRect.setAttribute('x', selectBounds.x.toString());
            selectRect.setAttribute('y', selectBounds.y.toString());
            selectRect.setAttribute('width', '0');
            selectRect.setAttribute('height', '0');
            me.svgContainer.appendChild(me.selectRect);
        }
        
        if (atLeastOneIntersection) {
            me.startDrag(evt.screenX, evt.screenY);
        }
        me.deselectAll();
    }

    private onMouseUp = (evt: MouseEvent) => {
        let me = this;
        me.isDragging = false;
        if (me.selectRect.parentNode) {
            me.svgContainer.removeChild(me.selectRect);
        }
        for (let item of me.selectedItems) {
            item.processMouseUp();
        }
    }
    
    private doLayout() {
        let me = this,
            containerRect = me.isImageElement ? me.imageElement.getBoundingClientRect() : me.container.getBoundingClientRect(),
            buttonsToolbarWidth = 0,
            propertiesToolbarWidth = 0,
            numToolbarButtons = 0,
            numPropsButtons = 0,
            winScrollX = window.scrollX,
            winScrollY = window.scrollY,
            toolbarTop = containerRect.top/* - containerParentRect.top*/ + winScrollY,
            toolbarLeft = containerRect.left + winScrollX,
            useShadows = !!document.body.attachShadow,
            toolbarHeight = 0,
            targetRect = me.targetElement.getBoundingClientRect(),
            placeOnBody = me.targetElement == document.body;

        if (!placeOnBody) {
            toolbarTop -= (targetRect.top + winScrollY);
            toolbarLeft -= (targetRect.left + winScrollX);
        }
        
        if (me.toolbar) {
            numToolbarButtons = me.toolbar.getContainer().childNodes.length;
        }
        
        if (me.propertiesToolbar) {
            numPropsButtons = me.propertiesToolbar.getContainer().childNodes.length;
            let propToolbarContainer = me.propertiesToolbar.getContainer(),
            toolbarRect = propToolbarContainer.getBoundingClientRect();
            toolbarHeight = toolbarRect.height;
            if (!useShadows) {
                propToolbarContainer.style.top = (toolbarTop - toolbarRect.height) + 'px';
            }
            propToolbarContainer.style.left = useShadows ? '0' : toolbarLeft + 'px';
        }

        let maxWidth = me.width - 20,
            buttonWidth = maxWidth / (numToolbarButtons + numPropsButtons);
        
        buttonWidth = Math.min(30, Math.max(24, buttonWidth));
        buttonsToolbarWidth = numToolbarButtons * buttonWidth;
        propertiesToolbarWidth = numPropsButtons * buttonWidth;

        if (buttonsToolbarWidth > 0) {
            
            let maxButtonsWidth = maxWidth - propertiesToolbarWidth;
            if (buttonsToolbarWidth > maxButtonsWidth) {
                buttonsToolbarWidth = maxButtonsWidth;
            }
            
            let toolbarContainer = me.toolbar.getContainer();
            toolbarContainer.style.width = buttonsToolbarWidth + 'px';
            
            let toolbarRect = toolbarContainer.getBoundingClientRect();
            if (toolbarHeight == 0) {
                toolbarHeight = toolbarRect.height;
            }

            if (!useShadows) {
                toolbarContainer.style.top = (toolbarTop - toolbarRect.height) + 'px';
                toolbarContainer.style.left = ((containerRect.right - (placeOnBody ? 0 : targetRect.left)) - toolbarRect.width) + 'px';
            } else {
                toolbarContainer.style.left = (1 + containerRect.width - toolbarRect.width) + 'px';
            }

            me.toolbar.doLayout();
            
            let firstToolbarItem = toolbarContainer.firstChild,
                percWidth = 100 / toolbarContainer.childNodes.length;
            while (firstToolbarItem) {
                (firstToolbarItem as HTMLElement).style.width = percWidth + '%';
                firstToolbarItem = firstToolbarItem.nextSibling;
            }
        }
        
        if (propertiesToolbarWidth > 0) {
            let propToolbarContainer = me.propertiesToolbar.getContainer();
			propToolbarContainer.style.width = propertiesToolbarWidth + 'px';
            
            let firstToolbarItem = propToolbarContainer.firstChild,
                percWidth,
                numPropItems = 0;
            while (firstToolbarItem) {
                if ((firstToolbarItem as HTMLElement).className.indexOf('-toolbar-item') > 0) {
                    numPropItems++;
                }
                firstToolbarItem = firstToolbarItem.nextSibling;
            }
            
            percWidth = 100 / numPropItems;
            firstToolbarItem = propToolbarContainer.firstChild;
            while (firstToolbarItem) {
                if ((firstToolbarItem as HTMLElement).className.indexOf('-toolbar-item') > 0) {
                    (firstToolbarItem as HTMLElement).style.width = percWidth + '%';
                }
                firstToolbarItem = firstToolbarItem.nextSibling;
            }
        }
        
        me.container.style.top = toolbarTop + 'px';
        me.container.style.left = toolbarLeft + 'px';
    }
    
    private initToolbar() {
        let me = this,
            config = me.config,
            showToolbar = config.showToolbar,
            showProperties = config.showProperties,
            toolbarItems = config.toolbarItems;
        
        if (showToolbar) {
            if (toolbarItems === null || toolbarItems === undefined) {
                toolbarItems = [
                    {
                        itemId: 'delete',
                        iconSVG: EraseIcon,
                        title: 'Delete selected or all elements'
                    },
                    new TextToolbarItem(),
                    new LineToolbarItem(),
                    new ArrowToolbarItem(),
                    new EllipseToolbarItem(),
                    new RectToolbarItem(),
                    new CalloutToolbarItem(),
                    new ImageToolbarItem(),
                    new BlurToolbarItem(),
                    new FreeDrawToolbarItem(me.config),
                    {
                        itemId: 'save',
                        iconSVG: SaveIcon,
                        title: 'Save changes and close annotator'
                    }];
                if (config.showClose === true) {
                    toolbarItems.push({
                        itemId: 'close',
                        iconSVG: CloseIcon,
                        title: 'Close Annotator'
                    });
                }
            } else {
                let haveClose = false;
                for(let i in toolbarItems) {
                    let item = toolbarItems[i];
                    let xtype = item.xtype;
                    if (xtype) {
                        switch (xtype) {
                            case 'delete':
                                toolbarItems[i].itemId = 'delete';
                                if (!item.iconSVG) item.iconSVG = EraseIcon;
                                break;
                            case 'text':
                                toolbarItems[i] = new TextToolbarItem();
                                break;
                            case 'line':
                                toolbarItems[i] = new LineToolbarItem();
                                break;
                            case 'arrow':
                                toolbarItems[i] = new ArrowToolbarItem();
                                break;
                            case 'ellipse':
                                toolbarItems[i] = new EllipseToolbarItem();
                                break;
                            case 'rect':
                                toolbarItems[i] = new RectToolbarItem();
                                break;
                            case 'callout':
                                toolbarItems[i] = new CalloutToolbarItem();
                                break;
                            case 'image':
                                toolbarItems[i] = new ImageToolbarItem();
                                break;
                            case 'blur':
                                toolbarItems[i] = new BlurToolbarItem();
                                break;
                            case 'free-draw':
                                toolbarItems[i] = new FreeDrawToolbarItem(me.config);
                                break;
                            case 'polygon':
                                toolbarItems[i] = new PolygonToolbarItem(me.config);
                                break;
                            case 'save':
                                if (!item.iconSVG) {
                                    item.iconSVG = SaveIcon;
                                }
                                break;
                            case 'close':
                                haveClose = true;
                                if (!item.iconSVG) {
                                    item.iconSVG = CloseIcon;
                                }
                                break;
                        }
                    }
                }

                if (config.showClose === true && !haveClose) {
                    toolbarItems.push({
                        itemId: 'close',
                        iconSVG: CloseIcon,
                        title: 'Close Annotator'
                    });
                }

            }
            me.toolbar = new Toolbar(me.config, toolbarItems, me.toolbarItemClickHandler, me);
        }
        
        if (showProperties) {
            let propertiesToolbar = new PropertiesToolbar(me.config, [
                new DrawToolbarItem(),
                new FillToolbarItem(),
                new FontToolbarItem(),
                new BlurPropsToolbarItem()
            ],
                me);
            propertiesToolbar.setSelectedItems(me.selectedItems);
            me.propertiesToolbar = propertiesToolbar;
        }
        
        me.doLayout();
            
    }
    
    private toolbarItemClickHandler(evt: MouseEvent, item: ToolbarItem) {
        let me = this;
        me.toolbar.deselectAll(item);
        if (item instanceof AbstractToolbarItem) {
            let abstractToolbarItem = item as AbstractToolbarItem;
            let newAnnotator = abstractToolbarItem.createAnnotator(me.config, me);
            if (newAnnotator == null) {
                me.pushedAnnotator = null;
                me.disableListeners(false);
                return;
            }
            
            newAnnotator.moveBy(
                (me.width - newAnnotator.getWidth()) / 2, 
                (me.height - newAnnotator.getHeight()) / 2, null);

            let drawStyle = this.config.drawStyles ? (this.config.drawStyles as any)[newAnnotator.getType()] : null;
            if (!drawStyle) {
                drawStyle = this.drawStyle;
            }

            let fillStyle = this.config.fillStyles ? (this.config.fillStyles as any)[newAnnotator.getType()] : null;
            if (!fillStyle) {
                fillStyle = this.fillStyle;
            }

            me._addElement(newAnnotator, drawStyle, fillStyle);
            me.deselectAll();
            newAnnotator.setSelected(true);
            me.selectedItems.push(newAnnotator);
            me.propertiesToolbar.setSelectedItems(me.selectedItems);
            
            let btnPushed = !!me.pushedAnnotator;
            if (abstractToolbarItem instanceof AbstractToolbarPushItem) {
                me.pushedAnnotator = newAnnotator as BaseStopableAnnotator;
            } else {
                if (me.pushedAnnotator) {
                    me.pushedAnnotator.stop();
                    me.pushedAnnotator = null;
                }
            }
            if (btnPushed != !!me.pushedAnnotator) {
                if (me.pushedAnnotator != null && me.pushedAnnotator.isDisableListeners()) {
                    me.disableListeners(true);
                } else {
                    me.disableListeners(false);
                }
            }
        } else {
            me.disableListeners(false);
            if (me.pushedAnnotator) {
                me.pushedAnnotator.stop();
                me.pushedAnnotator = null;
            }

            let itemId = item.itemId;
            if (itemId === undefined) {
                itemId = item.xtype;
            }
            switch (itemId) {
                case 'delete':
                    me.deleteSelection();
                    break;
                case 'close':
                    me.close();
                    break;
                case 'save':
                    me.save(function(data) {
                        if (me.completeCallback) {
                            me.completeCallback(data);
                        }
                    }, me.exportType);
                    break;
            }
        }
    }
    
    private disableListeners(disabled: boolean) {
        for(let annotator of this.annotators) {
            annotator.getElement().style.pointerEvents = disabled ? 'none' : 'auto';
        }
    }
    
    private _addElement(newAnnotator: BaseAnnotator, drawStyle?: DrawStyle, fillStyle?: FillStyle) {
        let me = this;
        
        newAnnotator.onSelectHandler = me.itemSelected;
        if (newAnnotator.isOnTop()) {
//            append annotator on top
            let nodeInserted = false;
            for(let annotator of me.annotators) {
                if (!annotator.isOnTop()) {
                    me.svgContainer.insertBefore(newAnnotator.getElement(), annotator.getElement());
                    nodeInserted = true;
                    break;
                }
            }
            if (!nodeInserted) {
                me.svgContainer.appendChild(newAnnotator.getElement());
            }
        } else {
            me.svgContainer.appendChild(newAnnotator.getElement());
        }
        if (drawStyle) {
            newAnnotator.setDrawStyle(drawStyle);
        }
        
        if (fillStyle) {
            newAnnotator.setFillStyle(fillStyle);
        }
        
        if (newAnnotator instanceof TextAnnotator) {
            (newAnnotator as TextAnnotator).setFont(me.config.font);
        }

        if (newAnnotator instanceof BlurAnnotator && me.config.blurStyle) {
            //only radius supported for now
            if (me.config.blurStyle.radius !== undefined) {
                //blur radius is between 0 (no blur) and 100
                //blurring radius set to container should be between 0 and 200 / 15
                let blurRadius = me.config.blurStyle.radius;
                if (!isNaN(blurRadius) && blurRadius >= 0 && blurRadius <= 100) {
                    (newAnnotator as BlurAnnotator).setBlur((blurRadius * 2) / 15);
                }
            }
        }
        
        me.annotators.push(newAnnotator);

    }
    
    public addElement(newAnnotator: BaseAnnotator) {
        this._addElement(newAnnotator);
    }
    
    private itemSelected = (element: BaseAnnotator) => {
        let me = this;
        me.deselectAll();
        me.selectedItems.push(element);
        element.setSelected(true);
        me.propertiesToolbar.setSelectedItems(me.selectedItems);
    }
    
    public selectAll() {
        this.selectedItems.length = 0;
        for(let i in this.annotators) {
            let annotator = this.annotators[i];
            annotator.setSelected(true);
            this.selectedItems.push(annotator);
        }
        this.propertiesToolbar.setSelectedItems(this.selectedItems);
    }
    
    public deselectAll() {
        let selItems = this.selectedItems;
        for(let selItem of selItems) {
            selItem.setSelected(false);
        }
        selItems.length = 0;
        this.propertiesToolbar.setSelectedItems(selItems);
    }
    
    private deleteSelection() {
        let me = this,
            allItems = me.annotators,
            newItems = [],
            selectedItems = me.selectedItems,
            item,
            svgContainer = me.svgContainer;
        
        if (me.selectedItems.length == 0) {
            me.clear();
        } else {
            
            for (item of allItems) {
                if (selectedItems.indexOf(item) >= 0) {
                    item.clean();
                    svgContainer.removeChild(item.getElement());
                } else {
                    newItems.push(item);
                }
            }

            me.annotators = newItems;
            me.selectedItems.length = 0;
            me.propertiesToolbar.setSelectedItems(me.selectedItems);
        }
    }
    
    public clear() {
        let me = this,
            svgContainer = me.svgContainer;
            
        me.selectedItems.length = 0;
        me.annotators.length = 0;
        let children = svgContainer.children, l = children.length, i,
            child, mainImageElement = me.rectSVGElement,
            defs = me.defs;
        for (i=l-1;i>=0;i--) {
            child = children[i];
            if (child != mainImageElement && child != defs) {
                svgContainer.removeChild(child);
            }
        }
        
        let lastDefs = defs.lastChild,
            imagePattern = me.imagePattern;
        while (lastDefs && lastDefs != imagePattern) {
            defs.removeChild(lastDefs);
            lastDefs = defs.lastChild;
        }
    }
    
    public close() {
        this.targetElement.removeChild(this.container);
        if (this.isImageElement) {
            this.imageElement.style.visibility = 'visible';
        }

        window.removeEventListener('resize', this.onResize);

        if (this.toolbar) {
            let container = this.toolbar.getContainer();
            container.parentElement?.removeChild(container);
        }

        if (this.propertiesToolbar) {
            let container = this.propertiesToolbar.getContainer();
            container.parentElement?.removeChild(container);
        }
    }
    
    public save(callback: (data: string) => void, exportType? : ExportType): void {
        this.deselectAll();
        if (exportType === undefined) {
            exportType = ExportType.IMAGE;
        }
        
        switch (exportType) {
            case ExportType.XML:
                let xml = this.saveAsXML();
                callback(xml);
                break;
            case ExportType.JSON:
                callback(this.saveAsJSON());
                break;
            case ExportType.SVG:
                callback(this.saveAsSVG());
                break;
            default:
                this.saveAsPNG(callback);
        }
        
    }
    
    public loadXML(xml: string) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(xml, 'text/xml'),
            mainElement = doc.getElementsByTagName('main');
            
        if (!mainElement) {
            throw 'Invalid XML!';
        }
        
        let firstNode = mainElement[0] as Node;
        let firstChild = firstNode.firstChild,
            me = this,
            constrParams = [me.config, me];
        
        while (firstChild) {
            let newAnnotator = ClassManager.create(firstChild.nodeName, constrParams) as BaseAnnotator;
            newAnnotator.fromXML(firstChild as Element);
            newAnnotator.setSelected(false);
            me._addElement(newAnnotator, null, null);
            if (newAnnotator instanceof BaseStopableAnnotator) {
                (newAnnotator as BaseStopableAnnotator).stop();
            }
            firstChild = firstChild.nextSibling;
        }
    }
    
    private doLoadJSON(jsonObj: any) {
        let me = this,
            data = jsonObj.data as Array<any>,
            constrParams = [me.config, me];
        if (data) {
            for(let annotator of data) {
                if (annotator.xtype) {
                    let newAnnotator = ClassManager.create(annotator.xtype, constrParams) as BaseAnnotator;
                    newAnnotator.fromJSON(annotator);
                    newAnnotator.setSelected(false);
                    me._addElement(newAnnotator, null, null);
                    if (newAnnotator instanceof BaseStopableAnnotator) {
                        (newAnnotator as BaseStopableAnnotator).stop();
                    }
                }
            }
        }

    }
    
    public loadJSON(json: string) {
        let jsonObj = JSON.parse(json) as any,
            me = this,
            checkLoaded = function() {
                if (!me.imgLoaded) {
                    window.setTimeout(checkLoaded, 500);
                } else {
                    me.doLoadJSON(jsonObj);
                }
            };
        if (jsonObj && jsonObj.v) {
            checkLoaded();
        } else {
            throw 'Invalid JSON Object!';
        }
    }

    /**
     * Export data in XML format.
     */
    public saveAsXML() : string {
        let xmlDoc = document.implementation.createDocument(null, 'ea', null),
            mainElement = xmlDoc.createElementNS(null, 'main');
        
        xmlDoc.documentElement.appendChild(mainElement);
        mainElement.setAttribute('v', '1.0');
            
        for (let annotator of this.annotators) {
            let xmlElement = annotator.toXML();
            if (xmlElement) {
                mainElement.appendChild(xmlElement);
            }
        }
        
        let serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }

    /**
     * Export data in JSON format.
     */
    public saveAsJSON() : string {
        
        let data = [];
        for (let annotator of this.annotators) {
            let jsonObj = annotator.toJSON();
            data.push(jsonObj);
        }
         
        let jsonObj = {
            v: '1.0',
            data: data
        };
        
        return JSON.stringify(jsonObj);
    }
    
    private saveAsPNG(callback: (imageData: string) => void) {
        Utils.exportToPNG(this.imageElement, this.svgContainer, this.config.useCrossOrigin, callback);
    }
    
    private saveAsSVG() {
        return this.svgContainer.outerHTML;
    }
    
    public getSVGContainer() : SVGSVGElement {
        return this.svgContainer;
    }
    
    public getSelectedItems() {
        return this.selectedItems;
    }

    private addStyleElement() {
        let elemID = 'easyAnnotationStyleElem_7689678';
        if (document.querySelector('#' + elemID)) {
            return;
        }
        let styleElement = document.createElement('style');
        styleElement.id = elemID;
        styleElement.type = 'text/css';
        styleElement.textContent =
            `easy-annotation {
                position: absolute;
                display: block;
            }`;

        document.head.appendChild(styleElement);
    }
}
