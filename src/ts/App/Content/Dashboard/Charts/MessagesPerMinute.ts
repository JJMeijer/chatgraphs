import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';

import { PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { getChartElement } from './chartElement';
import { getCurrentMinute } from './helpers';

export class MessagesPerMinute {
    eventBus: EventBus;
    element = getChartElement();
    canvas = this.element.querySelector('canvas') as HTMLCanvasElement;

    data: ScatterDataPoint[] = [];
    config: ChartConfiguration = {
        type: 'bar',
        data: {
            datasets: [
                {
                    data: this.data,
                },
            ],
        },
        options: {
            parsing: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm',
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Messages per minute',
                    position: 'top',
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                const currentMinute = getCurrentMinute();
                const index = this.data.findIndex((point) => point.x === currentMinute);

                if (index === -1) {
                    this.data.push({
                        x: currentMinute,
                        y: 1,
                    });
                } else {
                    (this.data[index] as ScatterDataPoint).y += 1;
                }

                this.chart.update();
            },
        });
    }
}
