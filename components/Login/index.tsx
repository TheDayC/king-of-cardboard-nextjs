import React from 'react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

import Credentials from './credentials';

interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

export const Login: React.FC<LoginProps> = ({ providers }) => {
    const { credentials, google } = providers;

    return (
        <React.Fragment>
            {credentials && <Credentials signinUrl={credentials.signinUrl} callbackUrl={credentials.callbackUrl} />}
        </React.Fragment>
    );
};

export default Login;
