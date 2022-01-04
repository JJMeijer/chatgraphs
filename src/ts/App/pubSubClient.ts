import { CLOSE_APP, ROOMSTATE, VIEWER_COUNT } from 'common/constants';
import { EventBus } from './EventBus';

export class PubSubClient {
    eventBus: EventBus;
    socket: WebSocket;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.socket = new WebSocket('wss://pubsub-edge.twitch.tv');

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }

    onOpen(): void {
        const sendPingMessage = () => this.socket.send('{"type": "PING"}');

        sendPingMessage();
        const pingInterval = setInterval(sendPingMessage, 240000); // Send Ping every 4 minutes

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                clearInterval(pingInterval);
            },
        });

        this.eventBus.subscribe({
            eventName: ROOMSTATE,
            eventCallback: (parsedMessage) => {
                const {
                    tags: { 'room-id': roomId },
                } = parsedMessage;

                if (roomId === undefined) {
                    throw new Error('Room id is undefined');
                }

                this.socket.send(
                    JSON.stringify({
                        type: 'LISTEN',
                        nonce: (Math.random() + 1).toString(36).substring(2),
                        data: {
                            topics: [`video-playback-by-id.${roomId}`],
                        },
                    }),
                );
            },
        });

        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                this.socket.close();
            },
        });
    }

    onMessage(event: MessageEvent<string>): void {
        const message = event.data.trim();

        if (message.match(/"type":"MESSAGE"/) && message.match(/\\"type\\":\\"viewcount\\"/)) {
            const viewersMatch = message.match(/"viewers\\":(\d+)/);

            if (viewersMatch && viewersMatch[1]) {
                this.eventBus.publish({
                    eventName: VIEWER_COUNT,
                    eventData: {
                        viewers: parseInt(viewersMatch[1]),
                    },
                });
            }
        }
    }
}
