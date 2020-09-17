
import {RectAnnotator} from "./RectAnnotator"
import InternalConfig from "../utils/InternalConfig"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {Font} from "../model/Font"
import FillStyle from "../model/Styles"
import DrawStyle from "../model/Styles"
import {Constants} from "../utils/Constants"

import {ClassManager} from "../utils/ClassManager"

import AcceptIcon from "../icons/accept.svg"
import CloseIcon from "../icons/close.svg"

export class TextAnnotator extends RectAnnotator {
    
    public static readonly xtype: string = "text";
    
    private foreignObject: SVGForeignObjectElement;
    
    private editorTextArea: HTMLTextAreaElement;
    
    private currentText: string = "Text";
    
    private selectedRect: SVGRectElement;
    
    private lastTouchTime: number = 0;
    
    readonly INITIAL_HEIGHT = 40;
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        
        this.width = 80;
        this.height = this.INITIAL_HEIGHT;
        this.x = 0;
        this.y = 0;
        this.createText(config);
        this.properties = [Constants.FILL_PROPERTY, Constants.FONT_PROPERTY];
    }
    
    protected initElement(config: InternalConfig) {
        let selectedRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        selectedRect.classList.add(config.ui + '-text-sel-rect');
        this.svgGroupElement.appendChild(selectedRect);
        this.selectedRect = selectedRect;
    }
    
    private createText(config: InternalConfig) {
        let me = this;
//        
        let textSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textSVG.classList.add(config.ui + '-svg-text-element');
//        textSVG.style.cursor = 'default';
        textSVG.addEventListener('dblclick', me.onTextClick);
        textSVG.addEventListener('touchstart', me.onTouchStart);
        
        me.svgGroupElement.appendChild(textSVG);
        
        me.baseSVGElement = textSVG;
        window.setTimeout(function() {
            me.setText(me.currentText);
        }, 100);
    }

    public setSelected(selected: boolean) {
        super.setSelected(selected);
        this.selectedRect.style.display = selected ? 'block' : 'none';
    }
    
    protected onTouchStart = (evt: TouchEvent) => {
        let timeStamp = evt.timeStamp,
            me = this;
        if (timeStamp - me.lastTouchTime < 600) {
            this.addEditor();
        } else {
            me.lastTouchTime = timeStamp;
        }
        evt.preventDefault();
    }
    
    private onTextClick = (evt: MouseEvent) => {
        this.addEditor();
    }
    
    private addEditor() {
        let me = this,
            editorTextArea = me.editorTextArea,
            foreignObject = me.foreignObject;
        let svgContainer = me.svgGroupElement.parentElement;
        while (svgContainer.nodeName.toLowerCase() != 'svg') {
            svgContainer = svgContainer.parentElement;
        }

        if (!foreignObject) {
            let d = document;
            foreignObject = d.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
            editorTextArea = d.createElement("textarea");

            foreignObject.appendChild(editorTextArea);
            svgContainer.appendChild(foreignObject);
            me.editorTextArea = editorTextArea;
            me.foreignObject = foreignObject;
            
            let buttonsContainer = d.createElement('div'),
                okButton = d.createElement('div'),
                cancelButton = d.createElement('div');
            buttonsContainer.classList.add(me.config.ui + '-text-ann-btn-container');
            buttonsContainer.appendChild(cancelButton);
            buttonsContainer.appendChild(okButton);
            
            okButton.addEventListener('click', me.saveEditText);
            okButton.innerHTML = AcceptIcon;
            cancelButton.addEventListener('click', me.hideEditor);
            cancelButton.innerHTML = CloseIcon;
            
            foreignObject.appendChild(buttonsContainer);
        } else if (!foreignObject.parentElement) {
            svgContainer.appendChild(foreignObject);
        }
        
        editorTextArea.innerHTML = this.currentText;
        
        let box = svgContainer.getBoundingClientRect(),
            w = box.width.toString();
        foreignObject.setAttribute('width', w);
        foreignObject.setAttribute('height', box.height.toString());
        editorTextArea.style.width = w + 'px';
        editorTextArea.style.height = (box.height - 40) + 'px';
        foreignObject.style.display = 'block';
        
        editorTextArea.focus();
        editorTextArea.select();
    }
    
    private saveEditText = () => {
        let me = this;
        me.currentText = me.editorTextArea.value;
        me.setText(me.currentText);
        me.hideEditor();
    }
    
    private hideEditor = () => {
        this.foreignObject.parentElement.removeChild(this.foreignObject);
    }
    
    public setFillStyle(fillStyle: FillStyle) {
        super.setFillStyle(fillStyle);
        this.baseSVGElement.childNodes.forEach(function(ch) {
            (ch as SVGTSpanElement).style.fill = fillStyle.color;
        });
    }
    
    public setText(text: string) {
        let textRows = text.split(/\n/), n = textRows.length, i,
            textSVGElement = this.baseSVGElement;
            
        while (textSVGElement.lastChild) {
            textSVGElement.removeChild(textSVGElement.lastChild);
        }
        for(i=0;i<n;i++) {
            let textSpanElement = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            textSpanElement.setAttribute('x', '0');
//            dy will make sure next span is positioned on a new line
            textSpanElement.setAttribute('dy', '1.2em');
            textSpanElement.style.fill = this.fillStyle.color;
            textSpanElement.innerHTML = textRows[i];
            textSVGElement.appendChild(textSpanElement);
        }

        this.setSelRectSize();
    }

    private setSelRectSize() {
        let boundRect = this.baseSVGElement.getBBox(),
            selectedRect = this.selectedRect;
        selectedRect.setAttribute('x', boundRect.x.toString());
        selectedRect.setAttribute('y', boundRect.y.toString());
        selectedRect.setAttribute('width', boundRect.width.toString());
        selectedRect.setAttribute('height', boundRect.height.toString());
    }
    
    public setDrawStyle(drawStyle: DrawStyle) {
        
    }
    
    public setStrokeWidth(width: number) {
        
    }
    
    public setFont(font: Font) {
        let textElement = this.baseSVGElement;
        textElement.style.fontFamily = font.name;
        textElement.style.fontSize = font.size + 'px';
        textElement.style.fontStyle = font.italic ? 'italic' : 'normal';
        textElement.style.fontWeight = font.bold ? 'bold' : 'normal';
        this.setSelRectSize();
    }
    
    public toXML(): Element {
        let elem = document.createElementNS(null, TextAnnotator.xtype),
            me = this;

        me._toXML(elem);
        elem.setAttribute('t', me.currentText);
        let textElementStyle = me.baseSVGElement.style;
        elem.setAttribute('fn', textElementStyle.fontFamily);
        elem.setAttribute('fs', parseInt(textElementStyle.fontSize, 10) + '');
        elem.setAttribute('fi', textElementStyle.fontStyle == 'italic' ? '1' : '0');
        elem.setAttribute('fb', textElementStyle.fontWeight == 'bold' ? '1' : '0');
        
        return elem;
    }
    
    public fromXML(element: Element) {
        let me = this;
        me.width = me.getXMLNumber(element, 'w');
        me.height = me.getXMLNumber(element, 'h');
        
        me.currentText = element.getAttribute('t') || 'Text';
        
        me.loadXMLDraw(element);
        me.loadXMLFill(element);
        let fontSize = parseInt(element.getAttribute('fs'), 10);
        if (isNaN(fontSize)) {
            fontSize = 24;
        }
        let font = {
            name: element.getAttribute('fn') || 'Arial',
            italic: element.getAttribute('fi') === '1',
            bold: element.getAttribute('fb') === '1',
            size: fontSize
        } as Font;

        setTimeout(function () {
            me.setFont(font);
        }, 50);

        super.moveBy(me.getXMLNumber(element, 'x'), me.getXMLNumber(element, 'y'), null);
        
    }
    
    public toJSON() : Object {
        let me = this,
            result = super.toJSON() as any;

        result.xtype = TextAnnotator.xtype;
        delete result.w;
        delete result.h;
        result.t = me.currentText;

        let textElementStyle = me.baseSVGElement.style;
        result.fn = textElementStyle.fontFamily;
        result.fs = parseInt(textElementStyle.fontSize, 10);
        result.fi = textElementStyle.fontStyle == 'italic' ? 1 : 0;
        result.fb = textElementStyle.fontWeight == 'bold' ? 1 : 0;
        return result;
    }
    
    public fromJSON(obj: any) {
        let me = this;
        me.x = 0;
        me.y = 0;

        if (obj.w) {
            me.width = obj.w;
        }
        if (obj.h) {
            me.height = obj.h;
        }

        me.loadJSONDraw(obj);
        me.loadJSONFill(obj);
        if (obj.t) {
            me.currentText = obj.t;
        }
        if (obj.fn) {
            let font = {
                name: obj.fn || 'Arial',
                italic: !! obj.fi,
                bold: !! obj.fb,
                size: obj.fs || 24
            } as Font;

            setTimeout(function () {
                me.setFont(font);
            }, 50);
            
        }
        super.moveBy(obj.x, obj.y, null);
    }
    
    public clean() {
        let me = this;
        if (me.foreignObject) {
            let svgContainer = me.svgGroupElement.parentElement;
            while (svgContainer.nodeName.toLowerCase() != 'svg') {
                svgContainer = svgContainer.parentElement;
            }
            
            svgContainer.removeChild(me.foreignObject);
        }
    }
    
}

ClassManager.register(TextAnnotator.xtype, TextAnnotator);