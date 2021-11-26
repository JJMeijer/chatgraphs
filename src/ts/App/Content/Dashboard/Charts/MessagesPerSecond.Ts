import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CLOSE_APP, PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { getChartElement } from './chartElement';
import { getSecondRoundedToFive } from './helpers';

export class MessagesPerSecond {
    eventBus: EventBus;
    element = getChartElement();
    canvas = this.element.querySelector('canvas') as HTMLCanvasElement;

    data: ScatterDataPoint[] = [];
    config: ChartConfiguration = {
        type: 'line',
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
                    adapters: {
                        date: {

                        },
                    },
                    type: 'time',
                    time: {
                        unit: 'second',
                        stepSize: 5,
                        displayFormats: {
                            second: 'H:mm:ss',
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Avg. Messages per Second',
                    position: 'top',
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newMessages = 0;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.setSubscribers();
        this.setupLoop();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                this.newMessages++;
            }
        })
    }

    setupLoop(): void {
        const loop = setInterval(() => {
            const currentSecond = getSecondRoundedToFive();

            this.data.push({
                x: currentSecond,
                y: this.newMessages / 5,
            });

            this.newMessages = 0;
            this.chart.update();
        }, 5000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(loop);
            }
        })
    }
}
