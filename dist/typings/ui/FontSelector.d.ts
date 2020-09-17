import { Font } from "../model/Font";
import { BaseDialog } from "./BaseDialog";
import Config from "../Config";
export declare class FontSelector extends BaseDialog {
    private font;
    private sampleTextDiv;
    private fontSizeDropDown;
    constructor(config: Config, font?: Font);
    private onOKBtnClick;
    private cancelBtnClick;
    private onFontSizeChange;
    private onButtonClick;
    private onFontNameChange;
}
