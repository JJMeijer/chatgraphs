export const getCurrentMinute = (): number => {
    const now = new Date().getTime();
    return now - (now % 60000);
};

export const getSecondRoundedToFive = (): number => {
    const now = new Date().getTime();
    return now - (now % 5000);
};
