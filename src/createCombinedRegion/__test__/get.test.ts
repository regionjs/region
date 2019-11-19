import { region } from './region';

const {
    getLoading,
    getValue,
    getFetchTime,
    getError,
    getProps,
    private_store,
} = region;

let state: any = null;
private_store.getState = () => state;

const setState = (nextState: any) => {
  state = nextState;
};

describe('get', () => {
  test('get things from nothing', () => {
    // NOTE loading is true because we want to display loading ui when state is undefined.
    setState(undefined);
    expect(getLoading('a')).toEqual(true);
    expect(getValue('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(undefined);
    expect(getProps('a')).toEqual({
      loading: true,
      error: undefined,
      a: undefined,
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getValue(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTime(['a', 'b'])).toEqual(undefined);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      error: undefined,
      a: undefined,
      b: undefined,
    });
  });

  test('get things from initial state', () => {
    setState({});
    expect(getLoading('a')).toEqual(true);
    expect(getValue('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(undefined);
    expect(getProps('a')).toEqual({
      loading: true,
      a: undefined,
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getValue(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTime(['a', 'b'])).toEqual(undefined);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
  });

  test('get things from start loading', () => {
    setState({
      a: { loading: true },
    });
    expect(getLoading('a')).toEqual(true);
    expect(getValue('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(undefined);
    expect(getProps('a')).toEqual({
      loading: true,
      a: undefined,
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getValue(['a', 'b'])).toEqual([undefined, undefined]);
    expect(getFetchTime(['a', 'b'])).toEqual(undefined);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      a: undefined,
      b: undefined,
    });
  });

  test('treat undefined', () => {
    setState({
      a: { loading: true },
    });
    expect(getLoading('b')).toEqual(true);
    expect(getLoading('b')).toEqual(true);
  });

  test('get things from stop loading', () => {
    setState({
      a: {
        loading: false,
        fetchTime: 999,
        result: { name: '66', type: 'cat' },
      },
    });
    expect(getLoading('a')).toEqual(false);
    expect(getValue('a')).toEqual({ name: '66', type: 'cat' });
    expect(getFetchTime('a')).toEqual(999);
    expect(getProps('a')).toEqual({
      loading: false,
      fetchTime: 999,
      a: { name: '66', type: 'cat' },
    });

    expect(getLoading(['a', 'b'])).toEqual(true);
    expect(getValue(['a', 'b'])).toEqual([{ name: '66', type: 'cat' }, undefined]);
    expect(getFetchTime(['a', 'b'])).toEqual(999);
    expect(getProps(['a', 'b'])).toEqual({
      loading: true,
      error : undefined,
      fetchTime: 999,
      a: { name: '66', type: 'cat' },
      b: undefined,
    });
  });

  test('getProps with complex key', () => {
    setState({
      a: {
        loading: false,
        fetchTime: 999,
        result: { name: '66', type: 'cat' },
      },
    });
    expect(getProps({ key: ['a', 'b'], result:['b'] })).toEqual({
      loading: true,
      error : undefined,
      fetchTime: 999,
      b: undefined,
    });
    expect(getProps({ loading: ['a', 'b'], result:['b'] })).toEqual({
      loading: true,
      error : undefined,
      fetchTime: undefined,
      b: undefined,
    });
  });

  test('getLoadings from all resolved', () => {
    setState({
      a: { loading: false },
      b: { loading: false },
    });
    expect(getLoading(['a', 'b'])).toEqual(false);
  });

  test('getErrors', () => {
    const errorA = new Error('error a');
    setState({
      a: {
        loading: false,
        error: errorA,
      },
      b: {
        loading: false,
        error: undefined,
      },
    });
    expect(getError(['a', 'b'])).toEqual(errorA);
    expect(getError('a')).toEqual(errorA);
    expect(getError('b')).toEqual(undefined);
    expect(getProps('a').error).toEqual(new Error('error a'));
    expect(getProps(['a', 'b']).error).toEqual(new Error('error a'));

    const errorB = new Error('error b');
    setState({
      a: {
        loading: false,
        error: errorA,
      },
      b: {
        loading: false,
        error: errorB,
      },
    });
    expect(getError(['a', 'b'])).toEqual(new Error('error a, error b'));
    expect(getProps(['a', 'b']).error).toEqual(new Error('error a, error b'));
  });
});
