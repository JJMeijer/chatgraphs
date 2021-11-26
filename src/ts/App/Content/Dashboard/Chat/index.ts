import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { Messages } from './Messages';
import { ScrollBack } from './ScrollBack';

const html = /*html*/ `
    <div class="relative max-h-[95vh] h-full w-1/4 border-r border-gray-700"></div>
`;

export class Chat {
    eventBus: EventBus;
    element: HTMLDivElement;

    messages: Messages;
    scrollBack: ScrollBack;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);

        this.messages = new Messages(this.eventBus);
        this.scrollBack = new ScrollBack(this.eventBus);

        this.setListeners();
        this.render();
    }

    setListeners(): void {
        this.messages.element.addEventListener('scroll', () => {
            const isAnchorVisible = this.messages.anchor.isVisible();

            if (isAnchorVisible === !this.scrollBack.isVisible) {
                return;
            }

            this.scrollBack.toggleVisibility();
        });
    }

    render(): void {
        this.element.appendChild(this.messages.element);
        this.element.appendChild(this.scrollBack.element);
    }
}
