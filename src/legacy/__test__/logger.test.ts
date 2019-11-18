import { debug, group } from '../logger';

const useTrip = () => {
  const trip: string[] = [];
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
    group({ actionType: 'LOAD', key: 'user' });
    expect(trip).toEqual(['groupCollapsed', 'debug', 'debug', 'debug', 'groupEnd']);
  });
});
