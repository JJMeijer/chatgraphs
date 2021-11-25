import { SCROLL_TO_BOTTOM } from 'common/constants';
import { EventBus } from 'common/EventBus';

const createChatAnchorElement = (): HTMLSpanElement => {
    const chatAnchorElement = document.createElement('span');
    chatAnchorElement.classList.add('chat-anchor');

    return chatAnchorElement;
};

export class ChatAnchor {
    eventBus: EventBus;
    element: HTMLSpanElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createChatAnchorElement();

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
