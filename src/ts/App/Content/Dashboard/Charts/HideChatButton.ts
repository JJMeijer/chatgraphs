import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';
import { CHAT_VISIBILITY, ARROW_DOWN, ARROW_UP } from 'common/constants';

const html = /*html*/ `
    <div class="opacity-70 absolute -top-2 sm:top-1/2 flex w-full sm:w-0 justify-center">
        <span class="py-1 px-2 rounded-md border border-gray-700 hover:bg-gray-600">
            ${ARROW_UP}
        </span>
    </div>
`;

export class HideChatButton {
    eventBus: EventBus;
    element = createElementFromHtml<HTMLDivElement>(html);
    span = this.element.querySelector('span') as HTMLSpanElement;

    visible = true;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setListeners();
    }

    switchVisibility(): void {
        this.visible = !this.visible;
        this.span.innerHTML = this.visible ? ARROW_UP : ARROW_DOWN;
    }

    setListeners(): void {
        this.element.addEventListener('click', () => {
            this.switchVisibility();

            this.eventBus.publish({
                eventName: CHAT_VISIBILITY,
                eventData: {
                    visible: this.visible,
                },
            });
        });
    }
}
