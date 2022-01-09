import { CHANNEL_SUBMIT, CLOSE_APP, EMOTE_USED, PRIVMSG, VIEWER_COUNT } from 'common/constants';
import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

const html = /*html*/ `
    <div class="flex flex-row items-center w-full">
        <div class="py-1 px-4 flex flex-col">
            <span class="text-base">Dashboard Uptime: </span>
            <span class="timer text-lg font-bold">00:00:00</span>
        </div>

        <div class="py-1 px-4 flex flex-col">
            <span class="text-base">Current Viewers: </span>
            <span class="viewers text-lg font-bold">0</span>
        </div>

        <div class="py-1 px-4 flex flex-col">
            <span class="text-base">Total Messages: </span>
            <span class="message-count text-lg font-bold">0</span>
        </div>

        <div class="py-1 px-4 flex flex-col">
            <span class="text-base">Distinct Chatters: </span>
            <span class="distinct-chatters text-lg font-bold">0</span>
        </div>

        <div class="py-1 px-4 flex flex-col">
            <span class="text-base">Emotes Used: </span>
            <span class="emotes-used text-lg font-bold">0</span>
        </div>
    </div>
`;

export class Counters {
    eventBus: EventBus;
    element = createElementFromHtml<HTMLDivElement>(html);
    totalMessagesElement = this.element.querySelector('.message-count') as HTMLSpanElement;
    distinctChattersElement = this.element.querySelector('.distinct-chatters') as HTMLSpanElement;
    timerElement = this.element.querySelector('.timer') as HTMLSpanElement;
    viewersElement = this.element.querySelector('.viewers') as HTMLSpanElement;
    emotesUsedElement = this.element.querySelector('.emotes-used') as HTMLSpanElement;

    totalMessages = 0;
    emotesUsed = 0;
    chatters: string[] = [];

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: ({ source }) => {
                this.totalMessages++;
                this.totalMessagesElement.innerText = this.totalMessages.toString();

                if (this.chatters.indexOf(source) === -1) {
                    this.chatters.push(source);
                    this.distinctChattersElement.innerText = this.chatters.length.toString();
                }
            },
        });

        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                const interval = setInterval(() => {
                    seconds++;

                    if (seconds === 60) {
                        minutes++;
                        seconds = 0;
                    }

                    if (minutes === 60) {
                        hours++;
                        minutes = 0;
                    }

                    const prependZero = (num: number) => (num < 10 ? `0${num}` : '' + num);

                    this.timerElement.innerText = `${prependZero(hours)}:${prependZero(minutes)}:${prependZero(seconds)}`;
                }, 1000);

                this.eventBus.subscribe({
                    eventName: CLOSE_APP,
                    eventCallback: () => {
                        clearInterval(interval);
                    },
                });
            },
        });

        this.eventBus.subscribe({
            eventName: VIEWER_COUNT,
            eventCallback: ({ viewers }) => {
                this.viewersElement.innerText = viewers.toString();
            },
        });

        this.eventBus.subscribe({
            eventName: EMOTE_USED,
            eventCallback: () => {
                this.emotesUsed++;
                this.emotesUsedElement.innerText = this.emotesUsed.toString();
            },
        });
    }
}
