
import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BlurAnnotator} from "../annotators/BlurAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import BlurIcon from "../icons/blur.svg"

export class BlurToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = BlurIcon;
        this.title = 'Blur Image';
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        var bluringAnnotator = new BlurAnnotator(config, parent);
        
        return bluringAnnotator;
    }
}
