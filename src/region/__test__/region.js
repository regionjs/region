import Region from '../index';
import { provide } from '../..';

provide();
const region = new Region({ name: null });

export { region };
