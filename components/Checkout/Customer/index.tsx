import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { get } from 'lodash';
import { Button, Checkbox, Input, Stack, Step, StepContent, StepLabel, Typography } from '@mui/material';
import { Box } from '@mui/system';

import selector from './selector';
import { fieldPatternMsgs, updateAddress } from '../../../utils/checkout';
import { PersonalDetails } from '../../../types/checkout';
import { setAllowShippingAddress, setCurrentStep, setCustomerDetails } from '../../../store/slices/checkout';
import { parseCustomerDetails } from '../../../utils/parsers';
import { fetchOrder } from '../../../store/slices/cart';
const Customer: React.FC = () => {
    const { currentStep, customerDetails, order, accessToken } = useSelector(selector);
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
    const dispatch = useDispatch();
    const [allowShippingAddressInternal, setAllowShippingAddressInternal] = useState(allowShippingAddress);
    const [loading, setLoading] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: PersonalDetails) => {
        // Set loading in current form.
        setLoading(true);

        // Fetch allowShipping and also dispatch current state on submission.
        const allowShipping = get(data, 'allowShippingAddress', false);
        dispatch(setAllowShippingAddress(allowShipping));

        // There are quite a few customer details to parse so ship it off to a helper then store.
        const customerDetails = parseCustomerDetails(data, allowShipping);
        dispatch(setCustomerDetails(customerDetails));

        if (order && accessToken) {
            // Update billing address details in commerceLayer
            const hasBillingAddressUpdated = await updateAddress(accessToken, order.id, customerDetails, false);

            if (hasBillingAddressUpdated) {
                // Update shipping address details in commerceLayer
                await updateAddress(accessToken, order.id, customerDetails, true);
            }

            dispatch(fetchOrder(true));
        }

        // Remove load barriers.
        setLoading(false);

        // Redirect to next stage.
        dispatch(setCurrentStep(1));
    };

    // Collect errors.
    const firstNameErr = get(errors, 'firstName.message', null);
    const lastNameErr = get(errors, 'lastName.message', null);
    const companyErr = get(errors, 'company.message', null);
    const emailErr = get(errors, 'email.message', null);
    const mobileErr = get(errors, 'mobile.message', null);
    const billingLineOneErr = get(errors, 'billingAddressLineOne.message', null);
    const billingLineTwoErr = get(errors, 'billingAddressLineTwo.message', null);
    const billingCityErr = get(errors, 'billingCity.message', null);
    const billingPostcodeErr = get(errors, 'billingPostcode.message', null);
    const billingCountyErr = get(errors, 'billingCounty.message', null);
    const shippingLineOneErr = get(errors, 'shippingAddressLineOne.message', null);
    const shippingLineTwoErr = get(errors, 'shippingAddressLineTwo.message', null);
    const shippingCityErr = get(errors, 'shippingCity.message', null);
    const shippingPostcodeErr = get(errors, 'shippingPostcode.message', null);
    const shippingCountyErr = get(errors, 'shippingCounty.message', null);

    // Update internal allow shipping state to add / hide address.
    const onAllowShippingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllowShippingAddressInternal(e.target.checked);
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
        }
    };

    return (
        <Step>
            <StepLabel onClick={handleEdit}>{!hasErrors && !isCurrentStep ? 'Customer - Edit' : 'Customer'}</StepLabel>
            <form onSubmit={handleSubmit(onSubmit)}>
                <StepContent>
                    <Box>
                        <Typography>Personal Details</Typography>
                        <Box sx={{ mb: 2 }}>
                            <Controller
                                name="firstName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    pattern: {
                                        value: /^[a-z ,.'-]+$/i,
                                        message: fieldPatternMsgs('firstName'),
                                    },
                                    value: firstName,
                                }}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    pattern: {
                                        value: /^[a-z ,.'-]+$/i,
                                        message: fieldPatternMsgs('lastName'),
                                    },
                                    value: lastName,
                                }}
                            />
                            <Controller
                                name="company"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: false,
                                    value: company,
                                }}
                            />
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    pattern: {
                                        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: fieldPatternMsgs('email'),
                                    },
                                    value: email,
                                }}
                            />
                            <Controller
                                name="phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    pattern: {
                                        value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
                                        message: fieldPatternMsgs('mobile'),
                                    },
                                    value: phone,
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography>Billing Details</Typography>
                            <Controller
                                name="billingAddressLineOne"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    value: addressLineOne,
                                }}
                            />
                            <Controller
                                name="billingAddressLineTwo"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    value: addressLineTwo,
                                }}
                            />
                            <Controller
                                name="billingCity"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    value: city,
                                }}
                            />
                            <Controller
                                name="billingPostcode"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    pattern: {
                                        value: /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim,
                                        message: fieldPatternMsgs('shippingPostcode'),
                                    },
                                    value: postcode,
                                }}
                            />
                            <Controller
                                name="billingCounty"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input {...field} />}
                                rules={{
                                    required: { value: true, message: 'Required' },
                                    value: county,
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography>Ship to a different address?</Typography>
                            <Controller
                                name="allowShippingAddress"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Checkbox {...field} inputProps={{ 'aria-label': 'Checkbox demo' }} />
                                )}
                            />
                        </Box>
                        {allowShippingAddressInternal && (
                            <Box>
                                <Typography>Shipping Details</Typography>
                                <Controller
                                    name="shippingAddressLineOne"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Input {...field} />}
                                    rules={{
                                        required: { value: true, message: 'Required' },
                                        value: addressLineOne,
                                    }}
                                />
                                <Controller
                                    name="shippingAddressLineTwo"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Input {...field} />}
                                    rules={{
                                        value: addressLineTwo,
                                    }}
                                />
                                <Controller
                                    name="shippingCity"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Input {...field} />}
                                    rules={{
                                        required: { value: true, message: 'Required' },
                                        value: city,
                                    }}
                                />
                                <Controller
                                    name="shippingPostcode"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Input {...field} />}
                                    rules={{
                                        required: { value: true, message: 'Required' },
                                        pattern: {
                                            value: /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim,
                                            message: fieldPatternMsgs('shippingPostcode'),
                                        },
                                        value: postcode,
                                    }}
                                />
                                <Controller
                                    name="shippingCounty"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Input {...field} />}
                                    rules={{
                                        required: { value: true, message: 'Required' },
                                        value: county,
                                    }}
                                />
                            </Box>
                        )}
                        <Stack>
                            <Button variant="contained" sx={{ mt: 1, mr: 1 }} disabled={hasErrors}>
                                Continue
                            </Button>
                        </Stack>
                    </Box>
                </StepContent>
            </form>
        </Step>
    );
};

export default Customer;
