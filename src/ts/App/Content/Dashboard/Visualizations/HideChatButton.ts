import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';
import { CHAT_VISIBILITY, ARROW_DOWN, ARROW_UP, ARROW_LEFT, ARROW_RIGHT } from 'common/constants';

const html = /*html*/ `
    <div title="Hide Chat" class="opacity-70 absolute top-0 md:top-1/2 md:left-2 flex w-full md:w-0 justify-center">
        <span class="
            px-5
            pb-1
            rounded-b-lg
            md:pt-2
            md:pb-3
            md:pl-3
            md:pr-2
            md:rounded-r-lg
            border
            border-gray-700
            hover:bg-gray-600
            cursor-pointer
        ">
            ${screen.width > 768 ? ARROW_LEFT : ARROW_UP}
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
        const { innerWidth } = window;

        if (this.visible) {
            if (innerWidth > 768) {
                this.span.innerHTML = ARROW_LEFT;
            } else {
                this.span.innerHTML = ARROW_UP;
            }
        } else {
            if (innerWidth > 768) {
                this.span.innerHTML = ARROW_RIGHT;
            } else {
                this.span.innerHTML = ARROW_DOWN;
            }
        }
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

        window.addEventListener('resize', () => {
            const { innerWidth } = window;
            if (this.visible) {
                this.span.innerHTML = innerWidth > 768 ? ARROW_LEFT : ARROW_UP;
            } else {
                this.span.innerHTML = innerWidth > 768 ? ARROW_RIGHT : ARROW_DOWN;
            }
        });
    }
}
