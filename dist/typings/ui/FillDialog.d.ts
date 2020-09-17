import Config from "../Config";
import { BaseDialog } from "./BaseDialog";
import FillStyle from "../model/Styles";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class FillDialog extends BaseDialog {
    private static readonly BLUR_OPTIONS;
    private static readonly SHADOW_OPTIONS;
    private sampleDiv;
    private fillStyle;
    private colorPickerDiv;
    private fillPatternDropDown;
    private fillPatternLabel;
    private picker;
    private opacitySlider;
    private effectsDropDown;
    private config;
    private blurIndex;
    private shadowIndex;
    constructor(config: Config, fillStyle?: FillStyle);
    show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: Object) => void): void;
    private pickerSave;
    private pickerCancel;
    private pickerColorChange;
    private onOKBtnClick;
    private cancelBtnClick;
    private onFillStyleChange;
    private onEffectChange;
    private getBlurFilter;
    private getShadowFilter;
    protected hideDialog: (evt: MouseEvent) => void;
}