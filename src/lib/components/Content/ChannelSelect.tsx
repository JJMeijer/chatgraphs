import { useEffect, useState } from "react";

import { IconArrowRight } from "@components/icons";
import { Instance } from "@types";
import { useInstanceStore } from "@stores";

interface ChannelSelectProps {
    instance: Instance;
}

export const ChannelSelect = (props: ChannelSelectProps): JSX.Element => {
    const { instance } = props;

    const setInstanceChannel = useInstanceStore((state) => state.setInstanceChannel);

    const [channel, setChannel] = useState<string>("");
    const [channelValuesCache, setChannelValuesCache] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState<string>("none");
    const [showError, setShowError] = useState<boolean>(false);

    const onChannelSubmit = () => {
        if (!channel) {
            setErrorMessage("Please enter a channel name");
            setShowError(true);
            return;
        }
        setInstanceChannel(instance.id, channel);
    };

    const onInputKeyboardEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onChannelSubmit();
        }
    };

    const onInputBlur = () => {
        setShowError(false);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannel(event.target.value);
        setShowError(false);

        setChannelValuesCache((prev) => {
            return {
                ...prev,
                [instance.id]: event.target.value,
            };
        });
    };

    useEffect(() => {
        const previousValue = channelValuesCache[instance.id];
        setChannel(previousValue || "");
        setShowError(false);
    }, [instance]);

    return (
        <div className="absolute inset-x-0 flex flex-col items-center justify-center h-full gap-8 pb-32">
            <p className="text-2xl text-center select-none">Graphs about Twitch Chat. Enter a channel name:</p>
            <div className="flex flex-col">
                <p
                    className={`py-1 text-red-500 transition ease-in-out duration-200 ${
                        showError ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {errorMessage}
                </p>
                <div className="relative">
                    <input
                        className="h-12 p-2 text-2xl border-2 rounded-md outline-none border-primary-800/50 w-96 bg-zinc-800 placeholder-zinc-400/80 caret-zinc-400/80 text-zinc-300 focus:border-primary-800/80"
                        type="text"
                        value={channel}
                        onChange={onInputChange}
                        onBlur={onInputBlur}
                        onKeyDown={onInputKeyboardEvent}
                        autoComplete="off"
                        placeholder="Channel..."
                        spellCheck="false"
                        autoFocus={true}
                    />
                    <div className="absolute inset-y-0 flex items-center h-full right-3">
                        <IconArrowRight
                            onClick={onChannelSubmit}
                            className="cursor-pointer w-7 h-7 text-zinc-300/50 hover:text-zinc-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
