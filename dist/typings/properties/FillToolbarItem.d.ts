import Config from "../Config";
import { AbstractPropToolbarItem } from "./AbstractPropToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class FillToolbarItem extends AbstractPropToolbarItem {
    private fillDialog;
    constructor();
    invoke(config: Config, selectedItems: Array<BaseAnnotator>): void;
}
