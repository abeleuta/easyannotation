import Config from "../Config"
import {AbstractPropToolbarItem} from "./AbstractPropToolbarItem"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import FillStyle from "../model/Styles"
import {FillDialog} from "../ui/FillDialog"
import {Constants} from "../utils/Constants"

var FillColor = require("../icons/color.svg") as string

export class FillToolbarItem extends AbstractPropToolbarItem {
    
    private fillDialog: FillDialog;
    
    constructor() {
        super();
        this.xtype = Constants.FILL_PROPERTY;//"fill-color";
        this.title = 'Fill Style';
        this.iconSVG = FillColor;
    }
    
    public invoke(config: Config, selectedItems: Array<BaseAnnotator>) {
        let me = this;
        if (!me.fillDialog) {
            me.fillDialog = new FillDialog(config, config.fillStyle);
        }

        me.fillDialog.show(me.element, selectedItems, function (fill: FillStyle) {

            for (let item of selectedItems) {
                item.setFillStyle(fill);
            }
        });

    }
    
}
