
import {AbstractToolbarPushItem} from "./AbstractToolbarPushItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseStopableAnnotator} from "../annotators/BaseStopableAnnotator"
import {FreeDrawAnnotator} from "../annotators/FreeDrawAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

import FreeDrawIcon from "../icons/free-draw.svg"

export class FreeDrawToolbarItem extends AbstractToolbarPushItem {
    
    private lastAnnotator: BaseStopableAnnotator;
    
    public itemId: string;
    
    private config: InternalConfig;
    
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
            this.element.className = this.element.className.replace(' ' + config.ui + '-toolbar-item-pressed', '');
            this.lastAnnotator = null;
            lastAnnotator.setSelected(false);
            return null;
        }
        
        this.element.className += ' ' + config.ui + '-toolbar-item-pressed';
        let freeDrawAnnotator = new FreeDrawAnnotator(config, parent);
        this.lastAnnotator = freeDrawAnnotator;
        return freeDrawAnnotator;
    }
    
    public setPushed(pushed: boolean) {
        let me = this,
            element = me.element,
            ui = this.config.ui,
            className = element.className;
        me.pushed = pushed;
        if (pushed) {
            if (className.indexOf(('toolbar-item-pressed')) === -1) {
                element.className += ' ' + ui + '-toolbar-item-pressed';
            }
        } else {
            element.className = className.replace(' ' + ui + '-toolbar-item-pressed', '');
        }
        me.lastAnnotator = null;
    }
    
}
