import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { BaseVizualization } from '../BaseVisualization';

import './chartGlobalSetup';

const html = /*html*/ `
    <canvas></canvas>
`;

export class BaseChart extends BaseVizualization {
    canvas = createElementFromHtml<HTMLCanvasElement>(html);

    constructor(eventBus: EventBus) {
        super(eventBus);
        this.render();
    }

    render(): void {
        this.element.appendChild(this.canvas);
    }
}
