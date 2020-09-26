
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BlurAnnotator} from "../annotators/BlurAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
var BlurIcon = require("../icons/blur.svg") as string

export class BlurToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = BlurIcon;
        this.title = 'Blur Image';
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        let bluringAnnotator = new BlurAnnotator(config, parent);
        
        return bluringAnnotator;
    }
}
