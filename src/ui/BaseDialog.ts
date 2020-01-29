import {Utils} from "../utils/Utils"
import {BaseAnnotator} from "../annotators/BaseAnnotator"

export class BaseDialog {
    
    private static openDialog: BaseDialog = null;
    
    public static getOpenDialog() {
        return this.openDialog;
    }
    
    protected container: HTMLDivElement;
    
    protected callback: (res: Object) => void;
    
    protected height: number = 200;
    
    public show(target: HTMLElement, selectedItems: Array<BaseAnnotator>, callback: (res: Object) => void) {
        BaseDialog.openDialog = this;
        let bounds = target.getBoundingClientRect(),
            me = this,
            element = me.container,
            isMobile = Utils.isPhone();
        me.callback = callback;
        
        target.parentElement.appendChild(element);
        element.style.display = 'block';
        if (isMobile) {
            element.classList.add('ea-mobile-dialog');
//            element.style.height = w.screen.height + 'px';
//            element.style.width = w.screen.width + 'px';
            element.addEventListener('touchmove', me.onTouchMove);
            window.addEventListener('orientationchange', me.orientationChange);
        } else {
            let parentBounds = target.parentElement.getBoundingClientRect();
            element.style.left = (bounds.left - parentBounds.left) + 'px';
            if (bounds.top + me.height > window.innerHeight) {
                element.style.top = window.innerHeight - (bounds.top + me.height) + 'px';
            }
            element.style.height = me.height + 'px';
        }
        
        setTimeout(function() {
            if (Utils.isMobileDevice()) {
                window.addEventListener('touchstart', me.hideDialog);
            } else {
                window.addEventListener('click', me.hideDialog);
            }
        }, 500);
    }
    
    private orientationChange = () => {
        let container = this.container,
        screen = window.screen;
        container.style.height = screen.height + 'px';
        container.style.width = screen.width + 'px';
    }
    
    private onTouchMove = (evt: TouchEvent) => {
        evt.preventDefault();
    }
    
    protected hideDialog (evt: MouseEvent) {
        let target = evt.target as HTMLElement,
            dialogContainer = this.container;
        while (target) {
//            console.log(target.innerHTML);
//            console.log('-------------------------------------------------');
            if (target == dialogContainer) {
                return;
            }
            let cls = target.className;
            if ((typeof (cls) === 'string') && (cls.indexOf('pcr-selection') >= 0 || cls.indexOf('pcr-app') >= 0)) {
//                color pallet click
                return;
            }
            target = target.parentElement;
        }
        
        this.hide();
    }
    
    public hide() {
        BaseDialog.openDialog = null;
        let me = this;
        if (Utils.isMobileDevice()) {
            window.removeEventListener('touchstart', me.hideDialog);
        } else {
            window.removeEventListener('click', me.hideDialog);
        }
        me.container.parentElement.removeChild(me.container);//.style.display = 'none';
    }
    
}
