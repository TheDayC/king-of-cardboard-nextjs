import React from 'react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';
import { get } from 'lodash';

import Credentials from './credentials';
import ErrorAlert from '../ErrorAlert';

interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

export const Login: React.FC<LoginProps> = ({ providers }) => {
    const { credentials, google } = providers;
    const router = useRouter();
    const error: string = get(router, 'query.error', '');

    return (
        <React.Fragment>
            {error && (
                <div className="mb-6">
                    <ErrorAlert error="Invalid Credentials." />
                </div>
            )}
            {credentials && <Credentials signinUrl={credentials.signinUrl} callbackUrl={credentials.callbackUrl} />}
        </React.Fragment>
    );
};

export default Login;
