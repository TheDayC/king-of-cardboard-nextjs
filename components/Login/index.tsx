import React, { useEffect } from 'react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';

import Credentials from './credentials';
import Google from './google';
import Twitch from './twitch';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { AlertLevel } from '../../enums/system';
import { useDispatch } from 'react-redux';

interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
    showRegistrationSuccess: boolean;
}

export const Login: React.FC<LoginProps> = ({ providers, showRegistrationSuccess }) => {
    const { credentials } = providers;
    const router = useRouter();
    const dispatch = useDispatch();
    const error = safelyParse(router, 'query.error', parseAsString, null);

    useEffect(() => {
        if (error) {
            dispatch({ message: 'Invalid Credentials.', level: AlertLevel.Error });
        }
    }, [error]);

    useEffect(() => {
        if (showRegistrationSuccess) {
            dispatch({ message: 'Registration Successful!', level: AlertLevel.Success });
        }
    }, [showRegistrationSuccess]);

    return (
        <React.Fragment>
            {credentials && <Credentials />}
            <div className="divider">OR</div>
            <Google />
            <Twitch />
        </React.Fragment>
    );
};

export default Login;
