import { EventBus } from '../EventBus';

export class IrcClient {
    eventBus: EventBus;
    socket: WebSocket;
    channel: string;

    constructor(eventBus: EventBus, channel: string) {
        this.eventBus = eventBus;
        this.channel = channel;

        this.socket = new WebSocket('wss://irc-ws.chat.twitch.tv');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }

    onOpen(): void {
        this.socket.send(`PASS BLANK`);
        this.socket.send(`NICK justinfan4444`);
    }

    onMessage(event: MessageEvent<string>): void {
        const messages = event.data.trim().split('\r\n');

        messages.forEach((message: string) => {
            console.log(message);
        });
    }
}
