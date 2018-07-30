import { getLoading, getResults, getFetchTimes } from '../getThingsFromState';

describe('getThingsFromState', () => {
  test('get things from nothing', () => {
    // NOTE loading is true because we want to display loading ui when state is undefined.
    const state = undefined;
    expect(getLoading(state, 'a')).toEqual(true);
    expect(getResults(state, 'a')).toEqual(undefined);
    expect(getFetchTimes(state, 'a')).toEqual(undefined);
    expect(getLoading(state, ['a', 'b'])).toEqual(true);
    expect(getResults(state, ['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(state, ['a', 'b'])).toEqual([undefined, undefined]);
  });
  test('get things from initial state', () => {
    const state = {};
    expect(getLoading(state, 'a')).toEqual(true);
    expect(getResults(state, 'a')).toEqual(undefined);
    expect(getFetchTimes(state, 'a')).toEqual(undefined);
    expect(getLoading(state, ['a', 'b'])).toEqual(true);
    expect(getResults(state, ['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(state, ['a', 'b'])).toEqual([undefined, undefined]);
  });
  test('get things from start loading', () => {
    const state = {
      loadings: { a: true }
    };
    expect(getLoading(state, 'a')).toEqual(true);
    expect(getResults(state, 'a')).toEqual(undefined);
    expect(getFetchTimes(state, 'a')).toEqual(undefined);
    expect(getLoading(state, ['a', 'b'])).toEqual(true);
    expect(getResults(state, ['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(state, ['a', 'b'])).toEqual([undefined, undefined]);
  });
  test('get things from stop loading', () => {
    const state = {
      loadings: { a: false },
      fetchTimes: { a: 0 },
      results: { a: { name: '66', type: 'cat' } }
    };
    expect(getLoading(state, 'a')).toEqual(false);
    expect(getResults(state, 'a')).toEqual({ name: '66', type: 'cat' });
    expect(getFetchTimes(state, 'a')).toEqual(0);
    expect(getLoading(state, ['a', 'b'])).toEqual(false);
    expect(getResults(state, ['a', 'b'])).toEqual([{ name: '66', type: 'cat' }, undefined]);
    expect(getFetchTimes(state, ['a', 'b'])).toEqual([0, undefined]);
  });
});
