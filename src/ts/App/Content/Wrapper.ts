import { CLOSE_APP, TAB_CLICK } from '../../constants';
import { EventBus } from '../EventBus';

const createContentWrapperElement = (): HTMLDivElement => {
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add(
        'content-wrapper',
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'h-full',
    );

    return contentWrapper;
};

export class Wrapper {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createContentWrapperElement();
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
