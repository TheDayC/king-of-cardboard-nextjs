import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { getSession } from 'next-auth/react';

import AccountMenu from '../../../components/Account/Menu';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
import Loading from '../../../components/Loading';
import Fields from '../../../components/Account/AddressBook/Fields';
import PageWrapper from '../../../components/PageWrapper';
import { fetchCurrentAddress } from '../../../store/slices/account';
import Custom404Page from '../../404';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const addressId = safelyParse(context, 'query.addressId', parseAsString, null);

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
        <PageWrapper>
            <div className="flex flex-col md:flex-row w-full justify-start items-start">
                <div className="hidden md:block">
                    <AccountMenu isDropdown={false} />
                </div>
                <div className="dropdown w-full mb-4 md:hidden">
                    <div tabIndex={0} className="btn btn-block">
                        Account Menu
                    </div>
                    <AccountMenu isDropdown />
                </div>
                <div className="flex flex-col md:px-4 w-full md:w-3/4 relative">
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
