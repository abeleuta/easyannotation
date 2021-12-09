import DrawStyle from "./model/Styles"
import FillStyle from "./model/Styles"
import BlurStyle from "./model/Styles"
import {ToolbarItem} from "./toolbar/ToolbarItem"

export default interface Font {
    name?: string;
    size?: number;
    italic?: boolean;
    bold?: boolean;
};

export default interface Config {
    // element to render the annotator container, if null defaults to document.body
    targetElement?: HTMLElement;

    ui?: string;

    font?: Font;

    defaultText?: string;

    translations?: any;

    /**
     * Global draw style for all annotators.
     */
    drawStyle?: DrawStyle;

    /**
     * Individual draw style for each annotator.
     */
    drawStyles?: {
        line?: DrawStyle,
        arrow?: DrawStyle,
        rect?: DrawStyle,
        polygon?: DrawStyle,
        callout?: DrawStyle,
        ellipse?: DrawStyle
    };

    /**
     * Global fill style for all annotators.
     */
    fillStyle?: FillStyle;

    /**
     * Individual draw style for each annotator.
     */
    fillStyles?: {
        text?: FillStyle,
        rect?: FillStyle,
        polygon?: FillStyle,
        callout?: FillStyle,
        ellipse?: FillStyle
    };

    /**
     * Default blurring style for all Blur annotators.
     */
    blurStyle?: BlurStyle;

    //if true, annotator will load when user click or tap on the image element
    loadOnClick?: boolean;

    //if true, close button will show
    showClose?: boolean;

    x?: number;
    y?: number;
    width?: number;
    height?: number;
    showToolbar?: boolean;
    showProperties?: boolean;
    hideElement?: boolean;
    style?: string;
    toolbarItems?: Array<ToolbarItem>;
    defaultColors?: [] | null
}
