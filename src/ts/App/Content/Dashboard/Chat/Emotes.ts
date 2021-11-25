import { ROOMSTATE } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { BttvEmoteInfo, BttvResponse, FrankerFacezResponse, EmoteInfo } from 'common/types';

const getTwitchEmoticonUrl = (emoteId: string): string => {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`;
};

const getBttvEmoteUrl = (emoteId: string): string => {
    return `https://cdn.betterttv.net/emote/${emoteId}/1x`;
};

const getFrankerFaceZEmoteUrl = (emoteId: string): string => {
    return `https://cdn.frankerfacez.com/emoticon/${emoteId}/1`;
};

export class EmoteFactory {
    eventBus: EventBus;
    bttvEmotes: EmoteInfo = {};
    frankerFacezEmotes: EmoteInfo = {};

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.setGlobalBttvEmotes();

        this.setSubscribers();
    }

    emotify(content: string, twitchEmoteString: string | undefined): string {
        let newContent = content;

        if (twitchEmoteString) {
            const chars = Array.from(content);

            const emoteStrings = twitchEmoteString.split('/');
            emoteStrings.forEach((emoteString) => {
                const [emoteId, emoteLocations] = emoteString.split(':');

                if (emoteId === undefined || emoteLocations === undefined) {
                    throw new Error('Emote id or locations are undefined');
                }

                const emoteUrl = getTwitchEmoticonUrl(emoteId);

                emoteLocations.split(',').forEach((emoteLocation) => {
                    const [startStr, endStr] = emoteLocation.split('-');

                    if (startStr === undefined || endStr === undefined) {
                        throw new Error('Start or end is undefined');
                    }

                    const start = parseInt(startStr, 10);
                    const end = parseInt(endStr, 10);

                    const word = chars.slice(start, end + 1).join('');

                    chars[
                        start
                    ] = `<img class="inline" src="${emoteUrl}" alt="${word}" title="${word}" />`;

                    for (let i = start + 1; i < end + 1; i++) {
                        chars[i] = '';
                    }
                });
            });

            newContent = chars.join('');
        }

        const words = newContent.split(' ');
        const emotifiedWords = words.map((word) => {
            const bttvId = this.bttvEmotes[word];
            const ffId = this.frankerFacezEmotes[word];

            if (bttvId) {
                return `<img class="inline" src="${getBttvEmoteUrl(
                    bttvId,
                )}" alt="${word}" title="${word}" />`;
            }

            if (ffId) {
                return `<img class="inline" src="${getFrankerFaceZEmoteUrl(
                    ffId,
                )}" alt="${word}" title="${word}" />`;
            }

            const URL_REGEX = /^(https?:\/\/[^\s]+)$/g;
            if (word.match(URL_REGEX)) {
                return `<a class="hover:bg-gray-600 text-purple-500 cursor-pointer rounded-md px-1" target="_blank" href="${word}">${word}</a>`;
            }

            return word;
        });

        return emotifiedWords.join(' ');
    }

    async setGlobalBttvEmotes(): Promise<void> {
        const resp = await fetch('https://api.betterttv.net/3/cached/emotes/global');

        if (resp.ok) {
            const data = (await resp.json()) as BttvEmoteInfo[];
            data.forEach((emote) => {
                this.bttvEmotes[emote.code] = emote.id;
            });
            return;
        }

        throw new Error('Failed to get global bttv emotes');
    }

    async setChannelBttvEmotes(channelId: string): Promise<void> {
        const resp = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`);

        if (resp.ok) {
            const { channelEmotes, sharedEmotes } = (await resp.json()) as BttvResponse;
            const emotes = [...channelEmotes, ...sharedEmotes];
            emotes.forEach((emote) => {
                this.bttvEmotes[emote.code] = emote.id;
            });
            return;
        }

        throw new Error('Failed to get channel bttv emotes');
    }

    async setChannelFrankerFaceZEmotes(channelId: string): Promise<void> {
        const resp = await fetch(`https://api.frankerfacez.com/v1/room/id/${channelId}`);

        if (resp.ok) {
            const data = (await resp.json()) as FrankerFacezResponse;
            const {
                sets,
                room: { set: setId },
            } = data;

            const set = sets[setId];

            if (set) {
                set.emoticons.forEach((emote) => {
                    this.frankerFacezEmotes[emote.name] = emote.id;
                });
            }
            return;
        }

        throw new Error('Failed to get channel FrankerFacez emotes');
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: ROOMSTATE,
            eventCallback: (parsedMessage) => {
                const {
                    tags: { 'room-id': roomId },
                } = parsedMessage;

                if (roomId === undefined) {
                    throw new Error('Room id is undefined');
                }

                this.setChannelBttvEmotes(roomId);
                this.setChannelFrankerFaceZEmotes(roomId);
            },
        });
    }
}
