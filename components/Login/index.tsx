import React from 'react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';

import Credentials from './credentials';
import ErrorAlert from '../ErrorAlert';
import Google from './google';
import Twitch from './twitch';
import SuccessAlert from '../SuccessAlert';
import { parseAsString, safelyParse } from '../../utils/parsers';

interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
    showRegistrationSuccess: boolean;
}

export const Login: React.FC<LoginProps> = ({ providers, showRegistrationSuccess }) => {
    const { credentials } = providers;
    const router = useRouter();
    const error = safelyParse(router, 'query.error', parseAsString, null);

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
