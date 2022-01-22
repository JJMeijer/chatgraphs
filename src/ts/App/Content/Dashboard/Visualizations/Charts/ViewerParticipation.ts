import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';

import { CHANNEL_SUBMIT, CLOSE_APP, PRIVMSG, VIEWER_COUNT } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { BaseChart } from './BaseChart';
import { getCurrentMinute } from './helpers';

export class ViewerParticipation extends BaseChart {
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
                        unit: 'minute',
                        tooltipFormat: 'H:mm',
                        displayFormats: {
                            minute: 'H:mm',
                        },
                    },
                },
                y: {
                    min: 0,
                    ticks: {
                        stepSize: 0.2,
                        callback: (value) => {
                            return ((value as number) * 100).toFixed(0) + '%';
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Viewer Participation per Minute',
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

    chatters: string[] = [];
    viewerCounts: number[] = [];

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.setupLoop();
            },
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: ({ source }) => {
                if (this.chatters.indexOf(source) === -1) {
                    this.chatters.push(source);
                }
            },
        });

        this.eventBus.subscribe({
            eventName: VIEWER_COUNT,
            eventCallback: ({ viewers }) => {
                this.viewerCounts.push(viewers);
            },
        });
    }

    setupLoop(): void {
        const currentMinute = getCurrentMinute();

        if (this.data.length === 0) {
            for (let i = 0; i < 30; i++) {
                this.data.push({
                    x: currentMinute - (30 - i) * 60000,
                    y: NaN,
                });
            }
        }

        this.chart.update();

        const interval = setInterval(() => {
            const currentMinute = getCurrentMinute();

            const chatterCount = this.chatters.length;
            const avgViewers = this.viewerCounts.reduce((total, curr) => total + curr, 0) / this.viewerCounts.length;

            const participation = chatterCount / avgViewers;

            this.chatters = [];
            this.viewerCounts = [];

            this.data.push({
                x: currentMinute,
                y: participation,
            });

            if (this.data.length > 30) {
                this.data.shift();
            }

            this.chart.update();
        }, 60000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => clearInterval(interval),
        });
    }
}
