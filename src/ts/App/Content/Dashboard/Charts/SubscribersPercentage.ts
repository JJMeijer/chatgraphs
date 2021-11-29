import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { PRIVMSG, CLOSE_APP } from 'common/constants';

import { EventBus } from 'common/EventBus';
import { BaseChart } from './BaseChart';
import { getSecondRoundedToFive } from './helpers';

export class SubscribersPercentage extends BaseChart {
    data: ScatterDataPoint[] = [];
    config: ChartConfiguration = {
        type: 'line',
        data: {
            datasets: [
                {
                    data: this.data,
                    fill: true,
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
                    min: 0,
                    max: 1,
                    ticks: {
                        stepSize: 0.2,
                        callback: (value) => {
                            return (value as number) * 100 + '%';
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: '% Subscriber Messages',
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const {
                                parsed: { y },
                            } = tooltipItem;

                            const perc = ((y as number) * 100).toFixed(1) + '%';
                            return perc;
                        },
                    },
                },
                legend: {
                    display: false,
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newMessages = 0;
    subscriberMessages = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setSubscribers();
        this.setupLoop();
    }

    setSubscribers() {
        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: (privMsgMessage) => {
                this.newMessages++;

                const {
                    tags: { subscriber },
                } = privMsgMessage;

                if (subscriber === '1') {
                    this.subscriberMessages++;
                }
            },
        });
    }

    setupLoop() {
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
                    y: this.subscriberMessages / this.newMessages,
                });

                this.newMessages = 0;
                this.subscriberMessages = 0;
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
