export const getSecondRoundedTo = (roundTo: number): number => {
    const now = new Date().getTime();
    return now - (now % (roundTo * 1000));
};
