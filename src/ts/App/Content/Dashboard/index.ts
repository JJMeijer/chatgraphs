import { EventBus } from '../../EventBus';
import { Chat } from './Chat';
import { Charts } from './Charts';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="flex flex-row h-full w-full bg-gray-800"></div>
`;

export class Dashboard {
    eventBus: EventBus;
    element: HTMLDivElement;

    chat: Chat;
    charts: Charts;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.chat = new Chat(this.eventBus);
        this.charts = new Charts(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.appendChild(this.chat.element);
        this.element.appendChild(this.charts.element);
    }
}
