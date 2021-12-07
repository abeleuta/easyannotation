import {AnnotatorContainer} from "../AnnotatorContainer"
import InternalConfig from "../utils/InternalConfig"
import {RectAnnotator} from "./RectAnnotator"
import {Constants} from "../utils/Constants"
import {ClassManager} from "../utils/ClassManager"

export class ImageAnnotator extends RectAnnotator {
    
    public static readonly xtype: string = "image";
    
    private uploadInput: HTMLInputElement;
    
    private foreignObject: SVGForeignObjectElement;
    
    private imageSVGElement: SVGImageElement;
    
    private blur: string = '0';
    
    private opacity: string = '1';
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        this.properties = [Constants.BLUR_PROPERTY];
        this.attachUploadInput();
    }
    
    private attachUploadInput() {
        let uploadInput = document.createElement('input'),
            foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject"),
            me = this;
//        foreignObject.innerHTML = '<div class="image-uploader-text">Click or drag image here</div>';
        foreignObject.innerHTML = 
            '<div style="height: 100%;display:flex;position:absolute;width:100%;">\
                <svg style="width:100%;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175 35">\
                    <text style="fill:black;" dy="1.5em">Click here or drag image</text>\
                </svg></div>';
        foreignObject.appendChild(uploadInput);
        uploadInput.setAttribute('type', 'file');
        
        uploadInput.className = 'image-uploader';
        me.svgGroupElement.style.fill = 'transparent';
        me.svgGroupElement.appendChild(foreignObject);
        foreignObject.setAttribute('width', me.width.toString());
        foreignObject.setAttribute('height', me.height.toString());
        
        foreignObject.addEventListener('change', me.onFileUpload);
        
        me.foreignObject = foreignObject;
        me.uploadInput = uploadInput;
    }
    
    private onFileUpload = (evt: Event) => {
        let reader  = new FileReader(),
            me = this;
        
        if (!me.uploadInput.files.length) {
            return;
        }
        
        me.createImageElement();
        
        let imageElement = me.imageSVGElement;
        
        let firstFile = me.uploadInput.files[0];
        if (firstFile.name) {
            let name = firstFile.name;
            if (!name.match(/.png$|.jpg$|.jpeg$|.gif$|.bmp$/i)) {
                me.baseSVGElement.classList.add('shake');
                window.setTimeout(function(){
                    me.baseSVGElement.classList.remove('shake');
                }, 1500);
                return false;
            }
        }
            
        reader.onloadend = function () {
            imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', reader.result.toString());
        }

        me.svgGroupElement.style.zIndex = '0';

        reader.readAsDataURL(firstFile);
                    
        let svgGroupElement = me.svgGroupElement;
        svgGroupElement.removeChild(me.foreignObject);
        svgGroupElement.insertBefore(imageElement, me.baseSVGElement);
        me.foreignObject = null;
    }
    
    private createImageElement() {
        let imageElement = document.createElementNS("http://www.w3.org/2000/svg", "image"),
            me = this;
        
        imageElement.setAttribute('x', me.x.toString());
        imageElement.setAttribute('y', me.y.toString());
        imageElement.setAttribute('width', me.width.toString());
        imageElement.setAttribute('height', me.height.toString());
        
        imageElement.setAttribute('draggable', 'false');
                    
        me.imageSVGElement = imageElement;

    }
    
    protected arrangeResizeElements() {
        super.arrangeResizeElements();
        
        let me = this,
            foreignObject = me.foreignObject,
            imageElement = me.imageSVGElement;
        if (imageElement) {
            imageElement.setAttribute('x', me.x.toString());
            imageElement.setAttribute('y', me.y.toString());
            imageElement.setAttribute('width', me.width.toString());
            imageElement.setAttribute('height', me.height.toString());
        } else if (foreignObject) {
            foreignObject.setAttribute('x', me.x.toString());
            foreignObject.setAttribute('y', me.y.toString());
            foreignObject.setAttribute('width', me.width.toString());
            foreignObject.setAttribute('height', me.height.toString());
        }
    }
    
    public setBlur(blur: number) {
        let me = this,
            imageSVGElement = me.imageSVGElement;
        me.blur = blur.toString();
        if (imageSVGElement) {
            imageSVGElement.style.filter = 'blur(' + blur + 'px)';
        }
    }
    
    public getBlur() {
        return this.blur;
    }
    
    public setOpacity(opacity: number) {
        let me = this,
            imageSVGElement = me.imageSVGElement;
        me.opacity = opacity.toString();
        if (imageSVGElement) {
            imageSVGElement.style.opacity = me.opacity;
        }
    }
    
    public getOpacity() {
        return this.opacity;
    }
    
    public setDrawColor(color: string) {
        this.baseSVGElement.style.stroke = 'transparent';
    }
    
    public setFillColor(color: string) {
        this.baseSVGElement.style.fill = 'transparent';
    }
    
    public setSelected(selected: boolean) {
        super.setSelected(selected);
        this.baseSVGElement.style.stroke = selected ? '#000' : 'transparent';
    }
    
    public toXML() : Element {
        let elem = document.createElementNS(null, ImageAnnotator.xtype),
            me = this;
        
        elem.setAttribute('i', me.imageSVGElement.getAttributeNS('http://www.w3.org/1999/xlink', 'href'));
//        me.imageSVGElement.getAttribute('href'));
        elem.setAttribute('o', me.opacity);
        elem.setAttribute('b', me.blur);
        
        me._toXML(elem);
        return elem;
    }
    
    public fromXML(element: Element) {
        super.fromXML(element);
        let attr = element.getAttribute('i'),
            me = this,
            svgGroupElement = me.svgGroupElement;
            
        svgGroupElement.removeChild(me.foreignObject);
        if (attr) {
            me.createImageElement();
            let imageElement = me.imageSVGElement;
            svgGroupElement.insertBefore(imageElement, me.baseSVGElement);
            imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', attr);
//            imageElement.setAttribute('href', attr);
        }
//        opacity
        attr = element.getAttribute('o');
        if (attr) {
            let floatNum = parseFloat(attr);
            if (floatNum >= 0 && floatNum <= 1) {
                me.setOpacity(floatNum);
            }
        }
        
        attr = element.getAttribute('b');
        let floatNum = parseFloat(attr);
        if (floatNum >= 0) {
            me.setBlur(floatNum);
        }
    }
    
    public toJSON() : Object {
        let result = super.toJSON() as any,
            me = this;
        
        result.xtype = ImageAnnotator.xtype;
//        imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', reader.result.toString());
        result.i = me.imageSVGElement.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        result.o = me.opacity;
        result.b = me.blur;
        
        return result;
    }
    
    public fromJSON(obj: any) {
        let me = this,
            svgGroupElement = me.svgGroupElement;
        if (obj.i) {
            super.fromJSON(obj);
            svgGroupElement.removeChild(me.foreignObject);

            me.createImageElement();
            let imageElement = me.imageSVGElement;
            svgGroupElement.insertBefore(imageElement, me.baseSVGElement);
            imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', obj.i);
//            imageElement.setAttribute('href', obj.i);
            
            me.setOpacity(obj.o);
            me.setBlur(obj.b);
        }
    }

    getType(): string {
        return ImageAnnotator.xtype;
    }

}

ClassManager.register(ImageAnnotator.xtype, ImageAnnotator);