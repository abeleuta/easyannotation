import Config from "../Config";
import { AbstractPropToolbarItem } from "./AbstractPropToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class FontToolbarItem extends AbstractPropToolbarItem {
    private font;
    private fontDialog;
    constructor();
    invoke(config: Config, selectedItems: Array<BaseAnnotator>): void;
}
