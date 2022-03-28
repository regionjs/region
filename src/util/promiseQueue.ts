export const uniqLast = <T>(arr: T[], next: T) => {
    return [...arr.filter(item => item !== next), next];
};

export const isLatest = <T>(queue: T[], value: T) => {
    return queue[queue.length - 1] === value;
};
