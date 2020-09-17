import InternalConfig from "../utils/InternalConfig";
import { BaseDialog } from "./BaseDialog";
import DrawStyle from "../model/Styles";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class DrawDialog extends BaseDialog {
    private sampleLine;
    private drawStyle;
    private colorPickerDiv;
    private arrowStyleDiv;
    private drawStyleDropDown;
    private lineWidthDropDown;
    private startArrowDropDown;
    private endArrowDropDown;
    private picker;
    private config;
    constructor(config: InternalConfig, drawStyle?: DrawStyle);
    show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: Object) => void): void;
    private pickerColorChange;
    private pickerColorSave;
    private pickerCancel;
    private onOKBtnClick;
    private cancelBtnClick;
    private onLineStyleChange;
    private onLineWidthChange;
    private beginArrowChange;
    private endArrowChange;
    private changeMarker;
    protected hideDialog: (evt: MouseEvent) => void;
}
