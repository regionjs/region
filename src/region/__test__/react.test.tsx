import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import { region } from './region';

const { set, useProps, connect, connectWith } = region;

describe('react', () => {
  test('useProps', () => {
    const User = () => {
      const { loading, user } = useProps('user');
      return loading ? `loading ${user}` : `!loading ${user}`;
    };
    // @ts-ignore
    expect(reactTestRenderer.create(<User />).toJSON()).toEqual('loading undefined');
    set('user', 'user');
    // @ts-ignore
    expect(reactTestRenderer.create(<User />).toJSON()).toEqual('!loading user');
  });

  test('connect and connectWith', () => {
    const User = ({ loading, user }: any) => loading ? `loading ${user}` : `!loading ${user}`;
    const ConnectUser = connect('user')(User);
    // @ts-ignore
    expect(reactTestRenderer.create(<ConnectUser />).toJSON()).toEqual('!loading user');
    set('user', 'user2');
    // @ts-ignore
    expect(reactTestRenderer.create(<ConnectUser />).toJSON()).toEqual('!loading user2');
    const ConnectWithUser = connectWith('user', User);
    // @ts-ignore
    expect(reactTestRenderer.create(<ConnectWithUser />).toJSON()).toEqual('!loading user2');
    set('user', 'user3');
    // @ts-ignore
    expect(reactTestRenderer.create(<ConnectWithUser />).toJSON()).toEqual('!loading user3');
  });

  test('connect with wrong key', () => {
    const User = ({ loading, user }: any) => loading ? `loading ${user}` : `!loading ${user}`;
    // @ts-ignore
    const ConnectUser = connect(null)(User);
    expect(ConnectUser).toBe(null);
  });
});
