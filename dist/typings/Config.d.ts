import DrawStyle from "./model/Styles";
import FillStyle from "./model/Styles";
import { ToolbarItem } from "./toolbar/ToolbarItem";
export default interface Font {
    name: string;
    size: number;
    italic: boolean;
    bold: boolean;
}
export default interface Config {
    targetElement?: HTMLElement;
    ui: string;
    font: Font;
    drawStyle: DrawStyle;
    fillStyle: FillStyle;
    loadOnClick: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    showToolbar?: boolean;
    showProperties?: boolean;
    hideElement?: boolean;
    style?: string;
    containerCls?: string;
    toolbarCls?: string;
    toolbarItems: Array<ToolbarItem>;
    defaultColors: [] | null;
}
