import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CHANNEL_SUBMIT, CLEARCHAT, CLOSE_APP, USERNOTICE } from 'common/constants';

import { EventBus } from 'common/EventBus';
import { getCurrentMinute } from './helpers';
import { BaseChart } from './BaseChart';

export class Notices extends BaseChart {
    subs: ScatterDataPoint[] = [];

    config: ChartConfiguration = {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Subs',
                    data: this.subs,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
                }
            },
        });

        this.eventBus.subscribe({
            eventName: CLEARCHAT,
            eventCallback: (data) => {
                console.log(data);
            },
        });
    }

    setupLoop(): void {
        const currentMinute = getCurrentMinute();

        for (let i = 0; i < 30; i++) {
            this.subs.push({
                x: currentMinute - (30 - i) * 60000,
                y: 0,
            });
        }

        this.chart.update();

        const interval = setInterval(() => {
            const newMinute = getCurrentMinute();
            const index = this.subs.findIndex((point) => point.x === newMinute);

            if (index === -1) {
                this.subs.push({
                    x: currentMinute,
                    y: this.newSubs,
                });
            } else {
                (this.subs[index] as ScatterDataPoint).y += this.newSubs;
            }

            this.newSubs = 0;
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
