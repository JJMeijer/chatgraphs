import { ReactNode } from "react";

interface ChartWrapperProps {
    children: ReactNode;
}
export const ChartWrapper = (props: ChartWrapperProps): JSX.Element => {
    const { children } = props;

    return <div className="flex flex-col items-center px-4 w-1/2 h-1/2 border-b pb-2 border-neutral-600/30">{children}</div>;
};
