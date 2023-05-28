import { UseDataStore } from "./stores";

export interface DataPoint {
    x: number;
    y: number;
}

export interface ChartProps {
    useDataStore: UseDataStore;
}
