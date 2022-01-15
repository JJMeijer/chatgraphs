import { CHANNEL_SUBMIT, CLOSE_APP, PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { ChatterInfo, ChatterInfoDictionary } from 'common/types';
import { BaseTable } from './BaseTable';

export class TopChatters extends BaseTable {
    chatters: ChatterInfoDictionary = {};

    constructor(eventBus: EventBus) {
        super(eventBus, 'Top Chatters');

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.createTable(['Chatter', 'Badges', 'Messages']);
                this.setupLoop();
            },
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: (eventData) => {
                const {
                    source,
                    tags: { 'display-name': displayName, badges = '' },
                } = eventData;

                const chatter = displayName || source;

                const existingChatter = this.chatters[chatter];

                if (existingChatter) {
                    existingChatter.count += 1;
                    return;
                }

                this.chatters[chatter] = {
                    count: 1,
                    badges,
                };
            },
        });
    }

    setupLoop(): void {
        const interval = setInterval(() => {
            this.data = Object.keys(this.chatters)
                .map((chatter) => {
                    const { badges, count } = this.chatters[chatter] as ChatterInfo;

                    return {
                        Chatter: chatter,
                        Badges: badges,
                        Messages: count,
                    };
                })
                .sort((a, b) => {
                    if (a.Messages < b.Messages) {
                        return 1;
                    }

                    if (a.Messages > b.Messages) {
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
