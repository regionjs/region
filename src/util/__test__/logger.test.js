import { debug, group } from '../logger';

describe('logger', () => {
  test('works', () => {
    debug('a', 'b');
    group('a', 'b', 'c', 'd');
  });
  test('debug trip', () => {
    const trip = [];
    console.debug = () => trip.push('debug');
    debug('a', 'b');
    expect(trip).toEqual(['debug']);
  });
  test('group value', () => {
    const trip = [];
    console.groupCollapsed = () => trip.push('groupCollapsed');
    console.debug = () => trip.push('debug');
    console.groupEnd = () => trip.push('groupEnd');
    group('a', 'b', 'c', 'd');
    expect(trip).toEqual(['groupCollapsed', 'debug', 'debug', 'groupEnd']);
  });
});
