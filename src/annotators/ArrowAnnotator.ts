
import InternalConfig from "../utils/InternalConfig"
import {LineAnnotator} from "./LineAnnotator"
import {AnnotatorContainer} from "../AnnotatorContainer"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {ClassManager} from "../utils/ClassManager"

import DrawStyle from "../model/Styles"

export class ArrowAnnotator extends LineAnnotator {
    
    public static readonly xtype: string = "arrow";
    
    private initialized: boolean = false;
    
    constructor(config: InternalConfig, parent: AnnotatorContainer) {
        super(config, parent);
        
        this.initArrow(config);
    }
    
    private initArrow(config: InternalConfig) {
        let markerResult = AnnotationUtils.createArrowMarker(config, 0, null);
        this.baseSVGElement.setAttribute('marker-end', "url(#" + markerResult[0].getAttribute('id') + ")");
        this.arrowEndHead = markerResult[1];
    }
    
    public setDrawStyle(drawStyle: DrawStyle) {
        let me = this,
            initialized = me.initialized,
            arrowEndHead = me.arrowEndHead;
        if (!initialized) {
            me.arrowEndHead = null;
        }
        super.setDrawStyle(drawStyle);
        if (!initialized) {
            me.drawStyle.endArrow = 1;
            me.arrowEndHead = arrowEndHead;
            me.baseSVGElement.setAttribute('marker-end', "url(#" + (arrowEndHead.parentNode as SVGElement).getAttribute('id') + ")");
            arrowEndHead.style.fill = drawStyle.color;
            arrowEndHead.style.stroke = drawStyle.color;
            me.initialized = true;
        }
    }

    getType() {
        return ArrowAnnotator.xtype;
    }

}

ClassManager.register(ArrowAnnotator.xtype, ArrowAnnotator);