/**
 * @param uptime Given uptime in format "00:00:00"
 * @returns "00:00:01"
 */
export const uptimeTick = (uptime: string) => {
    let [hours = 0, minutes = 0, seconds = 0] = uptime.split(":").map((x) => parseInt(x));

    seconds++;

    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }

    if (minutes === 60) {
        minutes = 0;
        hours++;
    }

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
};
