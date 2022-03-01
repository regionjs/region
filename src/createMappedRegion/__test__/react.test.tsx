import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import {region} from './region';

const {set, useLoading, useValue} = region;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connect = (key: any) => (Component: any) => {
    return () => {
        const loading = useLoading(key);
        const value = useValue(key);
        const props = {[key]: value};
        return <Component loading={loading} {...props} />;
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectWith = (key: any, Component: any) => connect(key)(Component);

describe('react', () => {
    test('useProps', () => {
        const User = () => {
            const loading = useLoading('user');
            const user = useValue('user');
            return loading ? <div>{`loading ${user}`}</div> : <div>{`!loading ${user}`}</div>;
        };
        expect(reactTestRenderer.create(<User />).toJSON()).toMatchSnapshot();
        set('user', 'user');
        expect(reactTestRenderer.create(<User />).toJSON()).toMatchSnapshot();
    });

    test('connect and connectWith', () => {
        interface Props {
            loading: boolean;
            user: string;
        }
        const User = ({loading, user}: Props) => (loading ? <div>{`loading ${user}`}</div> : <div>{`!loading ${user}`}</div>);
        const ConnectUser = connect('user')(User);
        expect(reactTestRenderer.create(<ConnectUser />).toJSON()).toMatchSnapshot();
        set('user', 'user2');
        expect(reactTestRenderer.create(<ConnectUser />).toJSON()).toMatchSnapshot();
        const ConnectWithUser = connectWith('user', User);
        expect(reactTestRenderer.create(<ConnectWithUser />).toJSON()).toMatchSnapshot();
        set('user', 'user3');
        expect(reactTestRenderer.create(<ConnectWithUser />).toJSON()).toMatchSnapshot();
    });
});
