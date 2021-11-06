import React from 'react';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn, getCsrfToken } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import Header from '../../components/Header';
import Credentials from '../../components/Login/credentials';

interface ServerSideProps {
    props: {
        providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
        csrfToken?: string;
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideProps> {
    const providers = await getProviders();
    const csrfToken = await getCsrfToken(context);

    return {
        props: {
            providers,
            csrfToken,
        },
    };
}

interface LoginPageProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
    csrfToken?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ providers, csrfToken }) => {
    if (!providers || !csrfToken) return null;

    const { credentials, google } = providers;
    console.log('🚀 ~ file: index.tsx ~ line 19 ~ providers', providers);
    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    {credentials && (
                        <Credentials
                            signinUrl={credentials.signinUrl}
                            callbackUrl={credentials.callbackUrl}
                            csrfToken={csrfToken}
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default LoginPage;
