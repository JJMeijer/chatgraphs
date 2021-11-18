import { ParsedMessage } from '../types';
import { CHANNEL_SUBMIT, CLOSE_APP } from '../constants';
import { EventBus } from './EventBus';

export class IrcClient {
    eventBus: EventBus;
    socket: WebSocket;

    ready = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.socket = new WebSocket('wss://irc-ws.chat.twitch.tv');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }

    onOpen(): void {
        this.socket.send(`PASS BLANK`);
        this.socket.send(`NICK justinfan4444`);

        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: ({ channel }) => {
                if (this.ready) {
                    this.socket.send('CAP REQ :twitch.tv/membership');
                    this.socket.send('CAP REQ :twitch.tv/tags');
                    this.socket.send('CAP REQ :twitch.tv/commands');
                    this.socket.send(`JOIN #${channel}`);
                    return;
                }

                throw new Error('IRC Client not ready to connect');
            },
        });

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                this.socket.close();
            },
        });
    }

    onMessage(event: MessageEvent<string>): void {
        const messages = event.data.trim().split('\r\n');

        messages.forEach((message: string) => {
            if (message.indexOf('PING') === 0) {
                this.socket.send(message.replace('PING', 'PONG'));
            }

            if (message.split(' ')[1] === '376') {
                this.ready = true;
            }

            this.parse(message);
        });
    }

    parse(message: string): void {
        let pos = 0;

        const parsedMessage: ParsedMessage = {
            tags: {},
            fullSource: '',
            source: '',
            keyword: '',
            keywordMetadata: [],
            content: '',
        };

        // Process irc tags
        if (message[pos] === '@') {
            const nextSpace = message.indexOf(' ');

            const tagsString = message.slice(1, nextSpace);

            tagsString.split(';').forEach((tag) => {
                const tagsPair = tag.split('=');

                if (tagsPair[0] === undefined) {
                    throw new Error('Unexpected format of IRC Message Tags');
                }

                parsedMessage.tags[tagsPair[0]] = tagsPair[1];
            });

            pos = nextSpace + 1;
        }

        // skip trailing spaces
        while (message[pos] === ' ') {
            pos++;
        }

        // process main body
        if (message[pos] === ':') {
            const nextColon = message.indexOf(':', pos + 1);
            const hasContent = nextColon !== -1;
            const metadataString = message.slice(pos + 1, hasContent ? nextColon : undefined);
            const [fullSource, keyword, ...keywordMetadata] = metadataString.trim().split(' ');
            const content = hasContent ? message.slice(nextColon + 1) : '';

            if (fullSource == undefined || keyword === undefined) {
                throw new Error('Unexpected format of IRC Message Tags');
            }

            const source =
                fullSource.indexOf('!') !== -1
                    ? fullSource.slice(0, fullSource.indexOf('!'))
                    : fullSource;

            parsedMessage.fullSource = fullSource;
            parsedMessage.source = source;
            parsedMessage.content = content;
            parsedMessage.keyword = keyword;
            parsedMessage.keywordMetadata = keywordMetadata;
        }

        console.log(parsedMessage);
    }
}
