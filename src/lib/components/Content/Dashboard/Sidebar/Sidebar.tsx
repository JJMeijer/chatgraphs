import { CommonDashboardProps } from "@types";
import { Chat } from "./Chat";
import { Embed } from "./Embed";

export const Sidebar = (props: CommonDashboardProps): JSX.Element => {
    return (
        <div className="flex flex-col h-full w-1/4 min-w-[25%] border-r border-primary-800">
            <Embed {...props} />
            <Chat {...props} />
        </div>
    );
};
