import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Step,
    StepLabel,
    StepContent,
    Typography,
    Button,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';
import { debounce } from 'lodash';
import { Autocomplete } from '@material-ui/lab';

import selector from './selector';
import {
    setEmail,
    setStep,
    setFirstName,
    setLastName,
    setAddressLineOne,
    setAddressLineTwo,
    setCity,
    setCounty,
    setPostCode,
    setPhone,
    setShippingAddressLineOne,
    setShippingAddressLineTwo,
    setShippingCity,
    setShippingPostcode,
    setShippingCounty,
} from '../../../store/slices/checkout';
import { addError, clearErrors } from '../../../store/slices/errors';
import { Steps } from '../../../enums/checkout';
import Edit from '../Edit';
import {
    getCounties,
    shouldEmailError,
    shouldNameError,
    shouldAddressLineError,
    shouldPostcodeError,
    shouldPhoneError,
} from '../../../utils/checkout';

export const Customer: React.FC = (props) => {
    const dispatch = useDispatch();
    const [emailError, setEmailError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [addressLineOneError, setAddressLineOneError] = useState(false);
    const [addressLineTwoError, setAddressLineTwoError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [postcodeError, setPostcodeError] = useState(false);
    const [countyError, setCountyError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [disableBtn, setDisableBtn] = useState(true);
    const [showDifferentShippingAddress, setShowDifferentShippingAddress] = useState(false);
    const [shippingAddressOneError, setShippingAddressOneError] = useState(false);
    const [shippingAddressTwoError, setShippingAddressTwoError] = useState(false);
    const [shippingCityError, setShippingCityError] = useState(false);
    const [shippingPostcodeError, setShippingPostcodeError] = useState(false);
    const [shippingCountyError, setShippingCountyError] = useState(false);
    const { customerDetails, currentStep } = useSelector(selector);
    const {
        email,
        firstName,
        lastName,
        addressLineOne,
        addressLineTwo,
        city,
        postcode,
        county,
        phone,
        shippingAddressLineOne,
        shippingAddressLineTwo,
        shippingCity,
        shippingCounty,
        shippingPostcode,
    } = customerDetails;

    const isCurrentStep = Boolean(currentStep === Steps.Customer);

    const handleContinue = () => {
        dispatch(setStep(Steps.Delivery));
    };

    const handleDifferentShippingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowDifferentShippingAddress(e.target.checked);
    };

    useEffect(() => {
        emailError ? dispatch(addError('Please enter a valid email.')) : dispatch(clearErrors());
    }, [emailError]);

    useEffect(() => {
        firstNameError ? dispatch(addError('Please enter a valid first name.')) : dispatch(clearErrors());
    }, [firstNameError]);

    useEffect(() => {
        lastNameError ? dispatch(addError('Please enter a valid last name.')) : dispatch(clearErrors());
    }, [lastNameError]);

    useEffect(() => {
        addressLineOneError || shippingAddressLineOne
            ? dispatch(addError('Please enter a valid address line one.'))
            : dispatch(clearErrors());
    }, [addressLineOneError, shippingAddressLineOne]);

    useEffect(() => {
        addressLineTwoError || shippingAddressLineTwo
            ? dispatch(addError('Please enter a valid address line two.'))
            : dispatch(clearErrors());
    }, [addressLineTwoError]);

    useEffect(() => {
        cityError || shippingCity ? dispatch(addError('Please enter a valid city.')) : dispatch(clearErrors());
    }, [cityError, shippingCity]);

    useEffect(() => {
        postcodeError || shippingPostcode
            ? dispatch(addError('Please enter a valid postcode.'))
            : dispatch(clearErrors());
    }, [postcodeError, shippingPostcode]);

    useEffect(() => {
        countyError || shippingCounty
            ? dispatch(addError('Please select a county from the list.'))
            : dispatch(clearErrors());
    }, [countyError, shippingCounty]);

    useEffect(() => {
        phoneError ? dispatch(addError('Please add a valid phone number.')) : dispatch(clearErrors());
    }, [phoneError]);

    useEffect(() => {
        const basicValidation = Boolean(
            !emailError &&
                !firstNameError &&
                !lastNameError &&
                !addressLineOneError &&
                !cityError &&
                !postcodeError &&
                !countyError &&
                !phoneError &&
                email &&
                email.length > 0 &&
                firstName &&
                firstName.length > 0 &&
                lastName &&
                lastName.length > 0 &&
                addressLineOne &&
                addressLineOne.length > 0 &&
                city &&
                city.length > 0 &&
                postcode &&
                postcode.length > 0 &&
                county &&
                county.length > 0 &&
                phone &&
                phone > 0
        );

        const shippingValidation = Boolean(
            !shippingAddressOneError &&
                shippingAddressLineOne &&
                shippingAddressLineOne.length > 0 &&
                !shippingAddressTwoError &&
                shippingAddressLineTwo &&
                shippingAddressLineTwo.length > 0 &&
                !shippingCityError &&
                shippingCity &&
                shippingCity.length > 0 &&
                !shippingPostcodeError &&
                shippingPostcode &&
                shippingPostcode.length > 0 &&
                !shippingCountyError &&
                shippingCounty &&
                shippingCounty.length > 0
        );

        const checkValidation = showDifferentShippingAddress ? basicValidation && shippingValidation : basicValidation;
        console.log('🚀 ~ file: index.tsx ~ line 184 ~ useEffect ~ checkValidation', checkValidation);

        if (checkValidation) {
            setDisableBtn(false);
        } else {
            setDisableBtn(true);
        }
    }, [
        emailError,
        firstNameError,
        lastNameError,
        addressLineOneError,
        cityError,
        postcodeError,
        countyError,
        phoneError,
        email,
        firstName,
        lastName,
        addressLineOne,
        city,
        postcode,
        county,
        phone,
    ]);

    // Email Validation
    const debounceEmail = debounce((value: string) => {
        if (shouldEmailError(value)) {
            setEmailError(true);
        } else {
            setEmailError(false);
            dispatch(setEmail(value));
        }
    }, 300);

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceEmail(e.target.value);
    };

    // First Name Validation
    const debounceFirstName = debounce((value: string) => {
        if (shouldNameError(value)) {
            setFirstNameError(true);
            dispatch(setFirstName(null));
        } else {
            setFirstNameError(false);
            dispatch(setFirstName(value));
        }
    }, 300);

    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceFirstName(e.target.value);
    };

    // Last Name Validation
    const debounceLastName = debounce((value: string) => {
        if (shouldNameError(value)) {
            setLastNameError(true);
            dispatch(setLastName(null));
        } else {
            setLastNameError(false);
            dispatch(setLastName(value));
        }
    }, 300);

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceLastName(e.target.value);
    };

    // Address Line 1 Validation
    const debounceAddressOne = debounce((value: string) => {
        if (shouldAddressLineError(value)) {
            setAddressLineOneError(true);
            dispatch(setAddressLineOne(null));
        } else {
            setAddressLineOneError(false);
            dispatch(setAddressLineOne(value));
        }
    }, 300);

    const handleAddressOne = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceAddressOne(e.target.value);
    };

    // Address Line 2 Validation
    const debounceAddressTwo = debounce((value: string) => {
        if (shouldAddressLineError(value)) {
            setAddressLineTwoError(true);
            dispatch(setAddressLineTwo(null));
        } else {
            setAddressLineTwoError(false);
            dispatch(setAddressLineTwo(value));
        }
    }, 300);

    const handleAddressTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceAddressTwo(e.target.value);
    };

    // City validation
    const debounceCity = debounce((value: string) => {
        if (shouldAddressLineError(value)) {
            setCityError(true);
            dispatch(setCity(null));
        } else {
            setCityError(false);
            dispatch(setCity(value));
        }
    }, 300);

    const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceCity(e.target.value);
    };

    // Postcode validation
    const debouncePostCode = debounce((value: string) => {
        if (shouldPostcodeError(value)) {
            setPostcodeError(true);
            dispatch(setPostCode(null));
        } else {
            setPostcodeError(false);
            dispatch(setPostCode(value));
        }
    }, 300);

    const handlePostCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncePostCode(e.target.value);
    };

    // Phone validation
    const debouncePhone = debounce((value: string) => {
        if (shouldPhoneError(value)) {
            setPhoneError(true);
            dispatch(setPhone(null));
        } else {
            setPhoneError(false);
            dispatch(setPhone(value));
        }
    }, 300);

    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncePhone(e.target.value);
    };

    // Shipping Address Line 1 validation
    const debounceShippingAddressOne = debounce((value: string) => {
        if (shouldAddressLineError(value)) {
            setShippingAddressOneError(true);
            dispatch(setShippingAddressLineOne(null));
        } else {
            setShippingAddressOneError(false);
            dispatch(setShippingAddressLineOne(value));
        }
    }, 300);

    const handleShippingAddressOne = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceShippingAddressOne(e.target.value);
    };

    // Shipping Address Line 2 validation
    const debounceShippingAddressTwo = debounce((value: string) => {
        if (shouldAddressLineError(value)) {
            setShippingAddressTwoError(true);
            dispatch(setShippingAddressLineTwo(null));
        } else {
            setShippingAddressTwoError(false);
            dispatch(setShippingAddressLineTwo(value));
        }
    }, 300);

    const handleShippingAddressTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceShippingAddressTwo(e.target.value);
    };

    // Shipping City validation
    const debounceShippingCity = debounce((value: string) => {
        if (shouldAddressLineError(value)) {
            setShippingCityError(true);
            dispatch(setShippingCity(null));
        } else {
            setShippingCityError(false);
            dispatch(setShippingCity(value));
        }
    }, 300);

    const handleShippingCity = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceShippingCity(e.target.value);
    };

    // Shipping City validation
    const debounceShippingPostcode = debounce((value: string) => {
        if (shouldPostcodeError(value)) {
            setShippingPostcodeError(true);
            dispatch(setShippingPostcode(null));
        } else {
            setShippingPostcodeError(false);
            dispatch(setShippingPostcode(value));
        }
    }, 300);

    const handleShippingPostcode = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceShippingPostcode(e.target.value);
    };

    return (
        <Step>
            <StepLabel>
                <Typography>Customer{!isCurrentStep && !disableBtn && <Edit editStep={Steps.Customer} />}</Typography>
                <Typography variant="caption">Billing information and shipping address</Typography>
            </StepLabel>
            <StepContent {...props}>
                <form autoComplete="off">
                    <Grid container className={styles.detailsContainer} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Billing Address</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                placeholder="Email"
                                defaultValue={email}
                                required
                                onChange={handleEmail}
                                error={emailError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="First Name"
                                name="first_name"
                                placeholder="First Name"
                                defaultValue={firstName}
                                required
                                onChange={handleFirstName}
                                error={firstNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Last Name"
                                name="last_name"
                                placeholder="Last Name"
                                defaultValue={lastName}
                                required
                                onChange={handleLastName}
                                error={lastNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Address Line 1"
                                name="address_line_one"
                                placeholder="Address Line 1"
                                defaultValue={addressLineOne}
                                required
                                onChange={handleAddressOne}
                                error={addressLineOneError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Address Line 2"
                                name="address_line_two"
                                placeholder="Address Line 2"
                                defaultValue={addressLineTwo}
                                onChange={handleAddressTwo}
                                error={addressLineTwoError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="City"
                                name="city"
                                placeholder="City"
                                defaultValue={city}
                                required
                                onChange={handleCity}
                                error={cityError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Post Code"
                                name="postcode"
                                placeholder="Postcode"
                                defaultValue={postcode}
                                required
                                onChange={handlePostCode}
                                error={postcodeError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                id="county-combo-box"
                                options={getCounties()}
                                getOptionLabel={(option) => option}
                                onChange={
                                    /* eslint-disable-next-line @typescript-eslint/ban-types */
                                    (event: React.ChangeEvent<{}>, value: string | null) => {
                                        if (value && value.length > 0) {
                                            setCountyError(false);
                                            dispatch(setCounty(county));
                                        } else {
                                            setCountyError(true);
                                            dispatch(setCounty(null));
                                        }
                                    }
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="County"
                                        name="county"
                                        placeholder="County"
                                        defaultValue={county}
                                        required
                                        error={countyError}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Phone"
                                name="phone"
                                placeholder="Phone"
                                defaultValue={phone}
                                required
                                onChange={handlePhone}
                                error={phoneError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleDifferentShippingAddress}
                                        name="differentShippingAddress"
                                    />
                                }
                                label="Ship to a different address"
                            />
                        </Grid>
                    </Grid>
                    {showDifferentShippingAddress && (
                        <Grid container className={styles.detailsContainer} spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h3">Shipping Address</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Address Line 1"
                                    name="shipping_address_line_one"
                                    placeholder="Shipping Address Line 1"
                                    required
                                    onChange={handleShippingAddressOne}
                                    error={shippingAddressOneError}
                                    defaultValue={shippingAddressLineOne}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Address Line 2"
                                    name="shipping_address_line_two"
                                    placeholder="Shipping Address Line 2"
                                    onChange={handleShippingAddressTwo}
                                    error={shippingAddressTwoError}
                                    defaultValue={shippingAddressLineTwo}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="City"
                                    name="shipping_city"
                                    placeholder="Shipping City"
                                    required
                                    onChange={handleShippingCity}
                                    error={shippingCityError}
                                    defaultValue={shippingCity}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Post Code"
                                    name="shipping_postcode"
                                    placeholder="Shipping Postcode"
                                    required
                                    onChange={handleShippingPostcode}
                                    error={shippingPostcodeError}
                                    defaultValue={shippingPostcode}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="shipping-county-combo-box"
                                    options={getCounties()}
                                    getOptionLabel={(option) => option}
                                    onChange={
                                        /* eslint-disable-next-line @typescript-eslint/ban-types */
                                        (event: React.ChangeEvent<{}>, value: string | null) => {
                                            if (value && value.length > 0) {
                                                setShippingCountyError(false);
                                                dispatch(setShippingCounty(county));
                                            } else {
                                                setShippingCountyError(true);
                                                dispatch(setShippingCounty(null));
                                            }
                                        }
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="County"
                                            name="shipping_county"
                                            placeholder="Shipping County"
                                            defaultValue={shippingCounty}
                                            required
                                            error={shippingCountyError}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}
                </form>
                <div className={styles.actionsContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleContinue}
                        className={styles.button}
                        disabled={disableBtn}
                    >
                        Continue to delivery
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
};

export default Customer;
