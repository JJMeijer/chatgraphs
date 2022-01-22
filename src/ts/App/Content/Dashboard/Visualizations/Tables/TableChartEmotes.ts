import { ScatterDataPoint, ChartConfiguration, Chart } from 'chart.js';
import { CLOSE_APP, EMOTE_USED } from 'common/constants';

import { EventBus } from 'common/EventBus';
import { getSecondRoundedTo } from '../Charts/helpers';
import { BaseTableChart } from './BaseTableChart';

export class TableChartEmotes extends BaseTableChart {
    emote: string;

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
                    display: false,
                },
                y: {
                    display: false,
                },
            },
            plugins: {
                title: {
                    display: false,
                },
                legend: {
                    display: false,
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    emoteCount = 1;

    constructor(eventBus: EventBus, emote: string) {
        super(eventBus);

        this.emote = emote;

        this.setSubscribers();
        this.setupLoop();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: EMOTE_USED,
            eventCallback: ({ word }) => {
                if (word !== this.emote) {
                    return;
                }

                this.emoteCount++;
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

            this.data.push({
                x: currentSecond,
                y: this.emoteCount,
            });

            this.emoteCount = 0;

            if (this.data.length > 30) {
                this.data.shift();
            }

            this.chart.update();
        }, 10000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => clearInterval(interval),
        });
    }
}
