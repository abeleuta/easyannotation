
import {Utils} from "../utils/Utils"
import {Font} from "../model/Font"
import {BaseDialog} from "./BaseDialog"
import Config from "../Config"
import {DropDown} from "../ui/DropDown"

export class FontSelector extends BaseDialog {
    
    private font: Font;
    
    private sampleTextDiv: HTMLDivElement;
    
    private fontSizeDropDown: DropDown;
    
    constructor(config: Config, font?: Font) {
        super();
        if (!font) {
            font = new Font();
            let conputedStyle = window.getComputedStyle(document.body,null);
            font.name = conputedStyle.getPropertyValue("font-family");
            font.size = parseInt(conputedStyle.getPropertyValue("font-size"), 10);
            font.italic = false;
        }
        this.font = font;
        let d = document, 
            el = d.createElement('div'),
            okButton = d.createElement('button'),
            bodyDiv = d.createElement('div'),
            cancelButton = d.createElement('button'),
            r = parseInt(''+(Math.random() * 1000), 10);
        bodyDiv.className = 'body';
        el.appendChild(bodyDiv);
        el.className = config.ui + '-dialog';
        
        let fontDropDown = d.createElement('select'),
            allFonts = 
            ['Arial', 'Britannic Bold', 'Broadway', 'Calibri', 'Cambria', 'Centaur', 'Chiller',
             'Consolas', 'Constantia', 'Courier New', 'Freestyle Script', 'Gabriola', 'Georgia',
             'Harlow Solid Italic', 'Harrington', 'Informal Roman', 'Lucida Bright', 'Lucida Calligraphy',
             'Lucida Console', 'Lucida Fax', 'Times New Roman', 'Segoe Script', 'Segoe UI', 'Sans-Serif', 'Tahoma', 'Verdana'], i,
            option;
            
        for (i in allFonts) {
            option = d.createElement('option');
            option.text = allFonts[i];
            option.value = allFonts[i];
            fontDropDown.appendChild(option);
        }
        
        fontDropDown.id = 'fontDlgDropDown' + r;
        
        fontDropDown.addEventListener('change', this.onFontNameChange, false);
        
        let label = d.createElement('label'),
            boldButton = d.createElement('div'),
            italicButton = d.createElement('div');
            
        boldButton.innerHTML = 'B';
        italicButton.innerHTML = 'I';
        boldButton.style.fontWeight = 'bold';
        italicButton.style.fontStyle = 'italic';
        boldButton.className = 'button hover-button';
        italicButton.className = 'button hover-button';
        
        label.innerHTML = 'Font';
        label.htmlFor = fontDropDown.id;
        bodyDiv.appendChild(label);
        bodyDiv.appendChild(fontDropDown);
        bodyDiv.appendChild(boldButton);
        bodyDiv.appendChild(italicButton);
        
        let fontSizeOptions = ['4', '5', '6', '10', '11', '14', '16', '18','20', '24', '28','32', '36', '45', '50'],
            fontSizeContainer = d.createElement('div');
        fontSizeContainer.setAttribute('style', 'width:100%;height:30px;');
        let fontSizeDropDown = new DropDown(config, fontSizeOptions);
        fontSizeDropDown.setEditable(true);
        fontSizeDropDown.onchange = this.onFontSizeChange;
        
        this.fontSizeDropDown = fontSizeDropDown;
        
        label = d.createElement('label');
        label.innerHTML = 'Size';
        fontSizeContainer.appendChild(label);
        let dropDownElement = fontSizeDropDown.getElement();
        dropDownElement.style.marginLeft = '11px';
        fontSizeContainer.appendChild(dropDownElement);
        bodyDiv.appendChild(fontSizeContainer);
        
        let clickEventName = 'click';
        boldButton.addEventListener(clickEventName, this.onButtonClick, true);
        italicButton.addEventListener(clickEventName, this.onButtonClick, true);
        
        let buttonsContainer = d.createElement('div');
        buttonsContainer.className = 'btn-container';
        el.appendChild(buttonsContainer);
        
        let sampleTextDiv = d.createElement('div');
        
        bodyDiv.appendChild(sampleTextDiv);
        sampleTextDiv.className = 'sample';
        sampleTextDiv.innerHTML = 'Sample Text';
        
        this.sampleTextDiv = sampleTextDiv;
        
        buttonsContainer.appendChild(okButton);
        buttonsContainer.appendChild(cancelButton);
        
        okButton.className = 'button';
        okButton.style.marginRight = '20px';
        cancelButton.className = 'button';
        okButton.innerHTML = 'OK';
        cancelButton.innerHTML = 'Cancel';
        
        okButton.addEventListener(clickEventName, this.onOKBtnClick, true);
        cancelButton.addEventListener(clickEventName, this.cancelBtnClick, true);
        
        this.container = el;
    }
    
    private onOKBtnClick = () => {
        if (this.callback) {
            this.callback(this.font);
        }
        this.hide();
    }
    
    private cancelBtnClick = () => {
        this.hide();
    }
    
    private onFontSizeChange = (index: number, value: any) => {
        this.sampleTextDiv.style.fontSize = value + 'px';
        this.font.size = value;
    }
    
    private onButtonClick = (evt: Event) => {
        var button = (evt.target as HTMLButtonElement);
        if (button.innerText == 'B') {
            this.font.bold = !this.font.bold;
            this.sampleTextDiv.style.fontWeight = this.font.bold ? 'bold' : 'normal';
            if (this.font.bold) {
                button.className = 'button';
            } else {
                button.className = 'button hover-button';
            }
        } else {
            this.font.italic = !this.font.italic;
            this.sampleTextDiv.style.fontStyle = this.font.italic ? 'italic' : 'normal';
            if (this.font.italic) {
                button.className = 'button';
            } else {
                button.className = 'button hover-button';
            }
        }
    }
    
    private onFontNameChange = (evt: Event) => {
        let dropDown = (evt.target as HTMLSelectElement),
        fontName = dropDown.options[dropDown.selectedIndex].value;
        this.font.name = fontName;
        this.sampleTextDiv.style.fontFamily = fontName;
    }
       
}