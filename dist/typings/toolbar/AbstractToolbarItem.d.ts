import { ToolbarItem } from "./ToolbarItem";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
import Config from "../Config";
import { AnnotatorContainer } from "../AnnotatorContainer";
export declare abstract class AbstractToolbarItem extends ToolbarItem {
    private enabled;
    abstract createAnnotator(config: Config, parent: AnnotatorContainer): BaseAnnotator;
    setEnabled(enabled: boolean): void;
}
