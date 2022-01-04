import { Content } from './Content';
import { Tab } from './Tab';
import { EventBus } from './EventBus';
import { IrcClient } from './IrcClient';
import { PubSubClient } from './pubSubClient';

export class App {
    tab: Tab;
    content: Content;

    eventBus: EventBus;
    ircClient: IrcClient;
    pubsubClient: PubSubClient;

    constructor() {
        this.eventBus = new EventBus();
        this.ircClient = new IrcClient(this.eventBus);
        this.pubsubClient = new PubSubClient(this.eventBus);

        this.tab = new Tab(this.eventBus);
        this.content = new Content(this.eventBus);
    }

    render() {
        this.tab.render();
        this.content.render();
    }
}
