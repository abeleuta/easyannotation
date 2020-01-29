
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import {BaseStopableAnnotator} from "../annotators/BaseStopableAnnotator"
import Config from "../Config"
import {AnnotatorContainer} from "../AnnotatorContainer"

export abstract class AbstractToolbarPushItem extends AbstractToolbarItem {
    
    protected pushed: boolean = false;

    constructor() {
        super();
        this.iconSVG = '';
    }
        
    abstract createAnnotator(config: Config, parent: AnnotatorContainer): BaseStopableAnnotator;
    
    public setPushed(pushed: boolean) {
        this.pushed = pushed;
    }
    
}
