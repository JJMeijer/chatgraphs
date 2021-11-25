import { PrivMsgMessage } from 'common/types';
import { EmoteFactory } from './Emotes';

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
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message', 'inline', 'w-full', 'px-1');

        const { tags, source, content } = this.privMsgMessage;
        const { 'display-name': displayName, 'tmi-sent-ts': timestamp, color, emotes } = tags;

        const date = timestamp ? new Date(parseInt(timestamp, 10)) : new Date();
        const time = date.toLocaleTimeString().substring(0, 5);

        const userNameColor = color ? color : '#60A5FA';
        const userName = (displayName || source) + ':';

        const messageContent = this.emoteFactory.emotify(content, emotes);

        messageWrapper.innerHTML = `
        <span class="text-gray-500 mr-1 text-sm">${time}</span>
        <span class="mr-1 font-bold" style="color: ${userNameColor};">${userName}</span>
        <span class="text-gray-300 break-words">${messageContent}</span>`;

        return messageWrapper;
    }
}
