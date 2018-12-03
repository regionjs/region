import { debug, group, groupWarn } from '../logger';

const useTrip = () => {
  const trip = [];
  console.groupCollapsed = () => trip.push('groupCollapsed');
  console.groupEnd = () => trip.push('groupEnd');
  console.debug = () => trip.push('debug');
  console.warn = () => trip.push('warn');
  return trip;
};

describe('logger', () => {
  test('debug trip', () => {
    const trip = useTrip();
    debug('a', 'b');
    expect(trip).toEqual(['debug']);
  });
  test('group trip', () => {
    const trip = useTrip();
    group('a', 'b', 'c', 'd');
    expect(trip).toEqual(['groupCollapsed', 'debug', 'debug', 'groupEnd']);
  });
  test('groupWarn trip', () => {
    const trip = useTrip();
    groupWarn('title', 'e');
    expect(trip).toEqual(['groupCollapsed', 'warn', 'groupEnd']);
  });
  test('groupWarn in production', () => {
    expect(process.env.NODE_ENV).toEqual('test');
    process.env.NODE_ENV = 'production';
    const trip = useTrip();
    groupWarn('title', 'e');
    expect(trip).toEqual([]);
    process.env.NODE_ENV = 'test';
    expect(process.env.NODE_ENV).toEqual('test');
  });
});
