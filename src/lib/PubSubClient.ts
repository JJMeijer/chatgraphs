import { ROOMSTATE, VIEW_COUNT } from "@constants";
import { RoomstateMessage, ViewCountMessage } from "@types";
import { EventBus } from "./EventBus";

export class PubSubClient {
    eventBus: EventBus;
    socket: WebSocket;

    pingInterval = 0;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        this.socket = new WebSocket("wss://pubsub-edge.twitch.tv");
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }

    private sendPingMessage = () => this.socket.send(JSON.stringify({ type: "PING" }));

    private onOpen(): void {
        this.sendPingMessage();
        this.pingInterval = setInterval(this.sendPingMessage, 30000);

        this.eventBus.on(ROOMSTATE, (data) => this.setRoomId(data));
    }

    private onMessage(event: MessageEvent<string>): void {
        const { data } = JSON.parse(event.data);

        if (!data) return;

        const { message } = data;
        if (typeof message === "string") {
            const viewCountData = JSON.parse(message) as ViewCountMessage;
            this.eventBus.emit(VIEW_COUNT, viewCountData);
        }
    }

    setRoomId(message: RoomstateMessage): void {
        const roomId = message.tags["room-id"];

        if (!roomId) {
            console.warn("Room ID is missing from ROOMSTATE message");
            return;
        }

        this.socket.send(
            JSON.stringify({
                type: "LISTEN",
                data: {
                    topics: [`video-playback-by-id.${roomId}`],
                },
            }),
        );
    }

    close(): void {
        clearInterval(this.pingInterval);
        this.socket.close();
    }
}
