import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Error from 'next/error';
import { useDispatch, useSelector } from 'react-redux';

import AccountMenu from '../../../components/Account/Menu';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
import Loading from '../../../components/Loading';
import Fields from '../../../components/Account/AddressBook/Fields';
import PageWrapper from '../../../components/PageWrapper';
import { fetchCurrentAddress } from '../../../store/slices/account';
import { fetchSession } from '../../../utils/auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await fetchSession(context);
    const addressId = safelyParse(context, 'query.addressId', parseAsString, null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const errorCode = addressId ? false : 404;

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
            errorCode,
            addressId,
            emailAddress,
        },
    };
};

interface OrderProps {
    errorCode: number | boolean;
    addressId: string | null;
    emailAddress: string | null;
}

export const EditAddressPage: React.FC<OrderProps> = ({ errorCode, addressId, emailAddress }) => {
    const { accessToken, currentAddress } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && emailAddress && addressId && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchCurrentAddress({ accessToken, id: addressId }));
            setIsLoading(false);
        }
    }, [accessToken, emailAddress, addressId, dispatch, shouldFetch]);

    // Show error page if a code is provided.
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="hidden md:block">
                    <AccountMenu isDropdown={false} />
                </div>
                <div className="dropdown w-full p-2 md:hidden">
                    <div tabIndex={0} className="btn btn-block">
                        Account Menu
                    </div>
                    <AccountMenu isDropdown />
                </div>
                <div className="flex flex-col py-2 px-6 md:py-4 md:px-8 w-full md:w-3/4 relative">
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
