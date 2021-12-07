
import InternalConfig from "../utils/InternalConfig"
import {FreeDrawAnnotator} from "../annotators/FreeDrawAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {FreeDrawToolbarItem} from './FreeDrawToolbarItem';
import {PolygonAnnotator} from '../annotators/PolygonAnnotator';

// var PolygonIcon = require("../icons/polygon.svg") as string
import PolygonIcon from "../icons/polygon.svg"

export class PolygonToolbarItem extends FreeDrawToolbarItem {
    
    constructor(config: InternalConfig) {
        super(config);
        this.iconSVG = PolygonIcon;
        this.itemId = 'polygon';
        this.title = 'Polygon';
    }
    
    protected newAnnotator(config: InternalConfig, parent: AnnotatorContainer): FreeDrawAnnotator {
        let annotator = new PolygonAnnotator(config, parent);
        annotator.on('stop', () => {
            this.setPushed(false);
        });
        return annotator;
    }

}
