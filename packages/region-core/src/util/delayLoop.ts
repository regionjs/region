export const delayLoop = async (loopCount = 1) => {
    for (let i = 0; i < loopCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 0));
    }
};
