import { EventBus } from '../../EventBus';
import { Chat } from './Chat';
import { Charts } from './Charts';

const createDashboardWrapper = (): HTMLDivElement => {
    const dashboard = document.createElement('div');
    dashboard.classList.add('flex', 'flex-row', 'h-full', 'w-full', 'bg-gray-800');

    return dashboard;
};

export class Dashboard {
    eventBus: EventBus;
    element: HTMLDivElement;

    chat: Chat;
    charts: Charts;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.element = createDashboardWrapper();
        this.chat = new Chat(this.eventBus);
        this.charts = new Charts(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.appendChild(this.chat.element);
        this.element.appendChild(this.charts.element);
    }
}
