import InternalConfig from "../utils/InternalConfig";
import { LineAnnotator } from "./LineAnnotator";
import { AnnotatorContainer } from "../AnnotatorContainer";
import DrawStyle from "../model/Styles";
export declare class ArrowAnnotator extends LineAnnotator {
    static readonly xtype: string;
    private initialized;
    constructor(config: InternalConfig, parent: AnnotatorContainer);
    private initArrow;
    setDrawStyle(drawStyle: DrawStyle): void;
}
