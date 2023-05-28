import { DataPoint } from "@types";

export const initMinutesData = (len: number, gap: number): DataPoint[] => {
    const currentMinute = new Date().setSeconds(0, 0);

    return Array.from({ length: len }, (_, i) => {
        return { x: new Date(currentMinute - (len - i) * (gap * 60000)).getTime(), y: null as unknown as number };
    });
};
