import { AbstractToolbarItem } from "./AbstractToolbarItem";
import { BaseStopableAnnotator } from "../annotators/BaseStopableAnnotator";
import Config from "../Config";
import { AnnotatorContainer } from "../AnnotatorContainer";
export declare abstract class AbstractToolbarPushItem extends AbstractToolbarItem {
    protected pushed: boolean;
    constructor();
    abstract createAnnotator(config: Config, parent: AnnotatorContainer): BaseStopableAnnotator;
    setPushed(pushed: boolean): void;
}
