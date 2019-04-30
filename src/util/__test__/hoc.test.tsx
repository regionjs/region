import * as React from 'react';
import { hoc } from '../hoc';

interface Props {
  withLabel: string;
}

const Display = ({ withLabel }: Props) => `Display with ${withLabel}`;
const Loading = ({ withLabel }: Props) => `Loading with ${withLabel}`;
const Error = ({ withLabel }: Props) => `Error with ${withLabel}`;

describe('hoc', () => {
  test('display', () => {
    const ConnectWith = hoc({ Display, Loading, Error, useProps: () => ({}) });
    const props = { withLabel: 'label' };
    // @ts-ignore
    expect(ConnectWith(props)).toEqual(<Display withLabel="label" />);
  });

  test('loading', () => {
    const ConnectWith = hoc({ Display, Loading, Error, useProps: () => ({ loading: true }) });
    const props = { withLabel: 'label' };
    // @ts-ignore
    expect(ConnectWith(props)).toEqual(<Loading loading withLabel="label" />);
  });

  test('error', () => {
    // @ts-ignore
    const error = new Error('error');
    const ConnectWith = hoc({ Display, Loading, Error, useProps: () => ({ error }) });
    const props = { withLabel: 'label', error };
    // @ts-ignore
    expect(ConnectWith(props)).toEqual(<Error error={error} withLabel="label" />);
  });
});
