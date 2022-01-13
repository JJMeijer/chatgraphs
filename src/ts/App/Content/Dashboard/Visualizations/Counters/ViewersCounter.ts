import { BaseCounter } from './BaseCounter';
import { EventBus } from 'common/EventBus';
import { VIEWER_COUNT } from 'common/constants';

export class ViewerCounter extends BaseCounter {
    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setTitle('Current Viewers');
        this.setContent('0');
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: VIEWER_COUNT,
            eventCallback: ({ viewers }) => {
                this.setContent(viewers.toString());
            },
        });
    }
}
