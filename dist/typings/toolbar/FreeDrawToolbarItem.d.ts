import { AbstractToolbarPushItem } from "./AbstractToolbarPushItem";
import InternalConfig from "../utils/InternalConfig";
import { BaseStopableAnnotator } from "../annotators/BaseStopableAnnotator";
import { AnnotatorContainer } from "../AnnotatorContainer";
export declare class FreeDrawToolbarItem extends AbstractToolbarPushItem {
    private lastAnnotator;
    itemId: string;
    private config;
    constructor(config: InternalConfig);
    createAnnotator(config: InternalConfig, parent: AnnotatorContainer): BaseStopableAnnotator;
    setPushed(pushed: boolean): void;
}
