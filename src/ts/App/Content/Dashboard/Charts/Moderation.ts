import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CHANNEL_SUBMIT, CLEARCHAT, CLEARMSG, CLOSE_APP } from 'common/constants';

import { EventBus } from 'common/EventBus';
import { getCurrentMinute } from './helpers';
import { BaseChart } from './BaseChart';

export class Moderation extends BaseChart {
    timeouts: ScatterDataPoint[] = [];
    bans: ScatterDataPoint[] = [];
    removed: ScatterDataPoint[] = [];

    config: ChartConfiguration = {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Timeouts',
                    data: this.timeouts,
                    backgroundColor: 'rgba(255, 206, 86, 0.8)',
                },
                {
                    label: 'Bans',
                    data: this.bans,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                },
                {
                    label: 'MSG Removed',
                    data: this.removed,
                    backgroundColor: 'rgba(255, 159, 64, 0.8)',
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
                        stepSize: 1,
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Moderation (Last 30 Minutes)',
                    position: 'top',
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newTimeouts = 0;
    newBans = 0;
    newRemoved = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    override setSubscribers() {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                this.setupLoop();
            },
        });

        this.eventBus.subscribe({
            eventName: CLEARCHAT,
            eventCallback: (data) => {
                const {
                    tags: { 'ban-duration': banDuration },
                } = data;

                if (banDuration) {
                    this.newTimeouts++;
                    return;
                }

                this.newBans++;
            },
        });

        this.eventBus.subscribe({
            eventName: CLEARMSG,
            eventCallback: () => {
                this.newRemoved++;
            },
        });
    }

    setupLoop(): void {
        const firstMinute = getCurrentMinute();

        for (let i = 0; i < 30; i++) {
            this.timeouts.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });

            this.bans.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });

            this.removed.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });
        }

        this.chart.update();

        const interval = setInterval(() => {
            const newMinute = getCurrentMinute();
            const index = this.bans.findIndex((point) => point.x === newMinute);

            if (index === -1) {
                this.timeouts.push({
                    x: newMinute,
                    y: this.newTimeouts,
                });

                this.bans.push({
                    x: newMinute,
                    y: this.newBans,
                });

                this.removed.push({
                    x: newMinute,
                    y: this.newRemoved,
                });
            } else {
                (this.timeouts[index] as ScatterDataPoint).y += this.newTimeouts;
                (this.bans[index] as ScatterDataPoint).y += this.newBans;
                (this.removed[index] as ScatterDataPoint).y += this.newRemoved;
            }

            this.newTimeouts = 0;
            this.newBans = 0;
            this.newRemoved = 0;

            if (this.bans.length > 30) {
                this.timeouts.shift();
                this.bans.shift();
                this.removed.shift();
            }

            this.chart.update();
        }, 5000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(interval);
            },
        });
    }
}
