export const getCurrentMinute = (): number => {
    const now = new Date().getTime();
    return now - (now % 60000);
};

export const getCurrentSecond = (): number => {
    const now = new Date().getTime();
    return now - (now % 1000);
};

export const getSecondsToCurrentMinute = (): number => {
    const currentMinute = getCurrentMinute();
    const currentSecond = getCurrentSecond();

    return (currentSecond - currentMinute) / 1000;
};

export const getSecondRoundedTo = (num: number): number => {
    const now = new Date().getTime();
    return now - (now % (num * 1000));
};
