import Config from '../Config';
import { ToolbarItem } from "../toolbar/ToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare abstract class AbstractPropToolbarItem extends ToolbarItem {
    xtype: string;
    private enabled;
    abstract invoke(config: Config, selectedItems: Array<BaseAnnotator>): void;
    canHandle(selectedItems: Array<BaseAnnotator>): boolean;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
}
