import {AnnotatorElement} from './ui/AnnotatorElement';

declare var window: any;

(function (window) {
    try {
        new MouseEvent('test');
        return false; // No need to polyfill
    } catch (e) {
        // Need to polyfill - fall through
    }

    class MouseEventArgs extends MouseEvent {

        constructor() {
            super('');
        }

        _bubles: boolean = false;
        _cancelable: boolean = false;
    };

// Polyfills DOM4 MouseEvent
    let MouseEventPolyfill = function (eventType: string, params: MouseEventArgs) {
        if (!params) {
            params = new MouseEventArgs();
        }
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(eventType,
            params._bubles,
            params._cancelable,
            window,
            0,
            params.screenX || 0,
            params.screenY || 0,
            params.clientX || 0,
            params.clientY || 0,
            params.ctrlKey || false,
            params.altKey || false,
            params.shiftKey || false,
            params.metaKey || false,
            params.button || 0,
            params.relatedTarget || null
        );

        return mouseEvent;
    }

    MouseEventPolyfill.prototype = Event.prototype;

    window.MouseEvent = MouseEventPolyfill;
})(window);

export {AnnotatorContainer} from "./AnnotatorContainer";
export {TextToolbarItem} from "./toolbar/TextToolbarItem"
export {LineToolbarItem} from "./toolbar/LineToolbarItem"
export {ArrowToolbarItem} from "./toolbar/ArrowToolbarItem"
export {EllipseToolbarItem} from "./toolbar/EllipseToolbarItem"
export {CalloutToolbarItem} from "./toolbar/CalloutToolbarItem"
export {BlurToolbarItem} from "./toolbar/BlurToolbarItem"
export {FreeDrawToolbarItem} from "./toolbar/FreeDrawToolbarItem"
export {ImageToolbarItem} from "./toolbar/ImageToolbarItem"
export {RectToolbarItem} from "./toolbar/RectToolbarItem"
export {PolygonToolbarItem} from "./toolbar/PolygonToolbarItem"
export {StrokeType} from "./model/LineStyle"
export * from "./Config"
export * from "./model/Styles"
export * from "./model/Font"

export enum ExportType {
    XML = 0,
    JSON = 1,
    IMAGE = 2,
    SVG = 3
}

// Inject to `<head>` and also available as `style`
// import style from "./style/style.css";
// //make sure style is injected into JavaScript and HTML
// const a = style;

if (!customElements.get('easy-annotation')) {
    customElements.define('easy-annotation', AnnotatorElement);
}
