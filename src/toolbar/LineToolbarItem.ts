
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {LineAnnotator} from "../annotators/LineAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

// var LineIcon = require("../icons/line.svg") as string
import LineIcon from "../icons/line.svg"

export class LineToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = LineIcon;
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        let lineAnnotator = new LineAnnotator(config, parent);
        
        return lineAnnotator;
    }
    
}
