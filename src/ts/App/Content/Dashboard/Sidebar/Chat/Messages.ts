import { EventBus } from 'common/EventBus';
import { PRIVMSG, USERNOTICE } from 'common/constants';
import { PrivMsgMessage, UsernoticeMessage } from 'common/types';
import { createElementFromHtml } from 'common/element';

import { Message } from './Message';
import { ChatAnchor } from './ChatAnchor';
import { EmoteFactory } from 'common/Factories';
import { SystemMessage } from './SystemMessage';

const html = /*html*/ `
    <div class="chat-messages flex flex-col-reverse h-full w-full overflow-y-auto py-1 no-overflow-anchor sm:overflow-anchor-auto"></div>
`;

export class Messages {
    eventBus: EventBus;
    element: HTMLDivElement;
    anchor: ChatAnchor;
    emoteFactory: EmoteFactory;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);
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

    appendUsernoticeMessage(usernoticeMessage: UsernoticeMessage): void {
        if (usernoticeMessage.content) {
            const privMsgMessage = usernoticeMessage as unknown as PrivMsgMessage;
            const message = new Message(this.emoteFactory, privMsgMessage);

            this.element.insertBefore(message.element, this.anchor.element.nextSibling);
        }

        const {
            tags: { 'system-msg': systemMessageStr },
        } = usernoticeMessage;

        if (systemMessageStr === undefined) {
            throw new Error('System message is undefined');
        }

        const systemMessage = new SystemMessage(systemMessageStr);
        this.element.insertBefore(systemMessage.element, this.anchor.element.nextSibling);
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: (privMsgMessage) => {
                this.appendChatMessage(privMsgMessage);
            },
        });

        this.eventBus.subscribe({
            eventName: USERNOTICE,
            eventCallback: (usernoticeMessage) => {
                this.appendUsernoticeMessage(usernoticeMessage);
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
