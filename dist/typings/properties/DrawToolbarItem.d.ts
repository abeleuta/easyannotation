import InternalConfig from "../utils/InternalConfig";
import { AbstractPropToolbarItem } from "./AbstractPropToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class DrawToolbarItem extends AbstractPropToolbarItem {
    private drawDialog;
    constructor();
    invoke(config: InternalConfig, selectedItems: Array<BaseAnnotator>): void;
}
