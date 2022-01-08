import { SCROLL_TO_BOTTOM } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="scroll-back bottom-1 hidden absolute w-full items-center justify-center">
        <div class="
            w-3/4
            rounded-md
            text-lg
            p-2
            text-center
            border
            border-gray-600
            bg-gray-900
            text-gray-100
            font-bold
            cursor-pointer
        ">
            Scroll back to live
        </div>
    </div>
`;

export class ScrollBack {
    eventBus: EventBus;
    element: HTMLDivElement;
    isVisible = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);

        this.setListeners();
    }

    toggleVisibility(): void {
        if (this.isVisible) {
            this.element.classList.replace('flex', 'hidden');
        } else {
            this.element.classList.replace('hidden', 'flex');
        }

        this.isVisible = !this.isVisible;
    }

    setListeners(): void {
        this.element.addEventListener('click', () => {
            this.toggleVisibility();

            this.eventBus.publish({
                eventName: SCROLL_TO_BOTTOM,
            });
        });
    }
}
