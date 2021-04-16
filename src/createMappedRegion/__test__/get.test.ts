import { region } from './region';

const {
  getLoading,
  getValue,
  getFetchTime,
  getError,
  private_setState_just_for_test: private_setState,
} = region;

describe('get', () => {
  test('get things from nothing', () => {
    // NOTE loading is true because we want to display loading ui when state is undefined.
    // private_setState({});
    expect(getLoading('a')).toEqual(true);
    expect(getValue('a')).toEqual(undefined);
    expect(getError('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(undefined);
  });

  test('get things from initial state', () => {
    private_setState({});
    expect(getLoading('a')).toEqual(true);
    expect(getValue('a')).toEqual(undefined);
    expect(getError('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(undefined);
  });

  test('get things from start loading', () => {
    private_setState({
      a: { loading: 1 },
    });
    expect(getLoading('a')).toEqual(true);
    expect(getValue('a')).toEqual(undefined);
    expect(getError('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(undefined);
  });

  test('treat undefined', () => {
    private_setState({
      a: { loading: 1 },
    });
    expect(getLoading('a')).toEqual(true);
    expect(getLoading('b')).toEqual(true);
  });

  test('get things from stop loading', () => {
    private_setState({
      a: {
        loading: 0,
        fetchTime: 999,
        result: { name: '66', type: 'cat' },
      },
    });
    expect(getLoading('a')).toEqual(false);
    expect(getValue('a')).toEqual({ name: '66', type: 'cat' });
    expect(getError('a')).toEqual(undefined);
    expect(getFetchTime('a')).toEqual(999);

    expect(getLoading('b')).toEqual(true);
    expect(getValue('b')).toEqual(undefined);
    expect(getError('b')).toEqual(undefined);
    expect(getFetchTime('b')).toEqual(undefined);
  });

  test('getLoadings from all resolved', () => {
    private_setState({
      a: { loading: 0 },
      b: { loading: 0 },
    });
    expect(getLoading('a')).toEqual(false);
    expect(getLoading('b')).toEqual(false);
  });

  test('getErrors', () => {
    const errorA = new Error('error a');
    private_setState({
      a: {
        loading: 0,
        error: errorA,
      },
      b: {
        loading: 0,
        error: undefined,
      },
    });
    expect(getError('a')).toEqual(errorA);
    expect(getError('b')).toEqual(undefined);

    const errorB = new Error('error b');
    private_setState({
      a: {
        loading: 0,
        error: errorA,
      },
      b: {
        loading: 0,
        error: errorB,
      },
    });
    expect(getError('a')).toEqual(errorA);
    expect(getError('b')).toEqual(errorB);
  });
});
