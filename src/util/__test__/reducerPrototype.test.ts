import { setValueDeep } from '../reducerPrototype';

describe('reducerPrototype', () => {
  test('setValueDeep deep path', () => {
    const state = {};
    setValueDeep(state, ['a', 'b'], 1);
    expect(state).toEqual({ a: { b: 1 } });
  });
  test('assignValueDeep deep path func', () => {
    const state = {};
    setValueDeep(state, ['a', 'b'], () => 1);
    expect(state).toEqual({ a: { b: 1 } });
    setValueDeep(state, ['a', 'b'], (v: number) => v + 1);
    expect(state).toEqual({ a: { b: 2 } });
  });
});
