import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CHANNEL_SUBMIT, CLOSE_APP, PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { BaseChart } from './BaseChart';
import { getCurrentSecond } from './helpers';

export class MessagesPerSecond extends BaseChart {
    barData: ScatterDataPoint[] = [];

    config: ChartConfiguration = {
        type: 'bar',
        data: {
            datasets: [
                {
                    type: 'bar',
                    data: this.barData,
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
                    ticks: {
                        stepSize: 1,
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Messages per Second (Last 5 Minutes)',
                    position: 'top',
                },
                legend: {
                    display: false,
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newMessages = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setSubscribers();
    }

    setInitData(): void {
        const currentSecond = getCurrentSecond();

        for (let i = 0; i < 300; i++) {
            this.barData.push({
                x: currentSecond - (300 - i) * 1000,
                y: NaN,
            });
        }

        this.chart.update();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.setInitData();
                this.setupLoops();
            },
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                this.newMessages++;
            },
        });
    }

    setupLoops(): void {
        const secondInterval = setInterval(() => {
            const currentSecond = getCurrentSecond();

            this.barData.push({
                x: currentSecond,
                y: this.newMessages,
            });

            this.newMessages = 0;

            if (this.barData.length > 300) {
                this.barData.shift();
            }

            this.chart.update();
        }, 1000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(secondInterval);
            },
        });
    }
}
