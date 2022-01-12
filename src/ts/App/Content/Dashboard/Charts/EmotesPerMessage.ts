import { ScatterDataPoint, ChartConfiguration, Chart } from 'chart.js';
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
                    text: 'Emotes % per Message (Last 5 Minutes)',
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

    newWords = 0;
    newEmotes = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.setupLoop();
            },
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: ({ content }) => {
                this.newWords += content.split(' ').length;
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
        const currentSecond = getSecondRoundedTo(10);

        if (this.data.length === 0) {
            for (let i = 0; i < 30; i++) {
                this.data.push({
                    x: currentSecond - (30 - i) * 10000,
                    y: NaN,
                });
            }
        }

        this.chart.update();

        const interval = setInterval(() => {
            const currentSecond = getSecondRoundedTo(10);

            if (this.newEmotes > 0) {
                this.data.push({
                    x: currentSecond,
                    y: this.newEmotes / this.newWords,
                });

                this.newEmotes = 0;
                this.newWords = 0;
            }

            if (this.data.length > 30) {
                this.data.shift();
            }

            this.chart.update();
        }, 10000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(interval);
            },
        });
    }
}
