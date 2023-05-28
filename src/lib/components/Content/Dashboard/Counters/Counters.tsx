import { UseDataStore } from "@types";
import { Counter } from "./Counter";

interface CountersProps {
    useDataStore: UseDataStore;
}

export const Counters = (props: CountersProps): JSX.Element => {
    const { useDataStore } = props;

    const totalMessages = useDataStore((state) => state.totalMessages);
    const viewers = useDataStore((state) => state.viewers);
    const uptime = useDataStore((state) => state.uptime);
    const chatterCount = useDataStore((state) => state.chatters).length;
    const totalEmotes = useDataStore((state) => state.totalEmotes);

    return (
        <div className="flex flex-row flex-wrap justify-evenly w-full p-2">
            <Counter title="Dashboard Uptime:" value={uptime} />
            <Counter title="Viewers:" value={viewers} />
            <Counter title="Total Messages:" value={totalMessages} />
            <Counter title="Distinct Chatters:" value={chatterCount} />
            <Counter title="Emotes:" value={totalEmotes} />
        </div>
    );
};
