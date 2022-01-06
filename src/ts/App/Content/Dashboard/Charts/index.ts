import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

import './chartGlobalSetup';

import { MessagesPerMinute } from './MessagesPerMinute';
import { MessagesPerSecond } from './MessagesPerSecond';
import { SubscribersPercentage } from './SubscribersPercentage';
import { Subscribers } from './Subscribers';
import { Moderation } from './Moderation';
import { Counters } from './Counters';
import { Viewers } from './Viewers';

const html = /*html*/ `
    <div class="flex flex-col w-3/4 h-[95vh] overflow-y-scroll">
        <div class="charts-content flex flex-row flex-wrap p-2">
    </div>
`;

export class Charts {
    eventBus: EventBus;
    element: HTMLDivElement;
    charts: HTMLDivElement;

    messagesPerSecond: MessagesPerSecond;
    messagesPerMinute: MessagesPerMinute;
    subscribersPercentage: SubscribersPercentage;
    subscribers: Subscribers;
    moderation: Moderation;
    counters: Counters;
    viewers: Viewers;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.charts = this.element.querySelector('.charts-content') as HTMLDivElement;

        this.messagesPerSecond = new MessagesPerSecond(this.eventBus);
        this.messagesPerMinute = new MessagesPerMinute(this.eventBus);
        this.subscribersPercentage = new SubscribersPercentage(this.eventBus);
        this.subscribers = new Subscribers(this.eventBus);
        this.moderation = new Moderation(this.eventBus);
        this.counters = new Counters(this.eventBus);
        this.viewers = new Viewers(this.eventBus);

        this.render();
    }

    render(): void {
        this.charts.append(
            this.counters.element,
            this.messagesPerSecond.element,
            this.subscribersPercentage.element,
            this.viewers.element,
            this.messagesPerMinute.element,
            this.subscribers.element,
            this.moderation.element,
        );
    }
}
