import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

import selector from './selector';
import { updateAddress, updateAddressClone, updateSameAsBilling } from '../../../utils/checkout';
import {
    setBillingAddress,
    setCloneBillingAddressId,
    setCloneShippingAddressId,
    setCurrentStep,
    setCustomerDetails,
    setShippingAddress,
} from '../../../store/slices/checkout';
import {
    parseAddress,
    parseBillingAddress,
    parseCustomerDetails,
    parseExistingAddress,
    parseShippingAddress,
} from '../../../utils/parsers';
import { fetchOrder } from '../../../store/slices/cart';
import { setCheckoutLoading } from '../../../store/slices/global';
import { addWarning } from '../../../store/slices/alerts';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';
import ShipToBilling from './ShipToBilling';
import PersonalDetails from './PersonalDetails';
import SelectionWrapper from '../../SelectionWrapper';
import ExistingAddress from './ExistingAddress';

const Customer: React.FC = () => {
    const { data: session } = useSession();
    const {
        currentStep,
        order,
        accessToken,
        checkoutLoading,
        isShippingSameAsBilling,
        cloneBillingAddressId,
        cloneShippingAddressId,
        billingAddress,
        shippingAddress,
    } = useSelector(selector);
    const dispatch = useDispatch();
    const [billingAddressEntryChoice, setBillingAddressEntryChoice] = useState('existingBillingAddress');
    const [shippingAddressEntryChoice, setShippingAddressEntryChoice] = useState('existingShippingAddress');
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: unknown) => {
        if (hasErrors || checkoutLoading || !order || !accessToken) {
            return;
        }

        let shouldSubmit = true;

        // Set loading in current form.
        dispatch(setCheckoutLoading(true));

        // Parse the customer details like name, email, phone etc
        const customerDetails = parseCustomerDetails(data);
        dispatch(setCustomerDetails(customerDetails));

        // Handle billing address first
        if (billingAddressEntryChoice === 'newBillingAddress') {
            // Parse the billing address into a customer address partial.
            const billingAddressParsed = parseBillingAddress(data);

            // Update billing address details in commerceLayer
            const billingAddressUpdatedRes = await updateAddress(
                accessToken,
                order.id,
                customerDetails,
                billingAddressParsed,
                false
            );

            dispatch(setBillingAddress(parseAddress(billingAddressParsed)));

            // If we're cloning a new address to shipping, simply update the details with isShipping as true.
            if (isShippingSameAsBilling) {
                // Update shipping address details in commerceLayer
                const res = await updateAddress(accessToken, order.id, customerDetails, billingAddressParsed, true);
            }
        } else if (billingAddressEntryChoice === 'existingBillingAddress') {
            // Parse the billing address into a customer address partial.
            const billingAddressParsed = parseExistingAddress(billingAddress);

            // Update billing address details in commerceLayer
            const billingAddressUpdatedRes = await updateAddress(
                accessToken,
                order.id,
                customerDetails,
                billingAddressParsed,
                false
            );

            // If we're choosing an existing address then check for a clone id and add as shipping.
            if (cloneBillingAddressId) {
                const res = await updateAddressClone(accessToken, order.id, cloneBillingAddressId, false);
            } else {
                dispatch(addWarning('Please select a billing address'));
                shouldSubmit = false;
            }
        }

        // If our shipping is the same as the billing address then we need to add the billing clone id to shipping.
        if (isShippingSameAsBilling) {
            // Update the shipping same as billing field regardless of value.
            await updateSameAsBilling(accessToken, order.id, isShippingSameAsBilling);

            if (cloneBillingAddressId) {
                const res = await updateAddressClone(accessToken, order.id, cloneBillingAddressId, true);
            } else {
                dispatch(addWarning('Please select a billing address'));
                shouldSubmit = false;
            }
        } else {
            // Handle shipping address, no need to check for existing or as we handle that onClick.
            if (shippingAddressEntryChoice === 'newShippingAddress') {
                // Parse the shipping address into a customer address partial.
                const shippingAddressParsed = parseShippingAddress(data);

                // Update shipping address details in commerceLayer. No check for same as billing here.
                const shippingAddressUpdatedRes = await updateAddress(
                    accessToken,
                    order.id,
                    customerDetails,
                    shippingAddressParsed,
                    true
                );

                if (shippingAddressUpdatedRes) {
                    dispatch(setShippingAddress(parseAddress(shippingAddressParsed)));
                }
            } else if (shippingAddressEntryChoice === 'existingShippingAddress') {
                // Parse the shipping address into a customer address partial.
                const shippingAddressParsed = parseExistingAddress(shippingAddress);

                // Update shipping address details in commerceLayer. No check for same as billing here.
                const shippingAddressUpdatedRes = await updateAddress(
                    accessToken,
                    order.id,
                    customerDetails,
                    shippingAddressParsed,
                    true
                );

                if (!cloneShippingAddressId) {
                    dispatch(addWarning('Please select a shipping address'));
                    shouldSubmit = false;
                }
            }
        }

        // Remove load blockers.
        dispatch(setCheckoutLoading(false));

        // If any errors were found then block the form.
        if (!shouldSubmit) {
            return;
        }

        submissionCleanup();
    };

    const submissionCleanup = () => {
        // Fetch the order with new details.
        dispatch(fetchOrder(true));

        // Redirect to next stage.
        dispatch(setCurrentStep(1));
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
        }
    };

    const handleBillingSelect = (id: string) => {
        setBillingAddressEntryChoice(id);

        if (id === 'newBillingAddress') {
            dispatch(setCloneBillingAddressId(null));
        }
    };

    const handleShippingSelect = (id: string) => {
        setShippingAddressEntryChoice(id);

        if (id === 'newShippingAddress') {
            dispatch(setCloneShippingAddressId(null));
        }
    };

    // Session doesn't load in immediately so we need to update the defaults on change.
    useEffect(() => {
        const hasSession = Boolean(session);

        if (hasSession) {
            setBillingAddressEntryChoice('existingBillingAddress');
            setShippingAddressEntryChoice('existingShippingAddress');
        } else {
            setBillingAddressEntryChoice('newBillingAddress');
            setShippingAddressEntryChoice('newShippingAddress');
        }
    }, [session]);

    // If we click the sameAs checkbox I want to reset the shipping address.
    useEffect(() => {
        if (isShippingSameAsBilling) {
            setShippingAddressEntryChoice('existingShippingAddress');
        }
    }, [isShippingSameAsBilling]);

    return (
        <div
            className={`collapse collapse-plus card bordered mb-4 rounded-md lg:mb-6 collapse-${
                isCurrentStep ? 'open' : 'closed'
            }`}
        >
            <div className="collapse-title text-lg lg:text-xl" onClick={handleEdit}>
                {!hasErrors && !isCurrentStep ? 'Customer - Edit' : 'Customer'}
            </div>
            <div className="collapse-content bg-base-100 p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex">
                        <div className="flex flex-col w-full">
                            <PersonalDetails register={register} errors={errors} setValue={setValue} />
                            <div className="divider lightDivider"></div>
                            <h3 className="text-2xl px-5 font-semibold">Billing Details</h3>
                            {session && (
                                <SelectionWrapper
                                    id="existingBillingAddress"
                                    title="Choose an existing billing address"
                                    name="billingAddress"
                                    isChecked={billingAddressEntryChoice === 'existingBillingAddress'}
                                    defaultChecked={Boolean(session)}
                                    onSelect={handleBillingSelect}
                                >
                                    <ExistingAddress isShipping={false} />
                                </SelectionWrapper>
                            )}
                            <SelectionWrapper
                                id="newBillingAddress"
                                title="Add a new billing address"
                                name="billingAddress"
                                isChecked={billingAddressEntryChoice === 'newBillingAddress'}
                                defaultChecked={!Boolean(session)}
                                onSelect={handleBillingSelect}
                            >
                                <BillingAddress register={register} errors={errors} />
                            </SelectionWrapper>
                            <ShipToBilling />
                            <div className="divider lightDivider"></div>
                            {!isShippingSameAsBilling && (
                                <React.Fragment>
                                    <h3 className="text-2xl px-5 font-semibold">Shipping Details</h3>
                                    {session && (
                                        <SelectionWrapper
                                            id="existingShippingAddress"
                                            title="Choose an existing shipping address"
                                            name="shippingAddress"
                                            isChecked={shippingAddressEntryChoice === 'existingShippingAddress'}
                                            defaultChecked={Boolean(session)}
                                            onSelect={handleShippingSelect}
                                        >
                                            <ExistingAddress isShipping={true} />
                                        </SelectionWrapper>
                                    )}
                                    <SelectionWrapper
                                        id="newShippingAddress"
                                        title="Add a new shipping address"
                                        name="shippingAddress"
                                        isChecked={shippingAddressEntryChoice === 'newShippingAddress'}
                                        defaultChecked={!Boolean(session)}
                                        onSelect={handleShippingSelect}
                                    >
                                        <ShippingAddress register={register} errors={errors} />
                                    </SelectionWrapper>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end p-4">
                        <button
                            type="submit"
                            className={`btn${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}${
                                checkoutLoading ? ' loading btn-square' : ''
                            }`}
                        >
                            {checkoutLoading ? '' : 'Delivery'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Customer;
