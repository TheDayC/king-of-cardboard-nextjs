import React from 'react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';
import { get } from 'lodash';

import Credentials from './credentials';
import ErrorAlert from '../ErrorAlert';
import Google from './google';
import Twitch from './twitch';
import SuccessAlert from '../SuccessAlert';

interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
    showRegistrationSuccess: boolean;
}

export const Login: React.FC<LoginProps> = ({ providers, showRegistrationSuccess }) => {
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
            {showRegistrationSuccess && (
                <div className="mb-6">
                    <SuccessAlert msg="Registration Successful!" />
                </div>
            )}
            {credentials && <Credentials />}
            <div className="divider">OR</div>
            <Google />
            <Twitch />
        </React.Fragment>
    );
};

export default Login;
