import { EMOTE_USED, ROOMSTATE } from "@constants";
import { BttvEmoteInfo, BttvResponse, FrankerFacezResponse, SevenTvEmoteSet, SevenTvChannel } from "@types";
import { EventBus } from "./EventBus";

export class EmoteFactory {
    eventBus: EventBus;

    bttvEmotes: Record<string, string> = {};
    frankerFacezEmotes: Record<string, string> = {};
    sevenTvEmotes: Record<string, string> = {};

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.setGlobalBttvEmotes();
        this.setGlobalSevenTvEmotes();

        this.eventBus.on(ROOMSTATE, (data) => {
            const {
                tags: { "room-id": roomId },
            } = data;

            if (!roomId) {
                console.warn("Room ID is missing from ROOMSTATE message");
                return;
            }

            this.setChannelBttvEmotes(roomId);
            this.setChannelFrankerFacezEmotes(roomId);
            this.setChannelSevenTvEmotes(roomId);
        });
    }

    private static getTwitchEmoticonUrl(emoteId: string): string {
        return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`;
    }

    private static getBttvEmoteUrl(emoteId: string): string {
        return `https://cdn.betterttv.net/emote/${emoteId}/1x`;
    }

    private static getFfzEmoteUrl(emoteId: string): string {
        return `https://cdn.frankerfacez.com/emoticon/${emoteId}/1`;
    }

    private static getSevenTvEmoteUrl(emoteId: string): string {
        return `https://cdn.7tv.app/emote/${emoteId}/1x.webp`;
    }

    emotify(content: string, twitchEmoteString: string): string {
        let newContent = content;

        if (twitchEmoteString) {
            const chars = Array.from(content);

            const emoteStrings = twitchEmoteString.split("/");
            emoteStrings.forEach((emoteString) => {
                const [emoteId, emoteLocations] = emoteString.split(":");

                if (emoteId === undefined || emoteLocations === undefined) {
                    throw new Error("Emote id or locations are undefined");
                }

                const url = EmoteFactory.getTwitchEmoticonUrl(emoteId);

                emoteLocations.split(",").forEach((emoteLocation) => {
                    const [startStr, endStr] = emoteLocation.split("-");

                    if (startStr === undefined || endStr === undefined) {
                        throw new Error("Start or end is undefined");
                    }

                    const start = parseInt(startStr, 10);
                    const end = parseInt(endStr, 10);

                    const word = chars.slice(start, end + 1).join("");

                    this.eventBus.emit(EMOTE_USED, {
                        type: "twitch",
                        word,
                        url,
                    });

                    const label = `${word} (twitch)`;
                    chars.splice(start, end + 1, `<img class="inline" src="${url}" alt="${label}" title="${label}" />`);
                });
            });

            newContent = chars.join("");
        }

        const words = newContent.split(" ");
        const emotifiedWords = words.map((word) => {
            const bttvId = this.bttvEmotes[word];
            const ffId = this.frankerFacezEmotes[word];
            const sevenTvId = this.sevenTvEmotes[word];

            if (bttvId) {
                const url = EmoteFactory.getBttvEmoteUrl(bttvId);

                this.eventBus.emit(EMOTE_USED, {
                    type: "bttv",
                    word,
                    url,
                });

                const label = `${word} (bttv)`;
                return `<img class="inline" src="${url}" alt="${label}" title="${label}" />`;
            }

            if (ffId) {
                const url = EmoteFactory.getFfzEmoteUrl(ffId);

                this.eventBus.emit(EMOTE_USED, {
                    type: "ffz",
                    word,
                    url,
                });

                const label = `${word} (ffz)`;
                return `<img class="inline" src="${url}" alt="${label}" title="${label}" />`;
            }

            if (sevenTvId) {
                const url = EmoteFactory.getSevenTvEmoteUrl(sevenTvId);

                this.eventBus.emit(EMOTE_USED, {
                    type: "7tv",
                    word,
                    url,
                });

                const label = `${word} (7tv)`;
                return `<img class="inline" src="${url}" alt="${label}" title="${label}" />`;
            }

            /**
             * Make a link for URLs. not really the right place to do this
             * but we're looping over words anyway
             */
            const URL_REGEX = /^(https?:\/\/[^\s]+)$/g;
            if (word.match(URL_REGEX)) {
                return `<a class="hover:bg-gray-600 text-purple-500 cursor-pointer rounded-md px-1" target="_blank" href="${word}">${word}</a>`;
            }

            const AT_REGEX = /^@[a-zA-Z0-9_]+$/;
            if (word.match(AT_REGEX)) {
                return `<span class="font-bold">${word}</span>`;
            }

            return word;
        });

        return emotifiedWords.join(" ");
    }

    async setGlobalBttvEmotes(): Promise<void> {
        const resp = await fetch("https://api.betterttv.net/3/cached/emotes/global");

        if (resp.ok) {
            const data = (await resp.json()) as BttvEmoteInfo[];
            data.forEach((emote) => {
                this.bttvEmotes[emote.code] = emote.id;
            });
            return;
        }

        console.info("Failed to get global bttv emotes");
    }

    async setChannelBttvEmotes(channelId: string): Promise<void> {
        const resp = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`);

        if (!resp.ok) {
            console.warn("Failed to get channel bttv emotes");
            return;
        }

        const { channelEmotes, sharedEmotes } = (await resp.json()) as BttvResponse;
        const emotes = [...channelEmotes, ...sharedEmotes];
        emotes.forEach((emote) => {
            this.bttvEmotes[emote.code] = emote.id;
        });
    }

    async setChannelFrankerFacezEmotes(channelId: string): Promise<void> {
        const resp = await fetch(`https://api.frankerfacez.com/v1/room/id/${channelId}`);

        if (!resp.ok) {
            console.warn("Failed to get channel FrankerFacez emotes");
            return;
        }

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
    }

    async setGlobalSevenTvEmotes(): Promise<void> {
        const resp = await fetch("https://7tv.io/v3/emote-sets/global");

        if (!resp.ok) {
            console.warn("Failed to get global 7tv emotes");
            return;
        }

        const data = (await resp.json()) as SevenTvEmoteSet;
        data.emotes.forEach((emote) => {
            this.sevenTvEmotes[emote.name] = emote.id;
        });
    }

    async setChannelSevenTvEmotes(channelId: string): Promise<void> {
        const resp = await fetch(`https://7tv.io/v3/users/twitch/${channelId}`);

        if (!resp.ok) {
            console.warn("Failed to get channel 7tv emotes");
            return;
        }

        const data = (await resp.json()) as SevenTvChannel;
        data.emote_set.emotes.forEach((emote) => {
            this.sevenTvEmotes[emote.name] = emote.id;
        });
    }
}
