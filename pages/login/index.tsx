import React, { useState } from 'react';
import { ClientSafeProvider, getProviders, LiteralUnion, getCsrfToken } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { GetServerSideProps } from 'next';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import Register from '../../components/Register';
import ResetPassword from '../../components/ResetPassword';
import Login from '../../components/Login';
import { Tabs } from '../../enums/auth';
import PageWrapper from '../../components/PageWrapper';
import { fetchSession } from '../../utils/auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const providers = await getProviders();
    const csrfToken = await getCsrfToken(context);
    const session = await fetchSession(context);

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
};

interface LoginPageProps {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
    csrfToken?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ providers, csrfToken }) => {
    const [currentTab, setCurrentTab] = useState(Tabs.Login);
    const [regSuccess, setRegSuccess] = useState(false);
    const router = useRouter();
    const isLogin = currentTab === Tabs.Login;
    const isRegister = currentTab === Tabs.Register;
    const isReset = currentTab === Tabs.Reset;
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));

    const handleLoginTab = () => {
        setCurrentTab(Tabs.Login);
    };

    const handleRegisterTab = () => {
        setCurrentTab(Tabs.Register);
    };

    const handleResetTab = () => {
        setCurrentTab(Tabs.Reset);
    };

    // Show error page if a code is provided.
    if (!cookieConsent) {
        router.push('/');
    }

    if (!providers || !csrfToken) return null;

    return (
        <PageWrapper>
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
        </PageWrapper>
    );
};

export default LoginPage;
