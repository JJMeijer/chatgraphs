import { SCROLL_TO_BOTTOM } from 'common/constants';
import { EventBus } from 'common/EventBus';

const createScrollBackElement = (): HTMLDivElement => {
    const scrollBackWrapper = document.createElement('div');
    scrollBackWrapper.classList.add(
        'bottom-1',
        'scroll-back',
        'hidden',
        'absolute',
        'w-full',
        'flex',
        'items-center',
        'justify-center',
    );

    const scrollBackButton = document.createElement('div');
    scrollBackButton.classList.add(
        'w-3/4',
        'rounded-md',
        'font-xl',
        'p-2',
        'text-center',
        'border',
        'border-gray-600',
        'bg-gray-900',
        'font-gray-100',
        'font-bold',
        'cursor-pointer',
    );
    scrollBackButton.innerHTML = 'Scroll back to live';

    scrollBackWrapper.appendChild(scrollBackButton);

    return scrollBackWrapper;
};

export class ScrollBack {
    eventBus: EventBus;
    element: HTMLDivElement;
    isVisible = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createScrollBackElement();

        this.setListeners();
    }

    toggleVisibility(): void {
        if (this.isVisible) {
            this.element.classList.add('hidden');
        } else {
            this.element.classList.remove('hidden');
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
