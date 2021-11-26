import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="flex items-center justify-center w-1/2 h-1/3 px-4">
        <canvas></canvas>
    </div>
`;

export class BaseChart {
    eventBus: EventBus;
    element = createElementFromHtml<HTMLDivElement>(html);
    canvas = this.element.querySelector('canvas') as HTMLCanvasElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }
}
