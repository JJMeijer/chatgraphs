import { ChannelSelect } from './ChannelSelect';
import { Wrapper } from './Wrapper';
import { EventBus } from '../EventBus';

export class Content {
    eventBus: EventBus;

    wrapper: Wrapper;
    channelSelect: ChannelSelect;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.wrapper = new Wrapper(eventBus);
        this.channelSelect = new ChannelSelect(eventBus);
    }

    render() {
        Wrapper.hideAll();

        const contentContainer = document.getElementById('content') as HTMLDivElement;
        this.wrapper.element.appendChild(this.channelSelect.element);
        contentContainer.appendChild(this.wrapper.element);

        this.channelSelect.element.focus();
    }
}
