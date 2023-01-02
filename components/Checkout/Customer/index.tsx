import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { BsTruck } from 'react-icons/bs';

import selector from './selector';
import {
    setBillingAddress,
    setCurrentStep,
    setCustomerDetails,
    setExistingBillingAddressId,
    setExistingShippingAddressId,
    setIsCheckoutLoading,
    setShippingAddress,
} from '../../../store/slices/checkout';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';
import ShipToBilling from './ShipToBilling';
import PersonalDetails from './PersonalDetails';
import SelectionWrapper from '../../SelectionWrapper';
import ExistingAddress from './ExistingAddress';
import { Address } from '../../../types/checkout';
import { BillingAddressChoice, ShippingAddressChoice } from '../../../enums/checkout';
import { fetchAddresses, setIsLoadingAddressBook } from '../../../store/slices/account';

const LIMIT = 10;
const SKIP = 0;

const defaultAddress: Address = {
    lineOne: '',
    lineTwo: '',
    company: '',
    city: '',
    postcode: '',
    county: '',
    country: '',
};

const Customer: React.FC = () => {
    const { data: session } = useSession();
    const {
        currentStep,
        isCheckoutLoading,
        isShippingSameAsBilling,
        billingAddress,
        shippingAddress,
        customerDetails,
        existingBillingAddressId,
        existingShippingAddressId,
    } = useSelector(selector);
    const dispatch = useDispatch();
    const [billingAddressChoice, setBillingAddressChoice] = useState(BillingAddressChoice.New);
    const [shippingAddressChoice, setShippingAddressChoice] = useState(ShippingAddressChoice.New);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        clearErrors,
    } = useForm({
        defaultValues: {
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            email: customerDetails.email,
            phone: customerDetails.phone,
            billingAddressLineOne: billingAddress.lineOne,
            billingAddressLineTwo: billingAddress.lineTwo,
            billingCompany: billingAddress.company,
            billingCity: billingAddress.city,
            billingPostcode: billingAddress.postcode,
            billingCounty: billingAddress.county,
            shippingAddressLineOne: shippingAddress.lineOne,
            shippingAddressLineTwo: shippingAddress.lineTwo,
            shippingCompany: shippingAddress.company,
            shippingCity: shippingAddress.city,
            shippingPostcode: shippingAddress.postcode,
            shippingCounty: shippingAddress.county,
            existingBilling: existingBillingAddressId,
            existingShipping: existingShippingAddressId,
        },
    });
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const existingBillingErr = safelyParse(errors, 'existingBilling.message', parseAsString, null);
    const existingShippingErr = safelyParse(errors, 'existingShipping.message', parseAsString, null);

    const onSubmit = async (data: FieldValues) => {
        if (hasErrors || isCheckoutLoading) {
            return;
        }

        // Set loading in current form.
        dispatch(setIsCheckoutLoading(true));

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
        } else if (existingBillingAddressId) {
            dispatch(setBillingAddress(billingAddress));

            if (isShippingSameAsBilling) dispatch(setShippingAddress(billingAddress));
        } else {
            setError('existingBilling', {
                type: 'custom',
                message: 'Must select an existing billing address or enter a new one.',
            });

            dispatch(setIsCheckoutLoading(false));
            return;
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

                dispatch(setShippingAddress(newShippingAddress));
            } else if (existingShippingAddressId) {
                dispatch(setShippingAddress(shippingAddress));
            } else {
                setError('existingShipping', {
                    type: 'custom',
                    message: 'Must select an existing shipping address or enter a new one.',
                });

                dispatch(setIsCheckoutLoading(false));
                return;
            }
        }

        // Redirect to next stage.
        dispatch(setCurrentStep(1));

        dispatch(setIsCheckoutLoading(false));
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
            dispatch(setExistingBillingAddressId(null));
            dispatch(setBillingAddress(defaultAddress));
        }
    };

    const handleShippingSelect = (choice: number) => {
        const newChoice = choice as ShippingAddressChoice;
        setShippingAddressChoice(newChoice);

        if (newChoice === ShippingAddressChoice.New) {
            dispatch(setExistingShippingAddressId(null));
            dispatch(setShippingAddress(defaultAddress));
        }
    };

    useEffect(() => {
        if (userId) {
            setBillingAddressChoice(BillingAddressChoice.Existing);
            setShippingAddressChoice(ShippingAddressChoice.Existing);
        }
    }, [userId]);

    // Fetch existing addresses once.
    useEffect(() => {
        if (!userId) return;

        if (shouldFetchAddresses) {
            setShouldFetchAddresses(false);
            dispatch(setIsLoadingAddressBook(true));
            dispatch(fetchAddresses({ userId, limit: LIMIT, skip: SKIP }));
        }
    }, [userId, dispatch, shouldFetchAddresses]);

    // Register existing address fields with RHF.
    useEffect(() => {
        register('existingBilling');
        register('existingShipping');
    }, [register]);

    // If id's are added make sure to update custom values
    useEffect(() => {
        setValue('existingBilling', existingBillingAddressId);
        clearErrors('existingBilling');
    }, [existingBillingAddressId]);

    useEffect(() => {
        setValue('existingShipping', existingShippingAddressId);
        clearErrors('existingShipping');
    }, [existingShippingAddressId]);

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
                            <PersonalDetails register={register} errors={errors} />
                            <div className="divider lightDivider"></div>
                            <h3 className="text-2xl font-semibold mb-4">Billing Details</h3>
                            {Boolean(session) && (
                                <SelectionWrapper
                                    id={BillingAddressChoice.Existing}
                                    title="Choose an existing billing address"
                                    name="billingAddress"
                                    isChecked={billingAddressChoice === BillingAddressChoice.Existing}
                                    defaultChecked={shippingAddressChoice === ShippingAddressChoice.Existing}
                                    onSelect={handleBillingSelect}
                                >
                                    <ExistingAddress isShipping={false} error={existingBillingErr} />
                                </SelectionWrapper>
                            )}
                            <SelectionWrapper
                                id={BillingAddressChoice.New}
                                title="Add a new billing address"
                                name="billingAddress"
                                isChecked={billingAddressChoice === BillingAddressChoice.New}
                                defaultChecked={billingAddressChoice === BillingAddressChoice.New}
                                onSelect={handleBillingSelect}
                            >
                                <BillingAddress register={register} errors={errors} />
                            </SelectionWrapper>

                            <div className="divider lightDivider my-2 lg:my-4"></div>
                            <ShipToBilling />
                            <div className="divider lightDivider my-2 lg:my-4"></div>
                            {!isShippingSameAsBilling && (
                                <React.Fragment>
                                    <h3 className="text-2xl mb-4 font-semibold">Shipping Details</h3>
                                    {Boolean(session) && (
                                        <SelectionWrapper
                                            id={ShippingAddressChoice.Existing}
                                            title="Choose an existing shipping address"
                                            name="shippingAddress"
                                            isChecked={shippingAddressChoice === ShippingAddressChoice.Existing}
                                            defaultChecked={shippingAddressChoice === ShippingAddressChoice.Existing}
                                            onSelect={handleShippingSelect}
                                        >
                                            <ExistingAddress isShipping={true} error={existingShippingErr} />
                                        </SelectionWrapper>
                                    )}
                                    <SelectionWrapper
                                        id={ShippingAddressChoice.New}
                                        title="Add a new shipping address"
                                        name="shippingAddress"
                                        isChecked={shippingAddressChoice === ShippingAddressChoice.New}
                                        defaultChecked={shippingAddressChoice === ShippingAddressChoice.New}
                                        onSelect={handleShippingSelect}
                                    >
                                        <ShippingAddress register={register} errors={errors} />
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
                            }${isCheckoutLoading ? ' loading' : ''}`}
                        >
                            {isCheckoutLoading ? '' : 'delivery'}
                            <BsTruck className="w-6 h-6 ml-2 inline" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Customer;
