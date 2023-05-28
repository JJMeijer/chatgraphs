import { DataPoint } from "@types";
import { getSecondRoundedTo } from "./get-second-rounded-to";

/**
 * Return an array with a record for the latest 300 seconds.
 */
export const initSecondsData = (len: number, gap: number): DataPoint[] => {
    // Round time to x seconds
    const base = getSecondRoundedTo(gap);

    return Array.from({ length: len }, (_, i) => {
        /**
         * chart.js expects y to be number, however we want to use null to make use of the spanGaps option
         * which will not draw a line when the point is null.
         */
        return { x: new Date(base - (len - i) * (gap * 1000)).getTime(), y: null as unknown as number };
    });
};
