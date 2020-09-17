
import {Blur} from "./Blur"

class BlurEffect {
    x: number;
    y: number;
    w: number;
    h: number;
    b: number;
}

export class Utils {
    
    private static isMobile: boolean = !!(navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i));
            
    private static checkMobile() {
        let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
                if (window.innerWidth <= 720 && window.innerHeight <= 1280) {
                    check = true;
                }
            }})(navigator.userAgent||navigator.vendor||(window as any).opera);
        return check;
    }
    private static _isMobilePhone:boolean = Utils.checkMobile();
    
    private static _isEdge: boolean = window.navigator.userAgent.indexOf("Edge") > -1;
            
    public static isMobileDevice() {
        return this.isMobile;
    }
    
    public static isPhone() {
        return this._isMobilePhone;
    }
    
    public static isEdge() {
        return this._isEdge;
    }
    
    public static getBrowserSpec() : any {
        let ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        
            if(/trident/i.test(M[1])){
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name:'IE',version:(tem[1] || '')};
        }
        
        if(M[1]=== 'Chrome'){
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem != null) return {name:tem[1].replace('OPR', 'Opera'),version:tem[2]};
        }
        
        M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem = ua.match(/version\/(\d+)/i))!= null) {
            M.splice(1, 1, tem[1]);
        }
        return {name:M[0], version:M[1]};
    }

    public static fixIOSSlider(slider: HTMLInputElement) {
        let me = this;
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            //do this for IOS only
            slider.addEventListener('touchstart', me.onSliderTouch);
            slider.addEventListener('touchmove', me.onSliderTouch);
        }
    }

    private static onSliderTouch = (evt: TouchEvent) => {
        if (evt.touches.length) {
            let slider = evt.target as HTMLInputElement;
            let clientRect = slider.getBoundingClientRect(),
                xVal = evt.touches[0].screenX - clientRect.left,
                value = xVal * parseInt(slider.max, 10) / clientRect.width;
            slider.value = Math.round(value) + '';
        }
    }

    
    public static exportToPNG(imageElement: HTMLImageElement, svgElement: SVGSVGElement, callback: (imageData: string) => void) {
        let width = svgElement.width.baseVal.value,
            height = svgElement.height.baseVal.value;
            
        let canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        context.drawImage(imageElement, 0, 0, width, height);

        let parser = new DOMParser(),
            svgContent = svgElement.outerHTML,
            foreignObjectIndex = svgContent.indexOf('<foreignObject'),
            groupStartIndex,
            groupEndIndex;

        while (foreignObjectIndex >= 0) {
            groupStartIndex = svgContent.lastIndexOf('<g', foreignObjectIndex);
            groupEndIndex = svgContent.indexOf('</g>', foreignObjectIndex + 20);
            svgContent = svgContent.substring(0, groupStartIndex) + svgContent.substr(groupEndIndex + 4);
            foreignObjectIndex = svgContent.indexOf('<foreignObject');
        }

//        first need to remove all unfinished Pictures that have no image but only text and <input tag
        let xmlDoc = parser.parseFromString(svgContent, "text/xml"),
            defs = xmlDoc.getElementsByTagName('defs')[0],
            allPatterns = defs.getElementsByTagName('pattern'),
            numImages = allPatterns.length, i;
            
        for (i = 0; i < numImages;i++) {
            if (allPatterns[i].id.indexOf('mainFillPattern') === 0) {
                defs.removeChild(allPatterns[i]);
                break;
            }
        }
        
        let firstElement = xmlDoc.getElementsByTagName('svg')[0].firstChild,
            allBluring = new Array<BlurEffect>();
        while (firstElement) {
            if (firstElement.nodeName.toLowerCase() == 'g') {
                let firstGroupChild = firstElement.firstChild;
                if (firstGroupChild.nodeName.toLowerCase() == 'rect') {
                    let transform = (firstElement as SVGGElement).transform.baseVal.getItem(0).matrix,
                        transformX = transform.e,
                        transformY = transform.f
                    let rect = firstGroupChild as SVGRectElement,
                        filter = rect.getAttribute('filter');
                    if (rect.classList.contains('blur-rect') && filter && filter.indexOf('#bluringFilter') > 0) {
//                        is bluring, so need to add an image
//                        url(#bluringFilter0_1)
                        let blurFilterID = filter.substr(5, filter.length - 6),
                            firstDef = defs.firstChild;
                        
                        while (firstDef) {
                            if (firstDef.nodeName.toLowerCase() == 'filter' && (firstDef as SVGFilterElement).id == blurFilterID) {
                                let blurValue = ((firstDef as SVGFilterElement).firstChild as SVGFEGaussianBlurElement).getAttribute('stdDeviation');
                                allBluring.push({
                                    x: rect.x.baseVal.value + transformX,
                                    y: rect.y.baseVal.value + transformY,
                                    w: rect.width.baseVal.value,
                                    h: rect.height.baseVal.value,
                                    b: parseFloat(blurValue)
                                } as BlurEffect);
                                break;
                            }
                            firstDef = firstDef.nextSibling;
                        }
                        
                    }
                }
            }
            firstElement = firstElement.nextSibling;
        }
        
        
        let svgBlob = new Blob([svgContent], {type: 'image/svg+xml'}),
            url = URL.createObjectURL(svgBlob),
            image = new Image();
        
        image.onload = function() {
            let d = document,
                canvas = d.createElement('canvas'),
                context = canvas.getContext('2d'),
                drawFinalImage = function() {
                    context.drawImage(image, 0, 0);
                    URL.revokeObjectURL(url);
                    let imageSrc = canvas.toDataURL('image/png');
                    callback(imageSrc);
                },
                drawImage = function(allBluring: Array<BlurEffect>, index: number) {
                    let tempCanvas = d.createElement('canvas'),
                        tempContext = tempCanvas.getContext('2d'),
                        blurRect = allBluring[index],
                        w = blurRect.w,
                        h = blurRect.h;
                    tempCanvas.width = w;
                    tempCanvas.height = h;

                    tempContext.drawImage(imageElement, blurRect.x, blurRect.y, w, h, 0, 0, w, h);
                    let imageData = tempContext.getImageData(0, 0, w, h);
                    Blur.blurData(imageData, Math.floor(blurRect.b * 2.5));
                    tempContext.putImageData(imageData, 0, 0);

                    let pngImage = tempCanvas.toDataURL('image/png'),
                        tempImage = new Image(w, h);

                    tempImage.onload = function() {
                        context.drawImage(tempImage, blurRect.x, blurRect.y);
                        if (index < allBluring.length - 1) {
                            drawImage(allBluring, index + 1);
                        } else {
                            drawFinalImage();
                        }
                    };

                    tempImage.src = pngImage;
                };

            canvas.width = width;
            canvas.height = height;
            context.drawImage(imageElement, 0, 0, width, height);
            
            if (allBluring.length == 0) {
                drawFinalImage();
            } else {
                drawImage(allBluring, 0);
            }
        };
        
        image.src = url;
    }

    public static on<K extends keyof HTMLElementEventMap>(elements: Array<Element> | Element | HTMLDocument,
                                                          events: Array<K>, func: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
        let elemArray;
        if (!Array.isArray(elements)) {
            elemArray = [elements];
        } else {
            elemArray = elements as Array<HTMLElement>;
        }

        for(let el of elemArray) {
            for(let evt of events) {
                el.addEventListener(evt, func, {capture: false});
            }
        }
    }

    public static un<K extends keyof HTMLElementEventMap>(elements: Array<HTMLElement> | Element | HTMLDocument,
                                                          events: Array<K>, func: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
        let elemArray;
        if (!Array.isArray(elements)) {
            elemArray = [elements];
        } else {
            elemArray = elements as Array<HTMLElement>;
        }

        for(let el of elemArray) {
            for(let evt of events) {
                el.removeEventListener(evt, func, {capture: false});
            }
        }
    }

    public static getEvent(evt:MouseEvent | TouchEvent) : Touch | MouseEvent {
        let finalEvent = evt as any;
        if (finalEvent.touches) {
            finalEvent = finalEvent.touches[0];
        }

        return finalEvent;
    }

}
