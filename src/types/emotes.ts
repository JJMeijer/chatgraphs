export interface BadgeResponse {
    badge_sets: {
        [key: string]: {
            versions: {
                [key: string]: {
                    title: string;
                    image_url_1x: string;
                    image_url_2x: string;
                    image_url_4x: string;
                };
            };
        };
    };
}

export interface BadgeData {
    title: string;
    url: string;
}

export interface BadgeDataDict {
    [key: string]: BadgeData;
}

export interface BttvEmoteInfo {
    id: string;
    code: string;
}

export interface BttvResponse {
    channelEmotes: BttvEmoteInfo[];
    sharedEmotes: BttvEmoteInfo[];
}

export interface SevenTvEmoteInfo {
    id: string;
    name: string;
}

export interface FrankerFacezResponse {
    room: {
        set: number;
    };
    sets: {
        [key: string]: {
            emoticons: {
                id: string;
                name: string;
            }[];
        };
    };
}
