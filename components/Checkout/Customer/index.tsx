import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

import selector from './selector';
import { fieldPatternMsgs, updateAddress } from '../../../utils/checkout';
import { setAllowShippingAddress, setCurrentStep, setCustomerDetails } from '../../../store/slices/checkout';
import { parseAsBoolean, parseAsString, parseCustomerDetails, safelyParse } from '../../../utils/parsers';
import { fetchOrder } from '../../../store/slices/cart';
import { setCheckoutLoading } from '../../../store/slices/global';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';
import { getAddresses } from '../../../utils/account';
import { CommerceLayerResponse } from '../../../types/api';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';
import AddShippingAddress from './AddShippingAddress';
import PersonalDetails from './PersonalDetails';

const PER_PAGE = 6;

const Customer: React.FC = () => {
    const { data: session } = useSession();
    const { currentStep, customerDetails, order, accessToken, checkoutLoading } = useSelector(selector);
    const { allowShippingAddress } = customerDetails;
    const dispatch = useDispatch();
    const [allowShippingAddressInternal, setAllowShippingAddressInternal] = useState(allowShippingAddress);
    const [addresses, setAddresses] = useState<CommerceLayerResponse[] | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [shouldCreateNewAddress, setShouldCreateNewAddress] = useState(true);
    const [chosenAddress, setChosenAddress] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const onSubmit = async (data: unknown) => {
        if (hasErrors || checkoutLoading) {
            return;
        }

        // Set loading in current form.
        dispatch(setCheckoutLoading(true));

        // Fetch allowShipping and also dispatch current state on submission.
        const allowShipping = safelyParse(data, 'allowShippingAddress', parseAsBoolean, false);
        dispatch(setAllowShippingAddress(allowShipping));

        // There are quite a few customer details to parse so ship it off to a helper then store.
        const customerDetails = parseCustomerDetails(data, allowShipping);
        dispatch(setCustomerDetails(customerDetails));

        if (order && accessToken) {
            // Update billing address details in commerceLayer
            const billingAddressUpdatedRes = await updateAddress(accessToken, order.id, customerDetails, false);

            if (isArrayOfErrors(billingAddressUpdatedRes)) {
                billingAddressUpdatedRes.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                // Update shipping address details in commerceLayer
                const res = await updateAddress(accessToken, order.id, customerDetails, true);

                if (isArrayOfErrors(res)) {
                    res.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                } else {
                    if (res) {
                        // Fetch the order with new details.
                        dispatch(fetchOrder(true));

                        // Redirect to next stage.
                        dispatch(setCurrentStep(1));
                    }
                }
            }
        }
    };

    // Update internal allow shipping state to add / hide address.
    const onAllowShippingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllowShippingAddressInternal(e.target.checked);
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
        }
    };

    const fetchAddresses = async (token: string, email: string, page: number) => {
        const res = await getAddresses(token, email, PER_PAGE, page);

        if (isArrayOfErrors(res)) {
            res.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            const { addresses, meta } = res;
            setAddresses(addresses);
            setPageCount(meta ? meta.page_count : null);
        }

        dispatch(setCheckoutLoading(false));
    };

    const handlePageNumber = (nextPage: number) => {
        const clPage = nextPage + 1;

        if (accessToken && emailAddress) {
            setCurrentPage(nextPage);
            fetchAddresses(accessToken, emailAddress, clPage);
        }
    };

    useEffect(() => {
        const clPage = currentPage + 1;

        if (session && shouldFetchAddresses && accessToken && emailAddress && clPage > 0) {
            fetchAddresses(accessToken, emailAddress, clPage);
            dispatch(setCheckoutLoading(true));
            setShouldFetchAddresses(false);
        }
    }, [session, accessToken, emailAddress, shouldFetchAddresses, currentPage]);

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
                        <div className="flex-grow">
                            <PersonalDetails register={register} errors={errors} />
                            <BillingAddress register={register} errors={errors} />
                            <AddShippingAddress
                                register={register}
                                allowShippingAddress={allowShippingAddressInternal}
                                onAllowShippingAddress={onAllowShippingAddress}
                            />
                            {allowShippingAddressInternal && <ShippingAddress register={register} errors={errors} />}
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
