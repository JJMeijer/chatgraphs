import {
    CHANNEL_SUBMIT,
    CLOSE_APP,
    ROOMSTATE,
    TAB_CLICK,
    SCROLL_TO_BOTTOM,
    PRIVMSG,
    USERNOTICE,
    CLEARCHAT,
    CLEARMSG,
    VIEWER_COUNT,
    EMOTE_USED,
} from '../constants';
import { SubscribeAction, SubscriberDictionary, PublishAction } from '../types';

export class EventBus {
    private subscriberDictionary: SubscriberDictionary;

    constructor() {
        this.subscriberDictionary = {
            [CLOSE_APP]: [],
            [TAB_CLICK]: [],
            [CHANNEL_SUBMIT]: [],
            [PRIVMSG]: [],
            [ROOMSTATE]: [],
            [USERNOTICE]: [],
            [CLEARCHAT]: [],
            [CLEARMSG]: [],
            [SCROLL_TO_BOTTOM]: [],
            [VIEWER_COUNT]: [],
            [EMOTE_USED]: [],
        };
    }

    subscribe(action: SubscribeAction): void {
        switch (action.eventName) {
            case CLOSE_APP:
                this.subscriberDictionary[CLOSE_APP].push(action.eventCallback);
                break;

            case TAB_CLICK:
                this.subscriberDictionary[TAB_CLICK].push(action.eventCallback);
                break;

            case CHANNEL_SUBMIT:
                this.subscriberDictionary[CHANNEL_SUBMIT].push(action.eventCallback);
                break;

            case PRIVMSG:
                this.subscriberDictionary[PRIVMSG].push(action.eventCallback);
                break;

            case ROOMSTATE:
                this.subscriberDictionary[ROOMSTATE].push(action.eventCallback);
                break;

            case USERNOTICE:
                this.subscriberDictionary[USERNOTICE].push(action.eventCallback);
                break;

            case CLEARCHAT:
                this.subscriberDictionary[CLEARCHAT].push(action.eventCallback);
                break;

            case CLEARMSG:
                this.subscriberDictionary[CLEARMSG].push(action.eventCallback);
                break;

            case SCROLL_TO_BOTTOM:
                this.subscriberDictionary[SCROLL_TO_BOTTOM].push(action.eventCallback);
                break;

            case VIEWER_COUNT:
                this.subscriberDictionary[VIEWER_COUNT].push(action.eventCallback);
                break;

            case EMOTE_USED:
                this.subscriberDictionary[EMOTE_USED].push(action.eventCallback);
                break;

            default:
                throw new Error('Unknown Event');
        }
    }

    publish(action: PublishAction): void {
        switch (action.eventName) {
            case CLOSE_APP:
                this.subscriberDictionary[CLOSE_APP].forEach((callback) => callback());
                break;

            case TAB_CLICK:
                this.subscriberDictionary[TAB_CLICK].forEach((callback) => callback());
                break;

            case CHANNEL_SUBMIT:
                this.subscriberDictionary[CHANNEL_SUBMIT].forEach((callback) => callback(action.eventData));
                break;

            case PRIVMSG:
                this.subscriberDictionary[PRIVMSG].forEach((callback) => callback(action.eventData));
                break;

            case ROOMSTATE:
                this.subscriberDictionary[ROOMSTATE].forEach((callback) => callback(action.eventData));
                break;

            case USERNOTICE:
                this.subscriberDictionary[USERNOTICE].forEach((callback) => callback(action.eventData));
                break;

            case CLEARCHAT:
                this.subscriberDictionary[CLEARCHAT].forEach((callback) => callback(action.eventData));
                break;

            case CLEARMSG:
                this.subscriberDictionary[CLEARMSG].forEach((callback) => callback(action.eventData));
                break;

            case SCROLL_TO_BOTTOM:
                this.subscriberDictionary[SCROLL_TO_BOTTOM].forEach((callback) => callback());
                break;

            case VIEWER_COUNT:
                this.subscriberDictionary[VIEWER_COUNT].forEach((callback) => callback(action.eventData));
                break;

            case EMOTE_USED:
                this.subscriberDictionary[EMOTE_USED].forEach((callback) => callback(action.eventData));
                break;

            default:
                throw new Error('Unknown Event');
        }
    }
}
