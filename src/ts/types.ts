import { PARSED_MESSAGE, CHANNEL_SUBMIT, CLOSE_APP, TAB_CLICK } from './constants';

interface IrcTags {
    'tmi-sent-ts'?: number;
    [key: string]: string | number | undefined;
}

export interface ParsedMessage {
    tags: IrcTags;
    fullSource: string;
    source: string;
    keyword: string;
    keywordMetadata: string[];
    content: string;
}

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

interface ParsedMessageSubscribeAction {
    eventName: typeof PARSED_MESSAGE;
    eventCallback: SubscriberEventCallback<ParsedMessage>;
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

interface ParsedMessagePublishAction {
    eventName: typeof PARSED_MESSAGE;
    eventData: ParsedMessage;
}

export type SubscribeAction =
    | CloseAppSubscribeAction
    | TabClickSubscribeAction
    | ChannelSubmitSubscribeAction
    | ParsedMessageSubscribeAction;

export type PublishAction =
    | CloseAppPublishAction
    | TabClickPublishAction
    | ChannelSubmitPublishAction
    | ParsedMessagePublishAction;

export interface SubscriberDictionary {
    [CLOSE_APP]: SubscriberEventCallback<void>[];
    [TAB_CLICK]: SubscriberEventCallback<void>[];
    [CHANNEL_SUBMIT]: SubscriberEventCallback<ChannelSubmit>[];
    [PARSED_MESSAGE]: SubscriberEventCallback<ParsedMessage>[];
}
