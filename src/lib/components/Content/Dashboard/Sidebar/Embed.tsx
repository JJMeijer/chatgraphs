import { CommonDashboardProps } from "@types";
import { useEffect, useState } from "react";

export const Embed = (props: CommonDashboardProps): JSX.Element => {
    const { channel } = props.instance;

    const [src, setSrc] = useState("");

    useEffect(() => {
        if (channel) {
            setSrc(
                `https://player.twitch.tv/?channel=${channel}&parent=localhost&parent=127.0.0.1&parent=chatgraphs.com&parent=www.chatgraphs.com`,
            );
        } else {
            setSrc("");
        }
    }, [channel]);

    return (
        <div className="h-1/4 w-full border-b border-primary-800">
            <iframe title={`embed-player-${channel}`} src={src} height="100%" width="100%" allowFullScreen={true} />
        </div>
    );
};

// import { BaseElement } from "@BaseElement";
// import { CHANNEL_SUBMIT } from "@constants";
// import { EventBus } from "@EventBus";

// const html = /*html*/ `
//     <div class="h-1/3 md:h-1/4 border-b border-gray-700">
//         <iframe
//             src=""
//             height="100%"
//             width="100%"
//             allowfullscreen="true">
//         </iframe>
//     </div>
// `;

// export class Embed extends BaseElement<HTMLDivElement> {
//     iframe: HTMLIFrameElement;

//     channel = "";

//     constructor(eventBus: EventBus, parent: HTMLDivElement) {
//         super(eventBus, html, parent);

//         this.iframe = this.element.querySelector("iframe") as HTMLIFrameElement;

//         this.setSubscribers();
//     }

//     override setSubscribers(): void {
//         this.eventBus.subscribe({
//             eventName: CHANNEL_SUBMIT,
//             eventCallback: ({ channel }) => {
//                 this.iframe.src = `https://player.twitch.tv/?channel=${channel}&parent=localhost&parent=127.0.0.1&parent=chatgraphs.com&parent=www.chatgraphs.com`;
//             },
//         });
//     }
// }
