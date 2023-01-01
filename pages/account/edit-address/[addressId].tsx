import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import Fields from '../../../components/Account/AddressBook/Fields';
import PageWrapper from '../../../components/PageWrapper';
import Custom404Page from '../../404';
import { authOptions } from '../../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const addressId = safelyParse(query, 'addressId', parseAsString, null);

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
            errorCode: !addressId ? 404 : null,
            addressId,
        },
    };
};

interface OrderProps {
    errorCode: number | boolean;
    addressId: string | null;
}

export const EditAddressPage: React.FC<OrderProps> = ({ errorCode }) => {
    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper
            title="Edit Address - Account - King of Cardboard"
            description="A page to add and edit your personal addresses."
        >
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="flex flex-col md:px-4 w-full relative">
                    <Fields
                        id={''}
                        title={''}
                        addressId={''}
                        lineOne={''}
                        lineTwo={''}
                        city={''}
                        company={''}
                        county={''}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default EditAddressPage;
