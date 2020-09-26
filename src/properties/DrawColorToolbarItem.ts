import Config from "../Config"

import {AbstractPropToolbarItem} from "./AbstractPropToolbarItem"
import {BaseAnnotator} from "../annotators/BaseAnnotator"

var Pencil = require("../icons/pencil-alt-solid.svg") as string

export class DrawColorToolbarItem extends AbstractPropToolbarItem{
    
    private color: string;
    
    constructor() {
        super();
        this.xtype = "draw-color";
        this.iconSVG = Pencil;
    }
    
    public invoke(config: Config, selectedItems: Array<BaseAnnotator>) {
        const color = this.color;
        for(let i in selectedItems) {
            selectedItems[i].setDrawColor(color);
        }
    }
    
}