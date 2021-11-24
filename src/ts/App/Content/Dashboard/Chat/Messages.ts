import { EventBus } from 'common/EventBus';
import { PARSED_MESSAGE } from 'common/constants';
import { ParsedMessage } from 'common/types';

import { Message } from './Message';
import { ChatAnchor } from './ChatAnchor';

const createMessagesWrapper = (): HTMLDivElement => {
    const messagesWrapper = document.createElement('div');
    messagesWrapper.classList.add(
        'chat-messages',
        'flex',
        'flex-col-reverse',
        'h-full',
        'w-full',
        'overflow-y-auto',
        'py-1',
    );

    return messagesWrapper;
};

export class Messages {
    eventBus: EventBus;
    element: HTMLDivElement;
    anchor: ChatAnchor;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createMessagesWrapper();
        this.anchor = new ChatAnchor();

        this.render();
        this.setSubscribers();
    }

    appendChatMessage(parsedMessage: ParsedMessage): void {
        const { tags, source, content } = parsedMessage;
        const { 'display-name': displayName, 'tmi-sent-ts': timestamp, color } = tags;

        const date = timestamp ? new Date(parseInt(timestamp, 10)) : new Date();
        const time = date.toLocaleTimeString().substring(0, 5);

        const userNameColor = color ? color : '#60A5FA';
        const userName = (displayName || source) + ':';

        const message = new Message(time, userNameColor, userName, content);

        this.element.insertBefore(message.element, this.anchor.element.nextSibling);
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

    render(): void {
        this.element.appendChild(this.anchor.element);
    }
}
