import { EventBus } from 'common/EventBus';
import { WordCloudData } from 'common/types';
import { BaseChart } from './BaseChart';

import Wordcloud from 'wordcloud';
import { CHANNEL_SUBMIT, CLOSE_APP, PRIVMSG } from 'common/constants';
import { EmoteFactory } from '../../../Factories/EmoteFactory';

export class Vibe extends BaseChart {
    data: WordCloudData[] = [];
    emoteFactory: EmoteFactory;

    constructor(eventBus: EventBus) {
        super(eventBus);
        this.emoteFactory = new EmoteFactory(this.eventBus);

        this.setSubscribers();
        this.canvas.setAttribute('height', '350px');
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => this.setupLoop(),
        });

        this.eventBus.subscribe({
            eventName: PRIVMSG,
            eventCallback: ({ content, tags: { emotes } }) => {
                const emotifiedContent = this.emoteFactory.emotify(content, emotes);

                const words = emotifiedContent.split(/[ ](?![^<]*>)/);

                words.forEach((word) => {
                    const existingIndex = this.data.findIndex((x) => x[0] === word);
                    if (existingIndex === -1) {
                        this.data.push([word, 1]);
                        return;
                    }

                    (this.data[existingIndex] as WordCloudData)[1]++;
                });
            },
        });
    }

    setupLoop(): void {
        const interval = setInterval(() => {
            const topWords = this.data
                .sort((a, b) => {
                    if (a[1] < b[1]) {
                        return 1;
                    }

                    if (a[1] > b[1]) {
                        return -1;
                    }

                    return 0;
                })
                .slice(0, 50);

            Wordcloud(this.canvas, {
                list: topWords,
                backgroundColor: '#1f2937',
                weightFactor: 3,
            });

            this.data = [];
        }, 10000);

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => clearInterval(interval),
        });
    }
}
