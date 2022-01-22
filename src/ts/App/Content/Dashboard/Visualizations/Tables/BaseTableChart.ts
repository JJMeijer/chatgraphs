import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

const html = /*html*/ `
    <div class="h-10 w-24">
        <canvas></canvas>
    </div>
`;

export class BaseTableChart {
    eventBus: EventBus;
    element = createElementFromHtml<HTMLDivElement>(html);
    canvas = this.element.querySelector('canvas') as HTMLCanvasElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }
}
