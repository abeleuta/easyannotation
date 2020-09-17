import Config from "../Config";
import { AbstractPropToolbarItem } from "./AbstractPropToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class DrawColorToolbarItem extends AbstractPropToolbarItem {
    private color;
    constructor();
    invoke(config: Config, selectedItems: Array<BaseAnnotator>): void;
}
