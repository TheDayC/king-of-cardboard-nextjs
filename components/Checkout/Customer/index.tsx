import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

import selector from './selector';
import {
    setBillingAddress,
    setCloneBillingAddressId,
    setCloneShippingAddressId,
    setCurrentStep,
    setCustomerDetails,
    setShippingAddress,
} from '../../../store/slices/checkout';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { setCheckoutLoading } from '../../../store/slices/global';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';
import ShipToBilling from './ShipToBilling';
import PersonalDetails from './PersonalDetails';
import SelectionWrapper from '../../SelectionWrapper';
import ExistingAddress from './ExistingAddress';
import { CustomerAddress } from '../../../store/types/state';
import { Address } from '../../../types/checkout';
import { BillingAddressChoice, ShippingAddressChoice } from '../../../enums/checkout';

const defaultAddress: Address = {
    lineOne: '',
    lineTwo: '',
    company: '',
    city: '',
    postcode: '',
    county: '',
    country: '',
};

interface CustomerProps {
    hasSession: boolean;
}

const Customer: React.FC<CustomerProps> = ({ hasSession }) => {
    const { data: session } = useSession();
    const { currentStep, checkoutLoading, isShippingSameAsBilling, addresses } = useSelector(selector);
    const dispatch = useDispatch();
    const [billingAddressChoice, setBillingAddressChoice] = useState(BillingAddressChoice.New);
    const [shippingAddressChoice, setShippingAddressChoice] = useState(ShippingAddressChoice.New);
    const [shouldSubmit, setShouldSubmit] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;
    const showExisting = hasSession && addresses.length > 0;

    const onSubmit = async (data: FieldValues) => {
        if (hasErrors || checkoutLoading) {
            return;
        }

        // Set loading in current form.
        dispatch(setCheckoutLoading(true));

        // Parse the customer details like name, email, phone etc
        dispatch(
            setCustomerDetails({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
            })
        );

        // Handle a new billing address.
        if (billingAddressChoice === BillingAddressChoice.New) {
            const newBillingAddress = {
                lineOne: safelyParse(data, 'billingAddressLineOne', parseAsString, ''),
                lineTwo: safelyParse(data, 'billingAddressLineTwo', parseAsString, ''),
                company: safelyParse(data, 'billingCompany', parseAsString, ''),
                city: safelyParse(data, 'billingCity', parseAsString, ''),
                postcode: safelyParse(data, 'billingPostcode', parseAsString, ''),
                county: safelyParse(data, 'billingCounty', parseAsString, ''),
                country: safelyParse(data, 'country', parseAsString, 'GB'),
            };

            dispatch(setBillingAddress(newBillingAddress));

            // If the shipping same as billing checkbox is selected just copy the billing address to shipping address.
            if (isShippingSameAsBilling) dispatch(setShippingAddress(newBillingAddress));
        } else {
            // TODO: Add existing billing address to state here.
        }

        // Handle a new shipping address.
        if (!isShippingSameAsBilling) {
            if (shippingAddressChoice === ShippingAddressChoice.New) {
                const newShippingAddress = {
                    lineOne: safelyParse(data, 'shippingAddressLineOne', parseAsString, ''),
                    lineTwo: safelyParse(data, 'shippingAddressLineTwo', parseAsString, ''),
                    company: safelyParse(data, 'shippingCompany', parseAsString, ''),
                    city: safelyParse(data, 'shippingCity', parseAsString, ''),
                    postcode: safelyParse(data, 'shippingPostcode', parseAsString, ''),
                    county: safelyParse(data, 'shippingCounty', parseAsString, ''),
                    country: safelyParse(data, 'country', parseAsString, 'GB'),
                };

                dispatch(setBillingAddress(newShippingAddress));
            } else {
                // TODO: Add existing shipping address to state here.
            }
        }

        // Redirect to next stage.
        dispatch(setCurrentStep(1));

        dispatch(setCheckoutLoading(false));
    };

    // Handle the edit collapsed item functionality.
    // Simple check for address step.
    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
        }
    };

    const handleBillingSelect = (choice: number) => {
        const newChoice = choice as BillingAddressChoice;
        setBillingAddressChoice(newChoice);

        if (newChoice === BillingAddressChoice.New) {
            dispatch(setCloneBillingAddressId(null));
            dispatch(setBillingAddress(defaultAddress));
        }
    };

    const handleShippingSelect = (choice: number) => {
        const newChoice = choice as ShippingAddressChoice;
        setShippingAddressChoice(newChoice);

        if (newChoice === ShippingAddressChoice.New) {
            dispatch(setCloneShippingAddressId(null));
            dispatch(setShippingAddress(defaultAddress));
        }
    };

    return (
        <div
            className={`collapse collapse-plus card bordered mb-4 rounded-md lg:mb-6 collapse-${
                isCurrentStep ? 'open' : 'closed'
            }`}
        >
            <div className="collapse-title text-xl font-medium" onClick={handleEdit}>
                {!hasErrors && !isCurrentStep ? 'Customer - Edit' : 'Customer'}
            </div>
            <div className="collapse-content bg-base-100 p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex">
                        <div className="flex flex-col w-full p-4">
                            <PersonalDetails register={register} errors={errors} setValue={setValue} />
                            <div className="divider lightDivider"></div>
                            <h3 className="text-2xl font-semibold mb-4">Billing Details</h3>
                            {showExisting && (
                                <SelectionWrapper
                                    id={BillingAddressChoice.Existing}
                                    title="Choose an existing billing address"
                                    name="billingAddress"
                                    isChecked={billingAddressChoice === BillingAddressChoice.Existing}
                                    defaultChecked={showExisting}
                                    onSelect={handleBillingSelect}
                                >
                                    <ExistingAddress isShipping={false} />
                                </SelectionWrapper>
                            )}
                            <SelectionWrapper
                                id={BillingAddressChoice.New}
                                title="Add a new billing address"
                                name="billingAddress"
                                isChecked={billingAddressChoice === BillingAddressChoice.New}
                                defaultChecked={!showExisting}
                                onSelect={handleBillingSelect}
                            >
                                <BillingAddress register={register} errors={errors} setValue={setValue} />
                            </SelectionWrapper>

                            <div className="divider lightDivider my-2 lg:my-4"></div>
                            <ShipToBilling />
                            <div className="divider lightDivider my-2 lg:my-4"></div>
                            {!isShippingSameAsBilling && (
                                <React.Fragment>
                                    <h3 className="text-2xl mb-4 font-semibold">Shipping Details</h3>
                                    {showExisting && (
                                        <SelectionWrapper
                                            id={ShippingAddressChoice.Existing}
                                            title="Choose an existing shipping address"
                                            name="shippingAddress"
                                            isChecked={shippingAddressChoice === ShippingAddressChoice.Existing}
                                            defaultChecked={showExisting}
                                            onSelect={handleShippingSelect}
                                        >
                                            <ExistingAddress isShipping={true} />
                                        </SelectionWrapper>
                                    )}
                                    <SelectionWrapper
                                        id={ShippingAddressChoice.New}
                                        title="Add a new shipping address"
                                        name="shippingAddress"
                                        isChecked={shippingAddressChoice === ShippingAddressChoice.New}
                                        defaultChecked={!showExisting}
                                        onSelect={handleShippingSelect}
                                    >
                                        <ShippingAddress register={register} errors={errors} setValue={setValue} />
                                    </SelectionWrapper>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end px-4 mb-4">
                        <button
                            type="submit"
                            className={`btn w-full lg:w-auto${
                                hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'
                            }${checkoutLoading ? ' loading' : ''}`}
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
