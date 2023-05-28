import { ParsedPrivMsgMessage } from "@types";

interface MessageProps {
    message: ParsedPrivMsgMessage;
}

export const Message = (props: MessageProps): JSX.Element => {
    const {
        message: {
            tags: { "display-name": displayName, color, id, "tmi-sent-ts": timestamp = new Date().getTime() },
            source,
            badges,
            contentHTML,
        },
    } = props;

    const messageId = id || `${source}-${timestamp}`;
    const userName = displayName || source;
    const userNameColor = color || "#9146ff";

    return (
        <div className="inline px-1 py-0.5 hover:bg-zinc-700 rounded-md m-0.5">
            <div className="inline align-text-bottom">
                {badges.map(({ url, title }) => (
                    <img key={`${messageId}-${title}`} src={url} title={title} className="inline w-4 h-4 mr-1" />
                ))}
            </div>
            <span className="mr-1">
                <span className="font-bold" style={{ color: userNameColor }}>
                    {userName}
                </span>
                <span className="ml-0.5">:</span>
            </span>
            {/**
             * dangerouslySetInnerHTML is used here to render the emotes as images.
             * it's probably possible to do this nicely with components, but the current
             * method of creating 1 string which contains the chat message including the
             * emotes as html img tags also seems pretty efficient.
             */}
            <span className="break-words" dangerouslySetInnerHTML={{ __html: contentHTML }}></span>
        </div>
    );
};
