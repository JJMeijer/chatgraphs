import {
    PRIVMSG,
    ROOMSTATE,
    USERNOTICE,
    CHANNEL_SUBMIT,
    CLOSE_APP,
    TAB_CLICK,
    SCROLL_TO_BOTTOM,
    UNKNOWN,
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

export interface SystemMessage extends BaseMessage {
    keyword: '001' | '002' | '003' | '004' | '353' | '366' | '372' | '375' | '376' | 'CAP' | 'JOIN';
}

export interface UnknownMessage extends BaseMessage {
    keyword: typeof UNKNOWN;
    keywordHint: string;
}

export type ParsedMessage = PrivMsgMessage | RoomstateMessage | UsernoticeMessage | SystemMessage | UnknownMessage;

interface ChannelSubmit {
    channel: string;
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

interface ScrollToBottomSubscribeAction {
    eventName: typeof SCROLL_TO_BOTTOM;
    eventCallback: SubscriberEventCallback<void>;
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

interface ScrollToBottomPublishAction {
    eventName: typeof SCROLL_TO_BOTTOM;
}

export type SubscribeAction =
    | CloseAppSubscribeAction
    | TabClickSubscribeAction
    | ChannelSubmitSubscribeAction
    | PrivMsgMessageSubscribeAction
    | RoomstateMessageSubscribeAction
    | UsernoticeMessageSubscribeAction
    | ScrollToBottomSubscribeAction;

export type PublishAction =
    | CloseAppPublishAction
    | TabClickPublishAction
    | ChannelSubmitPublishAction
    | PrivMsgMessagePublishAction
    | RoomstateMessagePublishAction
    | UsernoticeMessagePublishAction
    | ScrollToBottomPublishAction;

export interface SubscriberDictionary {
    [CLOSE_APP]: SubscriberEventCallback<void>[];
    [TAB_CLICK]: SubscriberEventCallback<void>[];
    [CHANNEL_SUBMIT]: SubscriberEventCallback<ChannelSubmit>[];
    [PRIVMSG]: SubscriberEventCallback<PrivMsgMessage>[];
    [ROOMSTATE]: SubscriberEventCallback<RoomstateMessage>[];
    [USERNOTICE]: SubscriberEventCallback<UsernoticeMessage>[];
    [SCROLL_TO_BOTTOM]: SubscriberEventCallback<void>[];
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
