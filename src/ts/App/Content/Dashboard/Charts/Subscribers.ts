import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CHANNEL_SUBMIT, CLOSE_APP, USERNOTICE } from 'common/constants';

import { EventBus } from 'common/EventBus';
import { getCurrentMinute } from './helpers';
import { BaseChart } from './BaseChart';

export class Subscribers extends BaseChart {
    subs: ScatterDataPoint[] = [];
    giftedSubs: ScatterDataPoint[] = [];

    config: ChartConfiguration = {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Subs',
                    data: this.subs,
                    backgroundColor: 'rgba(82, 38, 166, 0.8)',
                },
                {
                    label: 'Gifted',
                    data: this.giftedSubs,
                    backgroundColor: 'rgba(29, 138, 34, 0.8)',
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
                    text: 'Subscribers (Last 30 Minutes)',
                    position: 'top',
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newSubs = 0;
    newGiftedSubs = 0;

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
            eventName: USERNOTICE,
            eventCallback: (userNoticeMessage) => {
                const {
                    tags: { 'msg-id': msgId = '' },
                } = userNoticeMessage;

                if (msgId.match(/^(sub|resub)$/)) {
                    this.newSubs++;
                    return;
                }

                if (msgId.match(/^(subgift|submysterygift)$/)) {
                    this.newGiftedSubs++;
                    return;
                }

                console.log(userNoticeMessage);
            },
        });
    }

    setupLoop(): void {
        const firstMinute = getCurrentMinute();

        for (let i = 0; i < 30; i++) {
            this.subs.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });

            this.giftedSubs.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });
        }

        this.chart.update();

        const interval = setInterval(() => {
            const newMinute = getCurrentMinute();
            const index = this.subs.findIndex((point) => point.x === newMinute);

            if (index === -1) {
                this.subs.push({
                    x: newMinute,
                    y: this.newSubs,
                });

                this.giftedSubs.push({
                    x: newMinute,
                    y: this.newGiftedSubs,
                });
            } else {
                (this.subs[index] as ScatterDataPoint).y += this.newSubs;
                (this.giftedSubs[index] as ScatterDataPoint).y += this.newGiftedSubs;
            }

            this.newSubs = 0;
            this.newGiftedSubs = 0;

            if (this.subs.length > 30) {
                this.subs.shift();
                this.giftedSubs.shift();
            }

            this.chart.update();
        }, 1000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(interval);
            },
        });
    }
}
