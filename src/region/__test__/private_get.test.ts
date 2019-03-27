/* tslint:disable: max-file-line-count */
import { region } from './region';
import { getStore } from '../../global/store';

const {
  private_setConfig,
  private_getLoading: getLoading,
  private_getResults: getResults,
  private_getFetchTimes: getFetchTimes,
  private_getError: getError,
  getProps,
  private_selectorFactory: selectorFactory,
} = region;

let state: any = null;
const store = getStore();
store.getState = () => ({ region: state });

const setState = (nextState: any) => {
  state = nextState;
};

describe('get', () => {
  test('get things from nothing', () => {
    // NOTE loading is true because we want to display loading ui when state is undefined.
    setState(undefined);
    expect(getLoading('a')).toEqual(true);
    expect(getResults('a')).toEqual(undefined);
    expect(getFetchTimes('a')).toEqual(undefined);
    expect(getProps('a')).toEqual({
      loading: true,
      error: undefined,
      a: undefined,
    });
    expect(selectorFactory('a')()).toEqual({
      loading: true,
      a: undefined,
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      error: undefined,
      a: undefined,
      b: undefined,
    });
    expect(selectorFactory(['a', 'b'])()).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
  });

  test('get things from initial state', () => {
    setState({});
    expect(getLoading('a')).toEqual(true);
    expect(getResults('a')).toEqual(undefined);
    expect(getFetchTimes('a')).toEqual(undefined);
    expect(getProps('a')).toEqual({
      loading: true,
      a: undefined,
    });
    expect(selectorFactory('a')()).toEqual({
      loading: true,
      a: undefined,
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
    expect(selectorFactory(['a', 'b'])()).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
  });

  test('get things from start loading', () => {
    setState({
      loadings: { a: true },
    });
    expect(getLoading('a')).toEqual(true);
    expect(getResults('a')).toEqual(undefined);
    expect(getFetchTimes('a')).toEqual(undefined);
    expect(getProps('a')).toEqual({
      loading: true,
      a: undefined,
    });
    expect(selectorFactory('a')()).toEqual({
      loading: true,
      a: undefined,
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
    expect(selectorFactory(['a', 'b'])()).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
  });

  test('treat undefined', () => {
    setState({
      loadings: { a: true },
    });
    expect(getLoading('b')).toEqual(true);
    private_setConfig({ strictLoading: false });
    expect(getLoading('b')).toEqual(undefined);
    private_setConfig({ strictLoading: true });
    expect(getLoading('b')).toEqual(true);
  });

  test('get things from stop loading', () => {
    setState({
      loadings: { a: false },
      fetchTimes: { a: 0 },
      results: { a: { name: '66', type: 'cat' } },
    });
    expect(getLoading('a')).toEqual(false);
    expect(getResults('a')).toEqual({ name: '66', type: 'cat' });
    expect(getFetchTimes('a')).toEqual(0);
    expect(getProps('a')).toEqual({
      loading: false,
      a: { name: '66', type: 'cat' },
    });
    expect(selectorFactory('a')()).toEqual({
      loading: false,
      a: { name: '66', type: 'cat' },
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getResults(['a', 'b'])).toEqual([{ name: '66', type: 'cat' }, undefined]);
    expect(getFetchTimes(['a', 'b'])).toEqual([0, undefined]);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      a: { name: '66', type: 'cat' },
      b: undefined,
    });
    expect(selectorFactory(['a', 'b'])()).toEqual({
      loading: true,
      a: { name: '66', type: 'cat' },
      b: undefined,
    });
  });

  test('getLoading from all resolved', () => {
    setState({
      loadings: { a: false, b: false },
    });
    expect(getLoading(['a', 'b'])).toBe(false);
  });

  test('getError', () => {
    setState({
      loadings: { a: false, b: false },
      errors: { a: new Error('error a'), b: undefined },
    });
    expect(getError(['a', 'b'])).toBe('error a');
    expect(getError('a')).toBe('error a');
    expect(getError('b')).toBe(undefined);
    setState({
      loadings: { a: false, b: false },
      errors: { a: new Error('error a'), b: new Error('error b') },
    });
    expect(getError(['a', 'b'])).toBe('error a, error b');
  });

  test('selectorFactory', () => {
    setState({
      loadings: { a: true, b: false },
      fetchTimes: { a: 0, b: 0 },
      results: { a: { type: 'cat' }, b: { type: 'dog' } },
    });
    expect(selectorFactory('a')()).toEqual({
      loading: true,
      a: { type: 'cat' },
    });
    expect(selectorFactory(['a', 'b'])()).toEqual({
      loading: true,
      a: { type: 'cat' },
      b: { type: 'dog' },
    });
    expect(selectorFactory({ loading: 'b', result: 'a' })()).toEqual({
      loading: false,
      a: { type: 'cat' },
    });
    expect(selectorFactory({ loading: 'a', result: ['a', 'b'] })()).toEqual({
      loading: true,
      a: { type: 'cat' },
      b: { type: 'dog' },
    });
  });
  test('selector', () => {
    setState({
      loadings: { a: false },
      fetchTimes: { a: 0 },
      results: { a: [{ id: 0, type: 'cat' }, { id: 1, type: 'dog' }] },
    });
    const selected = selectorFactory({
      key: 'a',
      selector: ({ a }: any, { id }: any) => a.find((item: any) => item.id === id),
    })(null, { id: 1 });
    expect(selected.id).toBe(1);
    expect(selected.type).toBe('dog');
    expect(selected).toEqual({ loading: false, a: [{ id: 0, type: 'cat' }, { id: 1, type: 'dog' }], id: 1, type: 'dog' });
  });
  test('config reducePath', () => {
    private_setConfig({ name: 'result' });
    expect(getResults('a')).toBe(undefined);
    setState({ results: { a: 'config reducePath' } });
    store.getState = () => ({ result: state });
    expect(getResults('a')).toBe('config reducePath');
  });
});
