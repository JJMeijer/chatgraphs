import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CLOSE_APP, PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { BaseChart } from './BaseChart';
import { getSecondRoundedToFive } from './helpers';

export class MessagesPerSecond extends BaseChart {
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
                    type: 'time',
                    time: {
                        unit: 'second',
                        stepSize: 20,
                        tooltipFormat: 'H:mm:ss',
                        displayFormats: {
                            second: 'H:mm:ss',
                        },
                    },
                },
                y: {
                    type: 'linear',
                    min: 0,
                    beginAtZero: true,
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
        super(eventBus);

        this.setSubscribers();
        this.setupLoop();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                this.newMessages++;
            },
        });
    }

    setupLoop(): void {
        const loop = setInterval(() => {
            const currentSecond = getSecondRoundedToFive();

            if (this.data.length === 0) {
                for (let i = 0; i < 60; i++) {
                    this.data.push({
                        x: currentSecond - (60 - i) * 5000,
                        y: NaN,
                    });
                }
            }

            if (this.newMessages > 0) {
                this.data.push({
                    x: currentSecond,
                    y: this.newMessages / 5,
                });

                this.newMessages = 0;
            }

            if (this.data.length > 60) {
                this.data.shift();
            }

            this.chart.update();
        }, 5000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(loop);
            },
        });
    }
}
