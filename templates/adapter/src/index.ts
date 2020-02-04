import { IFeature } from '@dapplets/dapplet-extension';
import { IDynamicAdapter } from '@dapplets/dynamic-adapter';
import { IButtonState, Button } from './button';

@Injectable
export default class Adapter {

    @Inject("dynamic-adapter.dapplet-base.eth")
    private adapter: IDynamicAdapter;

    // ToDo: refactor it
    public widgets = {
        button: this.adapter.createWidgetFactory<IButtonState>(Button)
    };

    public config = [{
        containerSelector: "main[role=main]",
        contextSelector: "article",
        insPoints: {
            TWEET_SOUTH: {
                selector: "div[role=group]"
            }
        },
        contextType: 'tweet',
        contextEvent: 'TWEET_EVENT',
        contextBuilder: (ctxNode: any) => ({
            id: ctxNode.querySelector('a time').parentNode.href.split('/').pop(),
            text: ctxNode.querySelector('div[lang]')?.innerText,
            authorFullname: ctxNode.querySelector('a:nth-child(1) div span span')?.innerText,
            authorUsername: ctxNode.querySelector('div.r-1f6r7vd > div > span')?.innerText,
            authorImg: ctxNode.querySelector('img.css-9pa8cd')?.getAttribute('src')
        })
    }];

    // ToDo: refactor it
    constructor() {
        this.adapter.attachConfig(this.config);
    }

    // ToDo: refactor it
    public attachFeature(feature: IFeature): void { // ToDo: automate two-way dependency handling(?)
        this.adapter.attachFeature(feature);
    }

    // ToDo: refactor it
    public detachFeature(feature: IFeature): void {
        this.adapter.detachFeature(feature);
    }

    public onContextCreated(handler: (ctx?: any, insertionPoint?: string) => void): void {
        this.adapter.onContextCreated(handler);
    }

    public onContextDestroyed(handler: (ctx?: any, insertionPoint?: string) => void): void {
        this.adapter.onContextDestroyed(handler);
    }
}
