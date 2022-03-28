import {delayLoop} from '../delayLoop';

describe('delayLoop', () => {
    it('should delay after a loop', async () => {
        const result: number[] = [];
        await Promise.all([
            (async () => {
                await delayLoop(2);
                result.push(1);
            })(),
            (async () => {
                await delayLoop(1);
                result.push(2);
            })(),
            (async () => {
                result.push(3);
            })(),
        ]);
        expect(result).toEqual([3, 2, 1]);
    });
});
