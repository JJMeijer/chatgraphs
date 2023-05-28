import { MouseEvent } from "react";

import { Instance } from "@types";
import { useInstanceStore } from "@stores";
import { IconClose } from "../icons";

interface TabProps {
    instance: Instance;
}

export const Tab = (props: TabProps): JSX.Element => {
    const {
        instance: { id, channel },
    } = props;

    const removeInstance = useInstanceStore((state) => state.removeInstance);
    const setActiveInstanceId = useInstanceStore((state) => state.setActiveInstanceId);
    const activeInstanceId = useInstanceStore((state) => state.activeInstanceId);

    const onCloseClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        removeInstance(id);
    };

    const onTabClick = () => {
        setActiveInstanceId(id);
    };

    return (
        <div
            onClick={onTabClick}
            className={`relative flex flex-row items-center min-w-[9rem] justify-center h-full px-1 border-l border-r cursor-pointer group border-primary-300/40 hover:bg-primary-800 ${
                activeInstanceId === id ? "bg-primary-800/40" : ""
            }`}
        >
            <span className="pl-4 pr-6">{channel || "New Tab"}</span>
            <div className="absolute h-full right-1 top-0.5">
                <IconClose
                    onClick={onCloseClick}
                    className="w-4 h-4 my-1 cursor-pointer text-zinc-300/0 group-hover:text-zinc-300/50 hover:!text-zinc-200/90"
                />
            </div>
        </div>
    );
};
