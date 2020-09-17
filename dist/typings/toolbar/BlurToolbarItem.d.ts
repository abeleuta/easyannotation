import { AbstractToolbarItem } from "./AbstractToolbarItem";
import InternalConfig from "../utils/InternalConfig";
import { AnnotatorContainer } from "../AnnotatorContainer";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class BlurToolbarItem extends AbstractToolbarItem {
    constructor();
    createAnnotator(config: InternalConfig, parent: AnnotatorContainer): BaseAnnotator;
}
