import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="flex items-center justify-center w-full lg:w-1/2 min-h-[350px] py-4 pl-8 px-4 border-t border-gray-700"></div>
`;

export class BaseVizualization {
    eventBus: EventBus;
    element = createElementFromHtml<HTMLDivElement>(html);

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }
}
