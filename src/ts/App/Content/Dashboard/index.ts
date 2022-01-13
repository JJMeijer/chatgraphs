import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { Visualizations } from './Visualizations';
import { Sidebar } from './Sidebar';

const html = /*html*/ `
    <div class="flex flex-col md:flex-row h-full w-full bg-gray-800"></div>
`;

export class Dashboard {
    eventBus: EventBus;
    element: HTMLDivElement;

    sidebar: Sidebar;
    visualizations: Visualizations;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.sidebar = new Sidebar(this.eventBus);
        this.visualizations = new Visualizations(this.eventBus);

        this.render();
    }

    render(): void {
        this.element.appendChild(this.sidebar.element);
        this.element.appendChild(this.visualizations.element);
    }
}
