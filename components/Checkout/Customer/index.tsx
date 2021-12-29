import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import selector from './selector';
import { updateAddress } from '../../../utils/checkout';
import { setAllowShippingAddress, setCurrentStep, setCustomerDetails } from '../../../store/slices/checkout';
import { parseAsBoolean, parseCustomerDetails, safelyParse } from '../../../utils/parsers';
import { fetchOrder } from '../../../store/slices/cart';
import { setCheckoutLoading } from '../../../store/slices/global';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';
import AddShippingAddress from './AddShippingAddress';
import PersonalDetails from './PersonalDetails';
import SelectionWrapper from '../../SelectionWrapper';
import ExistingAddress from './ExistingAddress';

const Customer: React.FC = () => {
    const { currentStep, order, accessToken, checkoutLoading, isShippingSameAsBilling } = useSelector(selector);
    const dispatch = useDispatch();
    const [addressEntryChoice, setAddressEntryChoice] = useState('existingBillingAddress');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: unknown) => {
        if (hasErrors || checkoutLoading) {
            return;
        }

        // Set loading in current form.
        dispatch(setCheckoutLoading(true));

        // Fetch allowShipping and also dispatch current state on submission.
        const allowShipping = safelyParse(data, 'allowShippingAddress', parseAsBoolean, false);
        dispatch(setAllowShippingAddress(allowShipping));

        if (addressEntryChoice === 'newBillingAddress') {
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
        }
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
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
                            <SelectionWrapper
                                id="existingBillingAddress"
                                title="Add an existing billing address"
                                name="address"
                                isChecked={addressEntryChoice === 'existingBillingAddress'}
                                onSelect={setAddressEntryChoice}
                            >
                                <ExistingAddress />
                            </SelectionWrapper>
                            <SelectionWrapper
                                id="newBillingAddress"
                                title="Insert a new billing address"
                                name="address"
                                isChecked={addressEntryChoice === 'newBillingAddress'}
                                onSelect={setAddressEntryChoice}
                            >
                                <BillingAddress register={register} errors={errors} />
                            </SelectionWrapper>
                            <AddShippingAddress />
                            {!isShippingSameAsBilling && <ShippingAddress register={register} errors={errors} />}
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
