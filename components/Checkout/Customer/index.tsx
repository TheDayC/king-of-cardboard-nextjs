import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

import selector from './selector';
import { updateAddress, updateAddressClone, updateSameAsBilling } from '../../../utils/checkout';
import {
    fetchShipments,
    setBillingAddress,
    setCloneBillingAddressId,
    setCloneShippingAddressId,
    setCurrentStep,
    setCustomerDetails,
    setShippingAddress,
} from '../../../store/slices/checkout';
import {
    parseAddress,
    parseAsString,
    parseBillingAddress,
    parseExistingAddress,
    parseShippingAddress,
    safelyParse,
} from '../../../utils/parsers';
import { setCheckoutLoading } from '../../../store/slices/global';
import { addWarning } from '../../../store/slices/alerts';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';
import ShipToBilling from './ShipToBilling';
import PersonalDetails from './PersonalDetails';
import SelectionWrapper from '../../SelectionWrapper';
import ExistingAddress from './ExistingAddress';
import { CustomerAddress, CustomerDetails } from '../../../store/types/state';

const defaultBillingAddress: CustomerAddress = {
    id: null,
    billing_info: null,
    business: false,
    city: null,
    company: null,
    country_code: null,
    email: null,
    first_name: null,
    full_address: null,
    full_name: null,
    is_geocoded: false,
    is_localized: false,
    last_name: null,
    lat: null,
    line_1: null,
    line_2: null,
    lng: null,
    map_url: null,
    name: null,
    notes: null,
    phone: null,
    provider_name: null,
    reference: null,
    reference_origin: null,
    state_code: null,
    static_map_url: null,
    zip_code: null,
};

const defaultShippingAddress: CustomerAddress = {
    id: null,
    billing_info: null,
    business: false,
    city: null,
    company: null,
    country_code: null,
    email: null,
    first_name: null,
    full_address: null,
    full_name: null,
    is_geocoded: false,
    is_localized: false,
    last_name: null,
    lat: null,
    line_1: null,
    line_2: null,
    lng: null,
    map_url: null,
    name: null,
    notes: null,
    phone: null,
    provider_name: null,
    reference: null,
    reference_origin: null,
    state_code: null,
    static_map_url: null,
    zip_code: null,
};

const Customer: React.FC = () => {
    const { data: session } = useSession();
    const {
        currentStep,
        orderId,
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
    const [shouldSubmit, setShouldSubmit] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasBillingAddress = Boolean(billingAddress.id);
    const isNewBillingAddress = billingAddressEntryChoice === 'newBillingAddress';
    const hasShippingAddress = Boolean(shippingAddress.id);
    const isNewShippingAddress = shippingAddressEntryChoice === 'newShippingAddress';
    const hasErrors =
        Object.keys(errors).length > 0 ||
        (!hasBillingAddress && !isNewBillingAddress) ||
        (!hasShippingAddress && !isNewShippingAddress && !isShippingSameAsBilling);

    const handleNewBillingAddress = useCallback(
        async (data: unknown, customerDetails: CustomerDetails) => {
            if (!accessToken || !orderId) return;

            // Parse the billing address into a customer address partial.
            // CommerceLayer only expects the basic user input on their side hence the partial data parse.
            const billingAddressParsed = parseBillingAddress(data);

            // Update billing address details in commerceLayer.
            await updateAddress(accessToken, orderId, customerDetails, billingAddressParsed, false);

            // Set the billing address in full in our local store.
            dispatch(setBillingAddress(parseAddress(billingAddressParsed)));

            // If we're cloning a new address to shipping then update the shipping details with CommerceLayer.
            if (isShippingSameAsBilling) {
                await updateAddress(accessToken, orderId, customerDetails, billingAddressParsed, true);

                // Set the shipping address in full in our local store so our shipping matches billing locally.
                dispatch(setShippingAddress(parseAddress(billingAddressParsed)));
            }
        },
        [accessToken, orderId, dispatch, isShippingSameAsBilling]
    );

    const handleExistingBillingAddress = useCallback(
        async (customerDetails: CustomerDetails) => {
            if (!accessToken || !orderId || !billingAddress.id) return;

            // Parse the billing address into a customer address partial.
            // CommerceLayer only expects the basic user input on their side hence the partial data parse.
            const billingAddressParsed = parseExistingAddress(billingAddress);

            // Update billing address details in commerceLayer.
            await updateAddress(accessToken, orderId, customerDetails, billingAddressParsed, false);

            // Set the billing address in full in our local store.
            dispatch(setBillingAddress(parseAddress(billingAddressParsed)));

            // If we're cloning a new address to shipping then update the shipping details with CommerceLayer.
            if (isShippingSameAsBilling) {
                await updateAddress(accessToken, orderId, customerDetails, billingAddressParsed, true);

                // Set the shipping address in full in our local store so our shipping matches billing locally.
                dispatch(setShippingAddress(parseAddress(billingAddressParsed)));
            }

            // Ensure we have a clone id and update clone address field.
            if (cloneBillingAddressId) {
                await updateAddressClone(accessToken, orderId, cloneBillingAddressId, false);
            } else {
                setShouldSubmit(false);
                dispatch(addWarning('Please select a billing address'));
            }
        },
        [accessToken, orderId, dispatch, cloneBillingAddressId, billingAddress, isShippingSameAsBilling]
    );

    const handleNewShippingAddress = useCallback(
        async (data: unknown, customerDetails: CustomerDetails) => {
            if (!accessToken || !orderId) return;

            // Parse the shipping address into a customer address partial.
            // CommerceLayer only expects the basic user input on their side hence the partial data parse.
            const shippingAddressParsed = parseShippingAddress(data);

            // Update shipping address details in commerceLayer.
            await updateAddress(accessToken, orderId, customerDetails, shippingAddressParsed, true);

            // Set the shipping address as the in full in our local store.
            dispatch(setShippingAddress(parseAddress(shippingAddressParsed)));
        },
        [accessToken, orderId, dispatch]
    );

    const handleExistingShippingAddress = useCallback(
        async (customerDetails: CustomerDetails) => {
            if (!accessToken || !orderId) return;

            // Parse the shipping address into a customer address partial.
            const shippingAddressParsed = parseExistingAddress(shippingAddress);

            // Update shipping address details in commerceLayer. No check for same as billing here.
            await updateAddress(accessToken, orderId, customerDetails, shippingAddressParsed, true);

            // Set the shipping address in full in our local store.
            dispatch(setShippingAddress(parseAddress(shippingAddressParsed)));

            // Ensure we have a clone id and update clone address field.
            if (cloneShippingAddressId) {
                await updateAddressClone(accessToken, orderId, cloneShippingAddressId, true);
            } else {
                dispatch(addWarning('Please select a shipping address'));
                setShouldSubmit(false);
            }
        },
        [accessToken, orderId, dispatch, cloneShippingAddressId, shippingAddress]
    );

    const onSubmit = async (data: unknown) => {
        if (hasErrors || checkoutLoading || !orderId || !accessToken) {
            return;
        }
        // Reset form state on submission
        setShouldSubmit(true);

        // Set loading in current form.
        dispatch(setCheckoutLoading(true));

        // Parse the customer details like name, email, phone etc
        const customerDetails = {
            first_name: safelyParse(data, 'firstName', parseAsString, ''),
            last_name: safelyParse(data, 'lastName', parseAsString, ''),
            email: safelyParse(data, 'email', parseAsString, ''),
            phone: safelyParse(data, 'phone', parseAsString, ''),
        };
        dispatch(setCustomerDetails(customerDetails));

        // Handle a new billing address.
        if (billingAddressEntryChoice === 'newBillingAddress') {
            await handleNewBillingAddress(data, customerDetails);
        } else if (billingAddressEntryChoice === 'existingBillingAddress') {
            // Handle existing billing address.
            await handleExistingBillingAddress(customerDetails);
        }

        // If our shipping is the same as the billing address then update _shipping_address_same_as_billing field in CommerceLayer.
        if (isShippingSameAsBilling) {
            await updateSameAsBilling(accessToken, orderId, isShippingSameAsBilling);
        } else {
            // NOTE: At this point we know if the user is adding a shipping address manually.

            // Handle shipping address, no need to check for existing or as we handle that onClick.
            if (shippingAddressEntryChoice === 'newShippingAddress') {
                await handleNewShippingAddress(data, customerDetails);
            } else if (shippingAddressEntryChoice === 'existingShippingAddress') {
                // Handle existing shipping address.
                await handleExistingShippingAddress(customerDetails);
            }
        }

        if (!shouldSubmit) {
            // Remove load blockers.
            dispatch(setCheckoutLoading(false));

            return;
        }

        submissionCleanup();
    };

    const submissionCleanup = () => {
        if (accessToken && orderId) {
            dispatch(fetchShipments({ accessToken, orderId }));
        }

        // Remove load blockers.
        dispatch(setCheckoutLoading(false));

        // Redirect to next stage.
        dispatch(setCurrentStep(1));
    };

    // Handle the edit collapsed item functionality.
    // Simple check for address step.
    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
        }
    };

    const handleBillingSelect = (id: string) => {
        setBillingAddressEntryChoice(id);

        if (id === 'newBillingAddress') {
            dispatch(setCloneBillingAddressId(null));
            dispatch(setBillingAddress(defaultBillingAddress));
        }
    };

    const handleShippingSelect = (id: string) => {
        setShippingAddressEntryChoice(id);

        if (id === 'newShippingAddress') {
            dispatch(setCloneShippingAddressId(null));
            dispatch(setShippingAddress(defaultShippingAddress));
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
        if (!isShippingSameAsBilling) {
            dispatch(setShippingAddress(defaultShippingAddress));
        }
    }, [isShippingSameAsBilling, dispatch, billingAddressEntryChoice]);

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
                        <div className="flex flex-col w-full p-4">
                            <PersonalDetails register={register} errors={errors} setValue={setValue} />
                            <div className="divider lightDivider"></div>
                            <h3 className="text-2xl font-semibold mb-4">Billing Details</h3>
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
                                <BillingAddress register={register} errors={errors} setValue={setValue} />
                            </SelectionWrapper>

                            <div className="divider lightDivider"></div>
                            <ShipToBilling />
                            <div className="divider lightDivider"></div>
                            {!isShippingSameAsBilling && (
                                <React.Fragment>
                                    <h3 className="text-2xl mb-4 font-semibold">Shipping Details</h3>
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
