
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {CalloutAnnotator} from "../annotators/CalloutAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

// var CalloutIcon = require("../icons/callout.svg") as string
import CalloutIcon from "../icons/callout.svg"

export class CalloutToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = CalloutIcon;
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        let lineAnnotator = new CalloutAnnotator(config, parent);
        
        return lineAnnotator;
    }
    
}
