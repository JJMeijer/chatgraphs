import { CHANNEL_SUBMIT, CLOSE_APP, PARSED_MESSAGE, TAB_CLICK } from '../constants';
import { SubscribeAction, SubscriberDictionary, PublishAction } from '../types';

export class EventBus {
    private subscriberDictionary: SubscriberDictionary;

    constructor() {
        this.subscriberDictionary = {
            [CLOSE_APP]: [],
            [TAB_CLICK]: [],
            [CHANNEL_SUBMIT]: [],
            [PARSED_MESSAGE]: [],
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

            case PARSED_MESSAGE:
                this.subscriberDictionary[PARSED_MESSAGE].push(action.eventCallback);
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
                this.subscriberDictionary[CHANNEL_SUBMIT].forEach((callback) =>
                    callback(action.eventData),
                );
                break;

            case PARSED_MESSAGE:
                this.subscriberDictionary[PARSED_MESSAGE].forEach((callback) =>
                    callback(action.eventData),
                );
                break;

            default:
                throw new Error('Unknown Event');
        }
    }
}
