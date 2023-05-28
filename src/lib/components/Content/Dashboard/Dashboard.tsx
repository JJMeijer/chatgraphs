import { CommonDashboardProps } from "@types";
import { Charts } from "./Charts";
import { Counters } from "./Counters";
import { Sidebar } from "./Sidebar";

export const Dashboard = (props: CommonDashboardProps): JSX.Element => {
    const {
        instance: { useDataStore },
    } = props;

    return (
        <div className="flex flex-row h-full w-full">
            <Sidebar {...props} />
            <div className="flex flex-col flex-grow min-w-0">
                <Counters useDataStore={useDataStore} />
                <Charts useDataStore={useDataStore} />
            </div>
        </div>
    );
};
