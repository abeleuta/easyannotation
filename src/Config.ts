import DrawStyle from "./model/Styles"
import FillStyle from "./model/Styles"
import {ToolbarItem} from "./toolbar/ToolbarItem"

export default interface Font {
    name: string;
    size: number;
    italic: boolean;
    bold: boolean;
};

export default interface Config {
  // element to render the annotator container, if null defaults to document.body
  targetElement?: HTMLElement;
  ui: string;
  
  font: Font;
  
  drawStyle: DrawStyle;
  fillStyle: FillStyle;

  //if true, annotator will load when user click or tap on the image element
  loadOnClick: boolean;

  //if true, close button will show
  showClose: boolean;
  
  x? : number;
  y?: number;
  width? : number;
  height?: number;
  showToolbar?: boolean;
  showProperties?: boolean;
  hideElement?: boolean;
  style?: string;
  containerCls?: string;
  toolbarCls?: string;
  toolbarItems:Array<ToolbarItem>;
  defaultColors: [] | null
}
