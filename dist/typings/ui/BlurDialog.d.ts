import InternalConfig from "../utils/InternalConfig";
import { BaseDialog } from "./BaseDialog";
import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class BlurDialog extends BaseDialog {
    private sampleDiv;
    private blurSlider;
    private blurLabel;
    private transparencySlider;
    private transparencyLabel;
    constructor(config: InternalConfig);
    show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: any) => void): void;
    private onBlurChange;
    private onOKBtnClick;
    private cancelBtnClick;
    protected hideDialog: (evt: MouseEvent) => void;
}
