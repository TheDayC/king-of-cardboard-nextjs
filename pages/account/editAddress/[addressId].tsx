import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Error from 'next/error';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../../components/Header';
import AccountMenu from '../../../components/Account/Menu';
import { getCustomerAddress, getAddress } from '../../../utils/account';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import selector from './selector';
import { CommerceLayerResponse } from '../../../types/api';
import Loading from '../../../components/Loading';
import Fields from '../../../components/Account/AddressBook/Fields';
import { isArrayOfErrors, isError } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
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
    const { accessToken } = useSelector(selector);
    const [currentAddress, setCurrentAddress] = useState<CommerceLayerResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchAddress = async (token: string, id: string) => {
        const customerAddressRes = await getCustomerAddress(token, id);
        if (isError(customerAddressRes)) {
            dispatch(addAlert({ message: customerAddressRes.description, level: AlertLevel.Error }));
        } else if (isArrayOfErrors(customerAddressRes)) {
            customerAddressRes.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            // CL separates customer and original addresses.
            const originalAddressId = safelyParse(
                customerAddressRes,
                'relationships.address.data.id',
                parseAsString,
                null
            );

            if (originalAddressId) {
                const res = await getAddress(token, originalAddressId);

                if (isError(res)) {
                    dispatch(addAlert({ message: res.description, level: AlertLevel.Error }));
                } else if (isArrayOfErrors(res)) {
                    res.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                } else {
                    setCurrentAddress(res);
                }
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (accessToken && emailAddress && addressId) {
            fetchAddress(accessToken, addressId);
        }
    }, [accessToken, emailAddress, addressId]);

    // Show error page if a code is provided.
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-2 md:p-4 relative">
                <div className="container mx-auto">
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
                            {currentAddress && (
                                <Fields
                                    addressId={currentAddress.id}
                                    addressLineOne={currentAddress.attributes.line_1}
                                    addressLineTwo={currentAddress.attributes.line_2}
                                    city={currentAddress.attributes.city}
                                    company={currentAddress.attributes.company}
                                    county={currentAddress.attributes.state_code}
                                    firstName={currentAddress.attributes.first_name}
                                    lastName={currentAddress.attributes.last_name}
                                    phone={currentAddress.attributes.phone}
                                    postcode={currentAddress.attributes.zip_code}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default EditAddressPage;
