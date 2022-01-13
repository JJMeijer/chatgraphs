import { BaseCounter } from './BaseCounter';
import { EventBus } from 'common/EventBus';
import { EMOTE_USED } from 'common/constants';

export class EmotesCounter extends BaseCounter {
    emotesUsed = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setTitle('Emotes Used');
        this.setContent('0');
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: EMOTE_USED,
            eventCallback: () => {
                this.emotesUsed++;
                this.setContent(this.emotesUsed.toString());
            },
        });
    }
}
