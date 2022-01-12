import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';

import { CHANNEL_SUBMIT, PRIVMSG } from 'common/constants';
import { EventBus } from 'common/EventBus';

import { BaseChart } from './BaseChart';
import { getCurrentMinute } from './helpers';

export class MessagesPerMinute extends BaseChart {
    data: ScatterDataPoint[] = [];
    config: ChartConfiguration = {
        type: 'bar',
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
                        unit: 'minute',
                        tooltipFormat: 'H:mm',
                        displayFormats: {
                            minute: 'H:mm',
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Messages per Minute (Last 30 Minutes)',
                    position: 'top',
                },
                legend: {
                    display: false,
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                const currentMinute = getCurrentMinute();

                if (this.data.length === 0) {
                    for (let i = 0; i < 30; i++) {
                        this.data.push({
                            x: currentMinute - (30 - i) * 60000,
                            y: 0,
                        });
                    }
                }

                this.chart.update();
            },
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: () => {
                const currentMinute = getCurrentMinute();
                const index = this.data.findIndex((point) => point.x === currentMinute);

                if (index === -1) {
                    this.data.push({
                        x: currentMinute,
                        y: 1,
                    });
                } else {
                    (this.data[index] as ScatterDataPoint).y += 1;
                }

                if (this.data.length > 30) {
                    this.data.shift();
                }

                this.chart.update();
            },
        });
    }
}
