import { EMOTE_USED, PRIVMSG, ROOMSTATE, VIEW_COUNT, USERNOTICE, CLEARCHAT, CLEARMSG } from "@constants";
import {
    ClearMsgMessage,
    ClearchatMessage,
    Emote,
    EventCallback,
    PrivMsgMessage,
    RoomstateMessage,
    Subscribers,
    UsernoticeMessage,
    ViewCountMessage,
} from "@types";

export class EventBus {
    private subscribers: Subscribers = {};

    on(event: typeof ROOMSTATE, callback: EventCallback<RoomstateMessage>): void;
    on(event: typeof PRIVMSG, callback: EventCallback<PrivMsgMessage>): void;
    on(event: typeof VIEW_COUNT, callback: EventCallback<ViewCountMessage>): void;
    on(event: typeof EMOTE_USED, callback: EventCallback<Emote>): void;
    on(event: typeof USERNOTICE, callback: EventCallback<UsernoticeMessage>): void;
    on(event: typeof CLEARCHAT, callback: EventCallback<ClearchatMessage>): void;
    on(event: typeof CLEARMSG, callback: EventCallback<ClearMsgMessage>): void;
    on(event: string, callback: EventCallback<any>): void {
        const eventSubscriber = this.subscribers[event] || (this.subscribers[event] = []);
        eventSubscriber.push(callback);
    }

    emit(event: typeof ROOMSTATE, data: RoomstateMessage): void;
    emit(event: typeof PRIVMSG, data: PrivMsgMessage): void;
    emit(event: typeof VIEW_COUNT, data: ViewCountMessage): void;
    emit(event: typeof EMOTE_USED, data: Emote): void;
    emit(event: typeof USERNOTICE, data: UsernoticeMessage): void;
    emit(event: typeof CLEARCHAT, data: ClearchatMessage): void;
    emit(event: typeof CLEARMSG, data: ClearMsgMessage): void;
    emit(event: string, data: any): void {
        const eventSubscriber = this.subscribers[event];
        if (!eventSubscriber) return;

        eventSubscriber.forEach((callback) => callback(data));
    }

    reset(): void {
        this.subscribers = {};
    }
}
