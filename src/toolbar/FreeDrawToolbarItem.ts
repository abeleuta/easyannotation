
import {AbstractToolbarPushItem} from "./AbstractToolbarPushItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseStopableAnnotator} from "../annotators/BaseStopableAnnotator"
import {FreeDrawAnnotator} from "../annotators/FreeDrawAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

// var FreeDrawIcon = require("../icons/free-draw.svg") as string
import FreeDrawIcon from "../icons/free-draw.svg"

export class FreeDrawToolbarItem extends AbstractToolbarPushItem {
    
    protected lastAnnotator: BaseStopableAnnotator;
    
    public itemId: string;

    protected config: InternalConfig;
    
    constructor(config: InternalConfig) {
        super();
        this.config = config;
        this.iconSVG = FreeDrawIcon;
        this.itemId = 'free-draw';
        this.title = 'Free Draw';
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseStopableAnnotator {
        let lastAnnotator = this.lastAnnotator;
        if (lastAnnotator) {
            lastAnnotator.stop();
            this.element.className = this.element.className.replace(' default-toolbar-item-pressed', '');
            this.lastAnnotator = null;
            lastAnnotator.setSelected(false);
            return null;
        }
        
        this.element.className += ' default-toolbar-item-pressed';
        let freeDrawAnnotator = this.newAnnotator(config, parent);
        this.lastAnnotator = freeDrawAnnotator;
        return freeDrawAnnotator;
    }

    protected newAnnotator(config: InternalConfig, parent: AnnotatorContainer) {
        return new FreeDrawAnnotator(config, parent);
    }
    
    public setPushed(pushed: boolean) {
        let element = this.element,
            config = this.config,
            className = element.className;
        this.pushed = pushed;
        if (pushed) {
            if (className.indexOf(('toolbar-item-pressed')) === -1) {
                element.className += ' default-toolbar-item-pressed';
            }
        } else {
            element.className = className.replace(' default-toolbar-item-pressed', '');
        }
        this.lastAnnotator = null;
    }
    
}
