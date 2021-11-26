import { CLOSE_APP, TAB_CLICK } from '../../constants';
import { EventBus } from '../EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="relative content-wrapper flex flex-col justify-center items-center h-full"></div>
`;

export class Wrapper {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);

        this.setSubscribers();
    }

    static hideAll() {
        const allContentWrappers = document.querySelectorAll('.content-wrapper');
        allContentWrappers.forEach((element) => element.classList.replace('flex', 'hidden'));
    }

    setSubscribers() {
        this.eventBus.subscribe({
            eventName: TAB_CLICK,
            eventCallback: () => this.show(),
        });

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => this.delete(),
        });
    }

    show() {
        Wrapper.hideAll();
        this.element.classList.replace('hidden', 'flex');
    }

    delete() {
        this.element.remove();
    }
}
