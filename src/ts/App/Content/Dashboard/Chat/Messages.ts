import { EventBus } from 'common/EventBus';
import { PRIVMSG } from 'common/constants';
import { PrivMsgMessage } from 'common/types';

import { Message } from './Message';
import { ChatAnchor } from './ChatAnchor';
import { EmoteFactory } from './Emotes';

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
    emoteFactory: EmoteFactory;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createMessagesWrapper();
        this.anchor = new ChatAnchor(this.eventBus);
        this.emoteFactory = new EmoteFactory(this.eventBus);

        this.render();
        this.setSubscribers();
        this.setupLoop();
    }

    appendChatMessage(privMsgMessage: PrivMsgMessage): void {
        const message = new Message(this.emoteFactory, privMsgMessage);

        this.element.insertBefore(message.element, this.anchor.element.nextSibling);
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: (privMsgMessage) => {
                this.appendChatMessage(privMsgMessage);
            },
        });
    }

    render(): void {
        this.element.appendChild(this.anchor.element);
    }

    deleteOldMessages(): void {
        const messagesToDelete = this.element.childElementCount - 1000;

        if (messagesToDelete > 0) {
            for (let i = 0; i < messagesToDelete; i++) {
                if (this.element.lastChild) {
                    this.element.removeChild(this.element.lastChild);
                }
            }
        }
    }

    setupLoop(): void {
        setInterval(() => {
            this.deleteOldMessages();
        }, 5000);
    }
}
