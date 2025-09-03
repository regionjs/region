import {describe, test, expect} from 'vitest';
import {deprecate} from '../deprecate.js';

describe('deprecate', () => {
    test('deprecate', () => {
        let count = 0;
        console.warn = () => {
            count = count + 1;
        };
        deprecate('some');
        expect(count).toBe(1);
    });
});
