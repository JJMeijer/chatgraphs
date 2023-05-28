import { MouseEvent } from "react";
import { Instance } from "./stores";

export interface IconProps {
    className: string;
    title?: string;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export interface CommonDashboardProps {
    instance: Instance;
}
