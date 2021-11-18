import { EventBus } from '../../EventBus';

const createChatElement = () => {
    const chatElement = document.createElement('div');
    chatElement.classList.add(
        'flex',
        'flex-col',
        'h-full',
        'justify-center',
        'items-center',
        'w-1/4',
        'border-r',
        'border-gray-700',
    );
    chatElement.innerHTML = 'CHAT';
    return chatElement;
};

export class Chat {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createChatElement();
    }
}
