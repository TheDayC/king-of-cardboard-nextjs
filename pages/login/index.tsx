import React, { useState } from 'react';
import { ClientSafeProvider, getProviders, LiteralUnion, getCsrfToken, getSession } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

import Header from '../../components/Header';
import Register from '../../components/Register';
import ResetPassword from '../../components/ResetPassword';
import Login from '../../components/Login';
import { ServerSideRedirectProps } from '../../types/pages';
import { Tabs } from '../../enums/auth';

interface ServerSideProps {
    props: {
        providers?: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
        csrfToken?: string | null;
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<ServerSideProps | ServerSideRedirectProps> {
    const providers = await getProviders();
    const csrfToken = await getCsrfToken(context);
    const session = await getSession(context);

    if (session && csrfToken) {
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
            csrfToken: csrfToken || null,
        },
    };
}

interface LoginPageProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
    csrfToken?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ providers, csrfToken }) => {
    const [currentTab, setCurrentTab] = useState(Tabs.Login);
    const [regSuccess, setRegSuccess] = useState(false);
    const isLogin = currentTab === Tabs.Login;
    const isRegister = currentTab === Tabs.Register;
    const isReset = currentTab === Tabs.Reset;

    const handleLoginTab = () => {
        setCurrentTab(Tabs.Login);
    };

    const handleRegisterTab = () => {
        setCurrentTab(Tabs.Register);
    };

    const handleResetTab = () => {
        setCurrentTab(Tabs.Reset);
    };

    if (!providers || !csrfToken) return null;

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-0 relative lg:p-4">
                <div className="container mx-auto">
                    <div className="flex flex-col w-full justify-center items-center">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 card text-center rounded-md md:shadow-2xl">
                            <div className="card-body p-2 lg:p-6">
                                <div className="tabs">
                                    <a
                                        className={`tab tab-bordered w-1/3${isLogin ? ' tab-active' : ''}`}
                                        onClick={handleLoginTab}
                                    >
                                        Log In
                                    </a>
                                    <a
                                        className={`tab tab-bordered w-1/3${isRegister ? ' tab-active' : ''}`}
                                        onClick={handleRegisterTab}
                                    >
                                        Register
                                    </a>
                                    <a
                                        className={`tab tab-bordered w-1/3${isReset ? ' tab-active' : ''}`}
                                        onClick={handleResetTab}
                                    >
                                        Reset
                                    </a>
                                </div>
                                <div className="px-2 py-4 lg:p-4">
                                    {currentTab === Tabs.Login && (
                                        <Login providers={providers} showRegistrationSuccess={regSuccess} />
                                    )}
                                    {currentTab === Tabs.Register && (
                                        <Register setCurrentTab={setCurrentTab} setRegSuccess={setRegSuccess} />
                                    )}
                                    {currentTab === Tabs.Reset && <ResetPassword />}
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
