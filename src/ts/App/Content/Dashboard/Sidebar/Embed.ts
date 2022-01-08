import { CHANNEL_SUBMIT } from 'common/constants';
import { createElementFromHtml } from 'common/element';
import { EventBus } from 'common/EventBus';

const html = /*html*/ `
    <div class="h-1/4 border-b border-gray-700">
    <iframe
        src=""
        height="100%"
        width="100%"
        allowfullscreen="true">
    </iframe>
    </div>
`;

export class Embed {
    eventBus: EventBus;
    element: HTMLDivElement;
    iframe: HTMLIFrameElement;

    channel = '';

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.element = createElementFromHtml<HTMLDivElement>(html);
        this.iframe = this.element.querySelector('iframe') as HTMLIFrameElement;

        this.setSubscribers();
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: ({ channel }) => {
                this.iframe.src = `https://player.twitch.tv/?channel=${channel}&parent=localhost`;
            },
        });
    }
}
