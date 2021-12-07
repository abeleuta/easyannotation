import InternalConfig from "../utils/InternalConfig"

import {AbstractPropToolbarItem} from "./AbstractPropToolbarItem"
import {BlurAnnotator} from "../annotators/BlurAnnotator"
import {ImageAnnotator} from "../annotators/ImageAnnotator"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {Constants} from "../utils/Constants"

import {BlurDialog} from "../ui/BlurDialog"

import BlurSettingsIcon from "../icons/cog-solid.svg"

export class BlurPropsToolbarItem extends AbstractPropToolbarItem {
    
    private blurDialog: BlurDialog;
    
    constructor() {
        super();
        this.xtype = Constants.BLUR_PROPERTY;
        this.iconSVG = BlurSettingsIcon;
    }
    
    public invoke(config: InternalConfig, selectedItems: Array<BaseAnnotator>) {
        let me = this;
        if (!me.blurDialog) {
            me.blurDialog = new BlurDialog(config);
        }
        
        me.blurDialog.show(me.element, selectedItems, (res: any) => {
            let opacity = res.opacity,
                blur = res.blur;
            for(let item of selectedItems) {
                if (item instanceof ImageAnnotator) {
                    (item as ImageAnnotator).setOpacity(opacity);
                    (item as ImageAnnotator).setBlur(blur);
                } else if (item instanceof BlurAnnotator) {
                    (item as BlurAnnotator).setBlur(blur);
                }
            }
        });
        
    }
    
}
