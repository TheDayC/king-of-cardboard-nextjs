import React, { useState } from 'react';
import { ClientSafeProvider, getProviders, LiteralUnion, getCsrfToken, useSession, getSession } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import Register from '../../components/Register';
import Login from '../../components/Login';
import { ServerSideRedirectProps } from '../../types/pages';
import { Tabs } from '../../enums/auth';

interface ServerSideProps {
    props: {
        providers?: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
        csrfToken?: string;
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideProps | ServerSideRedirectProps> {
    const providers = await getProviders();
    const csrfToken = await getCsrfToken(context);
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: '/account',
            },
        };
    }

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
    const [currentTab, setCurrentTab] = useState(Tabs.Login);
    const [regSuccess, setRegSuccess] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    if (!providers || !csrfToken) return null;

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-col w-full justify-center items-center">
                        <div className="flex flex-col w-1/3 card text-center shadow-2xl rounded-md">
                            <div className="card-body">
                                <div className="tabs">
                                    <a
                                        className={`tab tab-bordered w-1/2${
                                            currentTab === Tabs.Login ? ' tab-active' : ''
                                        }`}
                                        onClick={() => setCurrentTab(Tabs.Login)}
                                    >
                                        Log In
                                    </a>
                                    <a
                                        className={`tab tab-bordered w-1/2${
                                            currentTab === Tabs.Register ? ' tab-active' : ''
                                        }`}
                                        onClick={() => setCurrentTab(Tabs.Register)}
                                    >
                                        Sign Up
                                    </a>
                                </div>
                                <div className="p-4">
                                    {currentTab === Tabs.Login && (
                                        <Login providers={providers} showRegistrationSuccess={regSuccess} />
                                    )}
                                    {currentTab === Tabs.Register && (
                                        <Register setCurrentTab={setCurrentTab} setRegSuccess={setRegSuccess} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default LoginPage;
