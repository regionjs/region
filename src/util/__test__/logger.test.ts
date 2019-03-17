import { debug, group } from '../logger';

const useTrip = () => {
  const trip = [];
  console.groupCollapsed = () => trip.push('groupCollapsed');
  console.groupEnd = () => trip.push('groupEnd');
  console.debug = () => trip.push('debug');
  console.error = () => trip.push('error');
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
    group({});
    expect(trip).toEqual(['groupCollapsed', 'debug', 'debug', 'debug', 'groupEnd']);
  });
});
