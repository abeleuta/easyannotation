
import {ToolbarItem} from "./ToolbarItem"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import Config from "../Config"
import {AnnotatorContainer} from "../AnnotatorContainer"

export abstract class AbstractToolbarItem extends ToolbarItem {
    
    private enabled: boolean = true;
    
    abstract createAnnotator(config: Config, parent: AnnotatorContainer): BaseAnnotator;
    
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
    
}
