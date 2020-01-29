
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {ArrowAnnotator} from "../annotators/ArrowAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

import ArrowIcon from "../icons/arrow.svg"

export class ArrowToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = ArrowIcon;
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        var lineAnnotator = new ArrowAnnotator(config, parent);
        
        return lineAnnotator;
    }
    
}
