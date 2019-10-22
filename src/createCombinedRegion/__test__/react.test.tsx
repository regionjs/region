import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import { region } from './region';

const { set, useProps, connect, connectWith } = region;

describe('react', () => {
  test('useProps', () => {
    const User: React.FC = () => {
      const { loading, user } = useProps('user');
      return loading ? <div>{`loading ${user}`}</div> : <div>{`!loading ${user}`}</div>;
    };
    expect(reactTestRenderer.create(<User />).toJSON()).toMatchSnapshot();
    set('user', 'user');
    expect(reactTestRenderer.create(<User />).toJSON()).toMatchSnapshot();
  });

  test('connect and connectWith', () => {
    const User: React.FC = ({ loading, user }: any) => loading ? <div>{`loading ${user}`}</div> : <div>{`!loading ${user}`}</div>;
    const ConnectUser = connect('user')(User);
    expect(reactTestRenderer.create(<ConnectUser />).toJSON()).toMatchSnapshot();
    set('user', 'user2');
    expect(reactTestRenderer.create(<ConnectUser />).toJSON()).toMatchSnapshot();
    const ConnectWithUser = connectWith('user', User);
    expect(reactTestRenderer.create(<ConnectWithUser />).toJSON()).toMatchSnapshot();
    set('user', 'user3');
    expect(reactTestRenderer.create(<ConnectWithUser />).toJSON()).toMatchSnapshot();
  });

  test('connect with wrong key', () => {
    const User: React.FC = ({ loading, user }: any) => loading ? <div>{`loading ${user}`}</div> : <div>{`!loading ${user}`}</div>;
    // expect to throw
    // @ts-ignore
    expect(() => connect(null)(User)).toThrow();
  });
});
