
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {RectAnnotator} from "../annotators/RectAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

// var RectIcon = require("../icons/rect.svg") as string
import RectIcon from "../icons/rect.svg"

export class RectToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = RectIcon;
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        let lineAnnotator = new RectAnnotator(config, parent);
        
        return lineAnnotator;
    }
    
}
