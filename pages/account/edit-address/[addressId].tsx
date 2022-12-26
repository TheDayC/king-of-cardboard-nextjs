import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { getSession } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
import Loading from '../../../components/Loading';
import Fields from '../../../components/Account/AddressBook/Fields';
import PageWrapper from '../../../components/PageWrapper';
import { fetchCurrentAddress } from '../../../store/slices/account';
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

export const EditAddressPage: React.FC<OrderProps> = ({ errorCode, addressId }) => {
    const { accessToken, currentAddress } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && addressId && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchCurrentAddress({ accessToken, id: addressId }));
            setIsLoading(false);
        }
    }, [accessToken, addressId, dispatch, shouldFetch]);

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
                    <Loading show={isLoading} />
                    <Fields
                        id={currentAddress.id}
                        name={currentAddress.name}
                        addressId={currentAddress.addressId}
                        addressLineOne={currentAddress.addressLineOne}
                        addressLineTwo={currentAddress.addressLineTwo}
                        city={currentAddress.city}
                        company={currentAddress.company}
                        county={currentAddress.county}
                        firstName={currentAddress.firstName}
                        lastName={currentAddress.lastName}
                        phone={currentAddress.phone}
                        postcode={currentAddress.postcode}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default EditAddressPage;
