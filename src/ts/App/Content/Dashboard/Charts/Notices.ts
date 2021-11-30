import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CHANNEL_SUBMIT, CLEARCHAT, CLEARMSG, CLOSE_APP, USERNOTICE } from 'common/constants';

import { EventBus } from 'common/EventBus';
import { getCurrentMinute } from './helpers';
import { BaseChart } from './BaseChart';

export class Notices extends BaseChart {
    subs: ScatterDataPoint[] = [];
    giftedSubs: ScatterDataPoint[] = [];
    timeouts: ScatterDataPoint[] = [];
    bans: ScatterDataPoint[] = [];
    removed: ScatterDataPoint[] = [];

    config: ChartConfiguration = {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Subs',
                    data: this.subs,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                },
                {
                    label: 'Gifted',
                    data: this.giftedSubs,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                },
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
                    label: 'Removed',
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
                    text: 'Notices',
                    position: 'top',
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newSubs = 0;
    newGiftedSubs = 0;
    newTimeouts = 0;
    newBans = 0;
    newRemoved = 0;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setSubscribers();
    }

    setSubscribers() {
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
            this.subs.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });

            this.giftedSubs.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });

            this.timeouts.push({
                x: firstMinute - (30 - i) * 60000,
                y: 0,
            });

            this.bans.push({
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

                this.timeouts.push({
                    x: newMinute,
                    y: this.newTimeouts,
                });

                this.bans.push({
                    x: newMinute,
                    y: this.newBans,
                });
            } else {
                (this.subs[index] as ScatterDataPoint).y += this.newSubs;
                (this.giftedSubs[index] as ScatterDataPoint).y += this.newGiftedSubs;
                (this.timeouts[index] as ScatterDataPoint).y += this.newTimeouts;
                (this.bans[index] as ScatterDataPoint).y += this.newBans;
            }

            this.newSubs = 0;
            this.newGiftedSubs = 0;
            this.newTimeouts = 0;
            this.newBans = 0;

            if (this.subs.length > 30) {
                this.subs.shift();
                this.giftedSubs.shift();
                this.timeouts.shift();
                this.bans.shift();
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
