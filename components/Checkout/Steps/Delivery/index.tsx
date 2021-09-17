import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Step, StepLabel, StepContent, Typography, Button } from '@material-ui/core';

import useStyles from '../styles';
import selector from './selector';
import { setStep } from '../../../../../store/slices/checkout';
import { Steps } from '../../../../../enums/checkout';
import Edit from '../Edit';

export const Delivery: React.FC = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { currentStep, customerDetails } = useSelector(selector);
    const [enableEdit, setEnableEdit] = useState(false);
    const isCurrentStep = Boolean(currentStep === Steps.Delivery);
    const { email, firstName, lastName, addressLineOne, city, postcode, county, phone } = customerDetails;

    const handleContinue = () => {
        dispatch(setStep(Steps.Payment));
    };

    useEffect(() => {
        if (email && firstName && lastName && addressLineOne && city && postcode && county && phone) {
            setEnableEdit(true);
        } else {
            setEnableEdit(false);
        }
    }, [email, firstName, lastName, addressLineOne, city, postcode, county, phone]);

    return (
        <Step>
            <StepLabel>
                <Typography>Delivery{!isCurrentStep && enableEdit && <Edit editStep={Steps.Delivery} />}</Typography>
                <Typography variant="caption">Shipment summary and delivery methods</Typography>
            </StepLabel>
            <StepContent {...props}>
                <div className={styles.actionsContainer}>
                    <Button variant="contained" color="primary" onClick={handleContinue} className={styles.button}>
                        Continue to payment
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
};

export default Delivery;
