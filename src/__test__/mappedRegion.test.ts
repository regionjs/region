import {createMappedRegion} from '..';

describe('createMappedRegion', () => {
    test('createMappedRegion with undefined', () => {
        const region = createMappedRegion();
        expect(region.getValue('key')).toBe(undefined);
        expect(region.getLoading('key')).toBe(true);
        expect(region.getError('key')).toBe(undefined);
        expect(region.getPromise('key')).toBe(undefined);
        region.set('key', 'Philip Fry');
        expect(region.getValue('key')).toBe('Philip Fry');
        region.set('key', undefined);
        expect(region.getValue('key')).toBe(undefined);
    });

    test('createMappedRegion with value', () => {
        const region = createMappedRegion('Michael Jackson');
        expect(region.getValue('key')).toBe('Michael Jackson');
        expect(region.getLoading('key')).toBe(true);
        expect(region.getError('key')).toBe(undefined);

        region.set('key', 'Nirvana Band');
        expect(region.getValue('other')).toBe('Michael Jackson');
        expect(region.getValue('key')).toBe('Nirvana Band');
        region.set('key', v => `${v}+`);
        expect(region.getValue('key')).toBe('Nirvana Band+');
        region.reset('key');
        expect(region.getValue('key')).toBe('Michael Jackson');
        region.set('key', 'Barack Obama');
        expect(region.getValue('key')).toBe('Barack Obama');
        region.resetAll();
        expect(region.getValue('key')).toBe('Michael Jackson');
        // @ts-expect-error
        region.set('key', undefined);
        expect(region.getValue('key')).toBe('Michael Jackson');

        // unexpected operation
        region.set('key', 'Barack Obama');
        // @ts-expect-error
        region.reset();
        expect(region.getValue('key')).toBe('Michael Jackson');
    });

    // TODO reopen after https://github.com/ecomfe/reskript/issues/271
    // test('createMappedRegion with dimension key', () => {
    //     const region = createMappedRegion();
    //     region.set({x: 0, y: 0}, 0);
    //     region.set({x: 1, y: 1}, 2);
    //     expect(region.getValue({x: 0, y: 0})).toBe(0);
    //     expect(region.getValue({x: 1, y: 1})).toBe(2);
    //     region.set({x: 0, y: 0}, 1);
    //     expect(region.getValue({x: 0, y: 0})).toBe(1);
    //     region.reset({x: 0, y: 0});
    //     expect(region.getValue({x: 0, y: 0})).toBe(undefined);
    // });

    test('createMappedRegion loadBy key function', async () => {
        const region = createMappedRegion<string, string>();
        const asyncFunction = async ({id}: {id: string}) => `${id}+`;
        const loadFunction = region.loadBy(
            params => params.id,
            asyncFunction
        );
        await loadFunction({id: '1'});
        expect(region.getValue('1')).toBe('1+');
    });
});
