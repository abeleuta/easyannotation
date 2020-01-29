
import InternalConfig from "../utils/InternalConfig"
import {BaseDialog} from "./BaseDialog"
import {DropDown} from "./DropDown"
import DrawStyle from "../model/Styles"
import {StrokeType} from "../model/Styles"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {BaseAnnotator} from "../annotators/BaseAnnotator"

import '@simonwep/pickr/dist/themes/nano.min.css';      // 'nano' theme

import Pickr from '@simonwep/pickr';
//const Pickr = require('');
//import Pickr from '@simonwep/pickr';
//export default Pickr;
//import Pickr from '@simonwep/pickr/dist/pickr.es5.min';

export class DrawDialog extends BaseDialog {
    
    private sampleDiv: SVGElement;
    
    private drawStyle: DrawStyle;
    
    private colorPickerDiv: HTMLDivElement;
    
    private arrowStyleDiv: HTMLDivElement;
    
    private drawStyleDropDown: DropDown;
    
    private lineWidthDropDown: DropDown;
    
    private startArrowDropDown: DropDown;
    
    private endArrowDropDown: DropDown;
    
    private picker: PickrConf;
    
    private config: InternalConfig;
    
    constructor(config: InternalConfig, drawStyle?: DrawStyle) {
        super();
        
        let me = this;
        me.config = config;
        me.picker = null;
        me.height = 300;
        me.drawStyle = {
            width: drawStyle ? drawStyle.width : 1,
            type: drawStyle ? drawStyle.type : StrokeType.SOLID,
            color: drawStyle ? drawStyle.color : '#000',
            startArrow: drawStyle ? drawStyle.startArrow : 0,
            endArrow: drawStyle ? drawStyle.endArrow : 0
        } as DrawStyle;
        let d = document, 
            el = d.createElement('div'),
            okButton = d.createElement('button'),
            bodyDiv = d.createElement('div'),
            cancelButton = d.createElement('button');
        bodyDiv.className = 'body';
        el.appendChild(bodyDiv);
        el.className = config.ui + '-dialog';

        bodyDiv.style.height = '230px';
        
        let label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Line Style';
        bodyDiv.appendChild(label);
        
        let drawStyleDropDown = new DropDown(config, [
            '<div style="height:1px;background:#000;margin-top:12px"></div>',
            '<div style="height:1px;border-top:1px dotted #000;margin-top:12px"></div>',
            '<div style="height:1px;border-top:1px dashed #000;margin-top:12px"></div>',
            ]);
        drawStyleDropDown.setSelectedIndex(drawStyle.type);
        drawStyleDropDown.onchange = me.onLineStyleChange;
        me.drawStyleDropDown = drawStyleDropDown;
        bodyDiv.appendChild(drawStyleDropDown.getElement());
        
        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Width';
        bodyDiv.appendChild(label);
        
        let allWidths = [1, 2, 3, 5, 7, 10, 12, 15, 20, 25], i = 0,
            divOptions = [], selectedIndex = -1, width;
        for (i = 0; i < allWidths.length;i++) {
            width = allWidths[i];
            if (width == drawStyle.width) {
                selectedIndex = i;
            }
            divOptions.push('<div style="height:' + width + 'px;background:#000;margin-top:' + (25 - width)/2 + 'px"></div>');
        }
        let lineWidthDropDown = new DropDown(config, divOptions);
        lineWidthDropDown.onchange = me.onLineWidthChange;
        bodyDiv.appendChild(lineWidthDropDown.getElement());
        
        me.lineWidthDropDown = lineWidthDropDown;
        
        this.arrowStyleDiv = d.createElement('div');
        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Arrow';
        this.arrowStyleDiv.appendChild(label);
        
        let arrowStartOptions = new Array<string>(),
            arrowEndOptions = new Array<string>();
            
        arrowStartOptions.push('<div class="arrow-style-none"></div>');
        arrowEndOptions.push('<div class="arrow-style-none"></div>');
            
        for(i=0;i<6;i++) {
            arrowStartOptions.push('<div class="arrow-style arrow-style' + i + '"></div>');
            arrowEndOptions.push('<div class="arrow-style arrow-style-end' + i + '"></div>');
        }
        
        let arrowBeginDropDown = new DropDown(config, arrowStartOptions, 'arrow-style-dropdown');
        let arrowEndDropDown = new DropDown(config, arrowEndOptions, 'arrow-style-dropdown');
        
        me.arrowStyleDiv.appendChild(arrowBeginDropDown.getElement());
        me.arrowStyleDiv.appendChild(arrowEndDropDown.getElement());
        
        arrowBeginDropDown.onchange = me.beginArrowChange;
        arrowEndDropDown.onchange = me.endArrowChange;
        
        me.startArrowDropDown = arrowBeginDropDown;
        me.endArrowDropDown = arrowEndDropDown;
        
        bodyDiv.appendChild(me.arrowStyleDiv);
        
        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Color';
        bodyDiv.appendChild(label);
        
        let colorPickerDiv = d.createElement('div');
        colorPickerDiv.className = 'color-picker';
        bodyDiv.appendChild(colorPickerDiv);
        
        me.colorPickerDiv = colorPickerDiv;

        let sampleDiv = d.createElement('div');
        
        bodyDiv.appendChild(sampleDiv);
        sampleDiv.className = 'sample';
        sampleDiv.innerHTML = '<svg width="200" height="80"><defs></defs><line x1="10" x2="190" y1="40" y2="40" stroke="black"/></svg>';
        
        let defsElement = sampleDiv.getElementsByTagName('defs')[0] as SVGDefsElement;
        for(i=0;i<6;i++) {
            let marker = AnnotationUtils.createArrowMarker(config, i)[0];
            marker.setAttribute('id', 'sampleMarker_' + (i + 1));
            marker.style.stroke = '#000';
            defsElement.appendChild(marker);
            if (i < 2) {
                marker = AnnotationUtils.createArrowMarker(config, i, null, true)[0];
                marker.setAttribute('id', 'start_sampleMarker_' + (i + 1));
                marker.style.stroke = '#000';
                defsElement.appendChild(marker);
            }
        }
        
        me.sampleDiv = sampleDiv.getElementsByTagName('line')[0] as SVGElement;

        let buttonsContainer = d.createElement('div');
        buttonsContainer.className = 'btn-container';
        el.appendChild(buttonsContainer);

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
        
        me.container = el;
        
        me.onLineStyleChange(drawStyle.type);
        if (selectedIndex >= 0) {
            lineWidthDropDown.setSelectedIndex(selectedIndex);
            me.onLineWidthChange(selectedIndex);
        }

    }
    
    public show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: Object) => void) {
        super.show(target, selectedItems, callback);
        
        let me = this,
            strokeType = -1,
            strokeWidth = -1,
            itemStrokeType,
            itemStrokeWidth,
            drawStyle = me.config.drawStyle as DrawStyle,
            color = '',
            startArrow = -1,
            endArrow = -1,
            item;
            
        for (item of selectedItems) {
            let itemDrawStyle = item.getDrawStyle(),
                itemColor = itemDrawStyle.color;
            itemStrokeType = itemDrawStyle.type;
            itemStrokeWidth = itemDrawStyle.width;
            
            if (itemColor != color) {
                if (color === '') {
                    color = itemColor;
                } else {
                    color = '-1';
                }
            }
            
            if (itemDrawStyle.startArrow != startArrow) {
                if (startArrow === -1) {
                    startArrow = itemDrawStyle.startArrow;
                } else {
                    startArrow = -2;
                }
            }
            
            if (itemDrawStyle.endArrow != endArrow) {
                if (endArrow === -1) {
                    endArrow = itemDrawStyle.endArrow;
                } else {
                    endArrow = -2;
                }
            }
            
            if (itemStrokeType != strokeType) {
                if (strokeType == -1) {
                    strokeType = itemStrokeType;
                } else {
//                different values, so use first item
                    strokeType = -2;
                }
            }
            
            if (itemStrokeWidth != strokeWidth) {
                if (strokeWidth == -1) {
                    strokeWidth = itemStrokeWidth;
                } else {
                    strokeWidth = -2;
                }
            }
            
        }
        
        if (strokeType < 0) {
            strokeType = drawStyle.type;
        }
        
        if (strokeWidth < 0) {
            strokeWidth = drawStyle.width;
        }
        
        if (startArrow < 0) {
            endArrow = 0;
        }
        
        if (endArrow < 0) {
            endArrow = 0;
        }
        
        me.drawStyleDropDown.setSelectedIndex(strokeType);
        
        let allWidths = [1, 2, 3, 5, 7, 10, 12, 15, 20, 25],
            widthIndex = allWidths.indexOf(strokeWidth);
        if (widthIndex < 0) {
            widthIndex = 0;
        }
        
        me.lineWidthDropDown.setSelectedIndex(widthIndex);
        me.startArrowDropDown.setSelectedIndex(startArrow);
        me.endArrowDropDown.setSelectedIndex(endArrow);
        
        if (!me.picker) {
            me.picker = ((window as any).Pickr || Pickr).create({
                el: me.colorPickerDiv,//'.color-picker',
                container: me.container,
                theme: 'nano', // or 'monolith', or 'nano'

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

            let pickr = (me.picker as PickrConf);
            pickr.on('change', me.pickerColorChange);
            pickr.on('save', me.pickerSave);
            pickr.on('cancel', me.pickerSave);
        }
        
        if (color === '' || color == '-1') {
            color = drawStyle.color;
        }
        
        me.picker.setColor(color);
    }
    
    private pickerSave = (color: HSVaColor) => {
        this.picker.hide();
    }
    
    private pickerColorChange = (color: HSVaColor) => {
        var hexa = color.toHEXA(),
            hexColor = '#' + hexa[0] + hexa[1] + hexa[2] + (hexa.length > 3 ? hexa[3] : '');
        this.drawStyle.color = hexColor;
        (this.container.querySelector('button.pcr-button') as HTMLButtonElement).style.color = hexColor;
        this.sampleDiv.style.borderTopColor = hexColor;
    }
    
    private onOKBtnClick = () => {
        let me = this;
        if (me.callback) {
            me.callback(me.drawStyle);
        }
        me.hide();
    }
    
    private cancelBtnClick = () => {
        this.hide();
    }
    
    private onLineStyleChange = (index: number) => {
        let sampleDiv = this.sampleDiv,
            strokeArray = 'none',
            strokeLineCap = 'unset';
            
        let elemStyle = sampleDiv.style;
        switch (index) {
            case StrokeType.DOTTED:
                let strokeWidth = parseInt(elemStyle.strokeWidth, 10);
                if (isNaN(strokeWidth)) {
                    return;
                }
                strokeArray = '1 '+(strokeWidth * (strokeWidth < 7 ? 2 : 1.5)).toString();
                strokeLineCap = 'round';
                break;
            case StrokeType.DASHED:
                strokeArray = '10%';
                break;
        }
        
        elemStyle.strokeDasharray = strokeArray;
        elemStyle.strokeLinecap = strokeLineCap;
            
        this.drawStyle.type = index;
    }
    
    private onLineWidthChange = (index: number) => {
        let sampleDiv = this.sampleDiv,
            widths = ['1', '2', '3', '5', '7', '10', '12', '15', '20', '25'];
        sampleDiv.style.strokeWidth = widths[index];
        this.drawStyle.width = parseInt(widths[index], 10);
        this.onLineStyleChange(this.drawStyle.type);
    }
    
    private beginArrowChange = (index: number) => {
        this.changeMarker(index, 'marker-start');
        this.drawStyle.startArrow = index;
    }
    
    private endArrowChange = (index: number) => {
        this.changeMarker(index, 'marker-end');
        this.drawStyle.endArrow = index;
    }
    
    private changeMarker(index: number, markerName: string) {
        let startMarker = 'none';
        if (index > 0) {
            startMarker = 'url(#' + ((index == 1 || index == 2) && markerName == 'marker-start' ? 'start_':'') + 'sampleMarker_' + index + ')';
        }
        this.sampleDiv.setAttribute(markerName, startMarker);
    }
    
    protected hideDialog = (evt: MouseEvent) => {
        let me = this;
        if (!me.drawStyleDropDown.isOpen() && !me.lineWidthDropDown.isOpen() &&
            !me.startArrowDropDown.isOpen() && !me.endArrowDropDown.isOpen()) {
            super.hideDialog(evt);
        }
    }
    
}
