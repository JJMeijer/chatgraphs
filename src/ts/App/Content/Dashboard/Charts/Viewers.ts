import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { VIEWER_COUNT, CHANNEL_SUBMIT } from 'common/constants';
import { EventBus } from 'common/EventBus';
import { BaseChart } from './BaseChart';
import { getCurrentSecond, getCurrentMinute } from './helpers';

export class Viewers extends BaseChart {
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
                        unit: 'minute',
                        tooltipFormat: 'H:mm:ss',
                        displayFormats: {
                            minute: 'H:mm',
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
                    text: 'Viewers (Last 30 Minutes)',
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
                            y: NaN,
                        });
                    }
                }

                this.chart.update();
            },
        });

        this.eventBus.subscribe({
            eventName: VIEWER_COUNT,
            eventCallback: ({ viewers }) => {
                const currentSecond = getCurrentSecond();

                this.data.push({
                    x: currentSecond,
                    y: viewers,
                });

                while (this.data[0] && this.data[0].x < currentSecond - 30 * 60000) {
                    this.data.shift();
                }

                this.chart.update();
            },
        });
    }
}
