import React, { useState } from 'react';
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
import { parseAddress, parseBillingAddress, parseCustomerDetails, parseShippingAddress } from '../../../utils/parsers';
import { fetchOrder } from '../../../store/slices/cart';
import { setCheckoutLoading } from '../../../store/slices/global';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';
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
    } = useSelector(selector);
    const dispatch = useDispatch();
    const [billingAddressEntryChoice, setBillingAddressEntryChoice] = useState('existingBillingAddress');
    const [shippingAddressEntryChoice, setShippingAddressEntryChoice] = useState('existingShippingAddress');
    const {
        register,
        handleSubmit,
        formState: { errors },
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

        // Update the shipping same as billing field regardless of value.
        handleSameAsBilling();

        // Handle billing address first
        if (billingAddressEntryChoice === 'newBillingAddress') {
            // Parse the billing address into a customer address partial.
            const billingAddress = parseBillingAddress(data);

            // Update billing address details in commerceLayer
            const billingAddressUpdatedRes = await updateAddress(
                accessToken,
                order.id,
                customerDetails,
                billingAddress,
                false
            );

            if (isArrayOfErrors(billingAddressUpdatedRes)) {
                billingAddressUpdatedRes.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
                shouldSubmit = false;
            } else {
                dispatch(setBillingAddress(parseAddress(billingAddress)));

                // If we're cloning a new address to shipping, simply update the details with isShipping as true.
                if (isShippingSameAsBilling) {
                    // Update shipping address details in commerceLayer
                    const res = await updateAddress(accessToken, order.id, customerDetails, billingAddress, true);

                    if (isArrayOfErrors(res)) {
                        res.forEach((value) => {
                            dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                        });
                        shouldSubmit = false;
                    }
                }
            }
        } else if (billingAddressEntryChoice === 'existingBillingAddress') {
            // If we're choosing an existing address then check for a clone id and add as shipping.
            if (isShippingSameAsBilling && cloneBillingAddressId) {
                const res = await updateAddressClone(accessToken, order.id, cloneBillingAddressId);

                if (isArrayOfErrors(res)) {
                    res.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                    shouldSubmit = false;
                }
            }

            if (!cloneBillingAddressId) {
                dispatch(addAlert({ message: 'Please select a billing address', level: AlertLevel.Warning }));
                shouldSubmit = false;
            }
        }

        // Handle shipping address, no need to check for existing or as we handle that onClick.
        if (shippingAddressEntryChoice === 'newShippingAddress') {
            // Parse the shipping address into a customer address partial.
            const shippingAddress = parseShippingAddress(data);

            // Update shipping address details in commerceLayer. No check for same as billing here.
            const shippingAddressUpdatedRes = await updateAddress(
                accessToken,
                order.id,
                customerDetails,
                shippingAddress,
                true
            );

            if (isArrayOfErrors(shippingAddressUpdatedRes)) {
                shippingAddressUpdatedRes.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
                shouldSubmit = false;
            } else {
                dispatch(setShippingAddress(parseAddress(shippingAddress)));
            }
        } else if (shippingAddressEntryChoice === 'existingShippingAddress') {
            if (!cloneShippingAddressId) {
                dispatch(addAlert({ message: 'Please select a shipping address', level: AlertLevel.Warning }));
                shouldSubmit = false;
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

    const handleSameAsBilling = async () => {
        if (order && accessToken) {
            const sameAsBillingRes = await updateSameAsBilling(accessToken, order.id, isShippingSameAsBilling);

            if (isArrayOfErrors(sameAsBillingRes)) {
                sameAsBillingRes.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            }
        }
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
        setBillingAddressEntryChoice(id);

        if (id === 'newShippingAddress') {
            dispatch(setCloneShippingAddressId(null));
        }
    };

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
                            <PersonalDetails register={register} errors={errors} />
                            <h3 className="text-2xl px-5 mt-4 font-semibold">Billing Details</h3>
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
                            {!isShippingSameAsBilling && (
                                <React.Fragment>
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
