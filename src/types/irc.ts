import { CLEARCHAT, CLEARMSG, PRIVMSG, ROOMSTATE, UNKNOWN, USERNOTICE } from "@constants";

export interface IrcTags {
    "tmi-sent-ts"?: string;
    id?: string;
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
    keyword: "001" | "002" | "003" | "004" | "353" | "366" | "372" | "375" | "376" | "CAP" | "JOIN" | "PART";
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
