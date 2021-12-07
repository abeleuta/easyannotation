
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {EllipseAnnotator} from "../annotators/EllipseAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

// var CircleIcon = require("../icons/circle.svg") as string
import CircleIcon from "../icons/circle.svg"

export class EllipseToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = CircleIcon;
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        let ellipseAnnotator = new EllipseAnnotator(config, parent);
        
        return ellipseAnnotator;
    }
    
}
