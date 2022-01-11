import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="py-1 px-4 flex flex-col">
        <span class="counter-title text-base"></span>
        <span class="counter-content text-lg font-bold"></span>
    </div>
`;

export class BaseCounter {
    eventBus: EventBus;
    element: HTMLDivElement;
    titleElement: HTMLSpanElement;
    contentElement: HTMLSpanElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.titleElement = this.element.querySelector('.counter-title') as HTMLSpanElement;
        this.contentElement = this.element.querySelector('.counter-content') as HTMLSpanElement;

        this.setSubscribers();
    }

    setTitle(title: string): void {
        this.titleElement.innerText = title;
    }

    setContent(content: string): void {
        this.contentElement.innerText = content;
    }

    setSubscribers(): void {
        // noop
    }
}
