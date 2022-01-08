import { SCROLL_TO_BOTTOM } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <span class="chat-anchor"></span>
`;

export class ChatAnchor {
    eventBus: EventBus;
    element: HTMLSpanElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLSpanElement>(html);

        this.setSubscribers();
    }

    isVisible(): boolean {
        const { top: anchorTop } = this.element.getBoundingClientRect();

        const parent = this.element.parentElement;
        if (parent === null) {
            throw new Error('chat anchor does not have parent');
        }

        const { bottom: parentBottom } = parent.getBoundingClientRect();

        return anchorTop < parentBottom;
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: SCROLL_TO_BOTTOM,
            eventCallback: () => {
                this.element.scrollIntoView();
            },
        });
    }
}
