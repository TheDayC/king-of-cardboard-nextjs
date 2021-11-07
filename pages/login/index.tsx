import React, { useState } from 'react';
import { ClientSafeProvider, getProviders, LiteralUnion, getCsrfToken, useSession } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import Register from '../../components/Register';
import Login from '../../components/Login';

interface ServerSideProps {
    props: {
        providers?: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
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

enum Tabs {
    Login = 'login',
    Register = 'register',
}

export const LoginPage: React.FC<LoginPageProps> = ({ providers, csrfToken }) => {
    const [currentTab, setCurrentTab] = useState(Tabs.Login);
    const { data: session, status } = useSession();
    const router = useRouter();

    if (!providers || !csrfToken) return null;

    if (status === 'authenticated') {
        router.push('/breaks');
    }

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
                                {currentTab === Tabs.Login && <Login providers={providers} csrfToken={csrfToken} />}
                                {currentTab === Tabs.Register && <Register />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default LoginPage;
