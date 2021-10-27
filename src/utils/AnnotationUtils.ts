import InternalConfig from "../utils/InternalConfig"
import Effect from "../model/Styles"

export class AnnotationUtils {
    
    private static annotatorIdx: number = 0;
    
    private static patternIdx = 0;
    
    private static arrowMarkerIdx = 0;
    
    private static filterIdx: number = 0;
    
    public static getNextAnnotatorIdx() {
        return this.annotatorIdx++;
    }
    
    private static getSVGElement(config: InternalConfig): SVGSVGElement {
        let svgElements = document.getElementsByTagName('svg'),
            mainSvgElement = null,
            annotatorContainerID = 'easyAnnotatorSVGContainer' + config.annotatorIdx;
        if (svgElements.length) {
            for(let i=0;i<svgElements.length;i++) {
                if (svgElements[i].id == annotatorContainerID) {
                    mainSvgElement = svgElements[i];
                    break;
                }
            }
        }
        
        if (!mainSvgElement) {
            mainSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        }
        
        return mainSvgElement;
    }
    
    public static createTransform(config: InternalConfig): SVGTransform {
        return this.getSVGElement(config).createSVGTransform();
    }
    
    public static getDefs(config: InternalConfig) : SVGDefsElement {
        let svgContainer = this.getSVGElement(config),
            svgDefs = svgContainer.getElementsByTagName('defs'),
            defsElement;

        if (svgDefs.length == 0) {
            defsElement = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            svgContainer.appendChild(defsElement);
        } else {
            defsElement = svgDefs[0];
        }
        
        return defsElement;

    }
    
    public static addToDefs(config: InternalConfig, element: SVGElement) {
        let id = element.id,
            defs = this.getDefs(config),
            allElems = defs.getElementsByTagName(element.tagName),
            l = allElems.length, i;
        
        for(i=0;i<l;i++) {
            if (allElems[i].id == id) {
                return;
            }
        }
        
        defs.appendChild(element);
    }
    
    public static createBlurFilter(config: InternalConfig, effect: Effect) {
        let bluringFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        bluringFilter.setAttribute('id', 'blurFilter_' + config.annotatorIdx + '_' + this.filterIdx++);
//        bluringFilter.setAttribute('filterUnits', 'userSpaceOnUse');
        bluringFilter.setAttribute('width', '200%');
        bluringFilter.setAttribute('height', '200%');
        bluringFilter.setAttribute('x', '-50%');
        bluringFilter.setAttribute('y', '-50%');
        bluringFilter.innerHTML = '<feGaussianBlur stdDeviation="' + parseFloat(effect.value) + '"/>';
        AnnotationUtils.addToDefs(config, bluringFilter);

        return bluringFilter;
    }
    
    public static createShadowFilter(config: InternalConfig, effect: Effect, blurEffect?: Effect) {
        let bluringFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        bluringFilter.setAttribute('id', 'blurFilter_' + config.annotatorIdx + '_' + this.filterIdx++);
        bluringFilter.setAttribute('width', '200%');
        bluringFilter.setAttribute('height', '200%');
        bluringFilter.setAttribute('x', '-50%');
        bluringFilter.setAttribute('y', '-50%');

        this.setShadowFilterValue(bluringFilter, effect, blurEffect);

        AnnotationUtils.addToDefs(config, bluringFilter);

        return bluringFilter;
    }
    
    public static setShadowFilterValue(bluringFilter: SVGFilterElement, shadowEffect: Effect, blurEffect?: Effect) {
        let shadowValue = parseFloat(shadowEffect.value),
            shadowHTML = '';
        if (blurEffect) {
            shadowHTML = '<feGaussianBlur in="SourceGraphic" stdDeviation="' + parseInt(blurEffect.value, 10) + '" result="DROPBLUR"></feGaussianBlur>';
        }
//                <!-- Get the source alpha and blur it,  -->
//        bluringFilter.innerHTML = '<feGaussianBlur in="SourceAlpha" stdDeviation="' + shadowValue + '" result="DROP"></feGaussianBlur>\
        
        shadowHTML += '<feGaussianBlur in="SourceGraphic" stdDeviation="' + shadowValue + '" result="DROP"></feGaussianBlur>\
            <feOffset in="SHADOW" result="DROPSHADOW" dx="' + shadowValue + '" dy="' + shadowValue + '"></feOffset>\
            <feColorMatrix type="matrix" in="DROPSHADOW" result="FINALSHADOW" values="1 0 0 0 0\
					  0 1 0 0 0 \
					  0 0 1 0 0 \
					  0 0 0 0.7 0">\
        </feColorMatrix>\
        <feMerge>\
            <feMergeNode in="FINALHADOW"></feMergeNode>\
            <feMergeNode in="' + (blurEffect ? 'DROPBLUR': 'SourceGraphic') + '"></feMergeNode>\
        </feMerge>';

        bluringFilter.innerHTML = shadowHTML;
    }
    
    public static createFillPattern(config: InternalConfig, fillType: number, currentPattern: SVGPatternElement) {
        let defsElement = this.getDefs(config);
        if (fillType > 0) {
            
            if (currentPattern) {
//                need to remove existing pattern
                try {
                    if (currentPattern.parentNode == defsElement) {
                        defsElement.removeChild(currentPattern);
                    }
                } catch(ex){}
            }

            let fillPatternID = 'fillPattern_' + this.annotatorIdx + '_' + this.patternIdx + '_' + fillType;
            let fillPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
            fillPattern.id = fillPatternID;
            
            fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
            fillPattern.setAttribute('viewBox', '0 0 12 20');
            let pathPatterns = [
                'M0 20 L12 0',
                'M0 0 L12 20',
                'M6 0 L6 20',
                'M0 10 L12 10',
                'M0 10 L12 10 M6 0 L6 20',
                'M0 20 L12 0 M0 0 L12 20',
                'M0 20 L12 0 M0 0 L12 20',
                'M 5,5 A 1 1 0 1 0 2 5',
                'M 5,5 A 3 3 0 1 0 2 5'
            ];
            
            if (fillType <= 6) {
                fillPattern.setAttribute('width', '12');
                fillPattern.setAttribute('height', '20');
            } else {
                fillPattern.setAttribute('width', '10');
                fillPattern.setAttribute('height', '10');
            }
            
            if (fillType <= pathPatterns.length) {
                fillPattern.innerHTML = '<path d="' + pathPatterns[fillType - 1] + '"/>';
            }
            
            defsElement.appendChild(fillPattern);
            
            return fillPattern;
        }
    }
    
    public static createArrowMarker(config: InternalConfig, arrowType: number, currentMarker?: SVGElement, startMarker?: boolean) : Array<any> {
        let marker = document.createElementNS("http://www.w3.org/2000/svg", "marker"),
            svgDefs = this.getDefs(config),
            headSVGElement = null, headAdditionalCls = '';
        
        if (currentMarker) {
            svgDefs.removeChild(currentMarker);
        }
            
        marker.setAttribute('id', 'arrowMarker_' + this.annotatorIdx + '_' + this.arrowMarkerIdx++);
        marker.setAttribute('markerWidth', '7');
        marker.setAttribute('markerHeight', '8');
        marker.setAttribute('refX', '5');
        marker.setAttribute('refY', '4');
        marker.setAttribute('orient', 'auto');

        switch (arrowType) {
            case 0:
                headSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                if (startMarker) {
                    //headSVGElement.setAttribute("points", '0 4 6,0 6,7');
                    headSVGElement.setAttribute("points", '1,4 6,1 6,7');
                } else {
                    headSVGElement.setAttribute("points", '0,1 6,4 0,7');
                }
                break;
            case 1:
                headSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                if (startMarker) {
                    marker.setAttribute('refX', '1');
                    headSVGElement.setAttribute("points", '6,1 0 4 6,7');
                } else {
                    // headSVGElement.setAttribute('points', '1 3.5 6,1 6,7');
                    headSVGElement.setAttribute('points', '1,7 6,4 1,1');
                    //headSVGElement.setAttribute("points", '0 1 6,4 0,7');
                }
                headAdditionalCls = ' arrow-no-fill';
                break;
            case 2:
                headSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                headSVGElement.setAttribute("points", '0,0 5,0 5,5 0,5 0,0');
                marker.setAttribute('refY', '3');
                break;
            case 3:
                headSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                headSVGElement.setAttribute("points", '1,3.5 3.5,1 6,3.5 3.5,6');
                marker.setAttribute('refY', '3.5');
                break;
            case 4:
                headSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                headSVGElement.setAttribute("cx", '3');
                headSVGElement.setAttribute("cy", '3');
                headSVGElement.setAttribute("r", '3');
                marker.setAttribute('refY', '3');
                marker.setAttribute('refX', '3');
                headAdditionalCls = ' arrow-no-stroke';
                break;
            case 5:
                headSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                headSVGElement.setAttribute("points", '1,0 1,8');
                marker.setAttribute('refX', '1');
                break;
        }
        headSVGElement.style.strokeLinejoin = 'miter';
        marker.appendChild(headSVGElement);
        
        svgDefs.appendChild(marker);
        
        headSVGElement.setAttribute('class', config.ui + '-arrow-head' + headAdditionalCls);
        
        return [marker, headSVGElement];
    }
    
}
