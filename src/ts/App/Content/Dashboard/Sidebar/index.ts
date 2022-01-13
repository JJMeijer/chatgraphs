import { CHAT_VISIBILITY } from 'common/constants';
import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';
import { Chat } from './Chat';
import { Embed } from './Embed';

const html = /*html*/ `
    <div class="relative h-[75vh] sm:h-[95vh] w-full sm:w-1/2 lg:w-1/4 sm:border-r border-gray-700"></div>
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

        this.setSubscribers();
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHAT_VISIBILITY,
            eventCallback: ({ visible }) => {
                visible ? this.show() : this.hide();
            },
        });
    }

    render(): void {
        this.element.appendChild(this.embed.element);
        this.element.appendChild(this.chat.element);
    }
}
