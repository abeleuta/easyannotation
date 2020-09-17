import { BaseAnnotator } from "../annotators/BaseAnnotator";
export declare class BaseDialog {
    private static openDialog;
    static getOpenDialog(): BaseDialog;
    protected container: HTMLDivElement;
    protected callback: (res: Object) => void;
    protected height: number;
    show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: Object) => void): void;
    private orientationChange;
    private onTouchMove;
    protected hideDialog(evt: MouseEvent): void;
    hide(): void;
    protected addBaseButtons(container: HTMLDivElement, okButton: HTMLButtonElement, cancelButton: HTMLButtonElement): void;
}
