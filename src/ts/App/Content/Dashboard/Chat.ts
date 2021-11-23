import { PARSED_MESSAGE } from '../../../constants';
import { ParsedMessage } from '../../../types';
import { EventBus } from '../../EventBus';

const createChatWrapperElement = () => {
    const chatWrapperElement = document.createElement('div');
    chatWrapperElement.classList.add(
        'chat-wrapper',
        'flex',
        'flex-col-reverse',
        'h-full',
        'max-h-[95vh]',
        'w-1/4',
        'border-r',
        'border-gray-700',
        'overflow-y-auto',
    );
    return chatWrapperElement;
};

const createMessageElement = (time: string, color: string, userName: string, content: string) => {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('inline', 'w-full', 'px-1');

    messageWrapper.innerHTML = `
        <span class="text-gray-500 mr-1">${time}</span>
        <span class="mr-1" style="color: ${color};">${userName}</span>
        <span>${content}</span>
    `;

    return messageWrapper;
};

export class Chat {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createChatWrapperElement();

        this.setSubscribers();
    }

    appendChatMessage(parsedMessage: ParsedMessage): void {
        const { tags, source, content } = parsedMessage;
        const { 'display-name': displayName, 'tmi-sent-ts': timestamp, color } = tags;

        const date = timestamp ? new Date(parseInt(timestamp, 10)) : new Date();
        const time = date.toLocaleTimeString().substring(0, 5);

        const userNameColor = color ? color : '#60A5FA';
        const userName = (displayName || source) + ':';

        const messageElement = createMessageElement(time, userNameColor, userName, content);

        this.element.prepend(messageElement);
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PARSED_MESSAGE,
            eventCallback: (parsedMessage) => {
                const { keyword } = parsedMessage;

                if (keyword === 'PRIVMSG') {
                    this.appendChatMessage(parsedMessage);
                }
            },
        });
    }
}
