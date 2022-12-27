import React from 'react';
import { GetServerSideProps } from 'next';
import { useSelector } from 'react-redux';
import { unstable_getServerSession } from 'next-auth';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
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
    const { currentAddress } = useSelector(selector);

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
                    {/*  <Loading show={isLoading} /> */}
                    <Fields
                        id={currentAddress.id}
                        title={currentAddress.name}
                        addressId={currentAddress.addressId}
                        lineOne={currentAddress.addressLineOne}
                        lineTwo={currentAddress.addressLineTwo}
                        city={currentAddress.city}
                        company={currentAddress.company}
                        county={currentAddress.county}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default EditAddressPage;
