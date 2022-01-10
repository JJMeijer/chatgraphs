import { ChartConfiguration, Chart } from 'chart.js';
import { EMOTE_USED } from 'common/constants';
import { EmoteCounter } from 'common/types';

import { EventBus } from 'common/EventBus';
import { BaseChart } from './BaseChart';

export class TopEmotes extends BaseChart {
    images: string[] = [];

    config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                },
            },
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Emotes',
                    position: 'top',
                },
                legend: {
                    display: false,
                },
            },
        },
    };

    emoteList: EmoteCounter[] = [];

    chart = new Chart(this.canvas, this.config);

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: EMOTE_USED,
            eventCallback: (eventData) => {
                const { word, url } = eventData;

                const index = this.emoteList.findIndex(({ word: existingWord }) => existingWord === word);

                if (index === -1) {
                    this.emoteList.push({
                        word,
                        count: 1,
                        url,
                    });
                } else {
                    (this.emoteList[index] as EmoteCounter).count++;
                }

                this.emoteList.sort((a, b) => b.count - a.count);

                const topEmotes = this.emoteList.slice(0, 10);

                this.chart.data.labels = topEmotes.map((emote) => emote.word);
                this.images = topEmotes.map((emote) => emote.url);
                this.chart.data.datasets = [{ data: topEmotes.map((emote) => emote.count) }];

                this.chart.update();
            },
        });
    }
}
