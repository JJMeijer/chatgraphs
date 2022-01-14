import { EventBus } from 'common/EventBus';
import { BaseTable } from './BaseTable';

export class TopChatters extends BaseTable {
    constructor(eventBus: EventBus) {
        super(eventBus, 'Top Chatters');
    }
}
