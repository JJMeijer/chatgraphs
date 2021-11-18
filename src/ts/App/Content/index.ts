import { ChannelSelect } from './ChannelSelect';
import { Dashboard } from './Dashboard';
import { Wrapper } from './Wrapper';
import { EventBus } from '../EventBus';

export class Content {
    eventBus: EventBus;

    wrapper: Wrapper;
    channelSelect: ChannelSelect;
    dashboard: Dashboard;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.wrapper = new Wrapper(eventBus);
        this.channelSelect = new ChannelSelect(eventBus);
        this.dashboard = new Dashboard(eventBus);
    }

    render() {
        Wrapper.hideAll();

        const contentContainer = document.getElementById('content') as HTMLDivElement;
        this.wrapper.element.appendChild(this.dashboard.element);
        this.wrapper.element.appendChild(this.channelSelect.element);
        contentContainer.appendChild(this.wrapper.element);

        this.channelSelect.element.focus();
    }
}
