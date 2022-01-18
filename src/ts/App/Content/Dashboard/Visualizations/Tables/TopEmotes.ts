import { CHANNEL_SUBMIT, CLOSE_APP, EMOTE_USED } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { EmoteCounterInfo, EmoteCounterDictionary } from 'common/types';
import { BaseTable } from './BaseTable';

export class TopEmotes extends BaseTable {
    emotes: EmoteCounterDictionary = {};

    constructor(eventBus: EventBus) {
        super(eventBus, 'Top Emotes');

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.createTable(['Emote', 'Service', 'Count']);
                this.setupLoop();
            },
        });

        this.eventBus.subscribe({
            eventName: EMOTE_USED,
            eventCallback: (eventData) => {
                const { type, word, url } = eventData;

                const existingEmote = this.emotes[word];

                if (existingEmote) {
                    existingEmote.count += 1;
                    return;
                }

                const typeLookup = {
                    bttv: 'BetterTTV',
                    twitch: 'Twitch',
                    ffz: 'FrankerFaceZ',
                    '7tv': '7TV',
                } as const;

                const verboseType = typeLookup[type];

                const emoteElement = /*html*/ `
                    <span>
                        <img class="inline" src="${url}" alt="${word}" title="${word}">
                         -
                        ${word}
                    </span>
                `;

                this.emotes[word] = {
                    verboseType,
                    emoteElement,
                    count: 1,
                };
            },
        });
    }

    setupLoop(): void {
        const interval = setInterval(() => {
            this.data = Object.keys(this.emotes)
                .map((emote) => {
                    const { verboseType, emoteElement, count } = this.emotes[emote] as EmoteCounterInfo;

                    return {
                        Emote: emoteElement,
                        Type: verboseType,
                        Count: count,
                    };
                })
                .sort((a, b) => {
                    if (a.Count < b.Count) {
                        return 1;
                    }

                    if (a.Count > b.Count) {
                        return -1;
                    }

                    return 0;
                })
                .slice(0, 10);

            this.updateTable();
        }, 1000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(interval);
            },
        });
    }
}
