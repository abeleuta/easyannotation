import {AbstractToolbarItem} from "./AbstractToolbarItem"
import InternalConfig from "../utils/InternalConfig"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {ImageAnnotator} from "../annotators/ImageAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"

// var ImageIcon = require("../icons/image-regular.svg") as string
import ImageIcon from "../icons/image-regular.svg"

export class ImageToolbarItem extends AbstractToolbarItem {
    
    constructor() {
        super();
        this.iconSVG = ImageIcon;
        this.title = 'Add Picture';
    }
    
    public createAnnotator(config: InternalConfig, parent: AnnotatorContainer) : BaseAnnotator {
        let imageAnnotator = new ImageAnnotator(config, parent);
        
        return imageAnnotator;
    }
    
}
