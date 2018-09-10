import { setConfig } from '../config';
import { getLoading, getResults, getFetchTimes, mapResultToProps } from '../getThingsFromState';

const setState = (state) => {
  setConfig({
    store: {
      getState() {
        return state;
      }
    }
  });
};

describe('getThingsFromState', () => {
  test('get things from nothing', () => {
    // NOTE loading is true because we want to display loading ui when state is undefined.
    setState(undefined);
    expect(getLoading('a')).toEqual(true);
    expect(getResults('a')).toEqual(undefined);
    expect(getFetchTimes('a')).toEqual(undefined);
    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([undefined, undefined]);
    expect(mapResultToProps('a')()).toEqual({
      loading: true,
      a: undefined
    });
    expect(mapResultToProps(['a', 'b'])()).toEqual({
      loading: true,
      a: undefined,
      b: undefined
    });
  });
  test('get things from initial state', () => {
    setState({});
    expect(getLoading('a')).toEqual(true);
    expect(getResults('a')).toEqual(undefined);
    expect(getFetchTimes('a')).toEqual(undefined);
    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([undefined, undefined]);
    expect(mapResultToProps('a')()).toEqual({
      loading: true,
      a: undefined
    });
    expect(mapResultToProps(['a', 'b'])()).toEqual({
      loading: true,
      a: undefined,
      b: undefined
    });
  });
  test('get things from start loading', () => {
    setState({
      loadings: { a: true }
    });
    expect(getLoading('a')).toEqual(true);
    expect(getResults('a')).toEqual(undefined);
    expect(getFetchTimes('a')).toEqual(undefined);
    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([undefined, undefined]);
    expect(mapResultToProps('a')()).toEqual({
      loading: true,
      a: undefined
    });
    expect(mapResultToProps(['a', 'b'])()).toEqual({
      loading: true,
      a: undefined,
      b: undefined
    });
  });
  test('get things from stop loading', () => {
    setState({
      loadings: { a: false },
      fetchTimes: { a: 0 },
      results: { a: { name: '66', type: 'cat' } }
    });
    expect(getLoading('a')).toEqual(false);
    expect(getResults('a')).toEqual({ name: '66', type: 'cat' });
    expect(getFetchTimes('a')).toEqual(0);
    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([{ name: '66', type: 'cat' }, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([0, undefined]);
    expect(mapResultToProps('a')()).toEqual({
      loading: false,
      a: { name: '66', type: 'cat' }
    });
    expect(mapResultToProps(['a', 'b'])()).toEqual({
      loading: true,
      a: { name: '66', type: 'cat' },
      b: undefined
    });
  });
});
