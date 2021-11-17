import { Content } from './Content';
import { Tab } from './Tab';
import { EventBus } from './EventBus';

export class App {
    tab: Tab;
    content: Content;

    eventBus: EventBus;

    constructor() {
        this.eventBus = new EventBus();

        this.tab = new Tab(this.eventBus);
        this.content = new Content(this.eventBus);
    }

    render() {
        this.tab.render();
        this.content.render();
    }
}
