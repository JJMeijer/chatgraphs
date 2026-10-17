import { ROOMSTATE } from "@constants";
import { BadgeData, BadgeDataDict, BadgeResponse } from "@types";
import { EventBus } from "./EventBus";

export class BadgeFactory {
    eventBus: EventBus;
    private badges: BadgeDataDict = {};
    private globalBadgesPromise: Promise<void>;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.globalBadgesPromise = this.setGlobalBadges();

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
        badgeResponse.forEach(({ set_id: setId, versions }) => {
            versions.forEach(({ id, image_url_1x: url, title }) => {
                const badgeId = `${setId}/${id}`;

                this.badges[badgeId] = {
                    title,
                    url,
                };
            });
        });
    }

    private async setGlobalBadges(): Promise<void> {
        const resp = await fetch("https://api.ivr.fi/v2/twitch/badges/global");

        if (!resp.ok) {
            console.warn("Failed to get global badges");
            return;
        }

        const badgeResponse = (await resp.json()) as BadgeResponse;
        this.parseBadgeResponse(badgeResponse);

        return;
    }

    async setChannelBadges(channelId: string): Promise<void> {
        // Make sure the global badges are loaded before channel badges so that
        // channel overrides (e.g. custom subscriber/bits badges) win the race
        await this.globalBadgesPromise;

        const resp = await fetch(`https://api.ivr.fi/v2/twitch/badges/channel?id=${channelId}`);

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
