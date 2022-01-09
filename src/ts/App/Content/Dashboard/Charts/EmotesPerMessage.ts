import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CHANNEL_SUBMIT, CLOSE_APP, EMOTE_USED, PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { BaseChart } from './BaseChart';
import { getSecondRoundedTo } from './helpers';

export class EmotesPerMessage extends BaseChart {
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
                    text: 'Emotes per Message (Last 5 Minutes)',
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
    newEmotes = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setSubscribers();
        this.setupLoop();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                const currentSecond = getSecondRoundedTo(5);

                if (this.data.length === 0) {
                    for (let i = 0; i < 30; i++) {
                        this.data.push({
                            x: currentSecond - (30 - i) * 10000,
                            y: NaN,
                        });
                    }
                }

                this.chart.update();
            },
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                this.newMessages++;
            },
        });

        this.eventBus.subscribe({
            eventName: EMOTE_USED,
            eventCallback: () => {
                this.newEmotes++;
            },
        });
    }

    setupLoop(): void {
        const loop = setInterval(() => {
            const currentSecond = getSecondRoundedTo(5);

            if (this.newMessages > 0) {
                this.data.push({
                    x: currentSecond,
                    y: this.newEmotes / this.newMessages,
                });

                this.newMessages = 0;
                this.newEmotes = 0;
            }

            if (this.data.length > 30) {
                this.data.shift();
            }

            this.chart.update();
        }, 10000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(loop);
            },
        });
    }
}
