
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {EllipseAnnotator} from "../annotators/EllipseAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

import CircleIcon from "../icons/circle.svg"

export class EllipseToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = CircleIcon;
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        var ellipseAnnotator = new EllipseAnnotator(config, parent);
        
        return ellipseAnnotator;
    }
    
}
