import {renderHook} from '@testing-library/react-hooks';
import {createRegion} from '..';

interface ParamsId { id: string }

describe('createRegion', () => {
    test('createRegion with undefined', () => {
        const region = createRegion();
        expect(region.getValue()).toBe(undefined);
        expect(region.getLoading()).toBe(true);
        expect(region.getError()).toBe(undefined);
        expect(region.getPromise()).toBe(undefined);
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
});

describe('set', () => {
    test('setValue', () => {
        const region = createRegion();
        region.set('Karen Martinez');
        expect(region.getValue()).toBe('Karen Martinez');
        expect(region.getLoading()).toBe(false);
        expect(region.getError()).toBe(undefined);
        expect(region.getPromise()).toBe(undefined);
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
        expect(region.getValue()).toBe('Jennifer Rodriguez');
        region.set(undefined);
        expect(region.getValue()).toBe(undefined);
        expect(region.getLoading()).toBe(false);
        expect(region.getError()).toBe(undefined);
        expect(region.getPromise()).toBe(undefined);
    });

    test('setValue with function in function region', () => {
        const func = () => 'Angela Robinson';
        const region = createRegion(func);
        region.set(() => 'Bryan Adams');
        expect(region.getValue()).toBe('Bryan Adams');
        const func2 = () => 'Cheryl Cole';
        region.set(() => func2);
        expect(region.getValue()).toBe(func2);
    });
});

describe('load', () => {
    test('load', async () => {
        const region = createRegion();
        const asyncFunction = () => Promise.resolve('Amy Hernandez');

        expect.assertions(4);
        await region.loadBy(asyncFunction)();
        expect(region.getValue()).toBe('Amy Hernandez');
        expect(region.getLoading()).toBe(false);
        expect(region.getError()).toBe(undefined);
        const promiseValue = await region.getPromise();
        expect(promiseValue).toBe('Amy Hernandez');
    });

    test('load resolve function', async () => {
        const region = createRegion();
        const func = () => 'David Anderson';
        const asyncFunction = () => Promise.resolve(func);

        expect.assertions(1);
        await region.loadBy(asyncFunction)();
        expect(region.getValue()).toBe(func);
    });

    test('load with reject', async () => {
        const region = createRegion();
        const asyncFunction = () => Promise.reject('Barbara Garcia');

        expect.assertions(2);
        await region.loadBy(asyncFunction)();
        expect(region.getValue()).toBe(undefined);
        expect(region.getError()).toStrictEqual(new Error('Barbara Garcia'));
    });

    test('load with reject error', async () => {
        const region = createRegion();
        const error = new Error('Kimberly Hall');
        const asyncFunction = () => Promise.reject(error);

        expect.assertions(2);
        await region.loadBy(asyncFunction)();
        expect(region.getValue()).toBe(undefined);
        expect(region.getError()).toStrictEqual(error);
    });

    test('load with params', async () => {
        const region = createRegion();
        const asyncFunction = (state: string) => Promise.resolve(`${state} & Joseph Hall`);

        expect.assertions(1);
        await region.loadBy(asyncFunction)('Barbara Rodriguez');
        expect(region.getValue()).toBe('Barbara Rodriguez & Joseph Hall');
    });

    test('load with reducer', async () => {
        const region = createRegion<string>();
        const asyncFunction = (state: string) => Promise.resolve(`${state} & Robert Thomas`);
        const reducer = (state = '', result = '') => `${state} | ${result}`;
        const loadUser1 = region.loadBy(asyncFunction, reducer);
        const loadUser2 = region.loadBy(asyncFunction, reducer);

        expect.assertions(2);
        await loadUser1('Michael Lee');
        expect(region.getValue()).toBe(' | Michael Lee & Robert Thomas');
        await loadUser2('Richard Hall');
        expect(region.getValue()).toBe(' | Michael Lee & Robert Thomas | Richard Hall & Robert Thomas');
    });

    test('reject will not erase resolve', async () => {
        const region = createRegion();
        const asyncFunction = () => Promise.resolve('Deborah Anderson');
        const asyncFunction2 = () => Promise.reject('Susan Gonzalez');

        expect.assertions(4);
        await region.loadBy(asyncFunction)();
        expect(region.getValue()).toBe('Deborah Anderson');
        expect(region.getError()).toBe(undefined);
        await region.loadBy(asyncFunction2)();
        expect(region.getValue()).toBe('Deborah Anderson');
        expect(region.getError()).toStrictEqual(new Error('Susan Gonzalez'));
    });

    test('resolve will erase reject', async () => {
        const region = createRegion();
        const asyncFunction = () => Promise.reject('Christopher Hall');
        const asyncFunction2 = () => Promise.resolve('Jason Lee');

        expect.assertions(4);
        await region.loadBy(asyncFunction)();
        expect(region.getValue()).toBe(undefined);
        expect(region.getError()).toStrictEqual(new Error('Christopher Hall'));
        await region.loadBy(asyncFunction2)();
        expect(region.getValue()).toBe('Jason Lee');
        expect(region.getError()).toBe(undefined);
    });

    test('load with id', async () => {
        const region = createRegion();
        const asyncFunction = ({id}: ParamsId) => Promise.resolve({id, name: 'Robert Davis'});

        expect.assertions(1);
        await region.loadBy(asyncFunction)({id: '620000198705195453'});
        expect(region.getValue()).toEqual({id: '620000198705195453', name: 'Robert Davis'});
    });

    test('load with idFunc', async () => {
        const region = createRegion();
        const asyncFunction = ({id}: ParamsId) => Promise.resolve({id, name: 'Scott Davis'});
        const loadUser = region.loadBy(asyncFunction);

        expect.assertions(1);
        await loadUser({id: '350000201202073963'});
        expect(region.getValue()).toEqual({id: '350000201202073963', name: 'Scott Davis'});
    });

    test('load normalize', async () => {
        const region = createRegion();
        const asyncFunction = ({id}: ParamsId) => Promise.resolve({id, name: 'Amy Davis'});
        const asyncFunction2 = ({id}: ParamsId) => Promise.resolve({id, name: 'Carol Jackson'});
        const loadUser = region.loadBy(asyncFunction);
        const loadUser2 = region.loadBy(asyncFunction2);

        expect.assertions(3);
        await loadUser({id: '650000200512087988'});
        expect(region.getValue()).toEqual({id: '650000200512087988', name: 'Amy Davis'});
        const promise = loadUser2({id: '330000197010067769'});
        expect(region.getValue()).toEqual({id: '650000200512087988', name: 'Amy Davis'});
        await promise;
        expect(region.getValue()).toEqual({id: '330000197010067769', name: 'Carol Jackson'});
    });

    test('load normalize compatible with set', async () => {
        const region = createRegion();
        const asyncFunction = () => Promise.resolve('Steven Walker');
        const loadUser = region.loadBy(asyncFunction);

        expect.assertions(2);
        await loadUser();
        expect(region.getValue()).toBe('Steven Walker');
        region.set('Patricia Thompson');
        expect(region.getValue()).toBe('Patricia Thompson');
    });

    test('load accepts latest', async () => {
        const region = createRegion();
        const asyncFunction1 = () => new Promise(resolve => setTimeout(() => resolve('Sharon Brown'), 40));
        const asyncFunction2 = () => new Promise(resolve => setTimeout(() => resolve('William Harris'), 20));
        const promise1 = region.loadBy(asyncFunction1)();
        const promise2 = region.loadBy(asyncFunction2)();

        expect.assertions(2);
        await Promise.all([promise1, promise2]);
        expect(region.getLoading()).toBe(false);
        expect(region.getValue()).toBe('William Harris');
    });
});

describe('useLoading', () => {
    test('useLoading', () => {
        const region = createRegion();
        const {result} = renderHook(() => region.useLoading());
        expect(result.current).toBe(true);
        region.set('Sharon Brown');
        expect(result.current).toBe(false);
    });
});

describe('useValue', () => {
    test('useValue', () => {
        const region = createRegion();
        const {result} = renderHook(() => region.useValue());
        expect(result.current).toBe(undefined);
        region.set('Elizabeth Taylor');
        expect(result.current).toBe('Elizabeth Taylor');
    });

    test('useValue with reset', () => {
        const region = createRegion('Fred Smith');
        const {result} = renderHook(() => region.useValue());
        expect(result.current).toBe('Fred Smith');
        region.set('George Washington');
        expect(result.current).toBe('George Washington');
        region.reset();
        expect(result.current).toBe('Fred Smith');
    });

    test('useValue with load', async () => {
        const region = createRegion();
        const {result} = renderHook(() => region.useValue());
        expect(result.current).toBe(undefined);
        await region.load(Promise.resolve('Henry Ford'));
        expect(result.current).toBe('Henry Ford');
    });

    test('useValue with selector', async () => {
        const region = createRegion<string>();
        const {result, rerender} = renderHook(() => region.useValue(s => s?.charAt(0)));
        expect(result.current).toBe(undefined);
        await region.load(Promise.resolve('Henry Ford'));
        await rerender();
        expect(result.current).toBe('H');
    });
});

describe('useError', () => {
    test('useError', async () => {
        const region = createRegion();
        const {result} = renderHook(() => region.useError());
        expect(result.current).toBe(undefined);
        region.set('Irene Kennedy');
        expect(result.current).toBe(undefined);
        const error = new Error('Oops');
        await region.load(Promise.reject(error));
        expect(result.current instanceof Error).toBe(true);
        expect(result.current).toBe(error);
        region.reset();
        expect(result.current).toBe(undefined);
    });

    test('useError with string reject', async () => {
        const region = createRegion();
        const {result} = renderHook(() => region.useError());
        expect(result.current).toBe(undefined);
        region.set('Irene Kennedy');
        expect(result.current).toBe(undefined);
        const error = 'just string';
        await region.load(Promise.reject(error));
        expect(result.current instanceof Error).toBe(true);
        expect(result.current).not.toBe('just string');
        expect(result.current?.message).toBe('just string');
    });
});

describe('useData', () => {
    test('useData', async () => {
        const region = createRegion();
        const {result, rerender} = renderHook(() => region.useData());
        expect(result.error?.message).toBe('Doesn\'t found any work in progress load process');
        await region.load(Promise.resolve('John Adams'));
        await rerender();
        expect(result.current).toBe('John Adams');
    });
});
