
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
        var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
//                alert(window.innerWidth + 'x' + window.innerHeight);
                if (window.innerWidth <= 720 && window.innerHeight <= 1280) {
                    check = true;
                }
            }})(navigator.userAgent||navigator.vendor||(window as any).opera);
//        (function(a) {
//            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;}
//        )(navigator.userAgent||navigator.vendor||(window as any).opera);
        return check;
    }
    private static _isMobilePhone:boolean = Utils.checkMobile();
    
    private static _isEdge: boolean = window.navigator.userAgent.indexOf("Edge") > -1;
            
    public static isMobileDevice() {
        return /*1 || */this.isMobile;
    }
    
    public static isPhone() {
        return /*1 || */this._isMobilePhone;
    }
    
    public static isEdge() {
        return this._isEdge;
    }
    
    public static getBrowserSpec() : any {
        var ua = navigator.userAgent, tem, 
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
        //mainImageBase64 = canvas.toDataURL('image/png');
            
//        Canvg.fromString(ctx, '<svg width="600" height="600"><text x="50" y="50">Hello World!</text></svg>');
            
//        console.log(svgElement.outerHTML);
//            const svg=`<svg version="1.1" baseProfile="full" width="300" height="200"
//xmlns="http://www.w3.org/2000/svg">
//   <rect width="100%" height="100%" fill="red" />
//   <circle cx="150" cy="100" r="80" fill="green" />
//   <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text></svg>`
//        console.log(svgElement.outerHTML);
        let parser = new DOMParser(),
            svgContent = svgElement.outerHTML,
            foreignObjectIndex = svgContent.indexOf('<foreignObject'),
            groupStartIndex,
            groupEndIndex;
//        console.log('start:' + svgContent);
        
        while (foreignObjectIndex >= 0) {
            groupStartIndex = svgContent.lastIndexOf('<g', foreignObjectIndex);
            groupEndIndex = svgContent.indexOf('</g>', foreignObjectIndex + 20);
            svgContent = svgContent.substring(0, groupStartIndex) + svgContent.substr(groupEndIndex + 4);
            foreignObjectIndex = svgContent.indexOf('<foreignObject');
        }
        
//        console.log('end:' + svgContent);
        
//        first need to remove all unfinished Pictures that have no image but only text and <input tag
//        console.log(svgElement.outerHTML);
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
        
//        <g transform="matrix(1, 0, 0, 1, 168.75, 98.5)" style="z-index: 100; pointer-events: auto;">
//          <rect x="0" y="0" width="135.5" height="66" class="blur-rect" filter="url(#bluringFilter0_1)" fill="url(#bluringPattern0_1)"></rect>
//          <circle transform="translate(-4, -4)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(131.5, -4)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(131.5, 62)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(-4, 62)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle></g>
        let firstElement = xmlDoc.getElementsByTagName('svg')[0].firstChild,
            allBluring = new Array<BlurEffect>();
        while (firstElement) {
            if (firstElement.nodeName.toLowerCase() == 'g') {
                let firstGroupChild = firstElement.firstChild;
                if (firstGroupChild.nodeName.toLowerCase() == 'rect') {
                    let transform = (firstElement as SVGGElement).transform.baseVal.getItem(0).matrix,
                        transformX = transform.e,
                        transformY = transform.f
                    console.log('transformX=' + transformX + ' y=' + transformY);
                    let rect = firstGroupChild as SVGRectElement,
                        filter = rect.getAttribute('filter');
                    if (rect.classList.contains('blur-rect') && filter && filter.indexOf('#bluringFilter') > 0) {
//                        is bluring, so need to add an image
//                        url(#bluringFilter0_1)
                        let blurFilterID = filter.substr(5, filter.length - 6),
                            firstDef = defs.firstChild;
                        
                        console.log('blurFilterID=' + blurFilterID);
                            
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
                                console.log('blurValue=' + blurValue);
                                break;
                            }
                            firstDef = firstDef.nextSibling;
                        }
                        
                    }
                }
            }
            firstElement = firstElement.nextSibling;
        }
        
        
//        console.log('n=' + xmlDoc.getElementsByTagName('defs').length + ' defs=' + defsElement);
            
//        let firstDefsChild = defsElement.firstChild;
//        while (firstDefsChild) {
//            if ((firstDefsChild as SVGElement).id.indexOf('mainFillPattern') === 0) {
//                defsElement.removeChild(firstDefsChild);
//                break;
//            }
//            firstDefsChild = firstDefsChild.nextSibling;
//        }
            
//        let svg = new XMLSerializer().serializeToString(xmlDoc);
//        console.log(svg);
//'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="600" height="400" viewBox="0 0 600 400" id="easyAnnotatorSVGContainer0"><defs><filter id="bluringFilter0_1" filterUnits="userSpaceOnUse" width="110%" height="110%" x="0" y="0"><feGaussianBlur stdDeviation="2"></feGaussianBlur></filter></defs><rect width="100%" height="100%" fill="url(#mainFillPattern0)"></rect><g transform="matrix(1, 0, 0, 1, 267, 95)" style="z-index: 100; pointer-events: auto;"><rect x="0" y="0" width="200" height="80" class="blur-rect" filter="url(#bluringFilter0_1)"></rect><circle transform="translate(-4, -4)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(196, -4)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(196, 76)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(-4, 76)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle></g><g transform="matrix(1, 0, 0, 1, 157, 231)" style="z-index: 0; pointer-events: auto;"><image x="0" y="0" width="228" height="135" draggable="false" href="data:image/png;base64,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"></image><rect x="0" y="0" width="228" height="135" style="stroke: transparent; stroke-width: 2px; stroke-dasharray: none; stroke-linecap: unset; fill: transparent;" filter="none"></rect><circle transform="translate(-4, -4)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(224, -4)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(224, 131)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle><circle transform="translate(-4, 131)" class="anotator-resize-element" r="8" cx="4" cy="4" style="display: none;"></circle></g></svg>';
//        new XML
//        var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
//        console.log(svgElement.outerHTML);
        let svgBlob = new Blob([svgContent], {type: 'image/svg+xml'}),
            url = URL.createObjectURL(svgBlob),
            image = new Image();
        
//        image.setAttribute('crossOrigin', 'anonymous');
            
        image.onload = function() {
            let d = document,
                canvas = d.createElement('canvas'),
                context = canvas.getContext('2d'),
                drawFinalImage = function() {
                    console.log('drawFinalImage');
                    context.drawImage(image, 0, 0);
                    URL.revokeObjectURL(url);
                    let imageSrc = canvas.toDataURL('image/png');
//                    (document.getElementById('resImg') as HTMLImageElement).src = imageSrc;
                    callback(imageSrc);
                },
                drawImage = function(allBluring: Array<BlurEffect>, index: number) {
                    console.log('draw image:' + index);
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
                        console.log('loaded image:' + index);
                        context.drawImage(tempImage, blurRect.x, blurRect.y);
                        if (index < allBluring.length - 1) {
                            drawImage(allBluring, index + 1);
                        } else {
                            drawFinalImage();
                        }
                    };

//                    console.log(pngImage);
                    tempImage.src = pngImage;
                };

            canvas.width = width;
            canvas.height = height;
//            canvas.toDataURL('image/png').
//            console.log('save...........');
            context.drawImage(imageElement, 0, 0, width, height);
            
            if (allBluring.length == 0) {
                drawFinalImage();
            } else {
                drawImage(allBluring, 0);
            }
            
//            context.beginPath();
//            context.rect(100, 100, 100, 100);
//            context.clip();
//            context.filter = 'blur(4px)';
//            context.drawImage(imageElement, 0, 0, width, height);
//            context.closePath();
            

        };
        
//        window.setTimeout(image.onload, 1000);
        
//        console.log(url);
        image.src = url;
//"data:image/svg+xml;base64," + btoa(svg);
//        url;
            
    }
    
}
