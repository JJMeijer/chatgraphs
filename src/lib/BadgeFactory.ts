import { ROOMSTATE } from "@constants";
import { BadgeData, BadgeDataDict, BadgeResponse } from "@types";
import { EventBus } from "./EventBus";

export class BadgeFactory {
    eventBus: EventBus;
    private badges: BadgeDataDict = {};

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setGlobalBadges();

        this.eventBus.on(ROOMSTATE, (data) => {
            const {
                tags: { "room-id": roomId },
            } = data;

            if (!roomId) {
                console.warn("Room ID is missing from ROOMSTATE message");
                return;
            }

            this.setChannelBadges(roomId);
        });
    }

    private parseBadgeResponse(badgeResponse: BadgeResponse): void {
        const { badge_sets: badgeSets } = badgeResponse;

        Object.entries(badgeSets).forEach(([badgeKey, badgeVersions]) => {
            const { versions } = badgeVersions;

            Object.entries(versions).forEach(([badgeVersionkey, badgeItem]) => {
                const { image_url_1x: url, title } = badgeItem;

                const badgeId = `${badgeKey}/${badgeVersionkey}`;

                this.badges[badgeId] = {
                    title,
                    url,
                };
            });
        });
    }

    private async setGlobalBadges(): Promise<void> {
        const resp = await fetch("https://badges.twitch.tv/v1/badges/global/display");

        if (!resp.ok) {
            console.warn("Failed to get global badges");
            return;
        }

        const badgeResponse = (await resp.json()) as BadgeResponse;
        this.parseBadgeResponse(badgeResponse);

        return;
    }

    async setChannelBadges(channelId: string): Promise<void> {
        const resp = await fetch(`https://badges.twitch.tv/v1/badges/channels/${channelId}/display`);

        if (resp.ok) {
            const badgeResponse = (await resp.json()) as BadgeResponse;
            this.parseBadgeResponse(badgeResponse);

            return;
        }

        console.info("Failed to get channel badges");
    }

    getBadgeData(badgeId: string): BadgeData | undefined {
        const badge = this.badges[badgeId];

        if (!badge) {
            console.warn(`Badge Unavailable: ${badgeId}`);
            return;
        }

        return badge;
    }
}
