import {
    PRIVMSG,
    ROOMSTATE,
    USERNOTICE,
    CHANNEL_SUBMIT,
    CLOSE_APP,
    TAB_CLICK,
    SCROLL_TO_BOTTOM,
    UNKNOWN,
    CLEARCHAT,
    CLEARMSG,
    VIEWER_COUNT,
    EMOTE_USED,
    CHAT_VISIBILITY,
} from './constants';

export interface IrcTags {
    'tmi-sent-ts'?: string;
    [key: string]: string | undefined;
}

interface BaseMessage {
    tags: IrcTags;
    source: string;
    content: string;
}

export interface PrivMsgMessage extends BaseMessage {
    keyword: typeof PRIVMSG;
}

export interface RoomstateMessage extends BaseMessage {
    keyword: typeof ROOMSTATE;
}

export interface UsernoticeMessage extends BaseMessage {
    keyword: typeof USERNOTICE;
}

export interface ClearchatMessage extends BaseMessage {
    keyword: typeof CLEARCHAT;
}

export interface ClearMsgMessage extends BaseMessage {
    keyword: typeof CLEARMSG;
}

export interface SystemMessage extends BaseMessage {
    keyword: '001' | '002' | '003' | '004' | '353' | '366' | '372' | '375' | '376' | 'CAP' | 'JOIN' | 'PART';
}

export interface UnknownMessage extends BaseMessage {
    keyword: typeof UNKNOWN;
    keywordHint: string;
}

export type ParsedMessage =
    | PrivMsgMessage
    | RoomstateMessage
    | UsernoticeMessage
    | ClearchatMessage
    | ClearMsgMessage
    | SystemMessage
    | UnknownMessage;

interface ChannelSubmit {
    channel: string;
}

interface ViewerCount {
    viewers: number;
}

interface EmoteUsed {
    type: 'twitch' | 'ffz' | 'bttv' | '7tv';
    word: string;
    url: string;
}

interface ChatVisibility {
    visible: boolean;
}

type SubscriberEventCallback<U> = (eventData: U) => void;

interface CloseAppSubscribeAction {
    eventName: typeof CLOSE_APP;
    eventCallback: SubscriberEventCallback<void>;
}

interface TabClickSubscribeAction {
    eventName: typeof TAB_CLICK;
    eventCallback: SubscriberEventCallback<void>;
}

interface ChannelSubmitSubscribeAction {
    eventName: typeof CHANNEL_SUBMIT;
    eventCallback: SubscriberEventCallback<ChannelSubmit>;
}

interface PrivMsgMessageSubscribeAction {
    eventName: typeof PRIVMSG;
    eventCallback: SubscriberEventCallback<PrivMsgMessage>;
}

interface RoomstateMessageSubscribeAction {
    eventName: typeof ROOMSTATE;
    eventCallback: SubscriberEventCallback<RoomstateMessage>;
}

interface UsernoticeMessageSubscribeAction {
    eventName: typeof USERNOTICE;
    eventCallback: SubscriberEventCallback<UsernoticeMessage>;
}

interface ClearchatMessageSubscribeAction {
    eventName: typeof CLEARCHAT;
    eventCallback: SubscriberEventCallback<ClearchatMessage>;
}

interface ClearMsgMessageSubscribeAction {
    eventName: typeof CLEARMSG;
    eventCallback: SubscriberEventCallback<ClearMsgMessage>;
}

interface ScrollToBottomSubscribeAction {
    eventName: typeof SCROLL_TO_BOTTOM;
    eventCallback: SubscriberEventCallback<void>;
}

interface ViewerCountSubscribeAction {
    eventName: typeof VIEWER_COUNT;
    eventCallback: SubscriberEventCallback<ViewerCount>;
}

interface EmoteUsedSubscribeAction {
    eventName: typeof EMOTE_USED;
    eventCallback: SubscriberEventCallback<EmoteUsed>;
}

interface HideChatSubscribeAction {
    eventName: typeof CHAT_VISIBILITY;
    eventCallback: SubscriberEventCallback<ChatVisibility>;
}

interface CloseAppPublishAction {
    eventName: typeof CLOSE_APP;
}

interface TabClickPublishAction {
    eventName: typeof TAB_CLICK;
}

interface ChannelSubmitPublishAction {
    eventName: typeof CHANNEL_SUBMIT;
    eventData: ChannelSubmit;
}

interface PrivMsgMessagePublishAction {
    eventName: typeof PRIVMSG;
    eventData: PrivMsgMessage;
}

interface RoomstateMessagePublishAction {
    eventName: typeof ROOMSTATE;
    eventData: RoomstateMessage;
}

interface UsernoticeMessagePublishAction {
    eventName: typeof USERNOTICE;
    eventData: UsernoticeMessage;
}

interface ClearchatMessagePublishAction {
    eventName: typeof CLEARCHAT;
    eventData: ClearchatMessage;
}

interface ClearMsgMessagePublishAction {
    eventName: typeof CLEARMSG;
    eventData: ClearMsgMessage;
}

interface ScrollToBottomPublishAction {
    eventName: typeof SCROLL_TO_BOTTOM;
}

interface ViewerCountPublishAction {
    eventName: typeof VIEWER_COUNT;
    eventData: ViewerCount;
}

interface EmoteUsedPublishAction {
    eventName: typeof EMOTE_USED;
    eventData: EmoteUsed;
}

interface HideChatPublishAction {
    eventName: typeof CHAT_VISIBILITY;
    eventData: ChatVisibility;
}

export type SubscribeAction =
    | CloseAppSubscribeAction
    | TabClickSubscribeAction
    | ChannelSubmitSubscribeAction
    | PrivMsgMessageSubscribeAction
    | RoomstateMessageSubscribeAction
    | UsernoticeMessageSubscribeAction
    | ClearchatMessageSubscribeAction
    | ClearMsgMessageSubscribeAction
    | ScrollToBottomSubscribeAction
    | ViewerCountSubscribeAction
    | EmoteUsedSubscribeAction
    | HideChatSubscribeAction;

export type PublishAction =
    | CloseAppPublishAction
    | TabClickPublishAction
    | ChannelSubmitPublishAction
    | PrivMsgMessagePublishAction
    | RoomstateMessagePublishAction
    | UsernoticeMessagePublishAction
    | ClearchatMessagePublishAction
    | ClearMsgMessagePublishAction
    | ScrollToBottomPublishAction
    | ViewerCountPublishAction
    | EmoteUsedPublishAction
    | HideChatPublishAction;

export interface SubscriberDictionary {
    [CLOSE_APP]: SubscriberEventCallback<void>[];
    [TAB_CLICK]: SubscriberEventCallback<void>[];
    [CHANNEL_SUBMIT]: SubscriberEventCallback<ChannelSubmit>[];
    [PRIVMSG]: SubscriberEventCallback<PrivMsgMessage>[];
    [ROOMSTATE]: SubscriberEventCallback<RoomstateMessage>[];
    [USERNOTICE]: SubscriberEventCallback<UsernoticeMessage>[];
    [CLEARCHAT]: SubscriberEventCallback<ClearchatMessage>[];
    [CLEARMSG]: SubscriberEventCallback<ClearMsgMessage>[];
    [SCROLL_TO_BOTTOM]: SubscriberEventCallback<void>[];
    [VIEWER_COUNT]: SubscriberEventCallback<ViewerCount>[];
    [EMOTE_USED]: SubscriberEventCallback<EmoteUsed>[];
    [CHAT_VISIBILITY]: SubscriberEventCallback<ChatVisibility>[];
}

export interface BttvEmoteInfo {
    id: string;
    code: string;
}

export interface BttvResponse {
    channelEmotes: BttvEmoteInfo[];
    sharedEmotes: BttvEmoteInfo[];
}

export interface EmoteInfo {
    [key: string]: string;
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

export interface SevenTvEmoteInfo {
    id: string;
    name: string;
}

export interface TimeData {
    x: number;
    y: number;
}

export interface EmoteCounter {
    word: string;
    count: number;
    url: string;
}

export interface TableData {
    [key: string]: string | number;
}

export interface ChatterInfo {
    count: number;
    badges: string;
}

export interface ChatterInfoDictionary {
    [key: string]: ChatterInfo;
}

export interface BadgeInfo {
    [key: string]: {
        title: string;
        url: string;
    };
}

export interface BadgeResponseVersionItem {
    title: string;
    image_url_1x: string;
}

export interface BadgeReponseItem {
    versions: {
        [key: string]: BadgeResponseVersionItem;
    };
}

export interface BadgeResponse {
    badge_sets: {
        [key: string]: BadgeReponseItem;
    };
}
