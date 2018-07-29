import { debug, group } from '../logger';

test('logger works', () => {
  debug('a', 'b');
  group('a', 'b', 'c', 'd');
});
