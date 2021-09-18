import React, { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { useDispatch } from 'react-redux';

import Header from '../../components/Header';
import Steps from '../../components/Checkout/Steps';
import CustomerDetails from '../../components/Checkout/CustomerDetails';
import { getCommerceAuth } from '../../utils/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { CommerceAuthProps } from '../../types/commerce';

export const getStaticProps: GetStaticProps = async () => {
    const tokenProps = await getCommerceAuth();

    if (tokenProps) {
        return tokenProps;
    } else {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};

export const CheckoutPage: React.FC<CommerceAuthProps> = ({ accessToken, expires }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAccessToken(accessToken));
        dispatch(setExpires(expires));
    }, [dispatch, accessToken, expires]);

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-8">
                <div className="flex flex-col">
                    <Steps currentStep={0} />
                    <CustomerDetails />
                </div>
            </div>
        </React.Fragment>
    );
};

export default CheckoutPage;
