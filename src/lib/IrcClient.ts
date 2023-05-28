import { CLEARCHAT, CLEARMSG, PRIVMSG, ROOMSTATE, UNKNOWN, USERNOTICE } from "@constants";
import { IrcTags, ParsedMessage } from "@types";
import { EventBus } from "./EventBus";

export class IrcClient {
    eventBus: EventBus;
    socket: WebSocket;

    ready = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.socket = new WebSocket("wss://irc-ws.chat.twitch.tv");
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }

    close(): void {
        this.socket.close();
    }

    join(channel: string): void {
        if (!this.ready) {
            setTimeout(() => this.join(channel), 1000);
            return;
        }

        this.socket.send("CAP REQ :twitch.tv/membership");
        this.socket.send("CAP REQ :twitch.tv/tags");
        this.socket.send("CAP REQ :twitch.tv/commands");
        this.socket.send(`JOIN #${channel.toLowerCase()}`);
    }

    onOpen(): void {
        this.socket.send(`PASS BLANK`);
        this.socket.send(`NICK justinfan4444`);
    }

    onMessage(event: MessageEvent<string>): void {
        const messages = event.data.trim().split("\r\n");

        messages.forEach((message: string) => {
            if (message.indexOf("PING") === 0) {
                this.socket.send(message.replace("PING", "PONG"));
                return;
            }

            if (message.split(" ")[1] === "376") {
                this.ready = true;
            }

            const parsedMessage = this.parse(message);

            const { keyword } = parsedMessage;

            switch (keyword) {
                case PRIVMSG:
                    this.eventBus.emit(PRIVMSG, parsedMessage);
                    break;

                case ROOMSTATE:
                    this.eventBus.emit(ROOMSTATE, parsedMessage);
                    break;

                case USERNOTICE:
                    this.eventBus.emit(USERNOTICE, parsedMessage);
                    console.log(parsedMessage);
                    break;

                case CLEARCHAT:
                    this.eventBus.emit(CLEARCHAT, parsedMessage);
                    console.log(parsedMessage);
                    break;

                case CLEARMSG:
                    this.eventBus.emit(CLEARMSG, parsedMessage);
                    console.log(parsedMessage);
                    break;

                case UNKNOWN:
                    console.warn(parsedMessage);
            }
        });
    }

    parse(message: string): ParsedMessage {
        let pos = 0;

        const tags: IrcTags = {};

        // Process irc tags
        if (message[pos] === "@") {
            const nextSpace = message.indexOf(" ");

            const tagsString = message.slice(1, nextSpace);

            tagsString.split(";").forEach((tag) => {
                const tagsPair = tag.split("=");

                if (tagsPair[0] === undefined) {
                    throw new Error("Unexpected format of IRC Message Tags");
                }

                tags[tagsPair[0]] = tagsPair[1];
            });

            pos = nextSpace + 1;
        }

        // skip trailing spaces
        while (message[pos] === " ") {
            pos++;
        }

        // process main body
        if (message[pos] === ":") {
            const nextColon = message.indexOf(":", pos + 1);
            const hasContent = nextColon !== -1;
            const metadataString = message.slice(pos + 1, hasContent ? nextColon : undefined);
            const [fullSource, keyword] = metadataString.trim().split(" ");

            if (fullSource == undefined || keyword === undefined) {
                throw new Error("Unexpected format of IRC Message Tags");
            }

            const source = fullSource.indexOf("!") !== -1 ? fullSource.slice(0, fullSource.indexOf("!")) : fullSource;

            const content = hasContent ? contentCleaner(message.slice(nextColon + 1)) : "";

            switch (keyword) {
                case PRIVMSG:
                case ROOMSTATE:
                case USERNOTICE:
                case CLEARCHAT:
                case CLEARMSG:
                case "001":
                case "002":
                case "003":
                case "004":
                case "353":
                case "366":
                case "372":
                case "375":
                case "376":
                case "CAP":
                case "JOIN":
                case "PART":
                    return {
                        keyword,
                        source,
                        content,
                        tags,
                    };

                default:
                    return {
                        keyword: UNKNOWN,
                        keywordHint: keyword,
                        source,
                        content,
                        tags,
                    };
            }
        }
        throw new Error("Unexpected format of IRC Message");
    }
}

const contentCleaner = (message: string): string => {
    return message.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
};
