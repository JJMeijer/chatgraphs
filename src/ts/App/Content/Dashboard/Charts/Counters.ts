import { PRIVMSG } from 'common/constants';
import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

const html = /*html*/ `
    <div class="flex flex-row items-center w-full">
        <div class="p-1 flex flex-col">
            <span class="text-base">Total Messages: </span>
            <span class="message-count text-lg font-bold">0</span>
        </div>
    </div>
`;

export class Counters {
    eventBus: EventBus;
    element = createElementFromHtml<HTMLDivElement>(html);
    totalCounter = this.element.querySelector('.message-count') as HTMLSpanElement;

    totalMessages = 0;

    chatters: string[] = [];

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                this.totalMessages++;
                this.totalCounter.innerText = this.totalMessages.toString();
            },
        });
    }
}
