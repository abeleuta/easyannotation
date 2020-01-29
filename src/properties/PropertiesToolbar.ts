import Config from '../Config';
import {AbstractPropToolbarItem} from "./AbstractPropToolbarItem"
import {ToolbarItem} from "../toolbar/ToolbarItem"
import {Toolbar} from "../toolbar/Toolbar"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {BaseDialog} from "../ui/BaseDialog"

import {AnnotatorContainer} from "../AnnotatorContainer"

export class PropertiesToolbar extends Toolbar {
    
    constructor(config: Config, items: AbstractPropToolbarItem[], parent: Object) {
        super(config, items, null, parent);
        
        this.config = config;
        this.itemClickHandler = this.toolbarItemClickHandler;
    }
    
    private toolbarItemClickHandler = (evt: MouseEvent, item: ToolbarItem) => {
        let propItem = item as AbstractPropToolbarItem,
            me = this;
        if (propItem.isEnabled()) {
            propItem.invoke(me.config, (me.parent as AnnotatorContainer).getSelectedItems());
        }
    }
    
    protected getUIElement(config: Config, toolbarItem: ToolbarItem) {
        let me = this,
            elem = super.getUIElement(config, toolbarItem);
        
        elem.onclick = function (evt: MouseEvent) {
            evt.stopPropagation();
            if (BaseDialog.getOpenDialog()) {
                BaseDialog.getOpenDialog().hide();
            }
            me.itemClickHandler.call(me, evt, toolbarItem);
        };
        
        return elem;
    }
    
    public setSelectedItems(selectedItems: Array<BaseAnnotator>) {
        for(let item of this.items) {
            let propItem = item as AbstractPropToolbarItem;
            propItem.setEnabled(propItem.canHandle(selectedItems));
        }
    }
    

}