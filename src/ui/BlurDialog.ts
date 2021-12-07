import InternalConfig from "../utils/InternalConfig"
import {BaseDialog} from "./BaseDialog"
import {AnnotationUtils} from "../utils/AnnotationUtils"
import {BaseAnnotator} from "../annotators/BaseAnnotator"
import {BlurAnnotator} from "../annotators/BlurAnnotator"
import {ImageAnnotator} from "../annotators/ImageAnnotator"
import {Utils} from "../utils/Utils"

export class BlurDialog extends BaseDialog {
    
    private sampleDiv: HTMLElement;
    
    private blurSlider: HTMLInputElement;

    private blurLabel: HTMLLabelElement;
    
    private transparencySlider: HTMLInputElement;
    
    private transparencyLabel: HTMLLabelElement;
    
    constructor(config: InternalConfig) {
        super();
        
        let me = this,
            d = document,
            container = d.createElement('div'),
            okButton = d.createElement('button'),
            bodyDiv = d.createElement('div'),
            cancelButton = d.createElement('button');

        me.height = 150;
        
        bodyDiv.className = 'body';
        container.appendChild(bodyDiv);
        container.className = 'default-dialog ' + config.ui;

        bodyDiv.style.height = '80px';
        
        let label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = config.translations && config.translations.blurRadius ? config.translations.blurRadius : 'Blur Radius';
        bodyDiv.appendChild(label);

        this.blurLabel = label;
        
        let blurSlider = d.createElement('input');
        blurSlider.className = 'slider transparency';
        blurSlider.type = 'range';
        blurSlider.max = '200';
        blurSlider.min = '0';
        blurSlider.value = '5';
        Utils.fixIOSSlider(blurSlider);
        
        me.blurSlider = blurSlider;
        
        blurSlider.addEventListener('change', me.onBlurChange);
        blurSlider.addEventListener('mousemove', me.onBlurChange);
        
        bodyDiv.appendChild(blurSlider);
        
        label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = config.translations && config.translations.transparency ? config.translations.transparency : 'Transparency';
        bodyDiv.appendChild(label);
        
        me.transparencyLabel = label;

        let transparencySlider = d.createElement('input');
        transparencySlider.className = 'slider transparency';
        transparencySlider.type = 'range';
        transparencySlider.max = '100';
        transparencySlider.min = '0';
        transparencySlider.value = '1';
        Utils.fixIOSSlider(transparencySlider);

        me.transparencySlider = transparencySlider;

        transparencySlider.addEventListener('change', me.onBlurChange);
        transparencySlider.addEventListener('mousemove', me.onBlurChange);

        bodyDiv.appendChild(transparencySlider);

        let sampleDiv = d.createElement('div');
        
        bodyDiv.appendChild(sampleDiv);
        sampleDiv.className = 'sample';
        sampleDiv.style.height = '30px';
        
        let allPatterns = AnnotationUtils.getDefs(config).getElementsByTagName('pattern'),
            l = allPatterns.length, i;
        for (i = 0; i < l; i++) {
            if (allPatterns[i].id.indexOf('mainFillPattern') === 0) {
                sampleDiv.style.backgroundImage = 'url("' + (allPatterns[i].getElementsByTagName('image')[0] as SVGImageElement).href.baseVal + '")';
                break;
            }
        }
        
        this.sampleDiv = sampleDiv;
        this.addBaseButtons(container, okButton, cancelButton);

        okButton.addEventListener('click', me.onOKBtnClick);
        cancelButton.addEventListener('click', me.cancelBtnClick);
        
        me.container = container;
    }
    
    public show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: any) => void) {
        super.show(target, selectedItems, callback);
        
        let blur = '-1',
            itemBlur,
            opacity = '-1',
            itemOpacity,
            item, showOpacity = false;
            
        for (item of selectedItems) {
            if (item instanceof BlurAnnotator) {
                itemBlur = (item as BlurAnnotator).getBlur();
            } else if (item instanceof ImageAnnotator) {
                showOpacity = true;
                itemBlur = (item as ImageAnnotator).getBlur();
                itemOpacity = (item as ImageAnnotator).getOpacity();
                if (itemOpacity != opacity) {
                    if (opacity == '-1') {
                        opacity = itemOpacity;
                    } else {
    //                different values, so use first item
                        opacity = '-2';
                    }
                }
            } else {
                continue;
            }
            
            if (itemBlur != blur) {
                if (blur == '-1') {
                    blur = itemBlur;
                } else {
//                different values, so use first item
                    blur = '-2';
                }
            }
        }
        
        let blurInt = parseInt(blur, 10),
            opacityFloat = parseFloat(opacity);
        if (blurInt < 0) {
            blur = '5';
        } else {
            blur = (blurInt * 15).toString();
        }
        
        if (opacityFloat < 0) {
            opacity = '100';
        } else {
            opacity = (opacityFloat * 100).toString();
        }
        
        let me = this,
            isPhone = Utils.isPhone();
        
        me.transparencySlider.style.display = showOpacity ? 'block' : 'none';
        me.transparencyLabel.style.display = showOpacity ? 'block' : 'none';
        me.blurSlider.style.display = showOpacity ?  'none' : 'block';
        me.blurLabel.style.display = showOpacity ?  'none' : 'block';

        if (showOpacity) {
            me.transparencySlider.value = opacity;
        }
        
        me.blurSlider.value = blur;

        this.sampleDiv.style.filter = 'blur(' + parseFloat(this.blurSlider.value)/15 + 'px)';
    }
    
    private onBlurChange = (evt: Event) => {
        this.sampleDiv.style.filter = 'blur(' + parseFloat(this.blurSlider.value)/15 + 'px)';
    }
    
    private onOKBtnClick = () => {
        let me = this;
        if (me.callback) {
            me.callback({
                blur: parseFloat(me.blurSlider.value)/15,
                opacity: parseFloat(me.transparencySlider.value)/100
            });
        }
        me.hide();
    }
    
    private cancelBtnClick = () => {
        this.hide();
    }

    protected hideDialog = (evt: MouseEvent) => {
        super.hideDialog(evt);
    }
    
}
