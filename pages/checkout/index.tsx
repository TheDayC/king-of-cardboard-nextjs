import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/Header';
import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { CommerceAuthProps } from '../../types/commerce';
import selector from './selector';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';

export const CheckoutPage: React.FC<CommerceAuthProps> = ({ accessToken, expires }) => {
    const dispatch = useDispatch();
    const { currentStep, hasCompletedOrder } = useSelector(selector);

    useEffect(() => {
        dispatch(setAccessToken(accessToken));
        dispatch(setExpires(expires));
    }, [dispatch, accessToken, expires]);

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-8">
                <div className="flex flex-col">
                    <Steps currentStep={currentStep} />
                    <div className="container mx-auto max-w-xxl">
                        <div className="flex flex-row space-x-8">
                            {!hasCompletedOrder ? (
                                <div className="flex flex-grow flex-col">
                                    <Customer />
                                    <Delivery />
                                    <Payment />
                                </div>
                            ) : (
                                <ConfirmationDetails />
                            )}
                            <div className="flex-1">
                                <Summary />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CheckoutPage;
