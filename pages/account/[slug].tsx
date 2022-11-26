import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { Document } from '@contentful/rich-text-types';
import { useDispatch, useSelector } from 'react-redux';
import { BuiltInProviderType } from 'next-auth/providers';

import Account from '../../components/Account';
import Content from '../../components/Content';
import { parseAsSlug, safelyParse } from '../../utils/parsers';
import PageWrapper from '../../components/PageWrapper';
import { getPageBySlug } from '../../utils/pages';
import Custom404Page from '../404';
import { toTitleCase } from '../../utils';
import { calculateTokenExpiry, createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import Login from '../../components/Login';
import selector from './selector';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const slug = safelyParse(context, 'query.slug', parseAsSlug, null);
    const accessToken = await createToken();
    const providers = await getProviders();
    const { content } = await getPageBySlug(slug, 'account/');
    const should404 = !slug || !content;

    // If session hasn't been established redirect to the login page.
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            errorCode: should404 ? 404 : null,
            slug,
            content,
            accessToken,
            providers,
        },
    };
};

interface AccountSubPageProps {
    errorCode: number | null;
    slug: string | null;
    content: Document | null;
    accessToken: CreateToken;
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

export const AccountSubPage: React.FC<AccountSubPageProps> = ({ errorCode, slug, content, accessToken, providers }) => {
    const dispatch = useDispatch();
    const { userTokenExpiry } = useSelector(selector);
    const prettySlug = slug ? toTitleCase(slug.replaceAll('-', ' ')) : '';
    const hasUserExpired = calculateTokenExpiry(userTokenExpiry);

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    if (errorCode || !content || !slug || !providers) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper title={`${prettySlug} - Account - King of Cardboard`} description="Account page">
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="flex flex-col relative w-full px-2 py-0 md:px-4 md md:px-8">
                    {hasUserExpired ? (
                        <React.Fragment>
                            <h1 className="text-3xl mb-4">Session Expired</h1>
                            <p>
                                Your user session has expired, please login with your account details again to continue.
                            </p>
                            <div className="flex flex-col w-full justify-center items-center">
                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 card text-center rounded-md md:shadow-2xl">
                                    <div className="card-body p-2 lg:p-6">
                                        <Login
                                            providers={providers}
                                            showRegistrationSuccess={false}
                                            shouldRedirect={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Content content={[content]} />
                            <Account slug={slug} />
                        </React.Fragment>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AccountSubPage;
