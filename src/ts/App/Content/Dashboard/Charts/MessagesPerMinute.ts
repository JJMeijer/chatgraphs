import { Chart, ChartConfiguration } from 'chart.js';

import { MESSAGES_PER_MINUTE } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

const html = /*html*/ `
    <div class="flex items-center justify-center w-1/3 h-1/3 border border-purple-400">
        <canvas id="${MESSAGES_PER_MINUTE}"></canvas>
    </div>
`;

export class MessagesPerMinute {
    eventBus: EventBus;
    element: HTMLDivElement;
    canvas: HTMLCanvasElement;

    chart: Chart;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.canvas = this.element.querySelector(`#${MESSAGES_PER_MINUTE}`) as HTMLCanvasElement;

        this.chart = new Chart(this.canvas, CONFIG);
    }
}

const CONFIG: ChartConfiguration = {
    type: 'bar',
    data: {
        datasets: [],
    },
};
