import {Utils} from "../utils/Utils";
import Config from "../Config";

export class ColorPicker {

    private readonly target: HTMLElement;

    private bodyElement: HTMLDivElement;

    private hueValPicker: HTMLDivElement;

    private paletteDiv: HTMLDivElement;

    private sampleDiv: HTMLDivElement;

    private colorPicker: HTMLDivElement;

    private transparencyPicker: HTMLDivElement;

    private alpha: number;

    private color: string;

    private originalColor: string;

    private hsvColor: Array<number>;

    private docEventsAdded: boolean = false;

    private isColorSlider: boolean;

    private listeners: {
        change: Array<any>,
        save: Array<any>,
        cancel: Array<any>
    };

    constructor(target: HTMLElement, config: Config) {
        this.target = target;
        this.listeners = {
            change: [],
            save: [],
            cancel: []
        };
        this.init(config);
    }

    private init(config: Config) {
        let bodyElement = document.createElement('div');
        bodyElement.className = 'ea-color-picker';

        this.target.classList.add('ea-picker-target');

        let rand = (Math.random() * 10000).toFixed(0),
            haveDefaultColors = config.defaultColors === undefined || (Array.isArray(config.defaultColors) && config.defaultColors.length > 0);

        bodyElement.innerHTML =
            '<div class="ea-color-selection">' +
                '<div class="ea-palette-container">' +
                    '<div style="position: relative;height: 100%;"><div class="ea-palette"></div></div>' +
                    '<div id="palletePicker_' + rand + '" class="ea-picker"></divid>' +
                '</div>' +
                '<div class="ea-selection-bottom">' +
                    '<div class="ea-color-sample"></div>' +
                    '<div style="float: left;width:180px;">' +
                        '<div class="ea-color-chooser">' +
                            '<div id="colorPicker_'+ rand + '" class="ea-picker ea-slider-picker"></div>' +
                            '<div id="colorSlider_'+ rand + '" class="ea-slider" tabindex="0" aria-label="hue selection slider" role="slider"></div>' +
                        '</div>' +
                         '<div class="ea-color-chooser">' +
                            '<div id="transpPicker_'+ rand + '" class="ea-picker ea-slider-picker"></div>' +
                            '<div id="transpSlider_'+ rand + '" class="ea-slider ea-transparency" tabindex="0" aria-label="transparency selection slider" role="slider"></div>' +
                         '</div>' +
                    '</div>' +
                '</div>' +
                (haveDefaultColors ? '<div class="ea-swatches-panel"></div>' : '') +
                '<div class="ea-picker-buttons"><button id="pickerOKBtn_' + rand +'">OK</button><button id="pickerCancelBtn_' + rand +'" style="margin-left: 20px;">Cancel</button></div>' +
            '</div>';

        this.hueValPicker = bodyElement.querySelector('#palletePicker_' + rand);
        this.sampleDiv = bodyElement.querySelector('div.ea-color-sample');
        this.colorPicker = bodyElement.querySelector('#colorPicker_' + rand);
        this.transparencyPicker = bodyElement.querySelector('#transpPicker_' + rand);

        Utils.on(this.colorPicker,['mousedown', 'touchstart'], this.onPickerDown);
        Utils.on(this.transparencyPicker,['mousedown', 'touchstart'], this.onPickerDown);
        Utils.on(bodyElement.querySelector('#transpSlider_' + rand), ['mousedown', 'mousemove', 'touchstart', 'touchmove'], this.transparencyEvt);
        Utils.on(bodyElement.querySelector('#colorSlider_' + rand), ['mousedown', 'mousemove'], this.transparencyEvt);
        Utils.on(bodyElement.querySelector('#pickerOKBtn_' + rand), ['click', 'touchstart'], this.onSave);
        Utils.on(bodyElement.querySelector('#pickerCancelBtn_' + rand), ['click', 'touchstart'], this.onCancel);

        let paletteDiv = bodyElement.querySelector('div.ea-palette');
        Utils.on([paletteDiv, this.hueValPicker],
            ['mousedown', 'touchstart', 'mousemove', 'touchmove'],
            this.paletteClick);

        if (haveDefaultColors) {
            let colors = [];
            if (Array.isArray(config.defaultColors)) {
                colors = config.defaultColors.slice(0, Math.min(14, config.defaultColors.length));
            } else {
                colors = [
                    '#F44336',
                    '#E91E63F2',
                    '#9C27B0E5',
                    '#673AB7D8',
                    '#3F51B5CC',
                    '#2196F3BF',
                    '#03A9F4B2',
                    '#00BCD4B2',
                    '#009688BF',
                    '#4CAF50CC',
                    '#8BC34AD8',
                    '#CDDC39E5',
                    '#FFEB3BF2',
                    '#FFC107'
                ];
            }
            this.addSwatches(bodyElement.querySelector('div.ea-swatches-panel'), colors);
        }

        this.paletteDiv = paletteDiv as HTMLDivElement;
        this.bodyElement = bodyElement;
        document.body.addEventListener('mousedown', this.hidePicker);
        Utils.on(this.target, ['mousedown', 'touchstart'], this.changeVisibility);
        document.body.appendChild(bodyElement);
    }

    private changeVisibility = (evt:MouseEvent | TouchEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.bodyElement.classList.contains('ea-picker-visible')) {
            this.hide();
        } else {
            this.setColorInternal(this.originalColor);
            this.show();
        }
    }

    private onPickerDown = (evt:MouseEvent | TouchEvent) => {
        let target = evt.target as HTMLDivElement;
        this.isColorSlider = target.id.indexOf('transp') < 0;
        this.addDocEvents();
        evt.preventDefault();
    }

    private addDocEvents = () => {
        if (!this.docEventsAdded) {
            this.docEventsAdded = true;
            Utils.on(document, ['mouseup', 'touchend', 'touchcancel'], this.transparencyEvt);
            Utils.on(document, ['mousemove', 'touchmove'], this.docMouseMove);
        }
    }

    private transparencyEvt = (evt:MouseEvent | TouchEvent) => {
        evt.preventDefault();
        let eventType = evt.type,
            target = evt.target as HTMLDivElement;
        if (target.className.indexOf('ea-slider-picker') >= 0) {
            target = target.parentElement.querySelector('div.ea-slider');
        }
        if (eventType == 'mousemove') {
            if ((evt as MouseEvent).buttons == 0 ||
                (this.isColorSlider != (target.id.indexOf('transp') < 0))) {
                return;
            }
        }

        if (eventType == 'mousedown') {
            this.addDocEvents();
            this.isColorSlider = target.id.indexOf('transp') < 0;
        } else if (eventType == 'mouseup' || eventType == 'touchend' || eventType == 'touchcancel') {
            this.docEventsAdded = false;
            Utils.un(document, ['mouseup', 'touchend', 'touchcancel'], this.transparencyEvt);
            Utils.un(document, ['mousemove', 'touchmove'], this.docMouseMove);
            return;
        }

        const event = Utils.getEvent(evt);
        if (event) {
            const left = target.getBoundingClientRect().left;
            if (this.isColorSlider) {
                this.colorSlider(event.clientX - left);
            } else {
                this.transparencySlider(event.clientX - left);
            }
        }
    }

    private colorSlider(clientX: number) {
        if (clientX < 0) {
            clientX = 0;
        } else if (clientX > 155) {
            clientX = 155;
        }
        const hue = (clientX / 155) * 360;
        this.hsvColor[0] = hue;

        if (this.hsvColor[1] == 0 && this.hsvColor[2] == 0) {
            this.hsvColor[1] = 100;
            this.hsvColor[2] = 100;
        }

        let rgbColor = this.hsvToRgb(hue, this.hsvColor[1], this.hsvColor[2]);

        this.setColorInternal(
            '#' + this.getHex(rgbColor[0].toString(16)) +
            this.getHex(rgbColor[1].toString(16)) +
            this.getHex(rgbColor[2].toString(16)) +
            this.getHex(this.alpha.toString(16)));
    }

    private transparencySlider(clientX: number) {
        if (clientX < 0) {
            clientX = 0;
        } else if (clientX > 155) {
            clientX = 155;
        }
        const transparency = clientX / 155;

        this.alpha = Math.round(transparency * 255);
        this.transparencyPicker.style.left = (clientX - 6) + 'px';

        let hsvColor = this.hsvColor;

        this.paletteDiv.style.background = `linear-gradient(to top, rgba(0, 0, 0, ${transparency}), transparent),
                        linear-gradient(to left, hsla(${hsvColor[0]}, 100%, 50%, ${transparency}), rgba(255, 255, 255, ${transparency}))`;

        let alpha = this.alpha.toString(16);
        if (this.color.length > 7) {
            this.color = this.color.substr(0, 7) + alpha;
        } else{
            this.color += alpha;
        }
        this._setColor(this.color);
    }

    private docMouseMove = (evt: MouseEvent | TouchEvent) => {
        let event = Utils.getEvent(evt),
            transparencySlider = this.transparencyPicker.parentElement;
        let left = transparencySlider.getBoundingClientRect().left;
        let clientX = event.pageX - left;

        if (this.isColorSlider) {
            this.colorSlider(clientX);
        } else {
            this.transparencySlider(clientX);
        }
    }

    private getHex(hex: string) {
        return hex.length == 1 ? '0' + hex : hex;
    }

    private paletteClick = (evt:MouseEvent | TouchEvent) => {
        let eventType = evt.type;
        if (eventType == 'mousemove') {
            if ((evt as MouseEvent).buttons == 0) {
                return;
            }
        }

        evt.preventDefault();
        let finalEvent = Utils.getEvent(evt);
        if (finalEvent) {
            let target = finalEvent.target as HTMLDivElement;
            if (target == this.hueValPicker) {
                target = target.parentElement as HTMLDivElement;
            }

            let paletteDiv = this.paletteDiv,
                rect = paletteDiv.getBoundingClientRect(),
                clientX = Math.max(0, Math.min(rect.width, finalEvent.clientX - rect.left)),
                clientY = Math.max(0, Math.min(rect.height, finalEvent.clientY - rect.top)),
                x = clientX / paletteDiv.clientWidth,
                y = clientY / paletteDiv.clientHeight;

            let colorSaturation = Math.round(x * 100),
                colorValue = Math.round(Math.max(100 - y * 100, 0));

            this.hsvColor[1] = colorSaturation;
            this.hsvColor[2] = colorValue;

            let rgbColor = this.hsvToRgb(this.hsvColor[0], colorSaturation, colorValue);
            this.color = '#' + this.getHex(rgbColor[0].toString(16)) +
                this.getHex(rgbColor[1].toString(16)) + this.getHex(rgbColor[2].toString(16));
            this._setColor(this.color + this.alpha.toString(16));

            this.hueValPicker.style.left = (clientX - 9) + 'px';
            this.hueValPicker.style.top = (clientY - 9) + 'px';
        }
    }

    private hsvToRgb(h: number, s: number, v: number) {
        h = (h / 360) * 6;
        s /= 100;
        v /= 100;

        const i = Math.floor(h);

        const f = h - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        const mod = i % 6;
        const r = [v, q, p, p, t, v][mod];
        const g = [t, v, v, q, p, p][mod];
        const b = [p, p, t, v, v, q][mod];

        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    private rgbToHsv(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;

        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const delta = maxVal - minVal;

        let h, s;
        const v = maxVal;
        if (delta === 0) {
            h = s = 0;
        } else {
            s = delta / maxVal;
            const dr = (((maxVal - r) / 6) + (delta / 2)) / delta;
            const dg = (((maxVal - g) / 6) + (delta / 2)) / delta;
            const db = (((maxVal - b) / 6) + (delta / 2)) / delta;

            if (r === maxVal) {
                h = db - dg;
            } else if (g === maxVal) {
                h = (1 / 3) + dr - db;
            } else if (b === maxVal) {
                h = (2 / 3) + dg - dr;
            }

            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }

        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(v * 100)
        ];
    }

    private hidePicker = (evt: MouseEvent) => {
        let target = evt.target,
            pickerBody = this.bodyElement;

        while (target) {
            if (target == pickerBody) {
                return;
            }
            if (target instanceof HTMLElement) {
                target = (target as HTMLElement).parentElement;
            } else {
                break;
            }
        }
        this.onCancel();
    }

    public show() {
        let rect = this.target.getBoundingClientRect();
        let pickerBody = this.bodyElement;
        let checkFunction = () => {
            let bounds = pickerBody.getBoundingClientRect(),
                width = bounds.width;
            if (width == 0) {
                setTimeout(checkFunction, 200);
            } else {
                let windowWidth = window.innerWidth,
                    windowHeight = window.innerHeight,
                    left = rect.left,
                    top = rect.top + rect.height;
                if (rect.left + width > windowWidth) {
                    left = Math.max(0, windowWidth - width);
                }

                if (top + bounds.height > windowHeight) {
                    top = Math.max(0, windowHeight - bounds.height);
                }
                pickerBody.style.left = left + 'px';
                pickerBody.style.top = top + 'px';
                pickerBody.style.opacity = '1';
            }
        };

        checkFunction();
        pickerBody.style.left = rect.left + 'px';
        pickerBody.style.top = (rect.top + rect.height) + 'px';
        pickerBody.style.opacity = '0.05';
        pickerBody.classList.add('ea-picker-visible');
    }

    hide() {
        this.bodyElement.classList.remove('ea-picker-visible');
    }

    private getValidHexColor(color: string) {
        if (color.charAt(0) == '#') {
            //hex color
            if (color.length == 4) {
                return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            }
            return color;
        } else {
            const ctx = document.createElement('canvas').getContext('2d');
            ctx.fillStyle = color;
            return ctx.fillStyle;
        }
    }

    public setColor(color: string) {
        this.originalColor = this.getValidHexColor(color);
        this.setColorInternal(this.getValidHexColor(color));
    }

    private setColorInternal(hexColor: string) {
        let rgb = hexColor.substr(1).match(/.{2}/g).map(v => parseInt(v, 16)),
            paletteDiv = this.paletteDiv;
        let alpha = rgb[3] || 255;
        this.color = hexColor;
        let hsvColor = this.rgbToHsv(rgb[0], rgb[1], rgb[2]);

        this.hsvColor = hsvColor;
        this.alpha = alpha;

        let colorPicker = this.colorPicker;
        let sliderWidth = ((colorPicker.parentElement).querySelector('div.ea-slider').clientWidth || 155);
        this.transparencyPicker.style.left = (alpha * sliderWidth / 255 - 6).toFixed(0) + 'px';
        this.hueValPicker.style.left = ((hsvColor[1] / 100) * (paletteDiv.clientWidth || 230) - 9).toFixed(0) + 'px';
        this.hueValPicker.style.top = ((100 - hsvColor[2]) / 100 * (paletteDiv.clientHeight || 125) - 9).toFixed(0) + 'px';

        colorPicker.style.left = (sliderWidth * hsvColor[0] / 360 - 6) + 'px';

        let transparency = (alpha/255).toFixed(2);
        paletteDiv.style.background = `linear-gradient(to top, rgba(0, 0, 0, ${transparency}), transparent),
                        linear-gradient(to left, hsla(${hsvColor[0]}, 100%, 50%, ${transparency}), rgba(255, 255, 255, ${transparency}))`;

        this._setColor(hexColor);
    }

    private _setColor = (color: string) => {
        this.hueValPicker.style.backgroundColor = color;
        this.sampleDiv.style.backgroundColor = color;
        this.target.style.backgroundColor = color;

        for(let l of this.listeners.change) {
            l.fn.call(l.caller, color);
        }
    }

    on = (event: PickerEventType, callback: (color: string) => void, thisArg: any) => {
        this.listeners[event].push({
            fn: callback,
            caller: thisArg
        });
    }

    un = (event: PickerEventType, callback: (color: string) => void) => {
        let idx = -1;
        this.listeners[event].forEach((value: any, index: number) => {
            if (value.fn == callback) {
                idx = index;
                return false;
            }
        });
        if (idx >= 0) {
            this.listeners[event].splice(idx, 1);
        }
    }

    private addSwatches(element: Element, colors: string[]) {
        let swatches = [];
        for(let color of colors) {
            let div = document.createElement('div');
            div.style.backgroundColor = color;
            swatches.push(div);
            div.setAttribute('data-color', color);
            element.appendChild(div);
        }

        Utils.on(swatches, ['mousedown', 'touchstart'], this.swatchClick);
    }

    private swatchClick = (evt: MouseEvent | TouchEvent) => {
        this.setColorInternal((evt.target as HTMLElement).getAttribute('data-color'));
    }

    private onSave = (evt: Event) => {
        evt.stopPropagation();
        let color = this.color;
        this.originalColor = color;
        if (this.alpha < 255 && color.length == 7) {
            color += this.getHex(this.alpha.toString(16));
        }
        for(let l of this.listeners.save) {
            l.fn.call(l.caller, color);
        }
        setTimeout(function(picker) {
            picker.hide();
        }, 100, this);
    }

    private onCancel = () => {
        for(let l of this.listeners.cancel) {
            l.fn.call(l.caller, this.originalColor);
        }
        setTimeout(function(picker) {
            picker.hide();
        }, 100, this);
    }

    public isVisible = () => {
        return this.bodyElement.classList.contains('ea-picker-visible');
    }
}

type PickerEventType =
    'change' |
    'save' |
    'cancel';
