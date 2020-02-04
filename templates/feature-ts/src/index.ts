import { IFeature } from '@dapplets/dapplet-extension'
import { sayHello } from './helper';
import EXAMPLE_IMG from './example.png'

@Injectable
export default class Feature implements IFeature {

    @Inject("twitter-adapter.dapplet-base.eth")
    public adapter: any; // ITwitterAdapter;
    public config: any; // T_TwitterFeatureConfig;

    constructor() {
        const { button } = this.adapter.widgets;
        this.config = {
            TWEET_SOUTH: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        label: ":)",
                        exec: (ctx, me) => {
                            sayHello();
                        },
                        img: EXAMPLE_IMG
                    }
                })
            ]
        };
    }

    public activate() {
        this.adapter.attachFeature(this);
    }

    public deactivate() {
        this.adapter.detachFeature(this);
    }
}