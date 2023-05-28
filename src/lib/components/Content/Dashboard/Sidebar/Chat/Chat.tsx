import { CommonDashboardProps } from "@types";
import { useRef, useState } from "react";
import { Message } from "./Message";

export const Chat = (props: CommonDashboardProps): JSX.Element => {
    const {
        instance: { useDataStore },
    } = props;
    const chatMessages = useDataStore((state) => state.chatMessages);

    const anchorRef = useRef<HTMLSpanElement>(null);
    const [anchorVisible, setAnchorVisible] = useState(true);

    const isAnchorVisible = (): boolean => {
        if (!anchorRef.current) return false;

        const { top, bottom } = anchorRef.current.getBoundingClientRect();

        return top >= 0 && bottom <= window.innerHeight;
    };

    const handleScroll = (): void => {
        const visible = isAnchorVisible();
        if (visible !== anchorVisible) setAnchorVisible(visible);
    };

    const onScrollBackClick = (): void => {
        if (!anchorRef.current) return;
        anchorRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="relative w-full h-3/4">
            <div
                onScroll={handleScroll}
                className="flex flex-col-reverse w-full h-full py-1 pl-1 pr-3 overflow-y-scroll scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-primary-700/70"
            >
                <span ref={anchorRef}></span>
                {chatMessages.slice(0, 500).map((message) => {
                    const {
                        tags: { id },
                    } = message;

                    if (!id) return null;

                    return <Message key={id} message={message} />;
                })}
            </div>
            <div
                className={`absolute inset-x-0 items-center justify-center w-full bottom-6 ${
                    anchorVisible ? "hidden" : "flex"
                }`}
            >
                <div
                    onClick={onScrollBackClick}
                    className="w-3/4 p-2 text-lg font-bold text-center border-2 rounded-md cursor-pointer border-primary-700/70 bg-zinc-600 hover:bg-zinc-700"
                >
                    Scroll back to live
                </div>
            </div>
        </div>
    );
};
