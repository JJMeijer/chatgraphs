import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

import './chartGlobalSetup';

import {
    MessagesPerMinute,
    MessagesPerSecond,
    EmotesPerMessage,
    Moderation,
    Subscribers,
    SubscribersPercentage,
    Viewers,
} from './Charts';
import { Counters } from './Counters';

import { CHANNEL_SUBMIT, CHAT_VISIBILITY } from 'common/constants';
import { HideChatButton } from './HideChatButton';

const html = /*html*/ `
    <div class="
        relative
        flex
        flex-col
        w-full
        md:w-1/2
        lg:w-3/4
        h-[95vh]
        md:overflow-y-scroll
        md:scrollbar-thin
        scrollbar-thumb-gray-600
        hover:scrollbar-thumb-gray-500
        border-t border-gray-700
        md:border-t-0
        pt-3
        md:pt-0
    ">
        <div class="charts-content flex flex-row flex-wrap">
    </div>
`;

export class Visualizations {
    eventBus: EventBus;
    element: HTMLDivElement;
    charts: HTMLDivElement;

    hideChatButton: HideChatButton;

    messagesPerSecond: MessagesPerSecond;
    messagesPerMinute: MessagesPerMinute;
    subscribersPercentage: SubscribersPercentage;
    emotesPerMessage: EmotesPerMessage;
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
        this.emotesPerMessage = new EmotesPerMessage(this.eventBus);
        this.subscribers = new Subscribers(this.eventBus);
        this.moderation = new Moderation(this.eventBus);
        this.counters = new Counters(this.eventBus);
        this.viewers = new Viewers(this.eventBus);

        this.hideChatButton = new HideChatButton(this.eventBus);

        this.render();
        this.setSubscribers();
    }

    show() {
        this.element.classList.remove('hidden');
    }

    setSubscribers() {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.show();
            },
        });

        this.eventBus.subscribe({
            eventName: CHAT_VISIBILITY,
            eventCallback: ({ visible }) => {
                if (visible) {
                    this.element.classList.add('md:w-1/2');
                    this.element.classList.add('lg:w-3/4');
                } else {
                    this.element.classList.remove('md:w-1/2');
                    this.element.classList.remove('lg:w-3/4');
                }
            },
        });
    }

    render(): void {
        this.charts.append(
            this.counters.element,
            this.messagesPerSecond.element,
            this.subscribersPercentage.element,
            this.viewers.element,
            this.messagesPerMinute.element,
            this.emotesPerMessage.element,
            this.subscribers.element,
            this.moderation.element,
        );

        this.element.appendChild(this.hideChatButton.element);
    }
}
