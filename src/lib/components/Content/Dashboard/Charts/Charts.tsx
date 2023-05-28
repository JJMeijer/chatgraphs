import { UseDataStore } from "@types";
import "./chart-settings";

import { MessagesPerSeconds } from "./MessagesPerSeconds";
import { MessagesPerMinute } from "./MessagesPerMinute";
import { ViewersHistory } from "./ViewersHistory";
import { EmotesPerMessage } from "./EmotesPerMessage";
import { SubscriberPercentage } from "./SubscriberPercentage";
import { ViewerParticipation } from "./ViewerParticipation";
import { Subscriptions } from "./Subscriptions";
import { Moderation } from "./Moderation";

interface ChartsProps {
    useDataStore: UseDataStore;
}

export const Charts = (props: ChartsProps): JSX.Element => {
    return (
        <div className="border-t border-zinc-600/60 flex flex-row flex-wrap px-6 py-2 flex-grow min-h-0 overflow-y-scroll scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-primary-700/70">
            <MessagesPerSeconds {...props} />
            <MessagesPerMinute {...props} />
            <EmotesPerMessage {...props} />
            <ViewersHistory {...props} />
            <SubscriberPercentage {...props} />
            <ViewerParticipation {...props} />
            <Subscriptions {...props} />
            <Moderation {...props} />
        </div>
    );
};
