import { assignValueDeep, setValueDeep } from '../reducerPrototype';

describe('reducerPrototype', () => {
  test('assignValueDeep', () => {
    const state = {};
    const nextState = assignValueDeep(state, 'a', 1);
    expect(state).toEqual({});
    expect(nextState).toEqual({ a: 1 });
  });
  test('setValueDeep', () => {
    const state = {};
    const nextState = setValueDeep(state, 'a', 1);
    expect(state).toEqual({ a: 1 });
    expect(nextState).toEqual(null);
  });
  test('assignValueDeep deep path', () => {
    expect(assignValueDeep({}, ['a', 'b'], 1)).toEqual({ a: { b: 1 } });
  });
  test('setValueDeep deep path', () => {
    const state = {};
    setValueDeep(state, ['a', 'b'], 1);
    expect(state).toEqual({ a: { b: 1 } });
  });
  test('assignValueDeep single path', () => {
    expect(assignValueDeep({}, ['a'], 1)).toEqual({ a: 1 });
  });
  test('setValueDeep single path', () => {
    const state = {};
    setValueDeep(state, ['a'], 1);
    expect(state).toEqual({ a: 1 });
  });
  test('assignValueDeep empty path', () => {
    expect(assignValueDeep({}, [], { a: 1 })).toEqual({ a: 1 });
  });
  test('setValueDeep empty path', () => {
    const state = {};
    setValueDeep(state, [], { a: 1 });
    expect(state).toEqual({ a: 1 });
  });
  test('assignValueDeep null path', () => {
    expect(assignValueDeep({}, null, { a: 1 })).toEqual({ a: 1 });
  });
  test('setValueDeep null path', () => {
    const state = {};
    setValueDeep(state, null, { a: 1 });
    expect(state).toEqual({ a: 1 });
  });
  test('assignValueDeep null path specific', () => {
    expect(assignValueDeep({}, null, 1)).toEqual({});
  });
  test('setValueDeep null path specific', () => {
    const state = {};
    setValueDeep(state, null, 1);
    expect(state).toEqual({});
  });
});
