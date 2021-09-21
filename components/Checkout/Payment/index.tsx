import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Address } from '@commercelayer/sdk/lib/resources/addresses';
import { PaymentMethod } from '@commercelayer/sdk/lib/resources/payment_methods';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import AuthProviderContext from '../../../context/context';

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep, customerDetails, order, shippingMethod } = useSelector(selector);
    const cl = useContext(AuthProviderContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 2;
    const {
        firstName,
        lastName,
        company,
        email,
        phone,
        addressLineOne,
        addressLineTwo,
        city,
        postcode,
        county,
        allowShippingAddress,
        shippingAddressLineOne,
        shippingAddressLineTwo,
        shippingCity,
        shippingPostcode,
        shippingCounty,
    } = customerDetails;
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);
    console.log('🚀 ~ file: index.tsx ~ line 41 ~ paymentMethods', paymentMethods);

    // Add the customer's email to the order and set flag.
    const addEmailToOrder = useCallback(async () => {
        if (cl && order) {
            const orderUpdate = await cl.orders.update({
                id: order.id,
                customer_email: email || '',
            });
        }
    }, [cl, order, email]);

    // Add the customer's billing address to the system.
    const addBillingToSystem = useCallback(async () => {
        if (cl && order) {
            const billingUpdate = await cl.addresses.create({
                first_name: firstName || '',
                last_name: lastName || '',
                company: company || '',
                line_1: addressLineOne || '',
                line_2: addressLineTwo || '',
                city: city || '',
                zip_code: postcode || '',
                state_code: county || '',
                country_code: 'UK' || '',
                phone: phone || '',
                email: email || '',
            });

            if (billingUpdate) {
                setBillingAddress(billingUpdate);
            }

            return billingUpdate;
        }

        return null;
    }, [cl, order, firstName, lastName, company, addressLineOne, addressLineTwo, city, postcode, county, phone, email]);

    // Add the customer's billing address to the order.
    const addBillingToOrder = useCallback(async () => {
        if (cl && order && billingAddress) {
            const orderUpdate = await cl.orders.update({
                id: order.id,
                billing_address: {
                    id: billingAddress.id,
                    type: 'addresses',
                },
            });
        }
    }, [cl, order, billingAddress]);

    // Add the customer's shipping address to the system.
    const addShippingToSystem = useCallback(async () => {
        if (cl && order) {
            const shippingUpdate = await cl.addresses.create({
                first_name: firstName || '',
                last_name: lastName || '',
                company: company || '',
                line_1: shippingAddressLineOne || '',
                line_2: shippingAddressLineTwo || '',
                city: shippingCity || '',
                zip_code: shippingPostcode || '',
                state_code: shippingCounty || '',
                country_code: 'UK' || '',
                phone: phone || '',
                email: email || '',
            });

            if (shippingUpdate) {
                setShippingAddress(shippingUpdate);
            }

            return shippingUpdate;
        }

        return null;
    }, [
        cl,
        order,
        firstName,
        lastName,
        company,
        shippingAddressLineOne,
        shippingAddressLineTwo,
        shippingCity,
        shippingPostcode,
        shippingCounty,
        phone,
        email,
    ]);

    // Add the customer's shipping address to the order.
    const addShippingToOrder = useCallback(async () => {
        if (cl && order && shippingAddress) {
            const orderUpdate = await cl.orders.update({
                id: order.id,
                shipping_address: {
                    id: shippingAddress.id,
                    type: 'addresses',
                },
            });
        }
    }, [cl, order, shippingAddress]);

    // Add the customer's shipping address to the order.
    const selectShippingMethod = useCallback(async () => {
        if (cl && order && shippingMethod) {
            const shippingMethodUpdate = await cl.shipments.update({
                id: order.id,
                shipping_method: {
                    id: shippingMethod,
                    type: 'shipping_methods',
                },
            });

            return shippingMethodUpdate;
        }

        return null;
    }, [cl, order, shippingMethod]);

    // Get payment methods
    const getPaymentMethods = useCallback(async () => {
        if (cl && order) {
            const fetchedPaymentMethods = await cl.orders.retrieve(order.id, {
                include: ['available_payment_methods'],
            });
            console.log(
                '🚀 ~ file: index.tsx ~ line 155 ~ getPaymentMethods ~ fetchedPaymentMethods',
                fetchedPaymentMethods
            );

            if (fetchedPaymentMethods && fetchedPaymentMethods.available_payment_methods) {
                setPaymentMethods(fetchedPaymentMethods.available_payment_methods);
            }
        }
    }, [cl, order]);

    const handleEdit = () => {
        dispatch(setCurrentStep(1));
    };

    const onSubmit = (data: any) => {
        if (cl && order) {
            addEmailToOrder();

            addBillingToSystem().then(() => {
                addBillingToOrder();
            });

            if (allowShippingAddress) {
                addShippingToSystem().then(() => {
                    addShippingToOrder();
                });
            }

            selectShippingMethod();
        }
    };

    useEffect(() => {
        getPaymentMethods();
    }, [getPaymentMethods]);

    return (
        <div className="flex">
            <div className={`collapse collapse-${isCurrentStep ? 'open' : 'closed'}`}>
                <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                    {!isCurrentStep ? 'Payment - Edit' : 'Payment'}
                </h3>
                <div className="collapse-content">
                    <form onSubmit={handleSubmit(onSubmit)}></form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
