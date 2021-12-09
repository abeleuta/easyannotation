import Config from '../Config';
import {ToolbarItem} from "./ToolbarItem"
import {AbstractToolbarPushItem} from "./AbstractToolbarPushItem"
import {Utils} from "../utils/Utils"
import {BaseDialog} from "../ui/BaseDialog"

// var MoreIcon = require("../icons/more.svg") as string
import MoreIcon from "../icons/more.svg"
import InternalConfig from '../utils/InternalConfig';

export class Toolbar {
    
    protected container: HTMLElement;
    
    protected items: ToolbarItem[];
    
    protected itemClickHandler: (evt: MouseEvent, item: ToolbarItem) => void;
    
    protected parent: Object;
    
    protected showMenuItemsButton: HTMLDivElement;
    
    protected submenuContainer: HTMLDivElement;
    
    protected submenuItems: ToolbarItem[];
    
    protected config: Config;

    constructor(config: Config, items: ToolbarItem[], itemClickHandler: (evt: MouseEvent, item: ToolbarItem) => void,
        parent: Object) {
        let me = this;
        me.items = items;
        me.itemClickHandler = itemClickHandler;
        me.parent = parent;
        me.config = config;
        me.init(config);
    }
    
    public init(config: Config) {
        let container = document.createElement('div');
        container.className = 'default-toolbar ' + config.ui;

        //exposing the part so toolbar can be styled from outside of shadow
        container.setAttribute('part', 'toolbar');
        
        for (let item of this.items) {
            let toolbarElement = this.getUIElement(config, item);
            item.element = toolbarElement;
            container.appendChild(toolbarElement);
        }

        (config as InternalConfig).annotatorContainer.appendChild(container);
        
        this.container = container;
    }
    
    public getContainer() {
        return this.container;
    }
    
    protected getUIElement(config: Config, toolbarItem: ToolbarItem) {
        let me = this;
        let element = document.createElement('div');
        element.className = 'default-toolbar-item ' + config.ui;
        
        if (toolbarItem.itemId) {
            element.id = toolbarItem.itemId;
        }
        
        if (toolbarItem.title) {
            element.title = toolbarItem.title;
        }
        
        element.onclick = (evt: MouseEvent) => {
            if (BaseDialog.getOpenDialog()) {
                BaseDialog.getOpenDialog().hide();
            }
            evt.stopPropagation();
            me.itemClickHandler.call(me.parent, evt, toolbarItem);
            if (me.submenuContainer) {
                me.submenuContainer.style.display = 'none';
            }
        };

        if (toolbarItem.iconSVG) {
            element.innerHTML = toolbarItem.iconSVG;
        } else if (toolbarItem.iconURL) {
            element.style.backgroundImage = toolbarItem.iconURL;
            element.className += ' toolbar-url-icon';
        }
        
        return element;
    }
    
    public deselectAll(itemToIgnore: ToolbarItem) {
        let item: ToolbarItem;
        for (item of this.items) {
            if (item != itemToIgnore && item instanceof AbstractToolbarPushItem) {
                (item as AbstractToolbarPushItem).setPushed(false);
            }
        }
    }
    
    public doLayout() {
        let me = this,
            items = me.items,
            numTotalItems = items.length,
            numAllowedButtons = items.length,
            container = me.container,
            width = container.getBoundingClientRect().width,
            buttonWidth = width / numAllowedButtons,
            totalToolbarWidth;
            
        buttonWidth = Math.min(30, Math.max(24, buttonWidth));
        totalToolbarWidth = buttonWidth * items.length;
        
        while (totalToolbarWidth > width) {
            numAllowedButtons--;
            buttonWidth = width / numAllowedButtons;
            buttonWidth = Math.min(30, Math.max(24, buttonWidth));
            totalToolbarWidth = buttonWidth * numAllowedButtons;
        }
        
        if (numAllowedButtons < numTotalItems) {
            if (!me.submenuItems) {
                me.submenuItems = [];
            }
            let i, maxKeepIndex = numAllowedButtons - 2, 
                itemToRemove;
            for (i = maxKeepIndex; i < numTotalItems - 1;i++) {
                itemToRemove = items[i];
                me.submenuItems.push(itemToRemove);
                container.removeChild(itemToRemove.element);
            }
            
            let showMenuItemsButton = me.showMenuItemsButton;
            if (showMenuItemsButton == null) {
                showMenuItemsButton = document.createElement('div');
                let configUI = me.config.ui;
                showMenuItemsButton.innerHTML = MoreIcon;
                showMenuItemsButton.classList.add('default-toolbar-item');
                if (configUI !== '') {
                    showMenuItemsButton.classList.add(configUI);
                }
                showMenuItemsButton.addEventListener('click', me.showMoreIcons);
                container.appendChild(showMenuItemsButton);
            }
        }
        
    }
    
    private showMoreIcons = () => {
        let me = this,
            submenuContainer = me.submenuContainer;
        if (!submenuContainer) {
            submenuContainer = document.createElement('div');
            submenuContainer.classList.add('default-toolbar');
            submenuContainer.classList.add('more-items-toolbar');
            if (me.config.ui != '') {
                submenuContainer.classList.add(me.config.ui);
            }
            me.container.appendChild(submenuContainer);
            
            let subClass = 'default-toolbar-submenu-item';

            for (let item of me.submenuItems) {
                if (!item.element.classList.contains(subClass)) {
                    item.element.classList.add(subClass);
                }
                submenuContainer.appendChild(item.element);
            }
            
            if (Utils.isMobileDevice()) {
                window.addEventListener('touchstart', me.hideSubMenu);
            } else {
                window.addEventListener('mousedown', me.hideSubMenu);
            }
            me.submenuContainer = submenuContainer;
        }
        
        if (submenuContainer.style.display == 'block') {
            submenuContainer.style.display = 'none';
        } else {
            submenuContainer.style.display = 'block';
        }
    }
    
    private hideSubMenu = (evt: MouseEvent | TouchEvent) => {
        let me = this, target = Utils.getTarget(evt),
            submenuContainer = me.submenuContainer;

        if (submenuContainer) {
            while (target) {
                if (target == submenuContainer) {
                    return;
                }
                if (target instanceof HTMLElement || target instanceof SVGElement) {
                    target = (target as HTMLElement | SVGElement).parentElement;
                } else {
                    break;
                }
            }
            submenuContainer.style.display = 'none';
        }
    }
    
}
