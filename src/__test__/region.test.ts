import mockDate from './mockDate';
import { createRegion } from '..';

mockDate();

describe('createRegion', () => {
  test('createRegion with undefined', () => {
    const region = createRegion();
    expect(region.getValue()).toBe(undefined);
    expect(region.getLoading()).toBe(true);
    expect(region.getError()).toBe(undefined);
    expect(region.getFetchTime()).toBe(undefined);
  });

  test('createRegion with value', () => {
    const region = createRegion('Karen Martinez');
    expect(region.getValue()).toBe('Karen Martinez');
    expect(region.getLoading()).toBe(false);
    expect(region.getError()).toBe(undefined);
    expect(region.getFetchTime()).toBe(0);
  });

  test('createRegion with function', () => {
    const region = createRegion(() => 'Helen Davis');
    expect(region.getValue()).toBe('Helen Davis');
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
    return region.load(asyncFunction).finally(() => {
      expect(region.getValue()).toBe('Amy Hernandez');
    });
  });

  test('load with reject', () => {
    const region = createRegion();
    const asyncFunction = () => Promise.reject('Barbara Garcia');

    expect.assertions(2);
    return region.load(asyncFunction).finally(() => {
      expect(region.getValue()).toBe(undefined);
      expect(region.getError()).toBe('Barbara Garcia');
    });
  });

  test('load with reject error', () => {
    const region = createRegion();
    const error = new Error('Kimberly Hall');
    const asyncFunction = () => Promise.reject(error);

    expect.assertions(2);
    return region.load(asyncFunction).finally(() => {
      expect(region.getValue()).toBe(undefined);
      expect(region.getError()).toBe(error);
    });
  });

  test('load with params', () => {
    const region = createRegion();
    const asyncFunction = (state: string) => Promise.resolve(`${state} & Joseph Hall`);

    expect.assertions(1);
    return region.loadBy(asyncFunction)('Barbara Rodriguez').finally(() => {
      expect(region.getValue()).toBe('Barbara Rodriguez & Joseph Hall');
    });
  });

  test('reject will not erase resolve', () => {
    const region = createRegion();
    const asyncFunction = () => Promise.resolve('Deborah Anderson');
    const asyncFunction2 = () => Promise.reject('Susan Gonzalez');

    expect.assertions(4);
    return region.load(asyncFunction).then(() => {
      expect(region.getValue()).toBe('Deborah Anderson');
      expect(region.getError()).toBe(undefined);
      return region.load(asyncFunction2);
    }).finally(() => {
      expect(region.getValue()).toBe('Deborah Anderson');
      expect(region.getError()).toBe('Susan Gonzalez');
    });
  });

  test('resolve will erase reject', () => {
    const region = createRegion();
    const asyncFunction = () => Promise.reject('Christopher Hall');
    const asyncFunction2 = () => Promise.resolve('Jason Lee');

    expect.assertions(4);
    return region.load(asyncFunction).then(() => {
      expect(region.getValue()).toBe(undefined);
      expect(region.getError()).toBe('Christopher Hall');
      return region.load(asyncFunction2);
    }).finally(() => {
      expect(region.getValue()).toBe('Jason Lee');
      expect(region.getError()).toBe(undefined);
    });
  });
});
