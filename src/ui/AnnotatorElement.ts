import style from '../style/style.css';

export class AnnotatorElement extends HTMLElement {

    private shadowRootEl: ShadowRoot;

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        this.addStyleElement(shadow);

        this.shadowRootEl = shadow;
    }

    private addStyleElement(parent: ShadowRoot) {
        let styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.textContent = style;

        parent.appendChild(styleElement);
    }

    // destroy() {
    //     this.sharedStylesHost.removeHost(this.shadowRoot);
    // }

    appendChild<T extends Node>(newChild: T): T {
        return this.shadowRootEl.appendChild(newChild);
    }

    insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
        return this.shadowRootEl.insertBefore(newChild, refChild);
    }

    removeChild<T extends Node>(oldChild: T): T {
        return this.shadowRootEl.removeChild(oldChild);
    }

    // readonly parentNode: Node & ParentNode | null {
    //     return this.shadowRoot.parentElement;
    //     // return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(node)));
    // }

}
