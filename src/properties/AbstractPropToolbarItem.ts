import Config from '../Config';

import {ToolbarItem} from "../toolbar/ToolbarItem"
import {BaseAnnotator} from "../annotators/BaseAnnotator"

export abstract class AbstractPropToolbarItem extends ToolbarItem {
    
    xtype: string;
    
    private enabled: boolean = true;
    
    abstract invoke(config: Config, selectedItems: Array<BaseAnnotator>): void;
    
    public canHandle(selectedItems: Array<BaseAnnotator>) : boolean {
        let xtype = this.xtype;
        for (let item of selectedItems) {
            if (item.getProperties().indexOf(xtype) >= 0) {
                return true;
            }
        }
        return false;
    }
    
    public setEnabled(enabled: boolean) {
        let me = this;
        if (enabled != me.enabled) {
            me.enabled = enabled;
            if (enabled) {
                me.element.classList.remove('btn-disabled');
            } else {
                me.element.classList.add('btn-disabled');
            }
        }
    }
    
    public isEnabled() : boolean {
        return this.enabled;
    }
    
}