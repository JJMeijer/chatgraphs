import { createElementFromHtml } from 'common/element';
import { PrivMsgMessage } from 'common/types';
import { EmoteFactory } from 'common/Factories';

const createMessageElement = (time: string, color: string, username: string, content: string) => {
    const html = /*html*/ `
        <div class="message inline w-full px-1">
            <span class="text-gray-500 mr-1 text-sm">${time}</span>
            <span class="mr-1" style="color: ${color};">${username}</span>
            <span class="text-gray-300 breakw-words">${content}</span>
        </div>
    `;

    return createElementFromHtml<HTMLDivElement>(html);
};

export class Message {
    emoteFactory: EmoteFactory;
    privMsgMessage: PrivMsgMessage;

    element: HTMLDivElement;

    constructor(emoteFactory: EmoteFactory, privMsgMessage: PrivMsgMessage) {
        this.emoteFactory = emoteFactory;
        this.privMsgMessage = privMsgMessage;

        this.element = this.createMessage();
    }

    createMessage(): HTMLDivElement {
        const { tags, source, content } = this.privMsgMessage;
        const { 'display-name': displayName, 'tmi-sent-ts': timestamp, color, emotes } = tags;

        const date = timestamp ? new Date(parseInt(timestamp, 10)) : new Date();
        const time = date.toLocaleTimeString().substring(0, 5);

        const userNameColor = color ? color : '#60A5FA';
        const userName = (displayName || source) + ':';

        const messageContent = this.emoteFactory.emotify(content, emotes);

        return createMessageElement(time, userNameColor, userName, messageContent);
    }
}
