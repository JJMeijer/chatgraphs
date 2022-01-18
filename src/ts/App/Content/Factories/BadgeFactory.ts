import { ROOMSTATE } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { BadgeInfo, BadgeReponseItem, BadgeResponse, BadgeResponseVersionItem } from 'common/types';

export class BadgeFactory {
    eventBus: EventBus;
    badges: BadgeInfo = {};

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setGlobalBadges();
        this.setSubscribers();
    }

    parseBadgeResponse(badgeResponse: BadgeResponse): void {
        const { badge_sets: badgeSets } = badgeResponse;

        Object.keys(badgeSets).forEach((badgeKey) => {
            const { versions } = badgeSets[badgeKey] as BadgeReponseItem;

            Object.keys(versions).forEach((badgeVersion) => {
                const { image_url_1x: url, title } = versions[badgeVersion] as BadgeResponseVersionItem;

                const badgeId = `${badgeKey}/${badgeVersion}`;

                this.badges[badgeId] = {
                    title,
                    url,
                };
            });
        });
    }

    async setGlobalBadges(): Promise<void> {
        const resp = await fetch('https://badges.twitch.tv/v1/badges/global/display');

        if (resp.ok) {
            const badgeResponse = (await resp.json()) as BadgeResponse;
            this.parseBadgeResponse(badgeResponse);

            return;
        }

        console.info('Failed to get global badges');
    }

    async setChannelBadges(channelId: string): Promise<void> {
        const resp = await fetch(`https://badges.twitch.tv/v1/badges/channels/${channelId}/display`);

        if (resp.ok) {
            const badgeResponse = (await resp.json()) as BadgeResponse;
            this.parseBadgeResponse(badgeResponse);

            return;
        }

        console.info('Failed to get channel badges');
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

                this.setChannelBadges(roomId);
            },
        });
    }

    getBadge(badgeId: string): string {
        const badgeInfo = this.badges[badgeId];

        if (badgeInfo) {
            const { title, url } = badgeInfo;
            return `<img class="inline" src="${url}" alt="${title}" title="${title}">`;
        }

        throw new Error(`Unknown badgeId ${badgeId}`);
    }
}
