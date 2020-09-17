import InternalConfig from "../utils/InternalConfig";
import { AbstractPropToolbarItem } from "./AbstractPropToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class BlurPropsToolbarItem extends AbstractPropToolbarItem {
    private blurDialog;
    constructor();
    invoke(config: InternalConfig, selectedItems: Array<BaseAnnotator>): void;
}
