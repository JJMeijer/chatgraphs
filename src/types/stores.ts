import { StoreApi, UseBoundStore } from "zustand";

import { EventBus, BadgeFactory, EmoteFactory, PubSubClient, IrcClient } from "@lib";
import { ClearMsgMessage, ClearchatMessage, PrivMsgMessage, UsernoticeMessage } from "./irc";
import { DataPoint } from "./charts";
import { BadgeData } from "./emotes";

export interface Message {
    content: string;
}

export interface Emote {
    type: "twitch" | "bttv" | "ffz" | "7tv";
    word: string;
    url: string;
}

export interface ParsedPrivMsgMessage extends PrivMsgMessage {
    badges: BadgeData[];
    contentHTML: string;
}

export interface DataStore {
    init: () => void;
    close: () => void;
    intervals: number[];

    addMessage: (privMsg: PrivMsgMessage) => void;
    addEmote: (emote: Emote) => void;
    addUsernotice: (usernotice: UsernoticeMessage) => void;
    addClearChat: (clearchat: ClearchatMessage) => void;
    addClearMsg: (clearmsg: ClearMsgMessage) => void;

    chatMessages: ParsedPrivMsgMessage[];
    addChatMessage: (privMsg: PrivMsgMessage) => void;

    uptime: string;
    uptimeInit: () => void;

    totalMessages: number;
    totalMessagesQueue: PrivMsgMessage[];
    totalMessagesInit: () => void;

    viewers: number;
    viewersHistory: DataPoint[];
    setViewers: (viewers: number) => void;

    chatters: string[];
    chattersQueue: string[];
    chattersInit: () => void;

    totalEmotes: number;
    totalEmotesQueue: Emote[];
    totalEmotesInit: () => void;

    messagesPerSecond: DataPoint[];
    messagesPerSecondQueue: PrivMsgMessage[];
    messagesPerSecondInit: () => void;

    messagesPerMinute: DataPoint[];
    messagesPerMinuteQueue: PrivMsgMessage[];
    messagesPerMinuteInit: () => void;

    emotesPerMessage: DataPoint[];
    emotesPerMessageEmoteQueue: Emote[];
    emotesPerMessageMsgQueue: PrivMsgMessage[];
    emotesPerMessageInit: () => void;

    subscriberPercentage: DataPoint[];
    subscriberPercentageQueue: PrivMsgMessage[];
    subscriberPercentageInit: () => void;

    viewerParticipation: DataPoint[];
    viewerParticipationQueue: PrivMsgMessage[];
    viewerParticipationInit: () => void;

    subscriptions: DataPoint[];
    primeSubscriptions: DataPoint[];
    giftedSubscriptions: DataPoint[];
    subscriptionsQueue: UsernoticeMessage[];
    subscriptionsInit: () => void;

    bans: DataPoint[];
    timeouts: DataPoint[];
    msgRemovals: DataPoint[];
    moderationQueue: (ClearchatMessage | ClearMsgMessage)[];
    moderationInit: () => void;
}

export type UseDataStore = UseBoundStore<StoreApi<DataStore>>;

export interface Instance {
    id: string;
    channel: string;
    eventBus: EventBus;
    ircClient: IrcClient;
    pubSubClient: PubSubClient;
    badgeFactory: BadgeFactory;
    emoteFactory: EmoteFactory;
    useDataStore: UseDataStore;
}

export interface InstanceStore {
    instances: Instance[];
    activeInstanceId: string;
    setActiveInstanceId: (id: string) => void;
    addInstance: () => void;
    removeInstance: (id: string) => void;
    setInstanceChannel: (id: string, channel: string) => void;
}
