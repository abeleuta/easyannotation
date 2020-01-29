import Config from '../Config';
import {ToolbarItem} from "./ToolbarItem"
import {AbstractToolbarPushItem} from "./AbstractToolbarPushItem"
import {Utils} from "../utils/Utils"
import {BaseDialog} from "../ui/BaseDialog"

import MoreIcon from "../icons/more.svg"

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
        var container = document.createElement('div');
        container.className = config.ui + '-toolbar';
        
        if (config.toolbarCls) {
            container.classList.add(config.toolbarCls);
        }
        
        for (var item of this.items) {
            var toolbarElement = this.getUIElement(config, item);
            item.element = toolbarElement;
            container.appendChild(toolbarElement);
        }
        
        config.targetElement.appendChild(container);
        
        this.container = container;
    }
    
    public getContainer() {
        return this.container;
    }
    
    protected getUIElement(config: Config, toolbarItem: ToolbarItem) {
        var me = this;
        var element = document.createElement('div');
        element.className = config.ui + '-toolbar-item';
        
        if (toolbarItem.itemId) {
            element.id = toolbarItem.itemId;
        }
        
        if (toolbarItem.title) {
            element.title = toolbarItem.title;
        }
        
        element.onclick = function (evt: MouseEvent) {
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
        
        console.log('numAllowedButtons=' + numAllowedButtons);
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
//                showMenuItemsButton.classList.add(configUI + '-toolbar-more-btn');
                showMenuItemsButton.innerHTML = MoreIcon;
                showMenuItemsButton.classList.add(configUI + '-toolbar-item');
                showMenuItemsButton.addEventListener('click', me.showMoreIcons);
                container.appendChild(showMenuItemsButton);
//                container.insertBefore(showMenuItemsButton, items[numTotalItems - 1].element);
            }
        }
        
    }
    
    private showMoreIcons = () => {
        let me = this,
            submenuContainer = me.submenuContainer;
        if (!submenuContainer) {
            submenuContainer = document.createElement('div');
            submenuContainer.classList.add(me.config.ui + '-toolbar-submenu');
            me.container.appendChild(submenuContainer);
            
            let subClass = me.config.ui + '-toolbar-submenu-item';
            
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
        let me = this, target = evt.target,
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
