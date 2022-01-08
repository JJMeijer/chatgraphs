import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';
import { Chat } from './Chat';
import { Embed } from './Embed';

const html = /*html*/ `
    <div class="relative max-h-[95vh] w-1/4 border-r border-gray-700"></div>
`;

export class Sidebar {
    eventBus: EventBus;
    element: HTMLDivElement;

    embed: Embed;
    chat: Chat;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.chat = new Chat(this.eventBus);
        this.embed = new Embed(this.eventBus);

        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.render();
    }

    render(): void {
        this.element.appendChild(this.embed.element);
        this.element.appendChild(this.chat.element);
    }
}
