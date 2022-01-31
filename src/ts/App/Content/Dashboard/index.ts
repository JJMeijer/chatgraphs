import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { Visualizations } from './Visualizations';
import { Sidebar } from './Sidebar';
import { CHANNEL_SUBMIT } from 'common/constants';

const html = /*html*/ `
    <div class="hidden flex-col md:flex-row h-full w-full bg-gray-800"></div>
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
        this.setSubscribers();
    }

    show() {
        this.element.classList.replace('hidden', 'flex');
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => this.show(),
        });
    }

    render(): void {
        this.element.appendChild(this.sidebar.element);
        this.element.appendChild(this.visualizations.element);
    }
}
