import {delay} from '../delay';

describe('delay', () => {
    it('should delay execution by the given amount of time', async () => {
        const start = Date.now();
        await delay(50);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(50);
    });
});
