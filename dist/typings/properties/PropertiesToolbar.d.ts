import Config from '../Config';
import { AbstractPropToolbarItem } from "./AbstractPropToolbarItem";
import { ToolbarItem } from "../toolbar/ToolbarItem";
import { Toolbar } from "../toolbar/Toolbar";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class PropertiesToolbar extends Toolbar {
    constructor(config: Config, items: AbstractPropToolbarItem[], parent: Object);
    private toolbarItemClickHandler;
    protected getUIElement(config: Config, toolbarItem: ToolbarItem): HTMLDivElement;
    setSelectedItems(selectedItems: Array<BaseAnnotator>): void;
}
