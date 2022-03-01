import {createRegion} from '..';
import mockDate from './mockDate';

mockDate();

interface ParamsId { id: string }

describe('createRegion', () => {
    test('createRegion with undefined', () => {
        const region = createRegion();
        expect(region.getValue()).toBe(undefined);
        expect(region.getLoading()).toBe(true);
        expect(region.getError()).toBe(undefined);
    });

    test('createRegion with value', () => {
        const region = createRegion('Karen Martinez');
        expect(region.getValue()).toBe('Karen Martinez');
        expect(region.getLoading()).toBe(true);
        expect(region.getError()).toBe(undefined);

        region.set(v => `${v}+`);
        expect(region.getValue()).toBe('Karen Martinez+');
    });

    test('createRegion with truthy/falsy value', () => {
        const falsyRegion = createRegion(false);
        expect(falsyRegion.getValue()).toBe(false);
        expect(falsyRegion.getLoading()).toBe(true);

        falsyRegion.set(v => !v);
        expect(falsyRegion.getValue()).toBe(true);

        const truthyRegion = createRegion(true);
        expect(truthyRegion.getValue()).toBe(true);
        expect(truthyRegion.getLoading()).toBe(true);

        truthyRegion.set(v => !v);
        expect(truthyRegion.getValue()).toBe(false);
    });

    test('createRegion with function', () => {
        const func = () => 'Helen Davis';
        const region = createRegion(func);
        expect(region.getValue()).toBe(func);
    });

    test('setValue with value', () => {
        const region = createRegion();
        region.set('Angela Robinson');
        expect(region.getValue()).toBe('Angela Robinson');
    });

    test('setValue with function', () => {
        const region = createRegion();
        region.set(() => 'Joseph Anderson');
        expect(region.getValue()).toBe('Joseph Anderson');
    });

    test('setValue with function with prevState', () => {
        const region = createRegion();
        region.set('Jennifer Rodriguez');
        region.set((state: string) => `${state} & Joseph Anderson`);
        expect(region.getValue()).toBe('Jennifer Rodriguez & Joseph Anderson');
    });

    test('setValue with undefined', () => {
        const region = createRegion();
        region.set('Jennifer Rodriguez');
        region.set(undefined);
        expect(region.getValue()).toBe(undefined);
    });

    test('load', () => {
        const region = createRegion();
        const asyncFunction = () => Promise.resolve('Amy Hernandez');

        expect.assertions(1);
        return region.loadBy(asyncFunction)().then(() => {
            expect(region.getValue()).toBe('Amy Hernandez');
        });
    });

    test('load with reject', () => {
        const region = createRegion();
        const asyncFunction = () => Promise.reject('Barbara Garcia');

        expect.assertions(2);
        return region.loadBy(asyncFunction)().then(() => {
            expect(region.getValue()).toBe(undefined);
            expect(region.getError()).toStrictEqual(new Error('Barbara Garcia'));
        });
    });

    test('load with reject error', () => {
        const region = createRegion();
        const error = new Error('Kimberly Hall');
        const asyncFunction = () => Promise.reject(error);

        expect.assertions(2);
        return region.loadBy(asyncFunction)().then(() => {
            expect(region.getValue()).toBe(undefined);
            expect(region.getError()).toStrictEqual(error);
        });
    });

    test('load with params', () => {
        const region = createRegion();
        const asyncFunction = (state: string) => Promise.resolve(`${state} & Joseph Hall`);

        expect.assertions(1);
        return region.loadBy(asyncFunction)('Barbara Rodriguez').then(() => {
            expect(region.getValue()).toBe('Barbara Rodriguez & Joseph Hall');
        });
    });

    test('load with reducer', () => {
        const region = createRegion<string>();
        const asyncFunction = (state: string) => Promise.resolve(`${state} & Robert Thomas`);
        const reducer = (state = '', result = '') => `${state} | ${result}`;
        const loadUser1 = region.loadBy(asyncFunction, reducer);
        const loadUser2 = region.loadBy(asyncFunction, reducer);

        expect.assertions(2);
        return loadUser1('Michael Lee').then(() => {
            expect(region.getValue()).toBe(' | Michael Lee & Robert Thomas');
            return loadUser2('Richard Hall');
        }).then(() => {
            expect(region.getValue()).toBe(' | Michael Lee & Robert Thomas | Richard Hall & Robert Thomas');
        });
    });

    test('reject will not erase resolve', () => {
        const region = createRegion();
        const asyncFunction = () => Promise.resolve('Deborah Anderson');
        const asyncFunction2 = () => Promise.reject('Susan Gonzalez');

        expect.assertions(4);
        return region.loadBy(asyncFunction)().then(() => {
            expect(region.getValue()).toBe('Deborah Anderson');
            expect(region.getError()).toBe(undefined);
            return region.loadBy(asyncFunction2)();
        }).then(() => {
            expect(region.getValue()).toBe('Deborah Anderson');
            expect(region.getError()).toStrictEqual(new Error('Susan Gonzalez'));
        });
    });

    test('resolve will erase reject', () => {
        const region = createRegion();
        const asyncFunction = () => Promise.reject('Christopher Hall');
        const asyncFunction2 = () => Promise.resolve('Jason Lee');

        expect.assertions(4);
        return region.loadBy(asyncFunction)().then(() => {
            expect(region.getValue()).toBe(undefined);
            expect(region.getError()).toStrictEqual(new Error('Christopher Hall'));
            return region.loadBy(asyncFunction2)();
        }).then(() => {
            expect(region.getValue()).toBe('Jason Lee');
            expect(region.getError()).toBe(undefined);
        });
    });

    test('load with id', () => {
        const region = createRegion();
        const asyncFunction = ({id}: ParamsId) => Promise.resolve({id, name: 'Robert Davis'});

        expect.assertions(1);
        return region.loadBy(asyncFunction)({id: '620000198705195453'}).then(() => {
            expect(region.getValue()).toEqual({id: '620000198705195453', name: 'Robert Davis'});
        });
    });

    test('load with idFunc', () => {
        const region = createRegion();
        const asyncFunction = ({id}: ParamsId) => Promise.resolve({id, name: 'Scott Davis'});
        const loadUser = region.loadBy(asyncFunction);

        expect.assertions(1);
        return loadUser({id: '350000201202073963'}).then(() => {
            expect(region.getValue()).toEqual({id: '350000201202073963', name: 'Scott Davis'});
        });
    });

    test('load normalize', () => {
        const region = createRegion();
        const asyncFunction = ({id}: ParamsId) => Promise.resolve({id, name: 'Amy Davis'});
        const asyncFunction2 = ({id}: ParamsId) => Promise.resolve({id, name: 'Carol Jackson'});
        const loadUser = region.loadBy(asyncFunction);
        const loadUser2 = region.loadBy(asyncFunction2);

        expect.assertions(3);
        return loadUser({id: '650000200512087988'}).then(() => {
            expect(region.getValue()).toEqual({id: '650000200512087988', name: 'Amy Davis'});
            const promise = loadUser2({id: '330000197010067769'});
            // TODO feature request
            // if user wants it undefined, MappedRegion should be used
            // Or some flag may provided to clear result
            // Seems that it is not so good to provide it, I will decided it later
            expect(region.getValue()).toEqual({id: '650000200512087988', name: 'Amy Davis'});
            return promise;
        }).then(() => {
            expect(region.getValue()).toEqual({id: '330000197010067769', name: 'Carol Jackson'});
        });
    });

    test('load normalize compatible with set', () => {
        const region = createRegion();
        const asyncFunction = () => Promise.resolve('Steven Walker');
        const loadUser = region.loadBy(asyncFunction);

        expect.assertions(2);
        return loadUser().then(() => {
            expect(region.getValue()).toBe('Steven Walker');
            region.set('Patricia Thompson');
            expect(region.getValue()).toBe('Patricia Thompson');
        });
    });

    test('load accepts latest', () => {
        const region = createRegion();
        const asyncFunction1 = () => new Promise(resolve => setTimeout(() => resolve('Sharon Brown'), 40));
        const asyncFunction2 = () => new Promise(resolve => setTimeout(() => resolve('William Harris'), 20));
        const promise1 = region.loadBy(asyncFunction1)();
        const promise2 = region.loadBy(asyncFunction2)();

        expect.assertions(2);
        return Promise.all([promise1, promise2]).then(() => {
            expect(region.getLoading()).toBe(false);
            expect(region.getValue()).toBe('William Harris');
        });
    });
});
