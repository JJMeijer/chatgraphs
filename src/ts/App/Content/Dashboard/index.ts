import { EventBus } from '../../EventBus';
import { Charts } from './Charts';
import { createElementFromHtml } from 'common/element';
import { Sidebar } from './Sidebar';

const html = /*html*/ `
    <div class="flex flex-row h-full w-full bg-gray-800"></div>
`;

export class Dashboard {
    eventBus: EventBus;
    element: HTMLDivElement;

    sidebar: Sidebar;
    charts: Charts;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.sidebar = new Sidebar(this.eventBus);
        this.charts = new Charts(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.appendChild(this.sidebar.element);
        this.element.appendChild(this.charts.element);
    }
}
