import { createElementFromHtml } from 'common/element';
import { EventBus } from '../../../EventBus';
import { MessagesPerMinute } from './MessagesPerMinute';

const html = /*html*/ `
    <div class="flex flex-row flex-wrap h-full p-2 w-3/4">
`;

export class Charts {
    eventBus: EventBus;
    element: HTMLDivElement;

    messagesPerMinute: MessagesPerMinute;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.messagesPerMinute = new MessagesPerMinute(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.append(this.messagesPerMinute.element);
    }
}
