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
        container.className = config.ui + '-dialog';

        bodyDiv.style.height = '120px';
        
        let label = d.createElement('label');
        label.className = 'label';
        label.innerHTML = 'Blur Radius';
        bodyDiv.appendChild(label);
        
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
        label.innerHTML = 'Transparency';
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
//        me.height = 175;
        
        let sampleDiv = d.createElement('div');
        
        bodyDiv.appendChild(sampleDiv);
        sampleDiv.className = 'sample';
        sampleDiv.style.height = '30px';
        
        let allPatterns = AnnotationUtils.getDefs(config).getElementsByTagName('pattern'),
            l = allPatterns.length, i;
        for (i = 0;i<l;i++) {
            if (allPatterns[i].id.indexOf('mainFillPattern') === 0) {
                sampleDiv.style.backgroundImage = 'url("' + (allPatterns[i].getElementsByTagName('image')[0] as SVGImageElement).href.baseVal + '")';
                break;
            }
        }
        
//        let easyAnnotatorSVGContainer = d.getElementById('easyAnnotatorSVGContainer') as Element,
//            mainPattern = easyAnnotatorSVGContainer.getElementById('');
//        sampleDiv.style.backgroundImage = 'url("' + config.;
        
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
        
        if (showOpacity) {
            me.transparencySlider.style.display = 'block';
            me.transparencySlider.value = opacity;
            me.transparencyLabel.style.display = 'block';
            if (!isPhone) {
                me.container.style.height = '180px';
            }
        } else{
            me.transparencySlider.style.display = 'none';
            me.transparencyLabel.style.display = 'none';
            if (!isPhone) {
                me.container.style.height = '150px';
            }
        }
        
        me.blurSlider.value = blur;
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
