import React, { useEffect } from 'react';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import Credentials from './credentials';
import Google from './google';
//import Twitch from './twitch';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { addWarning } from '../../store/slices/alerts';

interface LoginProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
    shouldRedirect: boolean;
}

export const Login: React.FC<LoginProps> = ({ providers, shouldRedirect }) => {
    const { credentials } = providers;
    const router = useRouter();
    const dispatch = useDispatch();
    const error = safelyParse(router, 'query.error', parseAsString, null);

    useEffect(() => {
        if (error) {
            dispatch(addWarning('Invalid Credentials.'));
        }
    }, [error, dispatch]);

    return (
        <React.Fragment>
            {credentials && <Credentials shouldRedirect={shouldRedirect} />}
            <div className="divider">OR</div>
            <Google />
            {/* <Twitch /> */}
        </React.Fragment>
    );
};

export default Login;
