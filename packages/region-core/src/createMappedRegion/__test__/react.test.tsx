import {describe, test, expect} from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import {render, screen} from '@testing-library/react';
import {createMappedRegion} from '../../index.js';

const {set, useLoading, useValue} = createMappedRegion();

const User = () => {
    const loading = useLoading('user');
    const user = useValue('user');
    return (
        <>
            <div role="loading">{String(loading)}</div>
            <div role="user">{String(user)}</div>
        </>
    );
};

describe('react', () => {
    test('useProps', async () => {
        render(<User />);
        expect(screen.getByRole('loading').textContent).toBe('true');
        expect(screen.getByRole('user').textContent).toBe('undefined');
        set('user', 'user');
        await new Promise(resolve => setTimeout(resolve, 0)); // wait for state update
        expect(screen.getByRole('loading').textContent).toBe('false');
        expect(screen.getByRole('user').textContent).toBe('user');
    });
});
