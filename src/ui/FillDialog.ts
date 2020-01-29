
import Config from "../Config"
import {BaseDialog} from "./BaseDialog"
import {DropDown} from "./DropDown"
import FillStyle from "../model/Styles"
import {EffectType} from "../model/Styles"
import Effect from "../model/Styles"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import { TextAnnotator } from "../annotators/TextAnnotator"
import { Utils } from "../utils/Utils"

import '@simonwep/pickr/dist/themes/nano.min.css';      // 'nano' theme

import Pickr from '@simonwep/pickr';

export class FillDialog extends BaseDialog {
    
    private static readonly BLUR_OPTIONS = ['.2px', '.5px', '1px', '3px', '5px', '10px'];
    
    private static readonly SHADOW_OPTIONS = ['1px', '2px', '5px', '10px', '20px'];
    
    private sampleDiv: HTMLDivElement;
    
    private fillStyle: FillStyle;
    
    private colorPickerDiv: HTMLDivElement;
    
    private fillPatternDropDown: DropDown;
    
    private fillPatternLabel: HTMLLabelElement;
    
    private picker: PickrConf;
    
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

        let buttonsContainer = d.createElement('div');
        buttonsContainer.className = 'btn-container';
        container.appendChild(buttonsContainer);

        buttonsContainer.appendChild(okButton);
        buttonsContainer.appendChild(cancelButton);
        
        okButton.className = 'button';
        okButton.style.marginRight = '20px';
        cancelButton.className = 'button';
        okButton.innerHTML = 'OK';
        cancelButton.innerHTML = 'Cancel';
        
        let clickEventName = 'click';//Utils.isMobileDevice() ? 'tap' : 'click';
        okButton.addEventListener(clickEventName, me.onOKBtnClick);
        cancelButton.addEventListener(clickEventName, me.cancelBtnClick);
        
        me.container = container;
        
//        this.onLineStyleChange(fillStyle.type);
//        if (selectedIndex >= 0) {
//            lineWidthDropDown.setSelectedIndex(selectedIndex);
//            this.onLineWidthChange(selectedIndex);
//        }

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
            me.picker = ((window as any).Pickr || Pickr).create({
                el: me.colorPickerDiv,//'.color-picker',
                container: me.container,
                theme: 'nano', // or 'monolith', or 'nano'
                
                default: color,

                swatches: [
                    'rgba(244, 67, 54, 1)',
                    'rgba(233, 30, 99, 0.95)',
                    'rgba(156, 39, 176, 0.9)',
                    'rgba(103, 58, 183, 0.85)',
                    'rgba(63, 81, 181, 0.8)',
                    'rgba(33, 150, 243, 0.75)',
                    'rgba(3, 169, 244, 0.7)',
                    'rgba(0, 188, 212, 0.7)',
                    'rgba(0, 150, 136, 0.75)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(139, 195, 74, 0.85)',
                    'rgba(205, 220, 57, 0.9)',
                    'rgba(255, 235, 59, 0.95)',
                    'rgba(255, 193, 7, 1)'
                ],

                components: {

                    // Main components
                    preview: true,
                    opacity: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        hex: false,
                        rgba: false,
                        hsla: false,
                        hsva: false,
                        cmyk: false,
                        input: false,
                        clear: false,
                        save: true,
                        cancel: true
                    }
                }
            });

            let pickr = me.picker;
            pickr.on('change', me.pickerColorChange);
            pickr.on('save', me.pickerSave);
            pickr.on('cancel', me.pickerSave);
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
        
//        console.log('opacity=' + opacity);
        me.opacitySlider.value = opacity.toString();
        me.fillStyle.color = color;
        me.picker.setColor(color);
        me.sampleDiv.style.backgroundColor = color;
//        if there are only Text elements, hide Fill
        let patternDisplayMode = numTextElements == selectedItems.length ? 'none' : '';
        me.fillPatternDropDown.getElement().style.display = patternDisplayMode;
        me.fillPatternLabel.style.display = patternDisplayMode;
    }
    
    private pickerSave = (color: HSVaColor) => {
        this.picker.hide();
    }
    
    private pickerColorChange = (color: HSVaColor) => {
        var hexa = color.toHEXA(),
            me = this,
            hexColor = '#' + hexa[0] + hexa[1] + hexa[2] + (hexa.length > 3 ? hexa[3] : '');
//        console.log('color changed to:' + hexColor);
        me.fillStyle.color = hexColor;
        (me.container.querySelector('button.pcr-button') as HTMLButtonElement).style.color = hexColor;
        me.sampleDiv.style.backgroundColor = hexColor;
//        this.sampleDiv.style.borderTopColor = hexColor;
//        if (me.fillStyle.fillType > 0) {
//            me.sampleDiv.style.backgroundImage = 'url("data:image/svg+xml;utf8,<svg width=\'12px\' height=\'20px\' viewBox=\'0 0 12 20\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\'><line stroke=\'black\' x1=\'0\' y1=\'5\' x2=\'12\' y2=\'5\'/><line stroke=\'' + hexColor + '\' x1=\'0\' y1=\'15\' x2=\'12\' y2=\'15\'/></svg>")';
////            me.sampleDiv.style.backgroundImage.replace('black', hexColor);
//        } else {
//        }
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
//        console.log('OK color=' + me.fillStyle.color);
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
        if (!this.fillPatternDropDown.isOpen() && !this.effectsDropDown.isOpen()) {
            super.hideDialog(evt);
        }
    }
    
}
