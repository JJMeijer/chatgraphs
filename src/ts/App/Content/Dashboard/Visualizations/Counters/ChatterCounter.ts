import { BaseCounter } from './BaseCounter';
import { EventBus } from 'common/EventBus';
import { PRIVMSG } from 'common/constants';

export class ChatterCounter extends BaseCounter {
    chatters: string[] = [];

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setTitle('Distinct Chatters');
        this.setContent('0');
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: ({ source }) => {
                if (this.chatters.indexOf(source) === -1) {
                    this.chatters.push(source);
                    this.setContent(this.chatters.length.toString());
                }
            },
        });
    }
}
