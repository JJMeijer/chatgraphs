import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

import './chartGlobalSetup';

import { MessagesPerMinute } from './MessagesPerMinute';
import { MessagesPerSecond } from './MessagesPerSecond';
import { SubscribersPercentage } from './SubscribersPercentage';

const html = /*html*/ `
    <div class="flex flex-row flex-wrap h-full p-2 w-3/4">
`;

export class Charts {
    eventBus: EventBus;
    element: HTMLDivElement;

    messagesPerSecond: MessagesPerSecond;
    messagesPerMinute: MessagesPerMinute;
    subscribersPercentage: SubscribersPercentage;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);

        this.messagesPerSecond = new MessagesPerSecond(this.eventBus);
        this.messagesPerMinute = new MessagesPerMinute(this.eventBus);
        this.subscribersPercentage = new SubscribersPercentage(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.append(
            this.messagesPerSecond.element,
            this.messagesPerMinute.element,
            this.subscribersPercentage.element,
        );
    }
}
