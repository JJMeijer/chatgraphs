import { BaseCounter } from './BaseCounter';
import { EventBus } from 'common/EventBus';
import { PRIVMSG } from 'common/constants';

export class MessagesCounter extends BaseCounter {
    messages = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setTitle('Total Messages');
        this.setContent('0');
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                this.messages++;
                this.setContent(this.messages.toString());
            },
        });
    }
}
