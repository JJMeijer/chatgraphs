import { useInstanceStore } from "@stores";
import { ChannelSelect } from "./ChannelSelect";
import { Dashboard } from "./Dashboard";

export const Content = (): JSX.Element => {
    const instances = useInstanceStore((state) => state.instances);
    const activeInstanceId = useInstanceStore((state) => state.activeInstanceId);

    const activeInstance = instances.find((instance) => instance.id === activeInstanceId);

    if (!activeInstance) throw new Error("No active instance found");

    return (
        <div className="relative flex flex-grow min-h-0 max-h-[95vh]">
            {activeInstance.channel === "" ? (
                <ChannelSelect instance={activeInstance} />
            ) : (
                <Dashboard instance={activeInstance} />
            )}
        </div>
    );
};
