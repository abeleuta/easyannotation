import {AnnotatorContainer} from "../AnnotatorContainer"
import InternalConfig from "../utils/InternalConfig"
import {RectAnnotator} from "./RectAnnotator"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import DrawStyle from "../model/Styles"
import FillStyle from "../model/Styles"
import {Constants} from "../utils/Constants"
import {ClassManager} from "../utils/ClassManager"

export class BlurAnnotator extends RectAnnotator {
    
    public static readonly xtype: string = "blur";
    
    private static BLURING_ID: number = 1;
    
    private bluringFilter: SVGFilterElement;
    
    private imagePattern: SVGPatternElement;
    
    private blur: string = '2';
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        
        let rectElement = this.baseSVGElement,
            bluringFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter"),
            idx = config.annotatorIdx + '_' + BlurAnnotator.BLURING_ID,
            id = 'bluringFilter' + idx;
        rectElement.classList.add('blur-rect');
        
        rectElement.setAttribute('filter', 'url(#' + id + ')');
        bluringFilter.setAttribute('id', id);
        bluringFilter.setAttribute('filterUnits', 'userSpaceOnUse');
        bluringFilter.setAttribute('width', '110%');
        bluringFilter.setAttribute('height', '110%');
        bluringFilter.innerHTML = '<feGaussianBlur stdDeviation="2"/>';
        AnnotationUtils.addToDefs(config, bluringFilter);
        
        let imagePattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern"),
            allPatterns = AnnotationUtils.getDefs(config).getElementsByTagName('pattern'),
            numPatterns = allPatterns.length, i,
            mainPattern;
        
        id = 'bluringPattern' + idx;
        imagePattern.id = id;
            
        for (i = 0; i < numPatterns;i++) {
            mainPattern = allPatterns[i];
            if (mainPattern.id == 'mainFillPattern' + config.annotatorIdx) {
                imagePattern.innerHTML = mainPattern.innerHTML;
                imagePattern.setAttribute('patternUnits', 'userSpaceOnUse');
                imagePattern.setAttribute('width', mainPattern.getAttribute('width'));
                imagePattern.setAttribute('height', mainPattern.getAttribute('height'));
                break;
            }
        }
            
        AnnotationUtils.addToDefs(config, imagePattern);
        
        BlurAnnotator.BLURING_ID++;
        
        rectElement.setAttribute('fill', 'url(#' + id + ')');
        this.bluringFilter = bluringFilter;
        this.imagePattern = imagePattern;
        
        this.properties = [Constants.BLUR_PROPERTY];
    }
    
    public moveBy(dx: number, dy: number, evt: MouseEvent) {
        super.moveBy(dx, dy, evt);
        
        let me = this,
            bluringFilter = me.bluringFilter,
            imagePattern = me.imagePattern;
        bluringFilter.setAttribute('x', me.x.toString());
        bluringFilter.setAttribute('y', me.y.toString());

        let transfromMatrix = me.svgGroupElement.transform.baseVal.getItem(0).matrix;

        imagePattern.setAttribute('x', (-transfromMatrix.e).toString());
        imagePattern.setAttribute('y', (-transfromMatrix.f).toString());
        
    }
    
    public setDrawStyle(drawStyle: DrawStyle) {
        
    }
    
    public setFillStyle(fillStyle: FillStyle){
        
    }
    
    public setBlur(blur: number) {
        this.blur = blur.toString();
        this.bluringFilter.getElementsByTagName('feGaussianBlur')[0].setAttribute('stdDeviation', this.blur);
    }
    
    public getBlur() {
        return this.blur;
    }
    
    public clean() {
        let me = this,
            defs = AnnotationUtils.getDefs(me.config);
        if (me.bluringFilter) {
            defs.removeChild(me.bluringFilter);
        }
        
        if (me.imagePattern) {
            defs.removeChild(me.imagePattern);
        }
    }
    
    public isOnTop(): boolean {
        return true;
    }

    public toXML() : Element {
        let elem = document.createElementNS(null, BlurAnnotator.xtype);
        super._toXML(elem);
        elem.setAttribute('b', this.blur);
        return elem;
    }
    
    public fromXML(element: Element) {
        super.fromXML(element);
        let blur = parseFloat(element.getAttribute('b'));
        if (isNaN(blur) || blur < 0 || blur > 200/15) {
            blur = 0;
        }
        
        this.blur = blur.toString();
        this.bluringFilter.getElementsByTagName('feGaussianBlur')[0].setAttribute('stdDeviation', this.blur);
    }
    
    public toJSON() : Object {
        let obj = super.toJSON() as any;
        obj.xtype = BlurAnnotator.xtype;
        obj.b = this.blur;
        return obj;
    }
    
    public fromJSON(obj: any) {
        super.fromJSON(obj);
        if (obj.b) {
            let blur = parseFloat(obj.b);
            if (isNaN(blur) || blur < 0 || blur > 200/15) {
                blur = 0;
            }
            this.blur = blur.toString();
        }
    }

    getType(): string {
        return BlurAnnotator.xtype;
    }

}

ClassManager.register(BlurAnnotator.xtype, BlurAnnotator);