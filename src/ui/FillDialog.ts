
import Config from "../Config"
import {BaseDialog} from "./BaseDialog"
import {DropDown} from "./DropDown"
import FillStyle from "../model/Styles"
import {EffectType} from "../model/Styles"
import Effect from "../model/Styles"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import { TextAnnotator } from "../annotators/TextAnnotator"
import { Utils } from "../utils/Utils"
import {ColorPicker} from "./ColorPicker";

export class FillDialog extends BaseDialog {
    
    private static readonly BLUR_OPTIONS = ['.2px', '.5px', '1px', '3px', '5px', '10px'];
    
    private static readonly SHADOW_OPTIONS = ['1px', '2px', '5px', '10px', '20px'];
    
    private sampleDiv: HTMLDivElement;
    
    private fillStyle: FillStyle;
    
    private colorPickerDiv: HTMLDivElement;
    
    private fillPatternDropDown: DropDown;
    
    private fillPatternLabel: HTMLLabelElement;
    
    private picker: ColorPicker;
    
    private opacitySlider: HTMLInputElement;
    
    private effectsDropDown: DropDown;
    
    private config: Config;
    
    private blurIndex: number = 0;
    
    private shadowIndex: number = 0;
    
    constructor(config: Config, fillStyle?: FillStyle) {
        super();
        
        let me = this;
        
        me.config = config;
        me.picker = null;
        me.height = 275;
        me.fillStyle = {
            fillType: fillStyle ? fillStyle.fillType : 0,
            color: fillStyle ? fillStyle.color : '#000',
            opacity: fillStyle ? fillStyle.opacity : 100,
            effects: fillStyle ? fillStyle.effects : []
        } as FillStyle;
        let d = document, 
            container = d.createElement('div'),
            okButton = d.createElement('button'),
            bodyDiv = d.createElement('div'),
            cancelButton = d.createElement('button');
        bodyDiv.className = 'body';
        container.appendChild(bodyDiv);
        container.className = config.ui + '-dialog';

        bodyDiv.style.height = '180px';
        
        let label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Fill Pattern';
        me.fillPatternLabel = label;
        bodyDiv.appendChild(label);
        
        let dropdownOptions = ['<div style="height:20px;background:#000;"></div>'], i;
        for(i=1;i<10;i++) {
            dropdownOptions.push('<div class="fill-pattern' + i + '" style="height:20px;"></div>');
        }
        
        let fillPatternDropDown = new DropDown(config, dropdownOptions, null, 'fill-value');
        fillPatternDropDown.setSelectedIndex(fillStyle.fillType);
        fillPatternDropDown.onchange = me.onFillStyleChange;
        bodyDiv.appendChild(fillPatternDropDown.getElement());
        
        me.fillPatternDropDown = fillPatternDropDown;

        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Color';
        bodyDiv.appendChild(label);
        
        let colorPickerDiv = d.createElement('div');
        colorPickerDiv.className = 'color-picker';
        bodyDiv.appendChild(colorPickerDiv);
        
        me.colorPickerDiv = colorPickerDiv;

        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Transparency';
        bodyDiv.appendChild(label);
        
        let opacitySlider = d.createElement('input');
        opacitySlider.className = 'slider transparency';
        opacitySlider.type = 'range';
        opacitySlider.max = '100';
        opacitySlider.min = '0';
        opacitySlider.value = fillStyle.opacity.toString();

        Utils.fixIOSSlider(opacitySlider);
        
        me.opacitySlider = opacitySlider;
        
        bodyDiv.appendChild(opacitySlider);
        
        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Effects';
        bodyDiv.appendChild(label);

        let blurDropDownOptions = ['<div>Blur</div>', '<div class="blur-option blur-none">None<div></div></div>'], 
            blurPx = ['1px', '2px', '5px', '10px', '20px', '50px'],
            filterOptions = FillDialog.BLUR_OPTIONS,
            shadowOptions = ['<div>Shadow</div>', 'None'];
        for(i in blurPx) {
            blurDropDownOptions.push('<div class="blur-option">' + blurPx[i] + 
            '<div style="filter:blur(' + filterOptions[i] + ')"></div></div>');
        }
        
        shadowOptions = shadowOptions.concat(FillDialog.SHADOW_OPTIONS);
        let effectsDropDown = new DropDown(config, [
            blurDropDownOptions,
            shadowOptions]);
        effectsDropDown.setSelectedIndex(fillStyle.fillType);
        effectsDropDown.onchange = me.onEffectChange;
        me.effectsDropDown = effectsDropDown;
        bodyDiv.appendChild(effectsDropDown.getElement());
        
        let sampleDiv = d.createElement('div');
        
        bodyDiv.appendChild(sampleDiv);
        sampleDiv.className = 'sample';
        sampleDiv.style.height = '30px';
        
        me.sampleDiv = sampleDiv;

        this.addBaseButtons(container, okButton,cancelButton);

        let clickEventName = 'click';//Utils.isMobileDevice() ? 'tap' : 'click';
        okButton.addEventListener(clickEventName, me.onOKBtnClick);
        cancelButton.addEventListener(clickEventName, me.cancelBtnClick);
        
        me.container = container;
        
    }
        
    public show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: Object) => void) {
        super.show(target, selectedItems, callback);
        
        let me = this,
            fillPattern = -1,
            fillStyle = me.config.fillStyle as FillStyle,
            itemFillStyle,
            itemFillPattern,
            color = '',
            opacity = -1,
            blurIndex = -1,
            itemBlurIndex,
            shadowIndex = -1,
            itemShadowIndex,
            item,
            numTextElements = 0;
        
        for (item of selectedItems) {
            if (item instanceof TextAnnotator) {
                numTextElements++;
            }
            itemFillStyle = item.getFillStyle();
            itemFillPattern = itemFillStyle.fillType;
            
            let itemColor = itemFillStyle.color,
                itemOpacity = itemFillStyle.opacity;
            
            if (itemFillPattern != fillPattern) {
                if (fillPattern === -1) {
                    fillPattern = itemFillPattern;
                } else {
                    fillPattern = -2;
                }
            }
            
            if (itemOpacity != opacity) {
                if (opacity === -1) {
                    opacity = itemOpacity;
                } else {
                    opacity = -2;
                }
            }
            
            if (itemColor != color) {
                if (color === '') {
                    color = itemColor;
                } else {
                    color = '-1';
                }
            }
            
            itemBlurIndex = -1;
            itemShadowIndex = -1;
            if (itemFillStyle.effects) {
                for(let effect of itemFillStyle.effects)  {
                    switch (effect.effectType) {
                        case EffectType.BLUR:
                            itemBlurIndex = effect.index;
                            if (itemBlurIndex != blurIndex) {
                                if (blurIndex === -1) {
                                    blurIndex = itemBlurIndex;
                                } else {
                                    blurIndex = -2;
                                }
                            }
                            break;
                        case EffectType.SHADOW:
                            itemShadowIndex = effect.index;
                            if (itemShadowIndex != shadowIndex) {
                                if (shadowIndex === -1) {
                                    shadowIndex = itemShadowIndex;
                                } else {
                                    shadowIndex = -2;
                                }
                            }
                            break;
                    }
                }
            }
            
            if (itemBlurIndex == -1) {
                blurIndex = -2;
            }
            
            if (itemShadowIndex == -1) {
                shadowIndex = -2;
            }
        }
        
        if (color === '' || color == '-1') {
            color = fillStyle.color;
        }
        
        if (!me.picker) {
            me.picker = new ColorPicker(me.colorPickerDiv, this.config);
            let colorPicker = me.picker;
            colorPicker.on('change', me.pickerColorChange, me);
            colorPicker.on('save', me.pickerSave, me);
            colorPicker.on('cancel', me.pickerCancel, me);
        }
        
        if (fillPattern < 0) {
            fillPattern = fillStyle.fillType;
        }
        
        me.fillPatternDropDown.setSelectedIndex(fillPattern);
        
        if (opacity < 0) {
            opacity = fillStyle.opacity;
        }
        
        if (blurIndex < 0) {
            blurIndex = 0;
        }
        
        if (shadowIndex < 0) {
            shadowIndex = 0;
        }
        
        me.effectsDropDown.setSelectedIndex(0, blurIndex);
        me.effectsDropDown.setSelectedIndex(1, shadowIndex);
        
        me.opacitySlider.value = opacity.toString();
        me.fillStyle.color = color;
        me.picker.setColor(color);

        me.colorPickerDiv.style.backgroundColor = color;
        me.sampleDiv.style.backgroundColor = color;
//        if there are only Text elements, hide Fill
        let patternDisplayMode = numTextElements == selectedItems.length ? 'none' : '';
        me.fillPatternDropDown.getElement().style.display = patternDisplayMode;
        me.fillPatternLabel.style.display = patternDisplayMode;
    }

    private pickerSave = (color: string) => {
        let me = this;
        me.fillStyle.color = color;
        me.sampleDiv.style.backgroundColor = color;
    }

    private pickerCancel = (originalColor: string) => {
        this.pickerSave(originalColor);
        this.colorPickerDiv.style.backgroundColor = originalColor;
    }

    private pickerColorChange = (color: string) => {
        this.colorPickerDiv.style.backgroundColor = color;
        this.fillStyle.color = color;
    }
    
    private onOKBtnClick = () => {
        let me = this,
            effects = null as Array<Effect>,
            blurIndex = me.blurIndex,
            shadowIndex = me.shadowIndex;

        if (blurIndex > 0) {
            let blurValue = '';
            if (blurIndex < FillDialog.BLUR_OPTIONS.length) {
                blurValue = FillDialog.BLUR_OPTIONS[blurIndex];
            }
            effects = [{effectType: EffectType.BLUR, index: blurIndex, value: blurValue} as Effect];
        }

        if (shadowIndex > 0) {
            let shadowValue = '';
            if (shadowIndex < FillDialog.SHADOW_OPTIONS.length) {
                shadowValue = FillDialog.SHADOW_OPTIONS[shadowIndex];
            }
            if (effects == null) {
                effects = [];
            }
            effects.push({effectType: EffectType.SHADOW, index: shadowIndex, value: shadowValue} as Effect);
        }
        
        me.fillStyle.effects = effects ? effects : null;
        me.fillStyle.opacity = parseInt(me.opacitySlider.value, 10);

        if (me.callback) {
            me.callback(me.fillStyle);
        }
        me.hide();
    }
    
    private cancelBtnClick = () => {
        this.hide();
    }
    
    private onFillStyleChange = (index: number) => {
        this.sampleDiv.className = 'sample fill-pattern' + index;
        this.fillStyle.fillType = index;
    }
    
    private onEffectChange = (index: number, val: any, topIndex: number) => {
        let me = this;
        switch (topIndex) {
            case 0:
//            Blur
                me.blurIndex = index;
                break;
            case 1:
//            Shadow
                me.shadowIndex = index;
                break;
        }
        let filter = me.getShadowFilter(me.shadowIndex) + me.getBlurFilter(me.blurIndex);
        if (filter === '') {
            filter = 'none';
        }
        me.sampleDiv.style.filter = filter;
    }
    
    private getBlurFilter(index: number) {
        if (index < 1) {
            return '';
        }
        
        let filterOptions = FillDialog.BLUR_OPTIONS;
        if (index > filterOptions.length) {
            return '';
        }
        return ' blur(' + filterOptions[index - 1] + ')';
    }
    
    private getShadowFilter(index: number) {
        if (index < 1) {
            return '';
        }
        let shadowOptions = FillDialog.SHADOW_OPTIONS;
        if (index > shadowOptions.length) {
            return '';
        }
        let shadowPx = shadowOptions[index - 1] + ' ';
        return ' drop-shadow(' + shadowPx + shadowPx + shadowPx + ')';
    }
    
    protected hideDialog = (evt: MouseEvent) => {
        if (!this.fillPatternDropDown.isOpen() &&
            !this.effectsDropDown.isOpen() &&
            !this.picker.isVisible()) {
            super.hideDialog(evt);
        }
    }
    
}
