import Config from "../Config";
export declare class DropDown {
    protected container: HTMLDivElement;
    protected optionsContainer: HTMLDivElement;
    protected valueDiv: HTMLDivElement;
    protected intervalID: number;
    onchange: (index: number, value?: any, topIndex?: number) => void;
    onclose: () => void;
    protected selectedIndex: number;
    protected editable: boolean;
    protected multiOptions: boolean;
    protected mouseOverTimeout: number;
    private subDropDownVisible;
    constructor(config: Config, options: Array<any>, cls?: string, valueCls?: string);
    protected onSubOptionsOver: (evt: MouseEvent) => void;
    protected onOptionEvent: (evt: TouchEvent | MouseEvent) => void;
    setSelectedIndex(primaryIndex: number, subIndex?: number): void;
    private checkContainer;
    private removeMobileCls;
    private onBackButton;
    private clearListeners;
    private onDropDownClick;
    private closeDropDown;
    private hideDropDown;
    private selectOption;
    getElement(): HTMLDivElement;
    setEditable(editable: boolean): void;
    isOpen(): boolean;
}
