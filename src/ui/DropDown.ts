import {Utils} from "../utils/Utils"
import Config from "../Config"

const SIMULATED_EVENT: number = -10000;
export class DropDown {
    
    protected container: HTMLDivElement;
    
    protected optionsContainer: HTMLDivElement;
    
    protected valueDiv: HTMLDivElement;
    
    protected intervalID: number;
    
    public onchange: (index: number, value?: any, topIndex?: number) => void;
    
    public onclose: () => void;
    
    protected selectedIndex: number;
    
    protected editable: boolean = false;
    
    protected multiOptions: boolean = false;
    
    protected mouseOverTimeout: number = 0;
    
    private subDropDownVisible: boolean = false;
    
    constructor(config: Config, options: Array<any>, cls?: string, valueCls? : string) {
        let d = document, 
            container = d.createElement('div'),
            optionsContainer = d.createElement('div'),
            isMobileDevice = Utils.isMobileDevice(),
            isPhone = Utils.isPhone(),
            index = 0, me = this;
            
        container.className = config.ui + '-drop-down' + (cls ? ' ' + cls : '');
        optionsContainer.className = 'options-container';
        
        if (isPhone) {
            optionsContainer.classList.add('mobile-dropdown-container');
            optionsContainer.classList.add(config.ui + '-mobile-dropdown-container');
            optionsContainer.addEventListener('touchmove', function (evt: TouchEvent) {
                evt.preventDefault();
            });
        }
        
        if (!valueCls) {
            valueCls = '';
        }
        valueCls += ' value';
        
        container.innerHTML = '<div class="body"><div class="' + valueCls + '"></div><div class="arrow"></div></div>';
        
        for(let optionHTML of options) {
            if (Array.isArray(optionHTML)) {
                this.multiOptions = true;
                if (optionHTML.length > 0) {
                    let optionElement = d.createElement('div');
                    optionElement.setAttribute('optIndex', index.toString());
                    optionElement.setAttribute('hasSubDropdDown', '1');
                    optionElement.className = 'option';
                    if (isMobileDevice) {
                        optionElement.addEventListener('touchend', me.onOptionEvent, { passive: false });
                    } else {
                        optionElement.addEventListener('mouseover', me.onOptionEvent);
                        optionElement.addEventListener('mouseout', me.onOptionEvent);
                    }
                    
                    optionElement.innerHTML = '<div class="sub-item">' + optionHTML[0] + '<div class="right-arrow"></div></div>';
                    optionsContainer.appendChild(optionElement);
                    
                    let subOptionsContainer = d.createElement('div');
                    subOptionsContainer.className = 'subdrop-down';
                    if (isPhone) {
                        subOptionsContainer.classList.add("mobile-sub-dropdown");
                    }
                    subOptionsContainer.setAttribute('subIndex', index.toString());
                    subOptionsContainer.addEventListener('mouseover', me.onSubOptionsOver);
                    let skipFirstOption = true,
                        subIndex = 0;
                    for (let subOptions of optionHTML) {
                        if (skipFirstOption) {
                            skipFirstOption = false;
                            continue;
                        }
                        let subOptionElement = d.createElement('div');
                        subOptionElement.setAttribute('optIndex', subIndex.toString());
                        subOptionElement.setAttribute('optValue', typeof(subOptions) === 'string' ? subOptions : subOptions.value);
                        subOptionElement.className = 'option';
                        if (isPhone) {
                            subOptionElement.classList.add("mobile-sub-option");
                        }
                        subOptionElement.innerHTML = '<div class="padding"></div>' + (typeof(subOptions) === 'string' ? subOptions : subOptions.html) + '<div class=""></div>';
                        if (isMobileDevice) {
                            subOptionElement.addEventListener('touchend', me.selectOption,  { passive: false });
                        } else {
                            subOptionElement.addEventListener('click', me.selectOption, false);
                        }
                        subOptionsContainer.appendChild(subOptionElement);
                        subIndex++;
                    }
                    
                    optionElement.firstChild.appendChild(subOptionsContainer);
                }
            } else {
                let optionElement = d.createElement('div');
                optionElement.setAttribute('optIndex', index.toString());
                optionElement.className = 'option';
                optionElement.innerHTML = optionHTML;
                optionElement.setAttribute('optValue', optionHTML);
                if (isMobileDevice) {
                    optionElement.addEventListener('touchend', me.selectOption,  { passive: false });
                } else {
                    optionElement.addEventListener('click', me.selectOption, false);
                }
                optionsContainer.appendChild(optionElement);
            }
            index++;
        }
        
        if (isMobileDevice) {
            container.firstChild.addEventListener('touchstart', me.onDropDownClick,  { passive: false });
        } else {
            container.firstChild.addEventListener('click', me.onDropDownClick, false);
        }
        me.valueDiv = (container.getElementsByClassName(valueCls)[0] as HTMLDivElement);
        if (!isPhone) {
            container.appendChild(optionsContainer);
        }
        
        me.container = container;
        me.optionsContainer = optionsContainer;
        
        if (isPhone) {
            let topButtonsDiv = d.createElement('div');
            topButtonsDiv.className = config.ui + '-mobile-buttons';
            optionsContainer.insertBefore(topButtonsDiv, optionsContainer.firstChild);
            let closeButtonDiv = d.createElement('div');
            if (me.multiOptions) {
                let backButtonDiv = d.createElement('div');
                backButtonDiv.className = 'back-button';
                topButtonsDiv.appendChild(backButtonDiv);
                backButtonDiv.addEventListener('touchstart', me.onBackButton, { passive: false });
            }

            closeButtonDiv.className = 'close-button';
            topButtonsDiv.appendChild(closeButtonDiv);
            closeButtonDiv.addEventListener('touchend', me.closeDropDown);
        }
        
    }
    
//    private log(str: string) {
//        let textArea = (document.getElementById("logArea") as HTMLTextAreaElement);
//        textArea.value += str + '\n';
//        textArea.scrollTop = textArea.scrollHeight;
//    }
    
    protected onSubOptionsOver = (evt: MouseEvent) => {
        let me = this;
        if (me.mouseOverTimeout) {
            window.clearTimeout(me.mouseOverTimeout);
            me.mouseOverTimeout = 0;
        }
    }
    
    protected onOptionEvent = (evt: MouseEvent | TouchEvent) => {
        let element = evt.target as HTMLElement,
            isTouchStartEvent = evt.type == 'touchend',
            isMouseOver = evt.type == 'mouseover' || isTouchStartEvent,
            me = this,
            subDropDown: HTMLElement;
        evt.stopPropagation();
        while (element.className.indexOf('option') < 0) {
            element = element.parentElement as HTMLElement;
        }
        
        if (element.getAttribute('hasSubDropdDown') === '1') {
            me.subDropDownVisible = true;
            subDropDown = (element.getElementsByClassName('subdrop-down')[0] as HTMLElement);
            
            if (Utils.isPhone()) {
                window.setTimeout(function() {
                    subDropDown.style.display = '';
                    subDropDown.classList.add('mobile-show-elem');
                }, 300);
                return;
            }
            if (!isMouseOver) {
                me.mouseOverTimeout = window.setTimeout(function(){
                    subDropDown.style.display = 'none';                
                }, 500);
                return;
            } else {
                let mouseOverTimeout = me.mouseOverTimeout;
                if (mouseOverTimeout || isTouchStartEvent) {
                    if (mouseOverTimeout) {
                        window.clearTimeout(mouseOverTimeout);
                        me.mouseOverTimeout = 0;
                    }
                    let menuItem = element.parentElement.firstChild as HTMLElement,
                        subItem;
                    while (menuItem) {
                        if (menuItem != element) {
                            subItem = menuItem.getElementsByClassName('subdrop-down');
                            if (subItem.length) {
                                (subItem[0] as HTMLElement).style.display = 'none';
                            }
                        }
                        menuItem = menuItem.nextSibling as HTMLElement;
                    }
                }
            }
            subDropDown.style.display = isMouseOver ? 'inline-block' : 'none';
        } else if (me.multiOptions) {
            me.removeMobileCls();
        }
    }
    
    public setSelectedIndex(primaryIndex: number, subIndex?: number) {
        let me = this,
            isMobilePhone = Utils.isPhone();
        if (subIndex !== undefined) {
            let subDropDowns = me.optionsContainer.childNodes;
            if (primaryIndex < 0 || primaryIndex >= subDropDowns.length) {
                primaryIndex = 0;
            }
            
            if (isMobilePhone) {
                primaryIndex++;
            }
            
            let subOptions = (subDropDowns[primaryIndex] as HTMLDivElement).getElementsByClassName('subdrop-down')[0].childNodes;
            if (subIndex < 0 || subIndex >= subOptions.length) {
                subIndex = 0;
            }
            let click = new MouseEvent('click', {
                detail: SIMULATED_EVENT
            }),
                optionElement = (subOptions[subIndex] as HTMLDivElement);
            
            optionElement.dispatchEvent(click);
            return;
        }
        if (primaryIndex < 0 || primaryIndex > me.optionsContainer.childNodes.length) {
            primaryIndex = 0;
        }
        
        me.selectedIndex = primaryIndex;
        if (!me.multiOptions) {
            if (isMobilePhone) {
                primaryIndex++;
            }
            me.valueDiv.innerHTML = (me.optionsContainer.childNodes[primaryIndex] as HTMLDivElement).innerHTML;
        }
        
        if (me.onchange) {
            me.onchange(me.selectedIndex);
        }
    }
    
    private checkContainer = () => {
        let me = this,
            parent = me.container.parentElement,
            body = document.body;
        while (parent) {
            if (parent == body) {
                return;
            }
            parent = parent.parentElement;
        }
        
        me.subDropDownVisible = false;
        me.removeMobileCls();
        if (me.intervalID > 0) {
            window.clearInterval(me.intervalID);
            me.intervalID = 0;
        }
        me.clearListeners();
    }
    
    private removeMobileCls(clsToRemove?:string, clsToAdd?: string) {
        if (Utils.isPhone()) {
            if (!clsToRemove) {
                clsToRemove = 'mobile-show-elem';
            }
            let mobileSubElems = this.optionsContainer.getElementsByClassName(clsToRemove), 
                i, l = mobileSubElems.length, elem;
            for(i=0;i<l;i++) {
                elem = (mobileSubElems[i] as HTMLElement);
                elem.classList.remove(clsToRemove);
                if (clsToAdd) {
                    elem.classList.add(clsToAdd);
                } else {
                    elem.style.display = 'none';
                }
            }
        }
    }
    
    private onBackButton = (evt: TouchEvent) => {
        let me = this;
        if (me.subDropDownVisible) {
            me.removeMobileCls(null, 'mobile-hide-elem');
            window.setTimeout(function(){
                me.removeMobileCls('mobile-hide-elem');
            }, 1000);
        } else {
            if (Utils.isPhone()) {
                me.optionsContainer.parentElement.removeChild(me.optionsContainer);
            }
//            me.optionsContainer.style.display = 'none';
            me.clearListeners();
        }
    }
    
    private clearListeners = () => {
        if (Utils.isMobileDevice()) {
            window.removeEventListener('touchstart', this.hideDropDown, false);
        } else {
            window.removeEventListener('click', this.hideDropDown, false);
        }
    }
    
    private onDropDownClick = (evt: Event) => {
        let me = this,
            body = document.body,
            optionsContainer = me.optionsContainer;

        if (!optionsContainer.parentElement) {
            if (Utils.isPhone()) {
                body.appendChild(optionsContainer);
                body.style.overflow = 'hidden';
            } else {
                me.container.appendChild(optionsContainer);
            }
        }
        evt.stopPropagation();
        optionsContainer.style.display = 'block';
        let parentBoundBox = optionsContainer.parentElement.getBoundingClientRect(),
            optionsBounds = optionsContainer.getBoundingClientRect();
        if (parentBoundBox.top + optionsBounds.height > window.innerHeight) {
            optionsContainer.style.top = -(optionsBounds.height + parentBoundBox.height) + 'px';
        } else {
            optionsContainer.style.top = '0';
        }
//        add a timeout to check when container is removed from the DOM tree and remove event listener
        me.intervalID = window.setInterval(me.checkContainer, 1000);
        
        window.setTimeout(function(obj: DropDown) {
            if (Utils.isMobileDevice()) {
                window.addEventListener('touchstart', obj.hideDropDown, { passive: false });
            } else {
                window.addEventListener('click', obj.hideDropDown, false);
            }
        }, 500, me);
    }
    
    private closeDropDown = (evt: TouchEvent) => {
        evt.preventDefault();
        let me = this;
        //if (Utils.isPhone()) {
        me.optionsContainer.parentElement.removeChild(me.optionsContainer);
        //}
//        this.optionsContainer.style.display = 'none';
        me.clearListeners();
    }
    
    private hideDropDown = (evt: MouseEvent | TouchEvent) => {
        let me = this,
            optionsContainer = me.optionsContainer,
            target = evt ? evt.target as HTMLElement : null,
            intervalID = me.intervalID;
        while (target) {
            if (target == optionsContainer) {
                return;
            }
            target = target.parentElement;
        }
        
        if (intervalID > 0) {
            window.clearInterval(intervalID);
            me.intervalID = 0;
        }
        
        if (optionsContainer.parentElement) {
            optionsContainer.parentElement.removeChild(optionsContainer);
        }
        me.clearListeners();
    }
    
    private selectOption = (evt: MouseEvent) => {
        let me = this;
        evt.preventDefault();
        evt.stopPropagation();
        //        me.optionsContainer.style.display = 'none';
        if (Utils.isPhone() && me.optionsContainer.parentElement) {
            me.optionsContainer.parentElement.removeChild(me.optionsContainer);
        }
        let target = evt.target as HTMLDivElement;
        while (!target.getAttribute('optIndex')) {
            target = target.parentElement as HTMLDivElement;
        }
        
        let value = target.getAttribute('optValue'),
            allOptions = target.parentElement.childNodes,
            i, l = allOptions.length,
            allDivs = target.getElementsByTagName('div'),
            checkedDivs,
            subOptionsContainer = target.parentElement;
            
        while (subOptionsContainer && subOptionsContainer.className.indexOf('subdrop-down') < 0) {
            subOptionsContainer = subOptionsContainer.parentElement;
        }
        
        if (evt.detail != SIMULATED_EVENT && subOptionsContainer) {
            subOptionsContainer.style.display = 'none';
        }
        
        if (me.multiOptions) {
            for(i=0;i<l;i++) {
                if (allOptions[i] != target) {
                    checkedDivs = (allOptions[i] as HTMLDivElement).getElementsByClassName('checked');
                    if (checkedDivs.length) {
                        checkedDivs[0].className = '';
                    }
                }
            }
            allDivs[allDivs.length - 1].className = 'checked';
        }
        
        me.selectedIndex = parseInt(target.getAttribute('optIndex'), 10);
        if (!me.multiOptions) {
            if (me.editable) {
                (me.valueDiv.firstChild as HTMLInputElement).value = target.innerHTML;
            } else {
                me.valueDiv.innerHTML = target.innerHTML;
            }
        }
        
        if (me.onchange) {
            me.onchange(me.selectedIndex, value, 
                me.multiOptions ? parseInt(target.parentElement.getAttribute('subIndex'), 10) : 0);
        }
        
        if (me.onclose) {
            me.onclose();
        }

        if (evt.detail != SIMULATED_EVENT) {
            me.hideDropDown(null);
            window.clearInterval(me.intervalID);
            me.intervalID = 0;
        }
        
    }
    
    public getElement(): HTMLDivElement {
        return this.container;
    }
    
    public setEditable(editable: boolean) {
        let me = this;
        if (me.editable != editable) {
            me.editable = editable;
            if (editable) {
                let setInputFilter = function(textbox: any, inputFilter: (any)) {
                    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
                        textbox.oldValue = "";
                        textbox.addEventListener(event, function() {
                            let input = this;
                            if (inputFilter(input.value)) {
                                input.oldValue = input.value;
                                input.oldSelectionStart = input.selectionStart;
                                input.oldSelectionEnd = input.selectionEnd;
                                if (me.onchange) {
                                    me.onchange(-1, input.value);
                                }
                            } else if (input.hasOwnProperty("oldValue")) {
                                input.value = input.oldValue;
                                input.setSelectionRange(input.oldSelectionStart, input.oldSelectionEnd);
                            }
                        });
                    });
                };
                me.valueDiv.innerHTML = '<input type="text"/>';
                let inputElement = me.valueDiv.firstChild;
                inputElement.addEventListener(Utils.isMobileDevice() ? 'touchstart' : 'click', function(evt) {
                    evt.stopPropagation();
                });
                setInputFilter(inputElement, function(value: any) {
                    return /^\d*$/.test(value);
                });
            } else {
                me.valueDiv.innerHTML = '';
            }
        }
    }
    
    public isOpen(): boolean {
        return this.intervalID > 0;
    }
    
}
