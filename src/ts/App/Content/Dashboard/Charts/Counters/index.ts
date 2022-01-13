import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';
import { UptimeCounter } from './UptimeCounter';
import { ViewerCounter } from './ViewersCounter';
import { MessagesCounter } from './MessagesCounter';
import { ChatterCounter } from './ChatterCounter';
import { EmotesCounter } from './EmotesCounter';

const html = /*html*/ `
    <div class="flex flex-row flex-wrap justify-evenly w-full p-2"></div>
`;

export class Counters {
    eventBus: EventBus;
    element: HTMLDivElement = createElementFromHtml<HTMLDivElement>(html);

    uptimeCounter: UptimeCounter;
    viewerCounter: ViewerCounter;
    messagesCounter: MessagesCounter;
    chatterCounter: ChatterCounter;
    emoteCounter: EmotesCounter;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.uptimeCounter = new UptimeCounter(this.eventBus);
        this.viewerCounter = new ViewerCounter(this.eventBus);
        this.messagesCounter = new MessagesCounter(this.eventBus);
        this.chatterCounter = new ChatterCounter(this.eventBus);
        this.emoteCounter = new EmotesCounter(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.append(this.uptimeCounter.element);
        this.element.append(this.viewerCounter.element);
        this.element.append(this.messagesCounter.element);
        this.element.append(this.chatterCounter.element);
        this.element.append(this.emoteCounter.element);
    }
}
