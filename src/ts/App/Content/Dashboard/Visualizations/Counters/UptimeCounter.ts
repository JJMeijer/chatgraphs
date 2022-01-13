import { BaseCounter } from './BaseCounter';
import { EventBus } from 'common/EventBus';
import { CHANNEL_SUBMIT, CLOSE_APP } from 'common/constants';

export class UptimeCounter extends BaseCounter {
    constructor(eventBus: EventBus) {
        super(eventBus);

        this.setTitle('Dashboard Uptime');
        this.setContent('00:00:00');
    }

    override setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: () => {
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                const interval = setInterval(() => {
                    seconds++;

                    if (seconds === 60) {
                        minutes++;
                        seconds = 0;
                    }

                    if (minutes === 60) {
                        hours++;
                        minutes = 0;
                    }

                    const prependZero = (num: number) => (num < 10 ? `0${num}` : '' + num);

                    this.setContent(`${prependZero(hours)}:${prependZero(minutes)}:${prependZero(seconds)}`);
                }, 1000);

                this.eventBus.subscribe({
                    eventName: CLOSE_APP,
                    eventCallback: () => {
                        clearInterval(interval);
                    },
                });
            },
        });
    }
}
