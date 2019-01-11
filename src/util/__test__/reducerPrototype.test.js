import { assignValueDeep, setValueDeep } from '../reducerPrototype';

describe('reducerPrototype', () => {
  test('setValueDeep deep path', () => {
    const state = {};
    setValueDeep(state, ['a', 'b'], 1);
    expect(state).toEqual({ a: { b: 1 } });
  });
  test('assignValueDeep deep path func', () => {
    const state = assignValueDeep({}, ['a', 'b'], () => 1);
    expect(state).toEqual({ a: { b: 1 } });
    expect(assignValueDeep(state, ['a', 'b'], v => v + 1)).toEqual({ a: { b: 2 } });
  });
});
