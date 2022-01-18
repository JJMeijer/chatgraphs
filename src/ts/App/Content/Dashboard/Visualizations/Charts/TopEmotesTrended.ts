import { Chart, ChartConfiguration, ScatterDataPoint } from 'chart.js';
import { CLOSE_APP, CHANNEL_SUBMIT, EMOTE_USED } from 'common/constants';
import { EventBus } from 'common/EventBus';
import {
    EmoteTrendedCounter,
    EmoteTrendedCounterDictionary,
    EmoteTrendedInfo,
    EmoteTrendedInfoDictionary,
} from 'common/types';
import { BaseChart } from './BaseChart';
import { getSecondRoundedTo } from './helpers';

export class TopEmotesTrended extends BaseChart {
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
                    text: 'Top Emotes (Last 5 Minutes)',
                    position: 'top',
                },
                legend: {
                    display: false,
                },
            },
        },
    };

    chart = new Chart(this.canvas, this.config);

    newEmotes: EmoteTrendedCounterDictionary = {};
    topEmotes: EmoteTrendedInfoDictionary = {};

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
            eventName: EMOTE_USED,
            eventCallback: (eventData) => {
                const { word, url } = eventData;

                const existingEmote = this.newEmotes[word];

                if (existingEmote) {
                    existingEmote.count += 1;
                }

                this.newEmotes[word] = {
                    url,
                    count: 1,
                };
            },
        });
    }

    setupLoop() {
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

        const loop = setInterval(() => {
            const currentSecond = getSecondRoundedTo(10);

            Object.keys(this.topEmotes).forEach((emote) => {
                const emoteInfo = this.topEmotes[emote] as EmoteTrendedInfo;
                const newEmoteInfo = this.newEmotes[emote];

                if (newEmoteInfo) {
                    emoteInfo.data.push({
                        x: currentSecond,
                        y: newEmoteInfo.count,
                    });

                    delete this.newEmotes[emote];
                } else {
                    emoteInfo.data.push({
                        x: currentSecond,
                        y: 0,
                    });
                }

                if (emoteInfo.data.length > 30) {
                    emoteInfo.data.shift();
                }
            });

            Object.keys(this.newEmotes).forEach((newEmote) => {
                const { url, count } = this.newEmotes[newEmote] as EmoteTrendedCounter;

                const data: ScatterDataPoint[] = [];

                for (let i = 0; i < 29; i++) {
                    data.push({
                        x: currentSecond - (30 - i) * 10000,
                        y: NaN,
                    });
                }

                data.push({
                    x: currentSecond,
                    y: count,
                });

                this.topEmotes[newEmote] = {
                    url,
                    data,
                };

                delete this.newEmotes[newEmote];
            });
            this.chart.update();
            console.log(this.topEmotes);
        }, 10000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(loop);
            },
        });
    }
}
