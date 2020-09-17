import Config from '../Config';
import { ToolbarItem } from "./ToolbarItem";
export declare class Toolbar {
    protected container: HTMLElement;
    protected items: ToolbarItem[];
    protected itemClickHandler: (evt: MouseEvent, item: ToolbarItem) => void;
    protected parent: Object;
    protected showMenuItemsButton: HTMLDivElement;
    protected submenuContainer: HTMLDivElement;
    protected submenuItems: ToolbarItem[];
    protected config: Config;
    constructor(config: Config, items: ToolbarItem[], itemClickHandler: (evt: MouseEvent, item: ToolbarItem) => void, parent: Object);
    init(config: Config): void;
    getContainer(): HTMLElement;
    protected getUIElement(config: Config, toolbarItem: ToolbarItem): HTMLDivElement;
    deselectAll(itemToIgnore: ToolbarItem): void;
    doLayout(): void;
    private showMoreIcons;
    private hideSubMenu;
}
