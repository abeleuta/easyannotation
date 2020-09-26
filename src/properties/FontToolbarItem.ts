import Config from "../Config"

import {AbstractPropToolbarItem} from "./AbstractPropToolbarItem"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {TextAnnotator} from "../annotators/TextAnnotator"
import {Font} from "../model/Font"
import {FontSelector} from "../ui/FontSelector"
import {Constants} from "../utils/Constants"

var FontIcon = require("../icons/font-solid.svg") as string

export class FontToolbarItem extends AbstractPropToolbarItem{
    
    private font: Font;
    
    private fontDialog: FontSelector;
    
    constructor() {
        super();
        this.xtype = Constants.FONT_PROPERTY;//"font";
        this.iconSVG = FontIcon;
    }
    
    public invoke(config: Config, selectedItems: Array<BaseAnnotator>) {
        let me = this;
        if (!me.fontDialog) {
            me.fontDialog = new FontSelector(config);
        }
        
        me.fontDialog.show(me.element, selectedItems, function(font: Font) {
            me.font = font;
            for(let item of selectedItems) {
                if (item instanceof TextAnnotator) {
                    (item as TextAnnotator).setFont(font);
                }
            }
        });
        
    }
    
}