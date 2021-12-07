import InternalConfig from "../utils/InternalConfig"

import {AbstractPropToolbarItem} from "./AbstractPropToolbarItem"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {DrawDialog} from "../ui/DrawDialog"
import DrawStyle from "../model/Styles"
import {Constants} from "../utils/Constants"

// var Pencil = require("../icons/pencil-alt-solid.svg") as string
import Pencil from "../icons/pencil-alt-solid.svg"

export class DrawToolbarItem extends AbstractPropToolbarItem {
    
    private drawDialog: DrawDialog;
    
    constructor() {
        super();
        this.xtype = Constants.DRAW_PROPERTY;//"draw-color";
        this.title = 'Line Style';
        this.iconSVG = Pencil;
    }
    
    public invoke(config: InternalConfig, selectedItems: Array<BaseAnnotator>) {
        
        let me = this;
        
        if (!me.drawDialog) {
            me.drawDialog = new DrawDialog(config, config.drawStyle);
        }
        
        me.drawDialog.show(me.element, selectedItems, function (drawStyle: DrawStyle) {
            config.drawStyle.width = drawStyle.width;
            config.drawStyle.type = drawStyle.type;
            
            for (let item of selectedItems) {
                item.setDrawStyle(drawStyle);
            }
        });
        
    }
    
}