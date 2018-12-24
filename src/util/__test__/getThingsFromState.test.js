import { region } from '../../global/region';
import { getStore } from '../../global/store';

const { setConfig, getLoading, getResults, getFetchTimes, mapResultToProps } = region;

describe('getStore', () => {
  test('throw', () => {
    expect(() => getStore()).toThrow();
  });

  test('getStore', () => {
    const dispatch = () => {};
    const getState = () => {};
    setConfig({
      store: { dispatch, getState }
    });
    expect(getStore()).toEqual({ dispatch, getState });
  });
});

const setState = (state) => {
  setConfig({
    store: {
      dispatch() {},
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
  test('treat undefined', () => {
    setState({
      loadings: { a: true }
    });
    expect(getLoading('b')).toEqual(true);
    setConfig({ strictLoading: false });
    expect(getLoading('b')).toEqual(undefined);
    setConfig({ strictLoading: true });
    expect(getLoading('b')).toEqual(true);
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
  test('getLoading from all resolved', () => {
    setState({
      loadings: { a: false, b: false }
    });
    expect(getLoading(['a', 'b'])).toBe(false);
  });
  test('mapResultToProps', () => {
    setState({
      loadings: { a: true, b: false },
      fetchTimes: { a: 0, b: 0 },
      results: { a: { name: '66', type: 'cat' }, b: { name: '77', type: 'dog' } }
    });
    expect(mapResultToProps('a')()).toEqual({
      loading: true,
      a: { name: '66', type: 'cat' }
    });
    expect(mapResultToProps(['a', 'b'])()).toEqual({
      loading: true,
      a: { name: '66', type: 'cat' },
      b: { name: '77', type: 'dog' }
    });
    expect(mapResultToProps({ loading: 'b', result: 'a' })()).toEqual({
      loading: false,
      a: { name: '66', type: 'cat' }
    });
    expect(mapResultToProps({ loading: 'a', result: ['a', 'b'] })()).toEqual({
      loading: true,
      a: { name: '66', type: 'cat' },
      b: { name: '77', type: 'dog' }
    });
  });
  test('config reducePath', () => {
    setConfig({ reducerPath: 'result' });
    expect(getResults('a')).toBe(undefined);
    setState({ result: { results: { a: 'config reducePath' } } });
    expect(getResults('a')).toBe('config reducePath');
    setConfig({ reducerPath: null });
    expect(getResults('a')).toBe(undefined);
  });
  test('selector', () => {
    setState({
      loadings: { a: false },
      fetchTimes: { a: 0 },
      results: { a: [{ id: 0, name: '66', type: 'cat' }, { id: 1, name: '77', type: 'dog' }] }
    });
    expect(mapResultToProps({
      entity: 'a',
      selector: ({ a }, { id }) => a.find(item => item.id === id)
    })(null, { id: 1 })).toEqual({ id: 1, name: '77', type: 'dog' });
  });
});
