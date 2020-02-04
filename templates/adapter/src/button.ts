import { IWidget } from '@dapplets/dynamic-adapter';

export interface IButtonState {
    label: string;
    exec: (ctx: any, me: IButtonState) => void;
    init: () => void;
    clazz: string;
    ctx: any;
}

export class Button implements IWidget<IButtonState> {
    public el: HTMLElement;
    public state: IButtonState;

    public mount() {
        if (!this.el) this._createElement();
        const { label } = this.state;
        const htmlString = `<button>${label?.toString()}</button>`
        this.el.innerHTML = htmlString;
    }

    public unmount() {
        this.el && this.el.remove();
    }

    private _createElement() {
        this.el = document.createElement('div');
        this.el.addEventListener("click", () => this.state.exec?.(this.state.ctx, this.state));
        this.mount();
        this.state.init?.();
    }
}